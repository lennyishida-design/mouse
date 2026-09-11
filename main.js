/**
 * Antigravity Control Center — Application Core
 * Connects DeviceManager, Hardware Scanner, and Feature Modules.
 */

import { DeviceManager } from "./modules/devicemanager.js";
import { MouseModule } from "./modules/mouse.js";
import { KeyboardModule } from "./modules/keyboard.js";
import { HeadsetModule } from "./modules/headset.js";
import { GamepadModule } from "./modules/gamepad.js";
import { RgbModule } from "./modules/rgb.js";

class AntigravityApp {
  constructor() {
    this.deviceManager = new DeviceManager();
    
    // Register all specialized modules
    this.modules = [
      new MouseModule(this.deviceManager),
      new KeyboardModule(this.deviceManager),
      new HeadsetModule(this.deviceManager),
      new GamepadModule(this.deviceManager),
      new RgbModule(this.deviceManager)
    ];

    this.activeModuleId = null;

    this.initDOM();
    this.bindEvents();
    this.autoSelectFirstModule();
    this.render();

    // Subscribe to device updates
    this.deviceManager.subscribe(() => {
      this.renderSidebarDevices();
      this.renderModuleNav();
      this.renderActiveModule();
    });
  }

  initDOM() {
    this.deviceSidebarList = document.getElementById("device-sidebar-list");
    this.deviceCountBadge = document.getElementById("device-count-badge");
    this.moduleNavList = document.getElementById("module-nav-list");
    this.mainViewport = document.getElementById("main-viewport");
    this.rescanBtn = document.getElementById("rescan-devices-btn");
    this.profileInput = document.getElementById("profile-name-input");
    this.saveProfileBtn = document.getElementById("save-profile-btn");
    this.exportProfileBtn = document.getElementById("export-profile-btn");
    this.importProfileBtn = document.getElementById("import-profile-btn");
    this.importFileInput = document.getElementById("import-file-input");
    this.toastContainer = document.getElementById("toast-container");
    this.statusText = document.getElementById("detection-status-text");
  }

  bindEvents() {
    // Hardware Rescan
    this.rescanBtn.addEventListener("click", async () => {
      this.statusText.textContent = "Scanne Hardware...";
      const detectedCount = await this.deviceManager.scanHardware();
      this.statusText.textContent = `${detectedCount} Hardware‑Geräte erfasst`;
      this.showToast(`Hardware‑Scan abgeschlossen (${detectedCount} Geräte gefunden).`);
      this.render();
    });

    // Profile Actions
    this.saveProfileBtn.addEventListener("click", () => {
      this.deviceManager.saveDevices();
      this.showToast(`Profil "${this.profileInput.value}" erfolgreich gesichert.`);
    });

    this.exportProfileBtn.addEventListener("click", () => {
      this.deviceManager.exportActiveProfile();
      this.showToast("Antigravity JSON‑Profil exportiert.");
    });

    this.importProfileBtn.addEventListener("click", () => {
      this.importFileInput.click();
    });

    this.importFileInput.addEventListener("change", (e) => {
      const file = e.target.files[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = (evt) => {
        const ok = this.deviceManager.importProfile(evt.target.result);
        if (ok) {
          this.showToast("Profil importiert!");
          this.autoSelectFirstModule();
          this.render();
        } else {
          this.showToast("Ungültige Profil‑JSON.", "error");
        }
      };
      reader.readAsText(file);
      e.target.value = "";
    });
  }

  autoSelectFirstModule() {
    const currentDevice = this.deviceManager.getActiveDevice();
    const available = this.modules.filter(m => m.isSupported(currentDevice));
    if (available.length > 0) {
      if (!available.some(m => m.id === this.activeModuleId)) {
        this.activeModuleId = available[0].id;
      }
    } else {
      this.activeModuleId = null;
    }
  }

  render() {
    this.renderSidebarDevices();
    this.renderModuleNav();
    this.renderActiveModule();
  }

  renderSidebarDevices() {
    const devices = this.deviceManager.getDevices();
    const active = this.deviceManager.getActiveDevice();

    this.deviceCountBadge.textContent = devices.length;

    this.deviceSidebarList.innerHTML = devices.map(device => `
      <div class="device-item ${device.id === active.id ? 'active' : ''}" data-device-id="${device.id}">
        <div class="device-item-main">
          <span class="device-item-icon">${device.icon}</span>
          <div class="device-item-info">
            <span class="device-item-name">${device.name}</span>
            <span class="device-item-source">${device.source || device.type}</span>
          </div>
        </div>
        <span class="device-live-badge ${device.isDetected ? 'connected' : ''}" title="${device.isDetected ? 'Echte Hardware verbunden' : 'Virtuelles Profil'}"></span>
      </div>
    `).join('');

    this.deviceSidebarList.querySelectorAll(".device-item").forEach(item => {
      item.addEventListener("click", () => {
        const id = item.dataset.deviceId;
        this.deviceManager.setActiveDevice(id);
        this.autoSelectFirstModule();
        this.render();
      });
    });
  }

  renderModuleNav() {
    const activeDevice = this.deviceManager.getActiveDevice();
    const available = this.modules.filter(m => m.isSupported(activeDevice));

    if (!this.activeModuleId && available.length > 0) {
      this.activeModuleId = available[0].id;
    }

    this.moduleNavList.innerHTML = available.map(mod => `
      <button class="module-nav-btn ${mod.id === this.activeModuleId ? 'active' : ''}" data-module-id="${mod.id}">
        <span>${mod.icon}</span>
        <span>${mod.name}</span>
      </button>
    `).join('');

    this.moduleNavList.querySelectorAll(".module-nav-btn").forEach(btn => {
      btn.addEventListener("click", () => {
        this.activeModuleId = btn.dataset.moduleId;
        this.renderModuleNav();
        this.renderActiveModule();
      });
    });
  }

  renderActiveModule() {
    const activeDevice = this.deviceManager.getActiveDevice();
    const mod = this.modules.find(m => m.id === this.activeModuleId && m.isSupported(activeDevice));

    if (mod) {
      mod.render(this.mainViewport);
    } else {
      this.mainViewport.innerHTML = `
        <div style="display: flex; height: 100%; min-height: 300px; align-items: center; justify-content: center; color: var(--text-muted);">
          Kein aktives Modul für dieses Gerät ausgewählt.
        </div>
      `;
    }
  }

  showToast(message, type = "success") {
    const toast = document.createElement("div");
    toast.className = "toast";
    toast.innerHTML = `<span>${type === "success" ? "✓" : "⚠"}</span> <span>${message}</span>`;
    this.toastContainer.appendChild(toast);

    setTimeout(() => {
      toast.style.opacity = "0";
      toast.style.transform = "translateY(8px)";
      toast.style.transition = "all 0.3s ease";
      setTimeout(() => toast.remove(), 300);
    }, 2800);
  }
}

// Bootstrap
document.addEventListener("DOMContentLoaded", () => {
  new AntigravityApp();
});
