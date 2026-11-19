# CodeShortcuts for VSCode

> 把常用提示词送达 CodeBuddy，把收藏网址与开发命令收进侧边栏

把常用提示词、收藏网址与环境维护动作收进同一个侧边栏，点击即用；右键菜单另内置五个代码处理动作与三个环境维护命令，提示词由扩展按选区和相对路径自动拼装。

[![Version](https://img.shields.io/github/package-json/v/baiwanyi/CodeShortcuts/main?label=version&color=blue)](https://github.com/baiwanyi/CodeShortcuts/releases)
![License](https://img.shields.io/github/license/baiwanyi/CodeShortcuts?color=blue)

-----

## ✨ 功能特性

| 功能 | 说明 |
| --- | --- |
| 🗂️ 三分区面板 | 顶部 Tabs 切换「提示词 / 系统命令 / 收藏夹」，各自独立渲染 |
| ⚡ 一键发送 | 点击卡片后短暂确认即发送（期间可撤销），优先复用 CodeBuddy 当前对话 |
| 🔖 收藏夹 | 常用网址独立管理，可从 20 个图标与 10 种背景色中自选外观，点击由 VS Code 内置简单浏览器打开 |
| 🖱️ 快捷命令 | 编辑器/资源管理器右键提供五个代码动作与三个环境维护命令 |
| 🧰 环境维护 | 「系统命令」分区提供重载窗口、重启 ESLint / 重启 TS |
| 💾 数据同步 | 提示词与收藏存于扩展全局状态，可参与 Settings Sync |
| 🎛️ 分级降级 | 复用会话 → 新建会话 → 剪贴板，结果以 toast 反馈 |
| 🧩 预设模板 | 首次安装写入五条提示词，之后可自由编辑、排序、删除 |

-----

## 🚀 快速开始

### 环境要求

| 依赖 | 版本 | 说明 |
| --- | --- | --- |
| VS Code | 1.146.0 或更高 | 清单 `engines.vscode` 的声明 |
| Node.js | 22.13+ 或 24+ | 由当前依赖推导（vsce、concurrently、ESLint、Vite），清单未显式声明；扩展产物以 `node20` 为目标 |
| pnpm | 12 | `pnpm-workspace.yaml` 按 pnpm 12 配置安装脚本白名单，清单未声明 `packageManager` |

### 安装

从源码运行：

1. `git clone https://github.com/baiwanyi/CodeShortcuts.git`（SSH：`git clone git@github.com:baiwanyi/CodeShortcuts.git`）
2. `pnpm install`
3. `pnpm run compile`
4. 在 VS Code 中按 `F5` 启动扩展开发宿主

安装本地打包产物（VSIX 不会自动更新，升级需重新安装）：

```bash
pnpm run package
```

脚本会先编译，再输出 `releases/codeshortcuts-<version>.vsix` 并调用 `code --install-extension --force` 覆盖安装到本机，重载窗口即生效。若 `code` 不在 PATH 中，只会警告并跳过安装，产物照常生成，此时可手动安装：

```bash
code --install-extension releases/codeshortcuts-0.1.5.vsix
```

### 面板分区

点击活动栏的「CodeShortcuts」图标展开面板，顶部三个 Tab 对应三类内容：

| 分区 | 内容 |
| --- | --- |
| 提示词 | 列表上方是连接状态、条数与搜索；下方卡片可新建、编辑、复制、排序、删除 |
| 系统命令 | 宿主工具表提供的环境维护动作，按宿主顺序渲染 |
| 收藏夹 | 网址条目按添加顺序排列，支持新建、编辑、删除与打开 |

容量用量徽章位于分区标签行的右侧，三个分区共用同一份提示词容量，切换标签时不会消失。

视图标题栏的 `+`（以及命令面板的「新建提示词模板」）是通用新建入口：在「提示词」分区新建提示词，在「收藏夹」分区新建收藏，在「系统命令」分区触发时切回提示词分区新建。条目编辑仍走卡片右侧菜单。

### 发送一条提示词

点击卡片后进入 500 ms 待发状态，行尾显示加载图标，此时再次点击可撤销；到点后按以下条件决定发送方式：

| 条件 | 行为 |
| --- | --- |
| `autoSend` 关闭 | 旁路：只写剪贴板并聚焦 CodeBuddy 对话框，不调用任何发送命令 |
| `autoSend` 开启、`reuseConversation` 开启 | 读取当前会话 ID，调用 `sendCommand` 发往当前对话，成功即结束 |
| 当前会话不可用（读不到 ID、命令拒绝或异常） | 调用 `newChatCommand` 新建对话并发送 |
| `reuseConversation` 关闭 | 跳过当前会话，直接调用 `newChatCommand` |
| 两条命令都失败且 `fallbackToClipboard` 开启 | 写剪贴板并聚焦对话框，提示粘贴后回车 |
| 两条命令都失败且 `fallbackToClipboard` 关闭 | 报错，提示调整命令类配置 |

`autoSend` 关闭或剪贴板兜底时，若写剪贴板也失败，会单独报错提示从卡片手动复制。

未检测到 CodeBuddy 时，面板会按 1.5s → 3s → 6s → 12s → 15s 的间隔退避轮询，最多 30 次；耗尽后显示带「刷新」按钮的提示 toast。点击卡片仍会先尝试激活 CodeBuddy，不会因面板显示未检测到就直接失败。

### 收藏网址

切到「收藏夹」分区后点击视图标题栏的 `+` 即可新建收藏；条目右侧菜单提供编辑与删除。点击条目即在 VS Code 内置的简单浏览器中打开。

- 网址固定使用 `https`，输入框无需填写协议；粘贴自带 `http://` 或 `https://` 时会自动去掉，宿主仍会二次校验。
- 图标与背景色各由一个下拉菜单选择：20 个图标、10 种颜色（白、灰、黑、红、橙、黄、绿、青、蓝、紫）。
- 外观不依赖外部 favicon 服务，默认「地球 + 白色」；历史数据缺少外观字段时自动回落到这一默认值。
- 名称最长 40 字符，网址最长 2048 字符；收藏夹目前没有总量上限。
- 数据已登记为同步键，但只有在 VS Code 中登录并开启 Settings Sync 后才会真正跨设备同步。

### 右键快捷命令

在编辑器中选中代码后右键，或在资源管理器中右键某个文件 →「快捷命令」→ 选择动作。目标描述由扩展自动拼成 `相对路径（整个文件）`、`相对路径（第 12 行）` 或 `相对路径（第 12-30 行）`，资源管理器右键时取所点文件，不会误用其他文件的选区。

五个代码动作：

| 菜单项 | 作用 | 使用模式 |
| --- | --- | --- |
| 修复缺陷 | 阅读文件及调用方定位成因，做最小必要改动 | 跟随配置（默认 `craft`） |
| 代码评审 | 检查正确性、安全、并发与资源释放，只出结论不改文件 | 固定 `ask` |
| 优化代码 | 从正确性、安全防御、边界鲁棒性、性能效率四维排查后修复 | 跟随配置（默认 `craft`） |
| 编码规范 | 按缩进、引号、import 顺序、命名、Hooks 等规则检查并修正 | 跟随配置（默认 `craft`） |
| 代码重构 | 分析职责分离、复用性、复杂度与耦合度，输出提取方案 | 跟随配置（默认 `craft`） |

子菜单末尾另提供三项环境维护命令，因此右键菜单共八项。`craft` / `ask` / `plan` 只是透传给 CodeBuddy 的模式值，扩展不实现其语义，实际行为取决于 CodeBuddy 版本。提示词模板正文来自 `resources/actions.md`，用 `{{target}}` 插入目标描述。

### 系统命令

面板首项为「重载窗口」，其后是「重启 ESLint」与「重启 TS」：

| 菜单项 | 转发到的命令 | 说明 |
| --- | --- | --- |
| 重载窗口 | `workbench.action.reloadWindow` | 立即重载，不等待也不二次确认 |
| 重启 ESLint | `eslint.restart` | 需安装并启用 ESLint 扩展，缺失时给出提示 |
| 重启 TS | `typescript.restartTsServer` | 由内置 TypeScript 扩展提供 |

三项只做命令转发，不读取选区、不发送提示词；命令面板中的标题分别为「重新加载窗口」「重启 ESLint 服务」「重启 TS 服务」。

-----

## 📖 预设提示词

首次安装写入五条预设模板，之后与自建模板完全等价，可编辑、排序、删除；删空不会自动补回。正文为空时以名称作为提示词发送。

| 名称 | 图标 | 模式 | 默认正文 |
| --- | --- | --- | --- |
| 请继续 | `terminal` | `craft` | 名称即正文 |
| 按推荐顺序实施 | `sparkles` | `craft` | 名称即正文 |
| 提交到 Git | `gitCommit` | `craft` | 名称即正文 |
| 推送到 Git | `gitPush` | `craft` | 名称即正文 |
| 排查遗留代码 | `shieldCheck` | `ask` | 识别孤儿代码、死代码与旧代码残留并输出评估报告 |

模板来源为 `resources/prompts.md`。侧边栏卡片始终使用各自模板的模式，不受 `codeshortcuts.prompt.codebuddy.mode` 影响。

-----

## ⚙️ 配置

全部配置位于 `settings.json` 或「设置 → 扩展 → CodeShortcuts」，无需环境变量。

| 设置项 | 默认值 | 说明 |
| --- | --- | --- |
| `codeshortcuts.prompt.codebuddy.reuseConversation` | `true` | 是否优先发往当前对话；关闭后每次点击都新建会话 |
| `codeshortcuts.prompt.codebuddy.sendCommand` | `tencentcloud.codingcopilot.chat.sendMessage` | 复用当前会话的命令 ID |
| `codeshortcuts.prompt.codebuddy.newChatCommand` | `tencentcloud.codingcopilot.sendToChat` | 新建会话的命令 ID，也是复用失败后的回退通道 |
| `codeshortcuts.prompt.codebuddy.mode` | `craft` | 右键动作未预设模式时的默认模式（`craft`/`ask`/`plan`） |
| `codeshortcuts.prompt.codebuddy.autoSend` | `true` | 关闭后不调用发送命令，只写剪贴板并聚焦对话框 |
| `codeshortcuts.prompt.codebuddy.fallbackToClipboard` | `true` | 发送链路失败末尾是否写剪贴板兜底 |
| `codeshortcuts.prompt.update.checkOnStartup` | `false` | 是否在启动时检查自建更新清单 |
| `codeshortcuts.prompt.update.manifestUrl` | 空 | 自建更新清单地址，仅接受 `https` |

```json
{
    "codeshortcuts.prompt.codebuddy.reuseConversation": true,
    "codeshortcuts.prompt.codebuddy.mode": "ask",
    "codeshortcuts.prompt.codebuddy.autoSend": true
}
```

两个命令类配置是 CodeBuddy 内部命令 ID 变动时的覆盖入口。更新检查默认关闭：只有在同时设置 `checkOnStartup: true` 与 `manifestUrl` 时，启动后才会请求清单、比较版本并提示下载；该机制不下载也不安装扩展，市场安装版本由 VS Code 自行更新。清单格式为：

```json
{
    "version": "0.2.0",
    "url": "https://example.com/releases/codeshortcuts-0.2.0.vsix"
}
```

版本只比较前三段数字，远端严格更高才提示；同一版本只提醒一次。

-----

## 🔒 数据与限制

| 项目 | 规则 |
| --- | --- |
| 存储位置 | 扩展 `globalState`，跨项目复用而非按工作区隔离 |
| 同步键 | `codeshortcuts.prompt.templates.v1`、`codeshortcuts.prompt.bookmarks.v1` |
| 提示词容量 | 整份列表序列化后不超过 512 KB，面板实时显示用量 |
| 字段上限 | 名称 40 字符、提示词正文 8000 字符、收藏网址 2048 字符 |
| 网址协议 | 新建固定 `https`；宿主兼容历史数据中的 `http` / `https`，拒绝相对地址与其他协议 |
| 输入校验 | Webview 提交后由宿主重新解析、校验再落盘，不信任前端载荷 |

品牌统一前的旧前缀配置与存储会在激活时一次性清除，不做数据迁移。

-----

## 🧱 技术栈

| 层 | 选型 |
| --- | --- |
| 语言 | TypeScript 6（日常类型检查）与 TypeScript 7（构建期校验） |
| 前端 | React 19 + Vite 8 + Tailwind CSS 4，组件来自 shadcn/ui，图标为 lucide-react |
| 扩展宿主 | esbuild 打包为 CommonJS 单文件，`target: node20` |
| 质量与打包 | ESLint 10 + Prettier 3，@vscode/vsce 打包发布，pnpm 12 管理依赖 |

宿主与 Webview 通过 `src/shared` 中的可辨识联合消息协议通信，宿主持有状态并在写操作后回推完整列表，Webview 只负责渲染与发起意图。

-----

## 🛠️ 开发

```bash
pnpm install
pnpm run compile   # tsc --noEmit + esbuild + vite build
```

| 命令 | 作用 |
| --- | --- |
| `pnpm run typecheck` | TypeScript 6 全项目类型检查，不构建 |
| `pnpm run watch` | 三路监听：类型检查、宿主打包、Webview 打包 |
| `pnpm run lint` | ESLint 全量检查 |
| `pnpm run lint:fix` | ESLint 检查并自动修复可修复项 |
| `pnpm run verify` | 类型检查 + ESLint + Prettier 格式校验 |
| `pnpm run package` | 编译、输出 VSIX 到 `releases/` 并安装到本机（`--no-install` 跳过安装） |
| `pnpm run release` | 打包、创建附注 tag 并发布到 GitHub Release；会检查工作区干净与 `gh auth status`，并推送当前分支和 tag |
| `pnpm run market` | 把 `releases/` 里当前版本的 VSIX 上架市场；不重新打包，需先执行 `package` |

`esbuild` 将 `src/extension.ts` 及 `src/modules` 打包为 `dist/extension.js`；Vite 将 `src/webview` 构建到 `dist/webview/`，宿主读取其 HTML 后注入 CSP 与资源地址。Webview 加载的是构建产物而非源码，改动前端后需重新构建并重载窗口。

主要目录：

| 目录 | 职责 |
| --- | --- |
| `src/extension.ts` | 激活入口，装配存储、桥接与视图，注册命令和配置监听 |
| `src/modules/prompt` | 提示词存储、预设解析与草稿校验 |
| `src/modules/bookmark` | 收藏存储与草稿校验 |
| `src/modules/commands` | 右键快捷动作与环境维护命令 |
| `src/modules/codebuddy` | CodeBuddy 发送链路、可用性轮询与结果反馈 |
| `src/modules/views` | 侧边栏提供者与 Webview 消息传输 |
| `src/modules/update` | 自建更新清单检查 |
| `src/modules/common` | 通知契约、输出通道与 Webview HTML 装配 |
| `src/webview` | React 面板：组件、Hooks、工具函数与样式 |
| `src/shared` | 两侧共用的类型、消息协议、守卫、错误与限制常量 |
| `resources` | 预设提示词、动作模板与图标 |

-----

## 💡 常见问题

**面板提示「Webview 资源缺失」**

构建产物不存在，执行 `pnpm run compile` 后重载窗口。

**修改前端代码后界面没变化**

Webview 加载 `dist/webview` 产物而非源码，重新构建后需重开视图或重载窗口。

**保存提示词被拒，提示容量已满**

整份列表上限 512 KB，删除或精简不再需要的提示词后再保存；分区标签右侧的徽章实时显示用量。收藏夹目前没有总量上限。

**常驻的「未检测到 CodeBuddy」提示**

确认 CodeBuddy 已安装并激活后点击提示里的「刷新」；自定义命令 ID 时检查是否指向已注册命令。排障日志在输出面板的「CodeShortcuts」通道。

**想确认这次实际用了哪条发送命令**

正常发送不会写日志，只有降级与失败路径写入「CodeShortcuts」输出通道。

**每次点击都新建了会话**

先确认 `reuseConversation` 为 `true`，该值为 `false` 时设计上就会每次新建。为 `true` 仍新建，说明读不到 `conversationId`（CodeBuddy 未返回或 `getContext` 命令不可用），扩展会退化为新建会话。

**点击收藏条目打开了外部浏览器**

当前实现调用 VS Code 内置简单浏览器，不会启动系统浏览器；若环境缺少该命令会给出明确提示。

**删除的预设或收藏能恢复吗**

不能自动恢复，项目也未提供导出/导入功能；操作前请自行留存重要内容。

**右键菜单提示「请先打开一个文件」**

动作需要目标文件：资源管理器右键会传入文件，命令面板调用则要求存在活动编辑器。

-----

## 📜 许可证

MIT License，Copyright (c) 2026 webian。完整条款见 [LICENSE.txt](./LICENSE.txt)。

## 🐛 反馈

| 渠道 | 地址 |
| --- | --- |
| 问题反馈 | [Issues](https://github.com/baiwanyi/CodeShortcuts/issues) |

-----

**Better prompts, better AI responses.**

Make VIBE CODING more convenient.
