/**
 * Host half of 推理模块.
 *
 * The slider itself is a browser plugin. This Host half keeps the rule that a
 * reasoning module may have at most one enabled visual-effect child plugin:
 * effect rows are addressed by their `reasoning-fx-*` patch ids and the newest
 * successful toggle wins.
 */
export function apply(ctx) {
  const pluginManager = ctx.get('pluginManager');
  if (!pluginManager) return;

  let lastEnabled = new Set();
  let running = false;
  let scheduled = false;

  function schedule() {
    if (scheduled) return;
    scheduled = true;
    queueMicrotask(() => {
      scheduled = false;
      enforce();
    });
  }

  async function enforce() {
    if (running) return;
    running = true;
    try {
      const plugins = await pluginManager.listPlugins();
      const effects = plugins.filter(
        (plugin) =>
          typeof plugin.patchId === 'string' &&
          plugin.patchId.startsWith('reasoning-fx-') &&
          plugin.enabled,
      );
      if (effects.length > 1) {
        const newest = effects.find((plugin) => !lastEnabled.has(plugin.entryId));
        const keep = newest ?? effects[0];
        for (const plugin of effects) {
          if (plugin === keep) continue;
          try {
            await pluginManager.setPluginEnabled(plugin.entryId, false);
          } catch {
            // A concurrent removal or a protected row leaves the next
            // change notification to settle the remaining set.
          }
        }
      }
      const current = await pluginManager.listPlugins();
      lastEnabled = new Set(
        current
          .filter(
            (plugin) =>
              typeof plugin.patchId === 'string' &&
              plugin.patchId.startsWith('reasoning-fx-') &&
              plugin.enabled,
          )
          .map((plugin) => plugin.entryId),
      );
    } catch {
      // Management may be unavailable or restarting; the next change retries.
    } finally {
      running = false;
    }
  }

  ctx.effect(() => {
    const off = ctx.on('plugin-manager/changed', schedule);
    schedule();
    return () => {
      off();
    };
  }, 'reasoning-module: exclusive effect plugins');
}
