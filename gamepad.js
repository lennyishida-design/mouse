/**
 * Gamepad Configuration Module
 */

export class GamepadModule {
  constructor(deviceManager) {
    this.deviceManager = deviceManager;
    this.name = "Controller";
    this.id = "gamepad";
    this.icon = "🎮";
    this.animFrameId = null;
  }

  isSupported(device) {
    return device.capabilities.includes("gamepad") || device.type === "gamepad";
  }

  render(container) {
    const device = this.deviceManager.getActiveDevice();
    const config = device.config;

    container.innerHTML = `
      <div class="module-panel">
        <div class="panel-header">
          <div>
            <h2 class="panel-title">${device.name}</h2>
            <p class="panel-desc">Stick‑Kalibrierung, Hair‑Trigger, Paddle‑Belegung und Vibration</p>
          </div>
        </div>

        <div class="card-box">
          <div class="card-title">
            <span>Live‑Stick & Trigger Visualizer</span>
            <span class="badge-value">${device.isDetected ? 'Hardware aktiv' : 'Emulation'}</span>
          </div>

          <div class="gamepad-visualizer">
            <div class="stick-container">
              <div class="stick-circle">
                <div class="stick-nub" id="left-stick-nub"></div>
              </div>
              <span class="stick-label">Linker Stick</span>
            </div>

            <div class="trigger-meters">
              <div class="trigger-bar-wrapper">
                <div class="trigger-meter">
                  <div class="trigger-fill" id="lt-meter-fill" style="height: 0%;"></div>
                </div>
                <span class="stick-label">LT</span>
              </div>
              <div class="trigger-bar-wrapper">
                <div class="trigger-meter">
                  <div class="trigger-fill" id="rt-meter-fill" style="height: 0%;"></div>
                </div>
                <span class="stick-label">RT</span>
              </div>
            </div>

            <div class="stick-container">
              <div class="stick-circle">
                <div class="stick-nub" id="right-stick-nub"></div>
              </div>
              <span class="stick-label">Rechter Stick</span>
            </div>
          </div>
        </div>

        <div class="grid-2">
          <div class="card-box">
            <div class="card-title">
              <span>Stick‑Totzonen (Deadzones)</span>
            </div>
            <div class="slider-group">
              <div style="display: flex; justify-content: space-between;">
                <span style="font-size: 0.75rem; color: var(--text-muted);">Linker Stick Totzone</span>
                <span style="font-size: 0.75rem; font-weight: 600;" id="ldz-val">${config.leftDeadzone || 4}%</span>
              </div>
              <input type="range" min="0" max="30" step="1" value="${config.leftDeadzone || 4}" class="range-slider" id="ldz-slider">
            </div>
          </div>

          <div class="card-box">
            <div class="card-title">
              <span>Haptik & Vibration</span>
            </div>
            <div class="slider-group">
              <div style="display: flex; justify-content: space-between;">
                <span style="font-size: 0.75rem; color: var(--text-muted);">Vibrationsstärke</span>
                <span style="font-size: 0.75rem; font-weight: 600;" id="vib-val">${config.vibrationStrength || 85}%</span>
              </div>
              <input type="range" min="0" max="100" step="5" value="${config.vibrationStrength || 85}" class="range-slider" id="vib-slider">
            </div>
          </div>
        </div>
      </div>
    `;

    this.attachEvents(container);
    this.startGamepadLoop(container);
  }

  attachEvents(container) {
    const ldzSlider = container.querySelector("#ldz-slider");
    const ldzVal = container.querySelector("#ldz-val");
    if (ldzSlider) {
      ldzSlider.addEventListener("input", (e) => {
        const val = parseInt(e.target.value, 10);
        ldzVal.textContent = `${val}%`;
        this.deviceManager.updateActiveConfig({ leftDeadzone: val });
      });
    }

    const vibSlider = container.querySelector("#vib-slider");
    const vibVal = container.querySelector("#vib-val");
    if (vibSlider) {
      vibSlider.addEventListener("input", (e) => {
        const val = parseInt(e.target.value, 10);
        vibVal.textContent = `${val}%`;
        this.deviceManager.updateActiveConfig({ vibrationStrength: val });
      });
    }
  }

  startGamepadLoop(container) {
    if (this.animFrameId) cancelAnimationFrame(this.animFrameId);
    const leftStickNub = container.querySelector("#left-stick-nub");
    const rightStickNub = container.querySelector("#right-stick-nub");
    const ltFill = container.querySelector("#lt-meter-fill");
    const rtFill = container.querySelector("#rt-meter-fill");
    if (!leftStickNub) return;

    let simAngle = 0;
    const loop = () => {
      const gamepads = navigator.getGamepads ? navigator.getGamepads() : [];
      let activeGp = null;
      for (const gp of gamepads) { if (gp) { activeGp = gp; break; } }

      if (activeGp) {
        const lx = (activeGp.axes[0] || 0) * 22;
        const ly = (activeGp.axes[1] || 0) * 22;
        const rx = (activeGp.axes[2] || 0) * 22;
        const ry = (activeGp.axes[3] || 0) * 22;
        leftStickNub.style.transform = `translate(${lx}px, ${ly}px)`;
        rightStickNub.style.transform = `translate(${rx}px, ${ry}px)`;
        if (ltFill) ltFill.style.height = `${(activeGp.buttons[6]?.value || 0) * 100}%`;
        if (rtFill) rtFill.style.height = `${(activeGp.buttons[7]?.value || 0) * 100}%`;
      } else {
        simAngle += 0.03;
        const sx = Math.sin(simAngle) * 4;
        const sy = Math.cos(simAngle) * 4;
        leftStickNub.style.transform = `translate(${sx}px, ${sy}px)`;
        rightStickNub.style.transform = `translate(${-sx}px, ${-sy}px)`;
      }
      this.animFrameId = requestAnimationFrame(loop);
    };
    loop();
  }
}
