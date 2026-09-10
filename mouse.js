/**
 * Antigravity Mouse Configuration Module
 * DPI Slider, Polling Rate, Lift-Off-Distance, Keybinds, Macro Editor
 */

export class MouseModule {
  constructor(deviceManager) {
    this.deviceManager = deviceManager;
    this.name = "Maus";
    this.id = "mouse";
    this.icon = "🖱️";
  }

  isSupported(device) {
    return device.capabilities.includes("mouse") || device.type === "mouse";
  }

  render(container) {
    const device = this.deviceManager.getActiveDevice();
    const config = device.config;

    container.innerHTML = `
      <div class="module-panel">
        <div class="panel-header">
          <div>
            <h2 class="panel-title">Maus & Sensor‑Leistung</h2>
            <p class="panel-desc">Optischer Sensor, Abtastrate, Lift‑Off‑Distance und Tastenbelegung</p>
          </div>
        </div>

        <div class="grid-2">
          <!-- DPI Settings -->
          <div class="card-box">
            <div class="card-title">
              <span>DPI‑Empfindlichkeit</span>
              <span class="badge-value" id="dpi-val">${config.dpi || 1600} DPI</span>
            </div>
            <div class="slider-group">
              <input type="range" min="100" max="30000" step="50" value="${config.dpi || 1600}" class="range-slider" id="dpi-slider">
            </div>
            <div class="card-title" style="margin-top: 8px;">
              <span>DPI‑Stufen</span>
            </div>
            <div class="dpi-stages" id="dpi-stages-container">
              ${(config.dpiStages || [400, 800, 1600, 3200, 6400]).map((stage, idx) => `
                <button class="dpi-stage-btn ${idx === config.activeStage ? 'active' : ''}" data-stage="${idx}" data-dpi="${stage}">
                  ${stage}
                </button>
              `).join('')}
            </div>
          </div>

          <!-- Polling & LOD -->
          <div class="card-box">
            <div class="card-title">
              <span>Polling‑Rate (Abtastrate)</span>
            </div>
            <select id="polling-select" class="custom-select">
              ${[125, 250, 500, 1000, 2000, 4000, 8000].map(rate => `
                <option value="${rate}" ${config.pollingRate === rate ? 'selected' : ''}>${rate} Hz (${(1000/rate).toFixed(2)}ms)</option>
              `).join('')}
            </select>

            <div class="card-title" style="margin-top: 12px;">
              <span>Lift‑Off‑Distance (LOD)</span>
              <span class="badge-value" id="lod-val">${config.liftOffDistance || 1.0} mm</span>
            </div>
            <div class="slider-group">
              <input type="range" min="0.5" max="3.0" step="0.1" value="${config.liftOffDistance || 1.0}" class="range-slider" id="lod-slider">
            </div>
          </div>
        </div>

        <!-- Keybinds & Macro Section -->
        <div class="grid-2">
          <!-- Keybinds -->
          <div class="card-box">
            <div class="card-title">
              <span>Tastenbelegung (Keybinds)</span>
            </div>
            <div class="keybind-list">
              ${Object.entries(config.keybinds || {
                "Taste 1 (Links)": "Left Click",
                "Taste 2 (Rechts)": "Right Click",
                "Taste 3 (Mitte)": "Middle Click",
                "Taste 4 (Daumen 1)": "Browser Back",
                "Taste 5 (Daumen 2)": "Browser Forward",
                "DPI Switch": "Cycle DPI"
              }).map(([btnName, action]) => `
                <div class="keybind-row">
                  <span class="key-name">${btnName}</span>
                  <select class="custom-select key-action-select" data-btn="${btnName}" style="width: 150px; font-size: 0.8rem; padding: 4px 8px;">
                    <option value="Left Click" ${action === 'Left Click' ? 'selected' : ''}>Linksklick</option>
                    <option value="Right Click" ${action === 'Right Click' ? 'selected' : ''}>Rechtsklick</option>
                    <option value="Middle Click" ${action === 'Middle Click' ? 'selected' : ''}>Mittelklick</option>
                    <option value="Browser Back" ${action === 'Browser Back' ? 'selected' : ''}>Zurück</option>
                    <option value="Browser Forward" ${action === 'Browser Forward' ? 'selected' : ''}>Vorwärts</option>
                    <option value="Cycle DPI" ${action === 'Cycle DPI' ? 'selected' : ''}>DPI-Wechsel</option>
                    <option value="Fast Tap" ${action === 'Fast Tap' ? 'selected' : ''}>Makro ausführen</option>
                    <option value="Disabled" ${action === 'Disabled' ? 'selected' : ''}>Deaktiviert</option>
                  </select>
                </div>
              `).join('')}
            </div>
          </div>

          <!-- Minimal Macro Editor -->
          <div class="card-box">
            <div class="card-title">
              <span>Makro‑Editor</span>
              <button class="btn btn-secondary btn-sm" id="add-macro-step-btn">+ Schritt</button>
            </div>
            <div class="macro-steps" id="macro-steps-list">
              ${((config.macros && config.macros[0]?.keys) || ["Click Left", "Delay 30ms", "Click Left"]).map((step, idx) => `
                <div class="macro-step-item">
                  <span>${step}</span>
                  <button class="btn btn-ghost btn-sm remove-macro-step" data-idx="${idx}" style="color: #ef4444;">✕</button>
                </div>
              `).join('')}
            </div>
            <div style="display: flex; gap: 8px; margin-top: 8px;">
              <input type="text" id="macro-step-input" class="custom-input" placeholder="z.B. Taste [F] oder 20ms" style="flex: 1;">
              <button class="btn btn-primary btn-sm" id="save-step-btn">Hinzufügen</button>
            </div>
          </div>
        </div>
      </div>
    `;

    this.attachEvents(container);
  }

  attachEvents(container) {
    const dpiSlider = container.querySelector("#dpi-slider");
    const dpiVal = container.querySelector("#dpi-val");
    if (dpiSlider) {
      dpiSlider.addEventListener("input", (e) => {
        const val = parseInt(e.target.value, 10);
        dpiVal.textContent = `${val} DPI`;
        this.deviceManager.updateActiveConfig({ dpi: val });
      });
    }

    const stageBtns = container.querySelectorAll(".dpi-stage-btn");
    stageBtns.forEach(btn => {
      btn.addEventListener("click", () => {
        const stage = parseInt(btn.dataset.stage, 10);
        const dpi = parseInt(btn.dataset.dpi, 10);
        stageBtns.forEach(b => b.classList.remove("active"));
        btn.classList.add("active");
        if (dpiSlider) dpiSlider.value = dpi;
        if (dpiVal) dpiVal.textContent = `${dpi} DPI`;
        this.deviceManager.updateActiveConfig({ activeStage: stage, dpi: dpi });
      });
    });

    const pollingSelect = container.querySelector("#polling-select");
    if (pollingSelect) {
      pollingSelect.addEventListener("change", (e) => {
        this.deviceManager.updateActiveConfig({ pollingRate: parseInt(e.target.value, 10) });
      });
    }

    const lodSlider = container.querySelector("#lod-slider");
    const lodVal = container.querySelector("#lod-val");
    if (lodSlider) {
      lodSlider.addEventListener("input", (e) => {
        const val = parseFloat(e.target.value);
        lodVal.textContent = `${val.toFixed(1)} mm`;
        this.deviceManager.updateActiveConfig({ liftOffDistance: val });
      });
    }

    const keySelects = container.querySelectorAll(".key-action-select");
    keySelects.forEach(select => {
      select.addEventListener("change", (e) => {
        const device = this.deviceManager.getActiveDevice();
        const keybinds = { ...device.config.keybinds, [select.dataset.btn]: e.target.value };
        this.deviceManager.updateActiveConfig({ keybinds });
      });
    });

    const saveStepBtn = container.querySelector("#save-step-btn");
    const stepInput = container.querySelector("#macro-step-input");
    if (saveStepBtn && stepInput) {
      const addStep = () => {
        const val = stepInput.value.trim();
        if (!val) return;
        const device = this.deviceManager.getActiveDevice();
        const macros = device.config.macros || [{ name: "Standard", keys: [] }];
        if (!macros[0]) macros[0] = { name: "Standard", keys: [] };
        macros[0].keys.push(val);
        this.deviceManager.updateActiveConfig({ macros });
        stepInput.value = "";
        this.render(container);
      };
      saveStepBtn.addEventListener("click", addStep);
      stepInput.addEventListener("keydown", (e) => { if (e.key === "Enter") addStep(); });
    }

    container.querySelectorAll(".remove-macro-step").forEach(btn => {
      btn.addEventListener("click", () => {
        const idx = parseInt(btn.dataset.idx, 10);
        const device = this.deviceManager.getActiveDevice();
        const macros = device.config.macros;
        if (macros && macros[0] && macros[0].keys) {
          macros[0].keys.splice(idx, 1);
          this.deviceManager.updateActiveConfig({ macros });
          this.render(container);
        }
      });
    });
  }
}
