/**
 * Gamepad Configuration Module
 * Visual Stick/Trigger Inspector, Deadzones, Hair Trigger, Paddle Mapping & Vibration
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
            <h2 class="panel-title">Controller & Gamepad</h2>
            <p class="panel-desc">Stick‑Kalibrierung, Hair‑Trigger, Paddle‑Belegung und Vibration</p>
          </div>
        </div>

        <!-- Live Stick & Trigger Inspector -->
        <div class="card-box">
          <div class="card-title">
            <span>Live‑Stick & Trigger Visualizer</span>
            <span class="badge-value" id="gamepad-status-badge">${device.isDetected ? 'Hardware aktiv' : 'Emulation'}</span>
          </div>

          <div class="gamepad-visualizer">
            <!-- Left Stick -->
            <div class="stick-container">
              <div class="stick-circle">
                <div class="stick-nub" id="left-stick-nub"></div>
              </div>
              <span class="stick-label">Linker Stick</span>
            </div>

            <!-- Triggers LT / RT -->
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

            <!-- Right Stick -->
            <div class="stick-container">
              <div class="stick-circle">
                <div class="stick-nub" id="right-stick-nub"></div>
              </div>
              <span class="stick-label">Rechter Stick</span>
            </div>
          </div>
        </div>

        <div class="grid-2">
          <!-- Stick Deadzones -->
          <div class="card-box">
            <div class="card-title">
              <span>Stick‑Totzonen (Deadzones)</span>
            </div>

            <div class="slider-group">
              <div style="display: flex; justify-content: space-between;">
                <span style="font-size: 0.75rem; color: var(--text-muted);">Linker Stick Totzone</span>
                <span style="font-size: 0.75rem; font-weight: 600;" id="ldz-val">${config.leftDeadzone || 5}%</span>
              </div>
              <input type="range" min="0" max="30" step="1" value="${config.leftDeadzone || 5}" class="range-slider" id="ldz-slider">
            </div>

            <div class="slider-group" style="margin-top: 10px;">
              <div style="display: flex; justify-content: space-between;">
                <span style="font-size: 0.75rem; color: var(--text-muted);">Rechter Stick Totzone</span>
                <span style="font-size: 0.75rem; font-weight: 600;" id="rdz-val">${config.rightDeadzone || 5}%</span>
              </div>
              <input type="range" min="0" max="30" step="1" value="${config.rightDeadzone || 5}" class="range-slider" id="rdz-slider">
            </div>
          </div>

          <!-- Trigger Actuation & Vibration -->
          <div class="card-box">
            <div class="card-title">
              <span>Trigger & Haptik</span>
            </div>

            <div class="slider-group">
              <div style="display: flex; justify-content: space-between;">
                <span style="font-size: 0.75rem; color: var(--text-muted);">Hair‑Trigger Ansprechpunkt</span>
                <span style="font-size: 0.75rem; font-weight: 600;" id="trigger-act-val">${config.leftTriggerActuation || 10}%</span>
              </div>
              <input type="range" min="1" max="100" step="1" value="${config.leftTriggerActuation || 10}" class="range-slider" id="trigger-act-slider">
            </div>

            <div class="slider-group" style="margin-top: 10px;">
              <div style="display: flex; justify-content: space-between;">
                <span style="font-size: 0.75rem; color: var(--text-muted);">Vibrationsstärke</span>
                <span style="font-size: 0.75rem; font-weight: 600;" id="vib-val">${config.vibrationStrength || 80}%</span>
              </div>
              <input type="range" min="0" max="100" step="5" value="${config.vibrationStrength || 80}" class="range-slider" id="vib-slider">
            </div>

            <button class="btn btn-secondary btn-sm" id="test-vibration-btn" style="margin-top: 6px;">
              Vibration testen
            </button>
          </div>
        </div>

        <!-- Paddle Keybinds -->
        <div class="card-box">
          <div class="card-title">
            <span>Rückseitige Paddles / Sondertasten</span>
          </div>

          <div class="keybind-list">
            ${Object.entries(config.paddles || {
              "Paddle P1": "A (Springen)",
              "Paddle P2": "B (Ducken)",
              "Paddle P3": "X (Nachladen)",
              "Paddle P4": "Y (Waffenwechsel)"
            }).map(([paddle, action]) => `
              <div class="keybind-row">
                <span class="key-name">${paddle}</span>
                <select class="custom-select paddle-action-select" data-paddle="${paddle}" style="width: 170px; font-size: 0.8rem; padding: 4px 8px;">
                  <option value="A" ${action.includes('A') ? 'selected' : ''}>A / Kreuz</option>
                  <option value="B" ${action.includes('B') ? 'selected' : ''}>B / Kreis</option>
                  <option value="X" ${action.includes('X') ? 'selected' : ''}>X / Quadrat</option>
                  <option value="Y" ${action.includes('Y') ? 'selected' : ''}>Y / Dreieck</option>
                  <option value="LB" ${action.includes('LB') ? 'selected' : ''}>LB / L1</option>
                  <option value="RB" ${action.includes('RB') ? 'selected' : ''}>RB / R1</option>
                  <option value="L3" ${action.includes('L3') ? 'selected' : ''}>Linker Stick Klick (L3)</option>
                  <option value="R3" ${action.includes('R3') ? 'selected' : ''}>Rechter Stick Klick (R3)</option>
                  <option value="None" ${action === 'None' ? 'selected' : ''}>Deaktiviert</option>
                </select>
              </div>
            `).join('')}
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

    const rdzSlider = container.querySelector("#rdz-slider");
    const rdzVal = container.querySelector("#rdz-val");
    if (rdzSlider) {
      rdzSlider.addEventListener("input", (e) => {
        const val = parseInt(e.target.value, 10);
        rdzVal.textContent = `${val}%`;
        this.deviceManager.updateActiveConfig({ rightDeadzone: val });
      });
    }

    const trigSlider = container.querySelector("#trigger-act-slider");
    const trigVal = container.querySelector("#trigger-act-val");
    if (trigSlider) {
      trigSlider.addEventListener("input", (e) => {
        const val = parseInt(e.target.value, 10);
        trigVal.textContent = `${val}%`;
        this.deviceManager.updateActiveConfig({ leftTriggerActuation: val, rightTriggerActuation: val });
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

    const testVibBtn = container.querySelector("#test-vibration-btn");
    if (testVibBtn) {
      testVibBtn.addEventListener("click", () => {
        const device = this.deviceManager.getActiveDevice();
        const intensity = (device.config.vibrationStrength || 80) / 100;
        if (navigator.getGamepads) {
          const gamepads = navigator.getGamepads();
          for (const gp of gamepads) {
            if (gp && gp.vibrationActuator) {
              gp.vibrationActuator.playEffect("dual-rumble", {
                startDelay: 0,
                duration: 400,
                weakMagnitude: intensity,
                strongMagnitude: intensity
              });
            }
          }
        }
        if (navigator.vibrate) {
          navigator.vibrate(300);
        }
      });
    }

    container.querySelectorAll(".paddle-action-select").forEach(select => {
      select.addEventListener("change", (e) => {
        const paddle = e.target.dataset.paddle;
        const device = this.deviceManager.getActiveDevice();
        const paddles = { ...(device.config.paddles || {}), [paddle]: e.target.value };
        this.deviceManager.updateActiveConfig({ paddles });
      });
    });
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
      for (const gp of gamepads) {
        if (gp) { activeGp = gp; break; }
      }

      if (activeGp) {
        // Read actual hardware stick axes
        const lx = (activeGp.axes[0] || 0) * 22;
        const ly = (activeGp.axes[1] || 0) * 22;
        const rx = (activeGp.axes[2] || 0) * 22;
        const ry = (activeGp.axes[3] || 0) * 22;

        leftStickNub.style.transform = `translate(${lx}px, ${ly}px)`;
        rightStickNub.style.transform = `translate(${rx}px, ${ry}px)`;

        // Triggers (Buttons 6 and 7 in standard gamepad mapping)
        const ltVal = activeGp.buttons[6]?.value || 0;
        const rtVal = activeGp.buttons[7]?.value || 0;
        if (ltFill) ltFill.style.height = `${ltVal * 100}%`;
        if (rtFill) rtFill.style.height = `${rtVal * 100}%`;
      } else {
        // Subtle ambient idle animation
        simAngle += 0.03;
        const sx = Math.sin(simAngle) * 5;
        const sy = Math.cos(simAngle) * 5;
        leftStickNub.style.transform = `translate(${sx}px, ${sy}px)`;
        rightStickNub.style.transform = `translate(${-sx}px, ${-sy}px)`;
      }

      this.animFrameId = requestAnimationFrame(loop);
    };

    loop();
  }
}
