/**
 * Antigravity Headset Configuration Module
 * EQ Presets, 5-Band Graphic Equalizer, Mic Gain, Noise Reduction, Spatial Audio
 */

export class HeadsetModule {
  constructor(deviceManager) {
    this.deviceManager = deviceManager;
    this.name = "Headset";
    this.id = "headset";
    this.icon = "🎧";
  }

  isSupported(device) {
    return device.capabilities.includes("headset") || device.type === "headset";
  }

  render(container) {
    const device = this.deviceManager.getActiveDevice();
    const config = device.config;
    const bands = config.eqBands || { "64Hz": 0, "250Hz": 0, "1kHz": 0, "4kHz": 0, "16kHz": 0 };

    container.innerHTML = `
      <div class="module-panel">
        <div class="panel-header">
          <div>
            <h2 class="panel-title">Headset & Akustik</h2>
            <p class="panel-desc">THX Spatial Audio, Equalizer‑Profile und Mikrofonfilter</p>
          </div>
        </div>

        <div class="grid-2">
          <!-- Equalizer -->
          <div class="card-box">
            <div class="card-title">
              <span>Equalizer & Presets</span>
              <select id="eq-preset-select" class="custom-select" style="width: 125px; padding: 3px 8px; font-size: 0.8rem;">
                <option value="gaming" ${config.eqPreset === 'gaming' ? 'selected' : ''}>Gaming</option>
                <option value="esports" ${config.eqPreset === 'esports' ? 'selected' : ''}>Esports / FPS</option>
                <option value="music" ${config.eqPreset === 'music' ? 'selected' : ''}>Musik</option>
                <option value="movie" ${config.eqPreset === 'movie' ? 'selected' : ''}>Film</option>
                <option value="custom" ${config.eqPreset === 'custom' ? 'selected' : ''}>Benutzerdefiniert</option>
              </select>
            </div>

            <!-- Graphic EQ -->
            <div class="eq-bars-container">
              ${Object.entries(bands).map(([freq, val]) => `
                <div class="eq-band">
                  <span style="font-size: 0.7rem; font-weight: 600;" id="eq-val-${freq}">${val > 0 ? '+' + val : val}dB</span>
                  <input type="range" min="-12" max="12" step="1" value="${val}" class="eq-slider" data-freq="${freq}">
                  <span class="eq-freq-label">${freq}</span>
                </div>
              `).join('')}
            </div>
          </div>

          <!-- Microphone & Enhancements -->
          <div class="card-box">
            <div class="card-title">
              <span>Mikrofon‑Einstellungen</span>
              <span class="badge-value" id="mic-gain-val">${config.micGain || 80}%</span>
            </div>

            <div class="slider-group">
              <label class="switch-label" style="font-size: 0.75rem; color: var(--text-muted);">Mikrofonverstärkung (Gain)</label>
              <input type="range" min="0" max="100" step="1" value="${config.micGain || 80}" class="range-slider" id="mic-gain-slider">
            </div>

            <div class="switch-control" style="margin-top: 14px;">
              <div>
                <div class="switch-label">Aktive Rauschunterdrückung</div>
                <div style="font-size: 0.725rem; color: var(--text-light);">Tastaturgeräusche und Lüfterrauschen eliminieren</div>
              </div>
              <label class="toggle-switch">
                <input type="checkbox" id="noise-reduction-toggle" ${config.noiseReduction ? 'checked' : ''}>
                <span class="toggle-slider"></span>
              </label>
            </div>

            <div class="switch-control" style="margin-top: 14px;">
              <div>
                <div class="switch-label">Spatial Audio 7.1 Surround</div>
                <div style="font-size: 0.725rem; color: var(--text-light);">Präzise ortbare 360° Klangkulisse</div>
              </div>
              <label class="toggle-switch">
                <input type="checkbox" id="spatial-toggle" ${config.spatialAudio ? 'checked' : ''}>
                <span class="toggle-slider"></span>
              </label>
            </div>
          </div>
        </div>
      </div>
    `;

    this.attachEvents(container);
  }

  attachEvents(container) {
    const eqPresetSelect = container.querySelector("#eq-preset-select");
    const eqSliders = container.querySelectorAll(".eq-slider");

    const PRESETS = {
      gaming: { "64Hz": 4, "250Hz": 2, "1kHz": 0, "4kHz": 4, "16kHz": 3 },
      esports: { "64Hz": -3, "250Hz": -1, "1kHz": 2, "4kHz": 6, "16kHz": 4 },
      music: { "64Hz": 5, "250Hz": 3, "1kHz": 0, "4kHz": 2, "16kHz": 5 },
      movie: { "64Hz": 6, "250Hz": 4, "1kHz": -1, "4kHz": 3, "16kHz": 2 },
      custom: { "64Hz": 0, "250Hz": 0, "1kHz": 0, "4kHz": 0, "16kHz": 0 }
    };

    if (eqPresetSelect) {
      eqPresetSelect.addEventListener("change", (e) => {
        const preset = e.target.value;
        if (PRESETS[preset]) {
          const newBands = PRESETS[preset];
          this.deviceManager.updateActiveConfig({ eqPreset: preset, eqBands: newBands });
          eqSliders.forEach(slider => {
            const freq = slider.dataset.freq;
            slider.value = newBands[freq] || 0;
            const label = container.querySelector(`#eq-val-${freq}`);
            if (label) label.textContent = `${slider.value > 0 ? '+' + slider.value : slider.value}dB`;
          });
        }
      });
    }

    eqSliders.forEach(slider => {
      slider.addEventListener("input", (e) => {
        const freq = e.target.dataset.freq;
        const val = parseInt(e.target.value, 10);
        const label = container.querySelector(`#eq-val-${freq}`);
        if (label) label.textContent = `${val > 0 ? '+' + val : val}dB`;
        
        const device = this.deviceManager.getActiveDevice();
        const eqBands = { ...(device.config.eqBands || {}), [freq]: val };
        this.deviceManager.updateActiveConfig({ eqBands, eqPreset: "custom" });
        if (eqPresetSelect) eqPresetSelect.value = "custom";
      });
    });

    const micGainSlider = container.querySelector("#mic-gain-slider");
    const micGainVal = container.querySelector("#mic-gain-val");
    if (micGainSlider) {
      micGainSlider.addEventListener("input", (e) => {
        const val = parseInt(e.target.value, 10);
        micGainVal.textContent = `${val}%`;
        this.deviceManager.updateActiveConfig({ micGain: val });
      });
    }

    const noiseToggle = container.querySelector("#noise-reduction-toggle");
    if (noiseToggle) {
      noiseToggle.addEventListener("change", (e) => {
        this.deviceManager.updateActiveConfig({ noiseReduction: e.target.checked });
      });
    }

    const spatialToggle = container.querySelector("#spatial-toggle");
    if (spatialToggle) {
      spatialToggle.addEventListener("change", (e) => {
        this.deviceManager.updateActiveConfig({ spatialAudio: e.target.checked });
      });
    }
  }
}
