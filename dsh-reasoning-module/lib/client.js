window.__ModuleLoader__.load({
  id: "dsh-reasoning-module",
  factory: function (require) {
    var module = { exports: {} };
    var exports = module.exports;
    Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });

    var React = require("react");
    var h = React.createElement;

    var PACKAGE_ID = "dsh-reasoning-module";
    var LOCALE_NS = "reasoning-module";
    var FRAME_MAX = 1000;
    var THUMB_INSET = 6;
    var EMPTY_EFFORTS = [];

    var CSS = `
.rps-control {
  --rps-progress: 0;
  --rps-strength: 0;
  position: relative;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  height: 28px;
  min-width: 0;
  max-width: min(230px, 35vw);
  padding: 0 8px 0 7px;
  box-sizing: border-box;
  overflow: visible;
  border: 1px solid transparent;
  border-radius: 999px;
  background: transparent;
  color: var(--dsw-alias-label-secondary, #a0a0aa);
  font: inherit;
  font-size: 12px;
  line-height: 1;
  user-select: none;
  -webkit-user-select: none;
  transition: background-color .16s ease, border-color .16s ease;
}
.rps-control:hover,
.rps-control[data-hover="true"] {
  background: color-mix(in oklab, var(--dsw-alias-label-primary, #f4f4f6) 6%, transparent);
}
.rps-control[data-focused="true"],
.rps-control[data-dragging="true"] {
  border-color: transparent;
  background: transparent;
  box-shadow: none;
}
.rps-control[data-state="pending"] { cursor: progress; }
.rps-control[data-state="error"] {
  background: color-mix(in oklab, var(--dsw-alias-state-error-primary, #e5484d) 7%, transparent);
}
.rps-control[data-disabled="true"] { opacity: .72; pointer-events: none; }
.rps-glyph {
  flex: none;
  width: 12px;
  text-align: center;
  color: color-mix(in oklab, var(--dsw-alias-brand-primary, #4d6bfe) 70%, #fff);
  font-size: 11px;
  text-shadow: 0 0 7px color-mix(in oklab, var(--dsw-alias-brand-primary, #4d6bfe) 45%, transparent);
}
.rps-caption {
  position: relative;
  z-index: 7;
  flex: none;
  color: var(--dsw-alias-label-primary, #f4f4f6);
  white-space: nowrap;
}
.rps-track {
  position: relative;
  flex: none;
  width: 106px;
  height: 24px;
  outline: none;
  cursor: pointer;
  touch-action: none;
}
.rps-track:focus-visible { outline: none; }
.rps-rail,
.rps-fill {
  position: absolute;
  left: 0;
  top: 50%;
  height: 7px;
  border-radius: 999px;
  transform: translateY(-50%);
  pointer-events: none;
}
.rps-rail {
  width: 100%;
  background: color-mix(in oklab, var(--dsw-alias-label-primary, #f4f4f6) 13%, transparent);
  box-shadow: inset 0 0 0 1px color-mix(in oklab, var(--dsw-alias-label-primary, #f4f4f6) 7%, transparent);
}
.rps-fill {
  min-width: 7px;
  background: linear-gradient(90deg, #5c7cff 0%, #9b6bff 100%);
  box-shadow: 0 0 8px rgba(126, 110, 255, .32);
}
.rps-ticks {
  position: absolute;
  inset: 0;
  pointer-events: none;
}
.rps-tick {
  position: absolute;
  top: 50%;
  width: 2px;
  height: 2px;
  margin: -1px 0 0 -1px;
  border-radius: 50%;
  background: color-mix(in oklab, var(--dsw-alias-label-primary, #f4f4f6) 35%, transparent);
}
.rps-tick[data-reached="true"] { background: rgba(255, 255, 255, .78); }
.rps-fx-layer {
  position: absolute;
  left: 0;
  right: 0;
  top: -7px;
  height: 38px;
  z-index: 2;
  pointer-events: none;
  overflow: visible;
}
.rps-thumb {
  position: absolute;
  top: 50%;
  left: calc(${THUMB_INSET}px + (100% - ${THUMB_INSET * 2}px) * var(--rps-progress));
  z-index: 5;
  width: 12px;
  height: 12px;
  box-sizing: border-box;
  border: 1px solid rgba(255, 255, 255, .9);
  border-radius: 50%;
  corner-shape: round;
  background: radial-gradient(circle at 35% 30%, #ffffff 0%, #e7eeff 35%, #8fa8ff 72%, rgba(120, 150, 255, .2) 100%);
  box-shadow: 0 0 0 1px rgba(10, 12, 24, .42), 0 0 9px rgba(220, 232, 255, .72);
  pointer-events: none;
  transform: translate(-50%, -50%);
  transition: transform .12s ease, box-shadow .18s ease;
}
.rps-track[data-dragging="true"] .rps-thumb,
.rps-control:active .rps-thumb { transform: translate(-50%, -50%) scale(1.18); }
.rps-readout {
  position: relative;
  z-index: 7;
  flex: 0 0 36px;
  width: 36px;
  overflow: hidden;
  color: var(--dsw-alias-label-secondary, #a0a0aa);
  text-align: left;
  white-space: nowrap;
}
.rps-control[data-state="error"] .rps-readout {
  color: var(--dsw-alias-state-error-primary, #e5484d);
}
`;

    var DICTIONARIES = {
      en: {
        label: "Reasoning",
        aria: "Reasoning effort",
        title: "Reasoning effort",
        effortDefault: "Default",
        statusPending: "Switching",
        statusFailed: "Failed",
      },
      zh: {
        label: "推理",
        aria: "推理强度",
        title: "推理强度",
        effortDefault: "默认",
        statusPending: "切换中",
        statusFailed: "失败",
      },
    };

    function clamp(value, min, max) {
      return Math.min(max, Math.max(min, value));
    }

    function frameForIndex(index, count) {
      if (count <= 1) return 0;
      return Math.round((index / (count - 1)) * FRAME_MAX);
    }

    function nearestEffortIndex(frame, efforts) {
      if (!efforts.length) return -1;
      if (efforts.length === 1) return 0;
      return Math.round((clamp(frame, 0, FRAME_MAX) / FRAME_MAX) * (efforts.length - 1));
    }

    function committedEffortIndex(efforts, effortId) {
      for (var index = 0; index < efforts.length; index += 1) {
        if (efforts[index] && efforts[index].id === effortId) return index;
      }
      return -1;
    }

    function fallbackTranslate(key) {
      return key;
    }

    function modelReasoning(state) {
      if (!state || state.current === null || state.current === undefined) return null;
      var groups = Array.isArray(state.groups) ? state.groups : [];
      var selection = state.current;
      var model = null;
      for (var groupIndex = 0; groupIndex < groups.length; groupIndex += 1) {
        var group = groups[groupIndex];
        if (!group || group.id !== selection.provider) continue;
        var models = Array.isArray(group.models) ? group.models : [];
        for (var modelIndex = 0; modelIndex < models.length; modelIndex += 1) {
          if (models[modelIndex] && models[modelIndex].id === selection.model) {
            model = models[modelIndex];
            break;
          }
        }
        break;
      }
      if (!model || !model.reasoning) return null;
      var efforts = Array.isArray(model.reasoning.efforts) ? model.reasoning.efforts : EMPTY_EFFORTS;
      if (efforts.length === 0) return null;
      return {
        selection: selection,
        efforts: efforts,
        defaultEffort: model.reasoning.defaultEffort,
      };
    }

    function ReasoningModule(props) {
      var available = props.available !== false;
      var directory = props.directory;
      var load = props.load;
      var select = props.select;
      var translate = typeof props.t === "function" ? props.t : fallbackTranslate;

      var state = React.useSyncExternalStore(
        React.useCallback(function (listener) {
          return directory.subscribe(listener);
        }, [directory]),
        React.useCallback(function () {
          return directory.getSnapshot();
        }, [directory]),
      );

      var reasoning = React.useMemo(function () {
        return modelReasoning(state);
      }, [state]);

      var efforts = reasoning ? reasoning.efforts : EMPTY_EFFORTS;
      var count = efforts.length;
      var visible = available && reasoning !== null && count >= 2;
      var currentEffortId = reasoning
        ? reasoning.selection.reasoningEffort === undefined
          ? reasoning.defaultEffort
          : reasoning.selection.reasoningEffort
        : undefined;
      var committedIndex = committedEffortIndex(efforts, currentEffortId);
      if (committedIndex < 0 && visible) committedIndex = 0;
      var committedFrame = committedIndex < 0 ? 0 : frameForIndex(committedIndex, count);
      var storePending = state.status === "selecting" || (state.pending !== null && state.pending !== undefined);

      var frameState = React.useState(committedFrame);
      var frame = frameState[0];
      var setFrame = frameState[1];
      var draggingState = React.useState(false);
      var dragging = draggingState[0];
      var setDragging = draggingState[1];
      var focusedState = React.useState(false);
      var focused = focusedState[0];
      var setFocused = focusedState[1];
      var keyboardFocusState = React.useState(false);
      var keyboardFocus = keyboardFocusState[0];
      var setKeyboardFocus = keyboardFocusState[1];
      var hoveringState = React.useState(false);
      var hovering = hoveringState[0];
      var setHovering = hoveringState[1];
      var pendingState = React.useState(false);
      var pendingLocal = pendingState[0];
      var setPendingLocal = pendingState[1];
      var failedState = React.useState(false);
      var failed = failedState[0];
      var setFailed = failedState[1];

      var frameRef = React.useRef(committedFrame);
      var committedFrameRef = React.useRef(committedFrame);
      var draggingRef = React.useRef(false);
      var dragStartRef = React.useRef(committedFrame);
      var pointerFocusRef = React.useRef(false);
      var keyboardDirtyRef = React.useRef(false);
      var requestedLoadRef = React.useRef(false);
      var trackRef = React.useRef(null);
      var errorTimerRef = React.useRef(0);

      var disabled = !visible || storePending || pendingLocal;

      React.useEffect(function () {
        if (!available || requestedLoadRef.current) return;
        requestedLoadRef.current = true;
        try {
          load();
        } catch {
          // A directory failure leaves the control hidden without breaking the composer.
        }
      }, [available, load]);

      React.useEffect(function () {
        if (draggingRef.current || pendingLocal) return;
        committedFrameRef.current = committedFrame;
        frameRef.current = committedFrame;
        setFrame(committedFrame);
      }, [committedFrame, pendingLocal]);

      React.useEffect(function () {
        return function () {
          if (errorTimerRef.current !== 0) window.clearTimeout(errorTimerRef.current);
        };
      }, []);

      function markFrame(raw) {
        var next = clamp(Number(raw) || 0, 0, FRAME_MAX);
        frameRef.current = next;
        setFrame(next);
      }

      function markFailed() {
        setFailed(true);
        if (errorTimerRef.current !== 0) window.clearTimeout(errorTimerRef.current);
        errorTimerRef.current = window.setTimeout(function () {
          errorTimerRef.current = 0;
          setFailed(false);
        }, 1900);
      }

      function commitFrame(raw) {
        if (!visible || storePending || pendingLocal) return;
        var targetIndex = nearestEffortIndex(raw, efforts);
        var target = efforts[targetIndex];
        if (!target) return;
        keyboardDirtyRef.current = false;
        markFrame(frameForIndex(targetIndex, count));
        if (target.id === currentEffortId) return;
        setPendingLocal(true);
        setFailed(false);
        var selection = reasoning.selection;
        Promise.resolve(
          select({
            provider: selection.provider,
            model: selection.model,
            reasoningEffort: target.id,
          }),
        ).then(function (outcome) {
          var ok = outcome === undefined || outcome === true || (outcome && outcome.ok === true);
          if (!ok) throw new Error("reasoning effort selection was rejected");
        }).catch(function () {
          markFailed();
          markFrame(frameForIndex(committedIndex, count));
        }).finally(function () {
          setPendingLocal(false);
        });
      }

      function previewFromClientX(clientX) {
        var track = trackRef.current;
        if (!track) return;
        var rect = track.getBoundingClientRect();
        var usable = Math.max(1, rect.width - THUMB_INSET * 2);
        var ratio = (clientX - rect.left - THUMB_INSET) / usable;
        markFrame(ratio * FRAME_MAX);
      }

      function resetToCommitted() {
        keyboardDirtyRef.current = false;
        markFrame(frameForIndex(committedIndex, count));
      }

      function onPointerDown(event) {
        if (disabled) return;
        if (event.pointerType === "mouse" && event.button !== 0) return;
        event.preventDefault();
        pointerFocusRef.current = true;
        setKeyboardFocus(false);
        var track = event.currentTarget;
        if (typeof track.focus === "function") track.focus({ preventScroll: true });
        try {
          if (typeof track.setPointerCapture === "function") track.setPointerCapture(event.pointerId);
        } catch {
          // Pointer capture is an optimization; the handlers still work without it.
        }
        draggingRef.current = true;
        dragStartRef.current = frameRef.current;
        keyboardDirtyRef.current = false;
        setDragging(true);
        setFailed(false);
        previewFromClientX(event.clientX);
      }

      function onPointerMove(event) {
        if (!draggingRef.current) return;
        event.preventDefault();
        previewFromClientX(event.clientX);
      }

      function releasePointerCapture(track, pointerId) {
        try {
          if (typeof track.releasePointerCapture === "function") track.releasePointerCapture(pointerId);
        } catch {
          // Releasing an already-lost capture is harmless.
        }
      }

      function onPointerUp(event) {
        if (!draggingRef.current) return;
        draggingRef.current = false;
        setDragging(false);
        releasePointerCapture(event.currentTarget, event.pointerId);
        commitFrame(frameRef.current);
      }

      function onPointerCancel() {
        if (!draggingRef.current) return;
        draggingRef.current = false;
        setDragging(false);
        setFailed(false);
        resetToCommitted();
      }

      var commitKeys = {
        ArrowLeft: true,
        ArrowRight: true,
        ArrowUp: true,
        ArrowDown: true,
        Home: true,
        End: true,
        PageUp: true,
        PageDown: true,
      };

      function onKeyDown(event) {
        if (disabled) return;
        setKeyboardFocus(true);
        if (event.key === "Escape") {
          event.preventDefault();
          resetToCommitted();
          return;
        }
        if (!commitKeys[event.key]) return;
        var index = nearestEffortIndex(frameRef.current, efforts);
        var next = index;
        if (event.key === "ArrowRight" || event.key === "ArrowUp" || event.key === "PageUp") {
          next = Math.min(count - 1, index + 1);
        } else if (event.key === "ArrowLeft" || event.key === "ArrowDown" || event.key === "PageDown") {
          next = Math.max(0, index - 1);
        } else if (event.key === "Home") {
          next = 0;
        } else if (event.key === "End") {
          next = count - 1;
        }
        event.preventDefault();
        if (next === index && (event.key === "Home" || event.key === "End")) return;
        keyboardDirtyRef.current = true;
        markFrame(frameForIndex(next, count));
      }

      function onKeyUp(event) {
        if (disabled) return;
        if (!keyboardDirtyRef.current || !commitKeys[event.key]) return;
        keyboardDirtyRef.current = false;
        commitFrame(frameRef.current);
      }

      function onBlur() {
        setFocused(false);
        setKeyboardFocus(false);
        pointerFocusRef.current = false;
        if (draggingRef.current) {
          draggingRef.current = false;
          setDragging(false);
          resetToCommitted();
        }
        if (keyboardDirtyRef.current) {
          keyboardDirtyRef.current = false;
          commitFrame(frameRef.current);
        }
      }

      if (!visible) return null;

      var previewIndex = nearestEffortIndex(frame, efforts);
      if (previewIndex < 0) previewIndex = 0;
      var previewEffort = efforts[previewIndex];
      var progress = clamp(frame / FRAME_MAX, 0, 1);
      var strength = count > 1 ? previewIndex / (count - 1) : 0;
      var readout = failed
        ? translate("statusFailed")
        : pendingLocal || storePending
          ? translate("statusPending")
          : previewEffort && previewEffort.name
            ? previewEffort.name
            : translate("effortDefault");
      var title = translate("title") + " · " + (previewEffort && previewEffort.name ? previewEffort.name : translate("effortDefault"));

      return h("div", {
        className: "rps-control",
        "data-plugin": PACKAGE_ID,
        "data-state": failed ? "error" : pendingLocal || storePending ? "pending" : "ready",
        "data-dragging": dragging ? "true" : "false",
        "data-focused": focused ? "true" : "false",
        "data-keyboard-focus": keyboardFocus ? "true" : "false",
        "data-hover": hovering ? "true" : "false",
        "data-disabled": disabled ? "true" : "false",
        title: title,
        style: {
          "--rps-progress": String(progress),
          "--rps-strength": String(strength),
        },
        onMouseEnter: function () {
          setHovering(true);
        },
        onMouseLeave: function () {
          setHovering(false);
        },
      },
        h("span", { className: "rps-glyph", "aria-hidden": "true" }, "\u2726"),
        h("span", { className: "rps-caption" }, translate("label")),
        h("div", {
          ref: trackRef,
          className: "rps-track",
          role: "slider",
          tabIndex: disabled ? -1 : 0,
          "aria-label": translate("aria"),
          "aria-valuemin": 0,
          "aria-valuemax": Math.max(0, count - 1),
          "aria-valuenow": previewIndex,
          "aria-valuetext": previewEffort && previewEffort.name ? previewEffort.name : translate("effortDefault"),
          "aria-disabled": disabled ? "true" : undefined,
          "data-dragging": dragging ? "true" : "false",
          onPointerDown: onPointerDown,
          onPointerMove: onPointerMove,
          onPointerUp: onPointerUp,
          onPointerCancel: onPointerCancel,
          onKeyDown: onKeyDown,
          onKeyUp: onKeyUp,
          onFocus: function () {
            setFocused(true);
            setKeyboardFocus(pointerFocusRef.current ? false : true);
          },
          onBlur: onBlur,
        },
          h("span", { className: "rps-rail", "aria-hidden": "true" }),
          h("span", {
            className: "rps-fill",
            "aria-hidden": "true",
            style: { width: String(progress * 100) + "%" },
          }),
          h("span", { className: "rps-ticks", "aria-hidden": "true" },
            efforts.map(function (effort, index) {
              var ratio = count > 1 ? index / (count - 1) : 0;
              return h("i", {
                key: effort && effort.id ? effort.id : String(index),
                className: "rps-tick",
                "data-reached": index <= previewIndex ? "true" : "false",
                style: { left: String(ratio * 100) + "%" },
              });
            }),
          ),
          h("span", { className: "rps-fx-layer", "aria-hidden": "true" }),
          h("span", { className: "rps-thumb", "aria-hidden": "true" }),
        ),
        h("span", { className: "rps-readout" }, readout),
      );
    }

    var inject = ["slots", "sessions", "modelDirectories", "locale"];

    function createReasoningEffectsService() {
      var children = new Map();
      var listeners = new Set();
      var activeId = null;
      var switching = false;
      var snapshot = { activeId: null, children: [], switching: false };

      function publish() {
        var list = [];
        children.forEach(function (child) {
          list.push({ id: child.id, order: Number.isFinite(child.order) ? child.order : 0 });
        });
        list.sort(function (left, right) {
          return left.order - right.order;
        });
        snapshot = { activeId: activeId, children: list, switching: switching };
        listeners.forEach(function (listener) {
          try {
            listener();
          } catch {
            // A settings consumer must not break the slider.
          }
        });
      }

      async function activate(id) {
        var child = children.get(id);
        if (!child) return false;
        if (activeId === id) {
          if (typeof child.isActive === "function" && child.isActive() !== true) await child.applyActive(true);
          return true;
        }
        var previous = activeId !== null ? children.get(activeId) : null;
        switching = true;
        publish();
        try {
          if (previous && typeof previous.applyActive === "function") await previous.applyActive(false);
          activeId = id;
          publish();
          await child.applyActive(true);
          return true;
        } finally {
          switching = false;
          publish();
        }
      }

      async function deactivate(id) {
        if (activeId === null || (id !== undefined && activeId !== id)) return false;
        var previous = children.get(activeId);
        switching = true;
        publish();
        try {
          if (previous && typeof previous.applyActive === "function") await previous.applyActive(false);
          activeId = null;
          return false;
        } finally {
          switching = false;
          publish();
        }
      }

      function select(id) {
        if (id === null) return deactivate();
        return activate(id);
      }

      function register(child) {
        if (
          child === null ||
          typeof child !== "object" ||
          typeof child.id !== "string" ||
          child.id === "" ||
          typeof child.applyActive !== "function"
        ) {
          throw new Error("reasoning-module: invalid effect descriptor");
        }
        if (children.has(child.id)) throw new Error("reasoning-module: duplicate effect " + child.id);
        children.set(child.id, child);
        publish();
        if (activeId === null) {
          activate(child.id).catch(function () {});
        }
        return function () {
          if (!children.has(child.id)) return;
          children.delete(child.id);
          if (activeId === child.id) {
            activeId = null;
            deactivate().catch(function () {});
          }
          publish();
        };
      }

      return {
        register: register,
        select: select,
        deactivate: deactivate,
        getActiveId: function () {
          return activeId;
        },
        snapshot: function () {
          return snapshot;
        },
        subscribe: function (listener) {
          listeners.add(listener);
          return function () {
            listeners.delete(listener);
          };
        },
      };
    }

    function apply(ctx) {
      var style = document.createElement("style");
      style.dataset.plugin = PACKAGE_ID;
      style.textContent = CSS;
      ctx.effect(function () {
        document.head.appendChild(style);
        return function () {
          style.remove();
        };
      }, "reasoning-module: base styles");

      ctx.effect(function () {
        return ctx.locale.register(LOCALE_NS, DICTIONARIES);
      }, "reasoning-module: locale dictionaries");

      // Child effect plugins register here. The service keeps at most one
      // effect active, so 推理模块 can safely grow alternative effects.
      ctx.provide("reasoningModule", createReasoningEffectsService());

      ctx.slots.inject("conversation.input.right", function () {
        return ctx.slots.register({
          name: "conversation.input.right",
          id: "reasoning-module",
          order: 12,
          locale: LOCALE_NS,
          inject: function (sessionId) {
            var available = ctx.sessions.subagentAddress(sessionId) === undefined;
            var directory = ctx.modelDirectories.directoryFor(sessionId);
            return {
              available: available,
              directory: directory.store,
              load: function () {
                if (!available) return;
                directory.load().catch(function () {});
              },
              select: function (selection) {
                if (!available) return Promise.resolve({ ok: false });
                return directory.select(selection);
              },
            };
          },
        }, ReasoningModule);
      });
    }

    exports.inject = inject;
    exports.apply = apply;
    exports.styles = CSS;
    exports.ReasoningModule = ReasoningModule;
    return module.exports;
  },
});
