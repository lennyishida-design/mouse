/**
 * Antigravity RGB Lighting & Chroma Module
 * Color Picker, Presets, Effects (Static, Breathing, Wave, Spectrum, Reactive), Global Sync
 */

export class RgbModule {
  constructor(deviceManager) {
    this.deviceManager = deviceManager;
    this.name = "Beleuchtung";
    this.id = "rgb";
    this.icon = "💡";
    this.animationId = null;
  }

  isSupported(device) {
    return true; // Supported on all configurable devices
  }

  render(container) {
    const device = this.deviceManager.getActiveDevice();
    const config = device.config.rgb || {
      effect: "breathing",
      color: "#10b981",
      brightness: 100,
      speed: 50,
      syncEnabled: false
    };

    container.innerHTML = `
      <div class="module-panel">
        <div class="panel-header">
          <div>
            <h2 class="panel-title">RGB & Chroma‑Beleuchtung</h2>
            <p class="panel-desc">Farben, dynamische Lichteffekte und geräteübergreifende Synchronisation</p>
          </div>
        </div>

        <div class="grid-2">
          <!-- RGB Live Preview & Effect Selector -->
          <div class="card-box">
            <div class="card-title">
              <span>Licht‑Vorschau</span>
              <span class="badge-value" id="effect-name-badge">${config.effect.toUpperCase()}</span>
            </div>
            
            <div class="rgb-preview-box" id="rgb-preview-container">
              <div class="rgb-preview-glow" id="rgb-glow-element" style="background: ${config.color};"></div>
              <span style="position: absolute; font-size: 0.75rem; font-weight: 600; color: rgba(255,255,255,0.8);">${device.name}</span>
            </div>

            <div class="card-title" style="margin-top: 10px;">
              <span>Lichteffekt</span>
            </div>
            <select id="rgb-effect-select" class="custom-select">
              <option value="static" ${config.effect === 'static' ? 'selected' : ''}>Statisch (Static)</option>
              <option value="breathing" ${config.effect === 'breathing' ? 'selected' : ''}>Atmen (Breathing)</option>
              <option value="wave" ${config.effect === 'wave' ? 'selected' : ''}>Welle (Wave)</option>
              <option value="spectrum" ${config.effect === 'spectrum' ? 'selected' : ''}>Farbspektrum (Spectrum)</option>
              <option value="reactive" ${config.effect === 'reactive' ? 'selected' : ''}>Reaktiv (Reactive)</option>
              <option value="off" ${config.effect === 'off' ? 'selected' : ''}>Ausgeschaltet (Off)</option>
            </select>
          </div>

          <!-- Color Chooser & Parameters -->
          <div class="card-box">
            <div class="card-title">
              <span>Primärfarbe</span>
            </div>
            
            <div class="color-input-wrapper">
              <input type="color" id="rgb-color-picker" class="color-picker-native" value="${config.color}">
              <div class="color-palette-presets">
                ${["#10b981", "#3b82f6", "#8b5cf6", "#ec4899", "#ef4444", "#f59e0b", "#ffffff"].map(c => `
                  <button class="palette-btn" data-color="${c}" style="background-color: ${c};" title="${c}"></button>
                `).join('')}
              </div>
            </div>

            <!-- Brightness & Speed -->
            <div class="slider-group" style="margin-top: 12px;">
              <div style="display: flex; justify-content: space-between;">
                <span style="font-size: 0.75rem; color: var(--text-muted);">Helligkeit</span>
                <span style="font-size: 0.75rem; font-weight: 600;" id="brightness-val">${config.brightness}%</span>
              </div>
              <input type="range" min="0" max="100" step="1" value="${config.brightness}" class="range-slider" id="brightness-slider">
            </div>

            <div class="slider-group" style="margin-top: 10px;">
              <div style="display: flex; justify-content: space-between;">
                <span style="font-size: 0.75rem; color: var(--text-muted);">Geschwindigkeit</span>
                <span style="font-size: 0.75rem; font-weight: 600;" id="speed-val">${config.speed}%</span>
              </div>
              <input type="range" min="10" max="100" step="1" value="${config.speed}" class="range-slider" id="speed-slider">
            </div>

            <!-- Global Sync Toggle -->
            <div class="switch-control" style="margin-top: 14px;">
              <div>
                <div class="switch-label">Alle Geräte synchronisieren</div>
                <div style="font-size: 0.725rem; color: var(--text-light);">Farbe & Effekt auf das gesamte Setup übertragen</div>
              </div>
              <label class="toggle-switch">
                <input type="checkbox" id="sync-all-toggle" ${config.syncEnabled ? 'checked' : ''}>
                <span class="toggle-slider"></span>
              </label>
            </div>
          </div>
        </div>
      </div>
    `;

    this.attachEvents(container);
    this.startAnimation(container);
  }

  attachEvents(container) {
    const effectSelect = container.querySelector("#rgb-effect-select");
    const colorPicker = container.querySelector("#rgb-color-picker");
    const effectBadge = container.querySelector("#effect-name-badge");
    const brightnessSlider = container.querySelector("#brightness-slider");
    const brightnessVal = container.querySelector("#brightness-val");
    const speedSlider = container.querySelector("#speed-slider");
    const speedVal = container.querySelector("#speed-val");
    const syncToggle = container.querySelector("#sync-all-toggle");

    const updateRgbConfig = (newProps) => {
      const device = this.deviceManager.getActiveDevice();
      const currentRgb = device.config.rgb || {};
      const updated = { ...currentRgb, ...newProps };
      
      this.deviceManager.updateActiveConfig({ rgb: updated });

      if (updated.syncEnabled) {
        this.deviceManager.getDevices().forEach(d => {
          if (d.id !== device.id) {
            d.config.rgb = { ...(d.config.rgb || {}), ...newProps, syncEnabled: true };
          }
        });
        this.deviceManager.saveDevices();
      }
    };

    if (effectSelect) {
      effectSelect.addEventListener("change", (e) => {
        const effect = e.target.value;
        if (effectBadge) effectBadge.textContent = effect.toUpperCase();
        updateRgbConfig({ effect });
      });
    }

    if (colorPicker) {
      colorPicker.addEventListener("input", (e) => {
        updateRgbConfig({ color: e.target.value });
      });
    }

    container.querySelectorAll(".palette-btn").forEach(btn => {
      btn.addEventListener("click", () => {
        const color = btn.dataset.color;
        if (colorPicker) colorPicker.value = color;
        updateRgbConfig({ color });
      });
    });

    if (brightnessSlider) {
      brightnessSlider.addEventListener("input", (e) => {
        const val = parseInt(e.target.value, 10);
        if (brightnessVal) brightnessVal.textContent = `${val}%`;
        updateRgbConfig({ brightness: val });
      });
    }

    if (speedSlider) {
      speedSlider.addEventListener("input", (e) => {
        const val = parseInt(e.target.value, 10);
        if (speedVal) speedVal.textContent = `${val}%`;
        updateRgbConfig({ speed: val });
      });
    }

    if (syncToggle) {
      syncToggle.addEventListener("change", (e) => {
        updateRgbConfig({ syncEnabled: e.target.checked });
      });
    }
  }

  startAnimation(container) {
    if (this.animationId) cancelAnimationFrame(this.animationId);

    const glow = container.querySelector("#rgb-glow-element");
    if (!glow) return;

    let step = 0;

    const loop = () => {
      const device = this.deviceManager.getActiveDevice();
      const rgb = device.config.rgb || { effect: "breathing", color: "#10b981", brightness: 80, speed: 50 };
      step += (rgb.speed / 50) * 0.04;

      if (rgb.effect === "off") {
        glow.style.opacity = "0";
      } else if (rgb.effect === "static") {
        glow.style.background = rgb.color;
        glow.style.opacity = `${rgb.brightness / 100}`;
      } else if (rgb.effect === "breathing") {
        const alpha = (Math.sin(step) + 1) / 2;
        glow.style.background = rgb.color;
        glow.style.opacity = `${(alpha * (rgb.brightness / 100)).toFixed(2)}`;
      } else if (rgb.effect === "spectrum" || rgb.effect === "wave") {
        const hue = (step * 50) % 360;
        glow.style.background = `hsl(${hue}, 100%, 50%)`;
        glow.style.opacity = `${rgb.brightness / 100}`;
      } else if (rgb.effect === "reactive") {
        const pulse = Math.abs(Math.sin(step * 2));
        glow.style.background = rgb.color;
        glow.style.opacity = `${(pulse * (rgb.brightness / 100)).toFixed(2)}`;
      }

      this.animationId = requestAnimationFrame(loop);
    };

    loop();
  }
}
