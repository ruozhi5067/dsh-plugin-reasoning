window.__ModuleLoader__.load({
  id: "dsh-reasoning-fx-one",
  factory: function () {
    var module = { exports: {} };
    var exports = module.exports;
    Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });

    var PACKAGE_ID = "dsh-reasoning-fx-one";
    var THUMB_INSET = 6;
    var MAX_PARTICLES = 120;
    var GOLDEN_RATIO = 0.6180339887498949;

    var CSS = `
.rps-control[data-fx-one="true"] .rps-glyph {
  color: #ffd27d;
  text-shadow: 0 0 8px rgba(255, 176, 60, .78);
}
.rps-control[data-fx-one="true"] .rps-fill {
  background: linear-gradient(90deg, #4e7cff 0%, #8f66ff 58%, #b56dff 100%);
  box-shadow:
    0 0 9px rgba(108, 132, 255, .48),
    0 0 22px rgba(146, 100, 255, .22);
}
.rps-control[data-fx-one="true"] .rps-thumb {
  width: 12px;
  height: 12px;
  border: 1px solid rgba(255, 255, 255, .92);
  background: radial-gradient(circle at 34% 28%, #fffdf8 0%, rgba(255, 236, 192, .98) 34%, rgba(255, 184, 76, .94) 68%, rgba(255, 246, 214, .2) 100%);
  box-shadow:
    0 0 calc(3px + var(--rps-strength) * 10px) rgba(255, 180, 66, .62),
    0 0 calc(1.5px + var(--rps-strength) * 4px) rgba(255, 249, 228, .74);
}
.rps-control[data-fx-one="true"] .rps-thumb::before {
  content: "";
  position: absolute;
  inset: -19px;
  z-index: -1;
  border-radius: 50%;
  pointer-events: none;
  background: radial-gradient(circle,
    rgba(255, 211, 138, .30) 0%,
    rgba(236, 158, 54, .18) 34%,
    rgba(208, 116, 24, .09) 58%,
    rgba(194, 100, 20, 0) 78%);
  filter: blur(1.2px);
  opacity: calc(.30 + var(--rps-strength) * .34);
}
.rps-fx-one-canvas {
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  z-index: 1;
  pointer-events: none;
}
.rps-fx-one-atom {
  position: absolute;
  left: calc(${THUMB_INSET}px + (100% - ${THUMB_INSET * 2}px) * var(--rps-progress));
  top: 50%;
  z-index: 4;
  width: 0;
  height: 0;
  pointer-events: none;
}
.rps-fx-one-orbit {
  position: absolute;
  left: 0;
  top: 0;
  border: 2px solid rgba(236, 166, 62, .98);
  border-radius: 50%;
  corner-shape: round;
  transform: translate(-50%, -50%) rotate(var(--rps-fx-angle, 0deg)) scaleY(var(--rps-fx-flatten, .32));
  opacity: calc(.62 + var(--rps-strength) * .38);
  filter:
    drop-shadow(0 0 calc(2px + var(--rps-strength) * 5px) rgba(230, 138, 30, .82))
    drop-shadow(0 0 calc(5px + var(--rps-strength) * 7px) rgba(255, 186, 70, .32));
}
.rps-fx-one-orbit--1 {
  width: 40px;
  height: 40px;
  --rps-fx-angle: 0deg;
  --rps-fx-flatten: .32;
  --rps-fx-base: 3s;
}
.rps-fx-one-orbit--2 {
  width: 52px;
  height: 52px;
  --rps-fx-angle: 64deg;
  --rps-fx-flatten: .27;
  --rps-fx-base: 4.1s;
}
.rps-fx-one-orbit--3 {
  width: 34px;
  height: 34px;
  --rps-fx-angle: -58deg;
  --rps-fx-flatten: .36;
  --rps-fx-base: 2.4s;
}
.rps-fx-one-rotor {
  position: absolute;
  inset: 0;
  animation: rps-fx-one-spin calc(var(--rps-fx-base) - var(--rps-strength) * 1.1s) linear infinite;
}
.rps-fx-one-orbit--2 .rps-fx-one-rotor { animation-direction: reverse; }
.rps-fx-one-rotor--alt { animation-delay: -1.3s; }
.rps-fx-one-rotor--alt2 { animation-delay: -2.1s; }
.rps-fx-one-electron {
  position: absolute;
  left: 50%;
  top: 0;
  width: 9px;
  height: 9px;
  margin: -4.5px 0 0 -4.5px;
  border-radius: 50%;
  corner-shape: round;
  background: radial-gradient(circle at 35% 30%, #fffef8 0%, #fff2cf 22%, #ffd37e 50%, #f0a13a 80%, rgba(240, 154, 50, 0) 100%);
  box-shadow:
    0 0 8px rgba(255, 250, 232, .99),
    0 0 18px rgba(255, 186, 74, .94),
    0 0 32px rgba(238, 128, 26, .48);
}
.rps-fx-one-electron--alt {
  width: 7px;
  height: 7px;
  margin: -3.5px 0 0 -3.5px;
  opacity: .88;
  box-shadow:
    0 0 6px rgba(255, 247, 223, .97),
    0 0 13px rgba(255, 180, 62, .82);
}
.rps-fx-one-electron--tiny {
  width: 5px;
  height: 5px;
  margin: -2.5px 0 0 -2.5px;
  opacity: .68;
  box-shadow:
    0 0 4px rgba(255, 246, 220, .95),
    0 0 9px rgba(255, 176, 54, .72);
}
@keyframes rps-fx-one-spin {
  to { transform: rotate(360deg); }
}
@media (prefers-reduced-motion: reduce) {
  .rps-fx-one-rotor { animation: none; }
}
`;

    function clamp(value, min, max) {
      return Math.min(max, Math.max(min, value));
    }

    function random(min, max) {
      return min + Math.random() * (max - min);
    }

    function buildAtom() {
      var atom = document.createElement("span");
      atom.className = "rps-fx-one-atom";
      atom.setAttribute("aria-hidden", "true");
      for (var orbitIndex = 1; orbitIndex <= 3; orbitIndex += 1) {
        var orbit = document.createElement("span");
        orbit.className = "rps-fx-one-orbit rps-fx-one-orbit--" + orbitIndex;
        orbit.append(buildRotor("rps-fx-one-electron"), buildRotor("rps-fx-one-electron rps-fx-one-electron--alt", "rps-fx-one-rotor--alt"), buildRotor("rps-fx-one-electron rps-fx-one-electron--tiny", "rps-fx-one-rotor--alt2"));
        atom.append(orbit);
      }
      return atom;
    }

    function buildRotor(electronClass, rotorClass) {
      var rotor = document.createElement("span");
      rotor.className = "rps-fx-one-rotor" + (rotorClass ? " " + rotorClass : "");
      var electron = document.createElement("span");
      electron.className = electronClass;
      rotor.append(electron);
      return rotor;
    }

    function createField(root, canvas) {
      var context = canvas.getContext("2d", { alpha: true });
      if (!context) return null;
      var width = 0;
      var height = 0;
      var dpr = 1;
      var particles = [];
      var raf = 0;
      var destroyed = false;
      var reducedMotion = false;
      try {
        reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      } catch {
        reducedMotion = false;
      }

      var intensity = 0;
      var lastProgress = 0;
      var flowDirection = -1;
      var spawnCursor = 0;
      var lastTime = 0;

      function progress() {
        var value = parseFloat(root.style.getPropertyValue("--rps-progress"));
        return clamp(Number.isFinite(value) ? value : 0, 0, 1);
      }

      function strength() {
        var value = parseFloat(root.style.getPropertyValue("--rps-strength"));
        return clamp(Number.isFinite(value) ? value : progress(), 0, 1);
      }

      function dragging() {
        return root.dataset.dragging === "true";
      }

      function thumbX(value) {
        return THUMB_INSET + clamp(value, 0, 1) * Math.max(0, width - THUMB_INSET * 2);
      }

      function particleCount(value) {
        return Math.round(7 + value * 56);
      }

      function particleHue(x) {
        var span = Math.max(1, width - THUMB_INSET * 2);
        var distance = clamp(Math.abs(x - thumbX(progress())) / span, 0, 1);
        return clamp(206 + (1 - distance) * 58 + intensity * 8 + random(-5, 5), 202, 280);
      }

      function distributedX() {
        var thumb = thumbX(progress());
        var left = THUMB_INSET;
        var right = Math.max(left + 1, width - THUMB_INSET);
        var start;
        var end;
        if (flowDirection < 0) {
          start = left;
          end = Math.max(left + 1, thumb);
        } else {
          start = Math.min(right - 1, thumb);
          end = right;
        }
        spawnCursor = (spawnCursor + 1) % 104729;
        var fraction = (spawnCursor * GOLDEN_RATIO) % 1;
        return start + fraction * (end - start) + random(-0.8, 0.8);
      }

      function spawn(kind) {
        var isSpark = kind === "spark";
        var x = distributedX();
        var y = height / 2 + random(-1, 1) * (0.4 + intensity * (isSpark ? 1.8 : 2.2));
        var vx;
        var life;
        var size;
        if (isSpark) {
          vx = flowDirection * (random(28, 62) + intensity * 150);
          life = random(0.22, 0.58);
          size = random(0.65, 1.55);
        } else {
          vx = flowDirection * (18 + intensity * 58) * random(0.88, 1.12);
          life = random(0.65, 1.35) * (1 - intensity * 0.1);
          size = random(0.7, 1.35);
        }
        return {
          x: x,
          y: y,
          vx: vx,
          life: 0,
          maxLife: life,
          size: size,
          hue: particleHue(x),
          light: 64 + intensity * 14 + random(-4, 7),
          alpha: random(0.82, 1),
        };
      }

      function ensureParticles(exact) {
        var target = particleCount(intensity);
        if (exact && particles.length > target) particles.length = target;
        if (!exact && particles.length > target + 20) particles.length = target + 20;
        while (particles.length < target && particles.length < MAX_PARTICLES) {
          var particle = spawn(Math.random() < intensity * 0.24 ? "spark" : "ambient");
          particle.life = Math.random() * particle.maxLife * 0.62;
          particles.push(particle);
        }
      }

      function resize() {
        if (destroyed) return;
        var rect = canvas.getBoundingClientRect();
        width = Math.max(0, rect.width);
        height = Math.max(0, rect.height);
        dpr = Math.min(2, window.devicePixelRatio || 1);
        canvas.width = Math.max(1, Math.round(width * dpr));
        canvas.height = Math.max(1, Math.round(height * dpr));
        context.setTransform(dpr, 0, 0, dpr, 0, 0);
        if (!raf) draw(performance.now());
      }

      function update(dt) {
        var current = progress();
        var delta = current - lastProgress;
        if (dragging() && Math.abs(delta) > 0.0004) {
          flowDirection = delta > 0 ? -1 : 1;
        } else if (!dragging()) {
          flowDirection = -1;
        }
        lastProgress = current;
        intensity += (strength() - intensity) * Math.min(1, dt * 7);
        ensureParticles(false);
        for (var index = particles.length - 1; index >= 0; index -= 1) {
          var particle = particles[index];
          particle.life += dt;
          if (particle.life >= particle.maxLife) {
            particles.splice(index, 1);
            continue;
          }
          particle.vx *= 1 - dt * 0.12;
          particle.x += particle.vx * dt;
          if (particle.x < -24 || particle.x > width + 24 || particle.y < -24 || particle.y > height + 24) {
            particles.splice(index, 1);
          }
        }
      }

      function draw(now) {
        if (!context || width <= 0 || height <= 0) return;
        context.clearRect(0, 0, width, height);
        context.save();
        context.globalCompositeOperation = "lighter";
        for (var index = 0; index < particles.length; index += 1) {
          var particle = particles[index];
          var age = clamp(particle.life / particle.maxLife, 0, 1);
          var fade = Math.sin(Math.PI * age);
          var alpha = fade * particle.alpha * (0.18 + intensity * 0.82);
          if (alpha <= 0.008) continue;
          var light = particle.light + Math.sin(now * 0.002 + particle.hue) * 6;
          if (intensity > 0.3) {
            context.strokeStyle = "hsla(" + particle.hue + ", 100%, " + light + "%, " + alpha + ")";
            context.lineWidth = Math.max(0.45, particle.size * 0.7);
            context.beginPath();
            context.moveTo(particle.x - particle.vx * 0.03, particle.y);
            context.lineTo(particle.x, particle.y);
            context.stroke();
          }
          context.fillStyle = "hsla(" + particle.hue + ", 100%, " + light + "%, " + alpha + ")";
          context.beginPath();
          context.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
          context.fill();
        }
        context.restore();
      }

      function loop(now) {
        if (destroyed) return;
        var dt = Math.min(0.048, Math.max(0, (now - lastTime) / 1000 || 0));
        lastTime = now;
        update(dt);
        draw(now);
        raf = window.requestAnimationFrame(loop);
      }

      function start() {
        if (destroyed || reducedMotion || raf) return;
        lastTime = performance.now();
        raf = window.requestAnimationFrame(loop);
      }

      function stop() {
        if (raf) {
          window.cancelAnimationFrame(raf);
          raf = 0;
        }
      }

      function sync() {
        intensity = strength();
        ensureParticles(true);
        draw(performance.now());
      }

      function handleVisibility() {
        if (document.hidden) stop();
        else start();
      }

      var resizeObserver = null;
      if (typeof ResizeObserver === "function") {
        resizeObserver = new ResizeObserver(resize);
        resizeObserver.observe(canvas);
      } else {
        window.addEventListener("resize", resize);
      }
      document.addEventListener("visibilitychange", handleVisibility);
      resize();
      sync();
      start();

      return {
        sync: sync,
        destroy: function () {
          if (destroyed) return;
          destroyed = true;
          stop();
          document.removeEventListener("visibilitychange", handleVisibility);
          if (resizeObserver) resizeObserver.disconnect();
          else window.removeEventListener("resize", resize);
          particles = [];
          context.clearRect(0, 0, canvas.width, canvas.height);
        },
      };
    }

    function attach(root) {
      var layer = root.querySelector(".rps-fx-layer");
      if (!layer) return null;
      root.dataset.fxOne = "true";
      var canvas = document.createElement("canvas");
      canvas.className = "rps-fx-one-canvas";
      canvas.setAttribute("aria-hidden", "true");
      var atom = buildAtom();
      layer.append(canvas, atom);
      var field = createField(root, canvas);
      return {
        root: root,
        canvas: canvas,
        atom: atom,
        field: field,
        destroy: function () {
          if (field) field.destroy();
          canvas.remove();
          atom.remove();
          delete root.dataset.fxOne;
        },
      };
    }

    function apply(ctx) {
      var style = document.createElement("style");
      style.dataset.plugin = PACKAGE_ID;
      style.textContent = CSS;
      document.head.appendChild(style);

      var attached = new Map();
      var scanScheduled = false;
      var observer = null;
      var active = false;

      function scan() {
        var roots = document.querySelectorAll('.rps-control[data-plugin="dsh-reasoning-module"]');
        for (var index = 0; index < roots.length; index += 1) {
          var root = roots[index];
          if (!attached.has(root)) {
            var controller = attach(root);
            if (controller) attached.set(root, controller);
          }
        }
        attached.forEach(function (controller, root) {
          if (!root.isConnected) {
            controller.destroy();
            attached.delete(root);
          }
        });
      }

      function start() {
        if (active) return;
        active = true;
        observer = new MutationObserver(function () {
          if (scanScheduled) return;
          scanScheduled = true;
          queueMicrotask(function () {
            scanScheduled = false;
            if (active) scan();
          });
        });
        observer.observe(document.body, { childList: true, subtree: true });
        scan();
      }

      function stop() {
        if (!active) return;
        active = false;
        if (observer) {
          observer.disconnect();
          observer = null;
        }
        attached.forEach(function (controller) {
          controller.destroy();
        });
        attached.clear();
      }

      var dispose = null;
      try {
        dispose = ctx.reasoningModule.register({
          id: "reasoning-fx-one",
          order: 10,
          applyActive: function (enabled) {
            if (enabled) start();
            else stop();
          },
          isActive: function () {
            return active;
          },
          isEnabled: function () {
            return true;
          },
        });
      } catch {
        // A duplicate registration leaves the manager's first effect in place.
      }

      if (ctx && typeof ctx.effect === "function") {
        ctx.effect(function () {
          return function () {
            if (dispose) dispose();
            stop();
            style.remove();
          };
        }, "reasoning-fx-one: dom effect");
      }
    }

    exports.inject = ["reasoningModule"];
    exports.apply = apply;
    return module.exports;
  },
});
