window.__ModuleLoader__.load({
  id: "dsh-reasoning-fx-two",
  factory: function () {
    var module = { exports: {} };
    var exports = module.exports;
    Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });

    var PACKAGE_ID = "dsh-reasoning-fx-two";
    var THUMB_INSET = 6;
    var CANVAS_PAD = 54;
    var MAX_PARTICLES = 170;
    var IDLE_RATE = 50;
    var HOVER_RATE = 72;
    var DRAG_RATE = 300;

    var CSS = `
.rps-control[data-fx-two="true"] .rps-glyph {
  color: #ffa8bf;
  text-shadow: 0 0 8px rgba(255, 60, 120, .8);
}
.rps-control[data-fx-two="true"] .rps-fill {
  background: linear-gradient(90deg, #c2185b 0%, #ef2d67 52%, #ff7aa8 100%);
  box-shadow:
    0 0 9px rgba(240, 60, 120, .5),
    0 0 22px rgba(255, 120, 170, .22);
}
.rps-control[data-fx-two="true"] .rps-thumb {
  background: radial-gradient(circle at 34% 28%, #ffffff 0%, #ffe6ef 42%, #ffa9c2 78%, #e86f96 100%);
  box-shadow: none;
}
.rps-fx-two-canvas {
  position: absolute;
  left: -${CANVAS_PAD}px;
  top: 0;
  width: calc(100% + ${CANVAS_PAD * 2}px);
  height: 100%;
  z-index: 1;
  pointer-events: none;
}
.rps-fx-two-sats {
  position: absolute;
  left: calc(${THUMB_INSET}px + (100% - ${THUMB_INSET * 2}px) * var(--rps-progress));
  top: 50%;
  width: 0;
  height: 0;
  z-index: 4;
  pointer-events: none;
}
.rps-fx-two-ring {
  position: absolute;
  left: 0;
  top: 0;
  width: 32px;
  height: 32px;
  margin: -16px 0 0 -16px;
  border: 1px solid rgba(255, 255, 255, .26);
  border-radius: 50%;
  corner-shape: round;
  pointer-events: none;
}
.rps-fx-two-rotor {
  position: absolute;
  left: 0;
  top: 0;
  width: 32px;
  height: 32px;
  margin: -16px 0 0 -16px;
  animation: rps-fx-two-spin calc(3.2s - var(--rps-strength) * 0.8s) linear infinite;
}
.rps-fx-two-sat {
  position: absolute;
  left: 50%;
  width: 5px;
  height: 5px;
  margin-left: -2.5px;
  border-radius: 50%;
  corner-shape: round;
  background: #ffffff;
  pointer-events: none;
}
.rps-fx-two-sat--a {
  top: -2.5px;
}
.rps-fx-two-sat--b {
  top: calc(100% - 2.5px);
}
@keyframes rps-fx-two-spin {
  to { transform: rotate(360deg); }
}
@media (prefers-reduced-motion: reduce) {
  .rps-fx-two-rotor { animation: none; }
}
`;

    function clamp(value, min, max) {
      return Math.min(max, Math.max(min, value));
    }

    function random(min, max) {
      return min + Math.random() * (max - min);
    }

    function buildSprite(stops, size) {
      var canvas = document.createElement("canvas");
      canvas.width = size;
      canvas.height = size;
      var context = canvas.getContext("2d");
      if (!context) return canvas;
      var radius = size / 2;
      var gradient = context.createRadialGradient(radius, radius, 0, radius, radius, radius);
      for (var index = 0; index < stops.length; index += 1) {
        gradient.addColorStop(stops[index][0], stops[index][1]);
      }
      context.fillStyle = gradient;
      context.fillRect(0, 0, size, size);
      return canvas;
    }

    function buildStreak(stops, width, height) {
      var canvas = document.createElement("canvas");
      canvas.width = width;
      canvas.height = height;
      var context = canvas.getContext("2d");
      if (!context) return canvas;
      var gradient = context.createLinearGradient(0, 0, width, 0);
      for (var index = 0; index < stops.length; index += 1) {
        gradient.addColorStop(stops[index][0], stops[index][1]);
      }
      context.fillStyle = gradient;
      context.fillRect(0, 0, width, height);
      var mask = context.createLinearGradient(0, 0, 0, height);
      mask.addColorStop(0, "rgba(0, 0, 0, 0)");
      mask.addColorStop(0.32, "rgba(0, 0, 0, 1)");
      mask.addColorStop(0.68, "rgba(0, 0, 0, 1)");
      mask.addColorStop(1, "rgba(0, 0, 0, 0)");
      context.globalCompositeOperation = "destination-in";
      context.fillStyle = mask;
      context.fillRect(0, 0, width, height);
      context.globalCompositeOperation = "source-over";
      return canvas;
    }

    function buildSatellites() {
      // 同一平面内的正圆轨道：一个白色轨道环 + 两枚 180° 对置的白色光点。
      // 两点始终关于滑块中心中心对称，大小一致，无光晕、无 3D 压扁。
      var wrap = document.createElement("span");
      wrap.className = "rps-fx-two-sats";
      wrap.setAttribute("aria-hidden", "true");
      var ring = document.createElement("span");
      ring.className = "rps-fx-two-ring";
      var rotor = document.createElement("span");
      rotor.className = "rps-fx-two-rotor";
      var satelliteA = document.createElement("span");
      satelliteA.className = "rps-fx-two-sat rps-fx-two-sat--a";
      var satelliteB = document.createElement("span");
      satelliteB.className = "rps-fx-two-sat rps-fx-two-sat--b";
      rotor.append(satelliteA, satelliteB);
      wrap.append(ring, rotor);
      return wrap;
    }

    function createWake(root, canvas) {
      var context = canvas.getContext("2d", { alpha: true });
      if (!context) return null;

      var sprites = [
        buildSprite(
          [
            [0, "rgba(255, 255, 255, 1)"],
            [0.16, "rgba(255, 242, 247, .98)"],
            [0.34, "rgba(255, 150, 180, .9)"],
            [0.6, "rgba(238, 70, 130, .45)"],
            [1, "rgba(190, 30, 90, 0)"],
          ],
          32,
        ),
        buildSprite(
          [
            [0, "rgba(255, 238, 244, .95)"],
            [0.24, "rgba(255, 150, 185, .72)"],
            [0.55, "rgba(225, 60, 120, .28)"],
            [1, "rgba(185, 30, 85, 0)"],
          ],
          32,
        ),
        buildSprite(
          [
            [0, "rgba(255, 255, 255, .95)"],
            [0.22, "rgba(255, 215, 228, .55)"],
            [0.5, "rgba(245, 110, 150, .16)"],
            [1, "rgba(200, 50, 100, 0)"],
          ],
          48,
        ),
        buildSprite(
          [
            [0, "rgba(255, 250, 252, .95)"],
            [0.24, "rgba(255, 190, 205, .7)"],
            [1, "rgba(220, 70, 120, 0)"],
          ],
          32,
        ),
        buildStreak(
          [
            [0, "rgba(255, 215, 228, .92)"],
            [0.24, "rgba(255, 150, 180, .58)"],
            [0.62, "rgba(235, 70, 125, .2)"],
            [0.9, "rgba(205, 50, 105, .05)"],
            [1, "rgba(190, 30, 90, 0)"],
          ],
          160,
          32,
        ),
        buildStreak(
          [
            [0, "rgba(255, 255, 255, 1)"],
            [0.34, "rgba(255, 232, 240, .85)"],
            [0.72, "rgba(255, 120, 155, .3)"],
            [0.92, "rgba(225, 70, 120, .08)"],
            [1, "rgba(200, 40, 95, 0)"],
          ],
          160,
          32,
        ),
      ];
      var S_HOT = 0;
      var S_COOL = 1;
      var S_CORE = 2;
      var S_VIOLET = 3;
      var S_STREAK = 4;
      var S_STREAK_HOT = 5;

      var width = 0;
      var height = 0;
      var dpr = 1;
      var trackWidth = 0;
      var pool = new Array(MAX_PARTICLES);
      for (var slot = 0; slot < MAX_PARTICLES; slot += 1) {
        pool[slot] = {
          life: -1,
          maxLife: 1,
          x: 0,
          y: 0,
          vx: 0,
          vy: 0,
          size: 1,
          alpha: 0,
          stretch: 1,
          sprite: S_COOL,
          drag: 1,
        };
      }
      var cursor = 0;
      var raf = 0;
      var destroyed = false;
      var lastTime = 0;
      var emitAcc = 0;
      var prevProgress = readProgress();
      var direction = prevProgress > 0.5 ? 1 : -1;
      var lastMotionAt = 0;
      var flamePower = 0;
      var reducedMotion = false;
      try {
        reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      } catch (error) {
        reducedMotion = false;
      }

      function readProgress() {
        var value = parseFloat(root.style.getPropertyValue("--rps-progress"));
        return clamp(Number.isFinite(value) ? value : 0, 0, 1);
      }

      function readStrength() {
        var value = parseFloat(root.style.getPropertyValue("--rps-strength"));
        return clamp(Number.isFinite(value) ? value : 0, 0, 1);
      }

      function usableWidth() {
        return Math.max(1, trackWidth - THUMB_INSET * 2);
      }

      function thumbX(progress) {
        return CANVAS_PAD + THUMB_INSET + clamp(progress, 0, 1) * usableWidth();
      }

      function emitParticle(sprite, x, y, vx, vy, size, life, alpha, stretch, drag) {
        var particle = pool[cursor];
        cursor = (cursor + 1) % MAX_PARTICLES;
        particle.life = 0;
        particle.maxLife = life;
        particle.x = x;
        particle.y = y;
        particle.vx = vx;
        particle.vy = vy;
        particle.size = size;
        particle.alpha = alpha;
        particle.stretch = stretch;
        particle.sprite = sprite;
        particle.drag = drag;
      }

      function spawnWake(progress, speed, strength, moving) {
        var nozzleX = thumbX(progress) - direction * 3;
        var centerY = height / 2;
        var power = 0.7 + strength * 0.55;
        if (moving) {
          emitParticle(
            S_CORE,
            nozzleX - direction * 2,
            centerY,
            -direction * (22 + speed * 0.2),
            random(-5, 5),
            14 + strength * 10,
            random(0.1, 0.17),
            0.55 + strength * 0.3,
            1.2,
            4,
          );
        }
        var fast = (150 + Math.min(420, speed * 0.55)) * power;
        var vx = -direction * fast * random(0.6, 1.25);
        var vy = random(-1, 1) * (6 + Math.min(20, speed * 0.025)) * random(0.65, 1.3);
        var life = random(0.42, 0.9);
        var size = 1.1 + Math.random() * 1.9 + strength * 0.4;
        var sprite = Math.random() < 0.13 ? S_VIOLET : Math.random() < 0.6 ? S_HOT : S_COOL;
        emitParticle(
          sprite,
          nozzleX + random(-1.2, 1.2),
          centerY + random(-1.6, 1.6),
          vx,
          vy,
          size,
          life,
          random(0.4, 0.75),
          2.4 + Math.abs(vx) / 90,
          0.55,
        );
        if (Math.random() < 0.06) {
          emitParticle(
            S_HOT,
            nozzleX,
            centerY + random(-1.6, 1.6),
            -direction * fast * random(1.4, 2),
            random(-12, 12),
            random(0.9, 1.9),
            random(0.18, 0.42),
            0.9,
            5.2,
            0.4,
          );
        }
        if (Math.random() < 0.1) {
          emitParticle(
            S_COOL,
            nozzleX,
            centerY + random(-1, 1),
            -direction * fast * random(0.7, 0.95),
            random(-4, 4),
            4.2 + strength * 3,
            random(0.55, 0.95),
            0.32,
            4.6,
            0.5,
          );
        }
      }

      function burst(progress) {
        var strength = readStrength();
        for (var index = 0; index < 12; index += 1) {
          spawnWake(progress, 280, strength, true);
        }
        startLoop();
      }

      function update(dt, now) {
        var progress = readProgress();
        var strength = readStrength();
        var delta = progress - prevProgress;
        var speed = (Math.abs(delta) / Math.max(0.001, dt)) * usableWidth();
        if (Math.abs(delta) > 0.00005) {
          direction = delta > 0 ? 1 : -1;
          lastMotionAt = now;
        } else {
          speed = 0;
          if (now - lastMotionAt > 650) {
            // 怠速时让喷口朝向轨道上更空的一侧，喷流始终有可见空间。
            direction = progress > 0.5 ? 1 : -1;
          }
        }
        prevProgress = progress;

        var dragging = root.getAttribute("data-dragging") === "true";
        var hover = root.getAttribute("data-hover") === "true";
        var moving = speed > 12;
        // 尾流常驻：即使静止不悬停也持续喷出一束怠速喷流。
        var rate;
        if (dragging) {
          rate = moving ? Math.min(DRAG_RATE, 120 + speed * 1.4) : 90;
        } else if (hover) {
          rate = HOVER_RATE * (0.7 + strength * 0.6);
        } else {
          rate = IDLE_RATE * (0.7 + strength * 0.6);
        }
        if (moving && !dragging) {
          rate = Math.max(rate, 150);
        }
        emitAcc += rate * dt;
        if (emitAcc > 10) emitAcc = 10;
        var budget = 18;
        var scaledSpeed = Math.min(speed, 900);
        while (emitAcc >= 1 && budget > 0) {
          emitAcc -= 1;
          budget -= 1;
          spawnWake(progress, scaledSpeed, strength, moving);
        }
        var flameTarget = dragging ? (moving ? 1 : 0.9) : hover ? 0.85 : 0.8;
        flamePower += (flameTarget - flamePower) * Math.min(1, dt * 9);

        var alive = 0;
        for (var index = 0; index < MAX_PARTICLES; index += 1) {
          var particle = pool[index];
          if (particle.life < 0) continue;
          particle.life += dt;
          if (particle.life >= particle.maxLife) {
            particle.life = -1;
            continue;
          }
          var damping = 1 - Math.min(0.6, particle.drag * dt);
          particle.vx *= damping;
          particle.vy *= damping;
          particle.x += particle.vx * dt;
          particle.y += particle.vy * dt;
          alive += 1;
        }
        return { dragging: dragging, hover: hover, alive: alive };
      }

      function drawStreak(sprite, nozzle, centerY, length, thickness, alpha) {
        if (length <= 1 || alpha <= 0.004) return;
        context.save();
        context.globalAlpha = alpha;
        context.translate(nozzle, centerY);
        if (direction > 0) context.scale(-1, 1);
        context.drawImage(sprite, 0, -thickness * 0.5, length, thickness);
        context.restore();
      }

      function draw() {
        context.clearRect(0, 0, width, height);
        if (width <= 0 || height <= 0) return;
        context.save();
        context.globalCompositeOperation = "lighter";
        var strength = readStrength();
        var nozzle = thumbX(prevProgress) - direction * 2;
        var centerY = height / 2;
        var available = direction > 0 ? nozzle - 3 : width - nozzle - 3;
        var tailLength = Math.max(0, available);
        if (flamePower > 0.03) {
          // 长尾流：从喷口一直贯穿到模块一侧尽头，随强度升高更亮更厚。
          drawStreak(sprites[S_STREAK], nozzle, centerY, tailLength, 34 + strength * 10, 0.1 * flamePower);
          drawStreak(sprites[S_STREAK], nozzle, centerY, tailLength, 22 + strength * 6, 0.07 * flamePower);
          drawStreak(sprites[S_STREAK_HOT], nozzle, centerY, tailLength * 0.4, 8 + strength * 3, 0.16 * flamePower);
          context.globalAlpha = (0.34 + strength * 0.12) * flamePower;
          context.drawImage(sprites[S_CORE], nozzle - 16, centerY - 9, 36, 18);
        }
        var tailForFade = Math.max(1, tailLength);
        for (var index = 0; index < MAX_PARTICLES; index += 1) {
          var particle = pool[index];
          if (particle.life < 0) continue;
          var age = clamp(particle.life / particle.maxLife, 0, 1);
          var fade = age < 0.18 ? age / 0.18 : Math.pow(1 - (age - 0.18) / 0.82, 1.25);
          // 越靠近尾端越淡越细，形成从喷口向远端收束的喷流。
          var distRatio = clamp(Math.abs(particle.x - nozzle) / tailForFade, 0, 1);
          var alpha = fade * particle.alpha * (1 - distRatio * 0.6);
          if (alpha <= 0.012) continue;
          var shrink = (0.45 + (1 - age) * 0.55) * (1 - distRatio * 0.35);
          var drawWidth = particle.size * particle.stretch * shrink;
          var drawHeight = particle.size * shrink;
          context.globalAlpha = alpha;
          context.drawImage(
            sprites[particle.sprite],
            particle.x - drawWidth * 0.5,
            particle.y - drawHeight * 0.5,
            drawWidth,
            drawHeight,
          );
        }
        context.restore();
        context.globalAlpha = 1;
      }

      function startLoop() {
        if (destroyed || reducedMotion || raf) return;
        lastTime = performance.now();
        raf = window.requestAnimationFrame(loop);
      }

      function loop(now) {
        raf = 0;
        if (destroyed) return;
        var dt = Math.min(0.05, Math.max(0.001, (now - lastTime) / 1000));
        lastTime = now;
        update(dt, now);
        draw();
        // 尾流常驻：只要特效处于激活状态且页面可见，就持续渲染怠速喷流。
        if (!destroyed && !document.hidden && !reducedMotion) {
          raf = window.requestAnimationFrame(loop);
        }
      }

      function resize() {
        if (destroyed) return;
        var rect = canvas.getBoundingClientRect();
        width = Math.max(0, rect.width);
        height = Math.max(0, rect.height);
        trackWidth = Math.max(0, width - CANVAS_PAD * 2);
        dpr = Math.min(2, window.devicePixelRatio || 1);
        canvas.width = Math.max(1, Math.round(width * dpr));
        canvas.height = Math.max(1, Math.round(height * dpr));
        context.setTransform(dpr, 0, 0, dpr, 0, 0);
        if (!raf) draw();
      }

      function handleVisibility() {
        if (document.hidden) {
          if (raf) {
            window.cancelAnimationFrame(raf);
            raf = 0;
          }
          return;
        }
        startLoop();
      }

      var attributeObserver = new MutationObserver(function () {
        var progress = readProgress();
        var delta = progress - prevProgress;
        var dragging = root.getAttribute("data-dragging") === "true";
        if (!dragging && Math.abs(delta) > 0.0008) {
          direction = delta > 0 ? 1 : -1;
          prevProgress = progress;
          burst(progress);
        }
        startLoop();
      });
      attributeObserver.observe(root, {
        attributes: true,
        attributeFilter: ["style", "data-hover", "data-dragging"],
      });

      var resizeObserver = null;
      if (typeof ResizeObserver === "function") {
        resizeObserver = new ResizeObserver(resize);
        resizeObserver.observe(canvas);
      } else {
        window.addEventListener("resize", resize);
      }
      document.addEventListener("visibilitychange", handleVisibility);
      resize();
      startLoop();

      return {
        start: startLoop,
        destroy: function () {
          if (destroyed) return;
          destroyed = true;
          if (raf) {
            window.cancelAnimationFrame(raf);
            raf = 0;
          }
          attributeObserver.disconnect();
          document.removeEventListener("visibilitychange", handleVisibility);
          if (resizeObserver) resizeObserver.disconnect();
          else window.removeEventListener("resize", resize);
          for (var index = 0; index < MAX_PARTICLES; index += 1) pool[index].life = -1;
          context.clearRect(0, 0, canvas.width, canvas.height);
        },
      };
    }

    function attach(root) {
      var layer = root.querySelector(".rps-fx-layer");
      if (!layer) return null;
      root.setAttribute("data-fx-two", "true");
      var canvas = document.createElement("canvas");
      canvas.className = "rps-fx-two-canvas";
      canvas.setAttribute("aria-hidden", "true");
      var satellites = buildSatellites();
      layer.append(canvas, satellites);
      var wake = createWake(root, canvas);
      return {
        destroy: function () {
          if (wake) wake.destroy();
          canvas.remove();
          satellites.remove();
          root.removeAttribute("data-fx-two");
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
        attached.forEach(function (controller, element) {
          if (!element.isConnected) {
            controller.destroy();
            attached.delete(element);
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
          id: "reasoning-fx-two",
          order: 20,
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
      } catch (error) {
        // A duplicate registration leaves the manager's first effect in place.
      }

      if (ctx && typeof ctx.effect === "function") {
        ctx.effect(function () {
          return function () {
            if (dispose) dispose();
            stop();
            style.remove();
          };
        }, "reasoning-fx-two: dom effect");
      }
    }

    exports.inject = ["reasoningModule"];
    exports.apply = apply;
    return module.exports;
  },
});
