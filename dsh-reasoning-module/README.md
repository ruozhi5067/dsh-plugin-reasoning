# 推理模块（dsh-reasoning-module）

DSH（DeepSeek Harness）的**推理强度选择模块**：渲染一个圆形滑块，读取当前会话模型的 `reasoning.efforts`，支持拖拽 / 键盘调档并提交给当前会话。

它本身**不包含任何粒子、光晕或原子特效**。特效由「推理模块」组合包下的子插件提供：

- 特效一：`dsh-reasoning-fx-one`
- 特效二：`dsh-reasoning-fx-two`

```
推理模块（本包，组合包）
├─ 特效一  dsh-reasoning-fx-one
└─ 特效二  dsh-reasoning-fx-two
```

## 功能

- **档位自适应**：档位数量与名称完全来自模型适配器，不写死。
- **拖拽提交**：拖动时连续预览，松手吸附到最近档位并提交；提交中显示 pending，失败保留原档位。
- **键盘操作**：`←` `→` `↑` `↓` 逐档、`PageUp` / `PageDown` 逐档、`Home` / `End` 直达首尾，松开按键提交，`Esc` 取消。
- **可访问性**：`role=slider`，`aria-valuemin` / `aria-valuemax` / `aria-valuenow` / `aria-valuetext` 完整。
- **可隐藏**：模型没有推理档位、或是子 agent 会话时，控件自动隐藏。
- **不侵入宿主**：挂在 `conversation.input.right` 插槽（order 12），通过 DSH 的模型目录服务提交选择。

## 互斥与特效切换

本包同时是「推理特效」的互斥容器，两层保证同一时间最多一个特效生效：

1. **Host 半边（行级硬互斥）**：`src/index.js` 监听 `plugin-manager/changed`，把所有 `patchId` 以 `reasoning-fx-` 开头的已启用插件行收敛到最多一个——用户新打开的那个保留，其余由 `pluginManager.setPluginEnabled(..., false)` 关闭；
2. **Client 半边（运行时互斥容器）**：浏览器端提供 `reasoningModule` Client Service，同一时间最多只有一个已注册特效处于激活状态。

在插件页打开「特效一」或「特效二」的开关即可切换，打开一个会自动关闭另一个（行级硬卸载，无渐变）。

## 给特效插件的接口

```js
const dispose = ctx.reasoningModule.register({
  id: 'reasoning-fx-mine',      // 全局唯一
  order: 30,
  applyActive(enabled) {},      // true 挂载，false 卸载并清理
  isActive() {},
});
```

服务还提供 `select(id)` / `deactivate()` / `getActiveId()` / `snapshot()` / `subscribe(listener)`。

> Loader 行的 `id` 需以 `reasoning-fx-` 开头，才会被 Host 半边的行级互斥规则管理。

## 文件

```
dsh-reasoning-module/
├─ package.json
├─ cordis.patch.yml   # 组合包补丁：插入 特效一 / 特效二 行
├─ src/index.js       # Host 半边：行级互斥
├─ lib/client.js      # 浏览器半边：滑块 UI + CSS + reasoningModule 服务
├─ locale/*.json      # 插件页显示名
└─ icon.svg
```

## 安装

本包属于 [dsh-plugin-reasoning](https://github.com/ruozhi5067/dsh-plugin-reasoning) 仓库，需要与两个特效子包一起安装：

1. 在 DSH profile 的 `package.json` 中把三个包登记为 `link:` 依赖；
2. 在 `dsh.profile.bundles` 中加入 `dsh-reasoning-module`（让本包的补丁插入两个特效行）；
3. 在 profile 的 `cordis.patch.yml` 中插入 `reasoning-module` 行（若你使用「外观与特效」母插件，它已插入该行）；
4. 重启 DSH。

完整步骤与截图见仓库根目录的 [README](https://github.com/ruozhi5067/dsh-plugin-reasoning#安装)。

## 兼容性

- 开发验证于 DSH Desktop 0.2.2-rc.1（Web GUI）；
- 依赖 DSH client 服务：`slots`、`locale`、`modelDirectories`、`theme`；
- 模型适配器需要提供 `reasoning.efforts`，否则滑块不显示。

## License

MIT © 2026 ruozhi5067
