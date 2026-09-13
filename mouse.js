/**
 * Antigravity Mouse Configuration Module
 * Optimized for ROCCAT Kain 120 / 200 AIMO (Debounce Time, Titan Click, Drag Click Mode)
 */

export class MouseModule {
  constructor(deviceManager) {
    this.deviceManager = deviceManager;
    this.name = "Maus (Kain)";
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
            <h2 class="panel-title">${device.name} — Sensor & Titan Switch</h2>
            <p class="panel-desc">Owl-Eye Sensor, Debounce-Time (Drag-Click), Polling-Rate & LOD</p>
          </div>
        </div>

        <div class="grid-2">
          <!-- DPI Settings -->
          <div class="card-box">
            <div class="card-title">
              <span>DPI‑Empfindlichkeit (Owl‑Eye Sensor)</span>
              <span class="badge-value" id="dpi-val">${config.dpi || 800} DPI</span>
            </div>
            <div class="slider-group">
              <input type="range" min="100" max="16000" step="50" value="${config.dpi || 800}" class="range-slider" id="dpi-slider">
            </div>
            <div class="card-title" style="margin-top: 8px;">
              <span>DPI‑Stufen</span>
            </div>
            <div class="dpi-stages" id="dpi-stages-container">
              ${(config.dpiStages || [400, 800, 1200, 1600, 3200, 16000]).map((stage, idx) => `
                <button class="dpi-stage-btn ${idx === config.activeStage ? 'active' : ''}" data-stage="${idx}" data-dpi="${stage}">
                  ${stage}
                </button>
              `).join('')}
            </div>
          </div>

          <!-- Debounce Time / Drag Click Tuning -->
          <div class="card-box">
            <div class="card-title">
              <span>Debounce Time (Tastenentprellung)</span>
              <span class="badge-value" id="debounce-val" style="color: ${config.debounceTime === 0 ? '#10b981' : 'inherit'};">
                ${config.debounceTime ?? 0} ms ${config.debounceTime === 0 ? '(Drag Click Aktiv)' : ''}
              </span>
            </div>
            <div class="slider-group">
              <input type="range" min="0" max="10" step="1" value="${config.debounceTime ?? 0}" class="range-slider" id="debounce-slider">
              <div style="display: flex; justify-content: space-between; font-size: 0.7rem; color: var(--text-muted); margin-top: 2px;">
                <span>0 ms (Max CPS / Drag Click)</span>
                <span>10 ms (Standard)</span>
              </div>
            </div>

            <div class="switch-control" style="margin-top: 10px;">
              <div>
                <div class="switch-label">Titan Click Speed Tuning</div>
                <div style="font-size: 0.725rem; color: var(--text-light);">Reaktionszeit der opto-mechanischen Schalter maximieren</div>
              </div>
              <label class="toggle-switch">
                <input type="checkbox" id="titan-toggle" ${config.titanClickTuning !== false ? 'checked' : ''}>
                <span class="toggle-slider"></span>
              </label>
            </div>
          </div>
        </div>

        <div class="grid-2">
          <!-- Polling & LOD -->
          <div class="card-box">
            <div class="card-title">
              <span>Polling‑Rate (Abtastrate)</span>
            </div>
            <select id="polling-select" class="custom-select">
              ${[125, 250, 500, 1000].map(rate => `
                <option value="${rate}" ${config.pollingRate === rate ? 'selected' : ''}>${rate} Hz (${(1000/rate).toFixed(2)}ms)</option>
              `).join('')}
            </select>

            <div class="card-title" style="margin-top: 12px;">
              <span>Lift‑Off‑Distance (LOD / DCU)</span>
              <span class="badge-value" id="lod-val">${config.liftOffDistance || 1.0} mm</span>
            </div>
            <div class="slider-group">
              <input type="range" min="0.5" max="3.0" step="0.1" value="${config.liftOffDistance || 1.0}" class="range-slider" id="lod-slider">
            </div>

            <div class="switch-control" style="margin-top: 10px;">
              <div>
                <div class="switch-label">Winkel-Ausrichtung (Angle Snapping)</div>
                <div style="font-size: 0.725rem; color: var(--text-light);">Sensor-Glättung bei horizontalen Linien</div>
              </div>
              <label class="toggle-switch">
                <input type="checkbox" id="angle-snapping-toggle" ${config.angleSnapping ? 'checked' : ''}>
                <span class="toggle-slider"></span>
              </label>
            </div>
          </div>

          <!-- Keybinds & Easy-Shift -->
          <div class="card-box">
            <div class="card-title">
              <span>Tastenbelegung (Easy‑Shift[+])</span>
            </div>
            <div class="keybind-list">
              ${Object.entries(config.keybinds || {
                "Titan Click Links": "Left Click",
                "Titan Click Rechts": "Right Click",
                "Titan Wheel Scroll": "Middle Click",
                "Easy-Shift / Daumen 1": "Browser Back",
                "Daumen 2": "Browser Forward",
                "DPI Taste": "Cycle DPI"
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
                    <option value="Butterfly Click" ${action === 'Butterfly Click' ? 'selected' : ''}>Butterfly Makro</option>
                    <option value="Disabled" ${action === 'Disabled' ? 'selected' : ''}>Deaktiviert</option>
                  </select>
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

    const debounceSlider = container.querySelector("#debounce-slider");
    const debounceVal = container.querySelector("#debounce-val");
    if (debounceSlider) {
      debounceSlider.addEventListener("input", (e) => {
        const val = parseInt(e.target.value, 10);
        debounceVal.textContent = `${val} ms ${val === 0 ? '(Drag Click Aktiv)' : ''}`;
        debounceVal.style.color = val === 0 ? '#10b981' : 'inherit';
        this.deviceManager.updateActiveConfig({ debounceTime: val });
      });
    }

    const titanToggle = container.querySelector("#titan-toggle");
    if (titanToggle) {
      titanToggle.addEventListener("change", (e) => {
        this.deviceManager.updateActiveConfig({ titanClickTuning: e.target.checked });
      });
    }

    const angleToggle = container.querySelector("#angle-snapping-toggle");
    if (angleToggle) {
      angleToggle.addEventListener("change", (e) => {
        this.deviceManager.updateActiveConfig({ angleSnapping: e.target.checked });
      });
    }

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

    container.querySelectorAll(".key-action-select").forEach(select => {
      select.addEventListener("change", (e) => {
        const device = this.deviceManager.getActiveDevice();
        const keybinds = { ...device.config.keybinds, [select.dataset.btn]: e.target.value };
        this.deviceManager.updateActiveConfig({ keybinds });
      });
    });
  }
}
