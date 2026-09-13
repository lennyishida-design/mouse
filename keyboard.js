/**
 * Keyboard Configuration Module
 */

export class KeyboardModule {
  constructor(deviceManager) {
    this.deviceManager = deviceManager;
    this.name = "Tastatur";
    this.id = "keyboard";
    this.icon = "⌨️";
  }

  isSupported(device) {
    return device.capabilities.includes("keyboard") || device.type === "keyboard";
  }

  render(container) {
    const device = this.deviceManager.getActiveDevice();
    const config = device.config;

    container.innerHTML = `
      <div class="module-panel">
        <div class="panel-header">
          <div>
            <h2 class="panel-title">${device.name}</h2>
            <p class="panel-desc">Optische Schalter, Rapid Trigger, SOCD Snap Tap und RGB‑Zonen</p>
          </div>
        </div>

        <div class="grid-2">
          <div class="card-box">
            <div class="card-title">
              <span>Rapid Trigger & Betätigung</span>
              <span class="badge-value" id="actuation-val">${config.actuationPoint || 1.0} mm</span>
            </div>
            
            <div class="slider-group">
              <label class="switch-label" style="font-size: 0.75rem; color: var(--text-muted);">Betätigungspunkt (Actuation Point)</label>
              <input type="range" min="0.1" max="4.0" step="0.1" value="${config.actuationPoint || 1.0}" class="range-slider" id="actuation-slider">
            </div>

            <div class="switch-control" style="margin-top: 12px;">
              <div>
                <div class="switch-label">Rapid Trigger</div>
                <div style="font-size: 0.725rem; color: var(--text-light);">Dynamisches Zurücksetzen bei Tastenhub</div>
              </div>
              <label class="toggle-switch">
                <input type="checkbox" id="rapid-trigger-toggle" ${config.rapidTriggerEnabled ? 'checked' : ''}>
                <span class="toggle-slider"></span>
              </label>
            </div>

            <div class="slider-group" style="margin-top: 10px;">
              <div style="display: flex; justify-content: space-between;">
                <span style="font-size: 0.75rem; color: var(--text-muted);">RT‑Sensitivität</span>
                <span style="font-size: 0.75rem; font-weight: 600;" id="rt-sens-val">${config.rapidTriggerSensitivity || 0.1} mm</span>
              </div>
              <input type="range" min="0.05" max="2.0" step="0.05" value="${config.rapidTriggerSensitivity || 0.1}" class="range-slider" id="rt-sens-slider">
            </div>
          </div>

          <div class="card-box">
            <div class="card-title">
              <span>Snap Tap (SOCD)</span>
            </div>
            
            <div class="switch-control">
              <div>
                <div class="switch-label">Snap Tap Modus</div>
                <div style="font-size: 0.725rem; color: var(--text-light);">Priorisiert die zuletzt gedrückte Richtungstaste (A/D)</div>
              </div>
              <label class="toggle-switch">
                <input type="checkbox" id="snaptap-toggle" ${config.snapTapEnabled ? 'checked' : ''}>
                <span class="toggle-slider"></span>
              </label>
            </div>

            <div class="card-title" style="margin-top: 20px;">
              <span>RGB‑Zonen</span>
            </div>
            <div style="display: flex; justify-content: space-between; gap: 8px;">
              ${Object.entries(config.rgbZones || { wasd: "#00e5ff", arrows: "#00e5ff", main: "#ff0055", functionKeys: "#ffaa00" }).map(([zone, color]) => `
                <div style="display: flex; flex-direction: column; align-items: center; gap: 4px;">
                  <input type="color" value="${color}" class="color-picker-native rgb-zone-picker" data-zone="${zone}" style="width: 36px; height: 36px;">
                  <span style="font-size: 0.675rem; font-weight: 600; text-transform: uppercase; color: var(--text-muted);">${zone}</span>
                </div>
              `).join('')}
            </div>
          </div>
        </div>
      </div>
    `;

    this.attachEvents(container);
  }

  attachEvents(container) {
    const actSlider = container.querySelector("#actuation-slider");
    const actVal = container.querySelector("#actuation-val");
    if (actSlider) {
      actSlider.addEventListener("input", (e) => {
        const val = parseFloat(e.target.value);
        actVal.textContent = `${val.toFixed(1)} mm`;
        this.deviceManager.updateActiveConfig({ actuationPoint: val });
      });
    }

    const rtToggle = container.querySelector("#rapid-trigger-toggle");
    if (rtToggle) {
      rtToggle.addEventListener("change", (e) => {
        this.deviceManager.updateActiveConfig({ rapidTriggerEnabled: e.target.checked });
      });
    }

    const rtSensSlider = container.querySelector("#rt-sens-slider");
    const rtSensVal = container.querySelector("#rt-sens-val");
    if (rtSensSlider) {
      rtSensSlider.addEventListener("input", (e) => {
        const val = parseFloat(e.target.value);
        rtSensVal.textContent = `${val.toFixed(2)} mm`;
        this.deviceManager.updateActiveConfig({ rapidTriggerSensitivity: val });
      });
    }

    const snapToggle = container.querySelector("#snaptap-toggle");
    if (snapToggle) {
      snapToggle.addEventListener("change", (e) => {
        this.deviceManager.updateActiveConfig({ snapTapEnabled: e.target.checked });
      });
    }

    container.querySelectorAll(".rgb-zone-picker").forEach(picker => {
      picker.addEventListener("input", (e) => {
        const zone = e.target.dataset.zone;
        const device = this.deviceManager.getActiveDevice();
        const rgbZones = { ...device.config.rgbZones, [zone]: e.target.value };
        this.deviceManager.updateActiveConfig({ rgbZones });
      });
    });
  }
}
