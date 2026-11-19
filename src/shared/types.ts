/**
 * 扩展宿主与 Webview 共享的领域类型。
 * 该文件是两侧唯一的类型契约来源：宿主侧负责持久化与校验，Webview 侧只做展示与编辑，
 * 任何字段调整都必须同步 PromptStore 的迁移逻辑与消息协议。
 * 注意：枚举型字段一律使用字面量联合，避免新增取值时出现未覆盖分支。
 */

/** CodeBuddy 对话模式，取值与扩展内置的 BASIC_CHAT_TYPES 对齐 */
export type ChatMode = 'craft' | 'ask' | 'plan'

/** 列表内移动方向：宿主排序、Webview 菜单与 movePrompt 消息共用同一份取值 */
export type MoveDirection = 'up' | 'down'

/** 提示词卡片可用的图标键，Webview 侧映射到 lucide 图标组件 */
export type PromptIconKey =
    | 'gitCommit'
    | 'gitPush'
    | 'listOrdered'
    | 'wrench'
    | 'shieldCheck'
    | 'sparkles'
    | 'bug'
    | 'search'
    | 'fileText'
    | 'terminal'

export const PROMPT_ICON_KEYS: readonly PromptIconKey[] = [
    'gitCommit',
    'gitPush',
    'listOrdered',
    'wrench',
    'shieldCheck',
    'sparkles',
    'bug',
    'search',
    'fileText',
    'terminal',
]

/** 校验图标键取值：宿主读档、草稿收敛与 Webview 选项组共用同一份白名单 */
export function isPromptIconKey(value: unknown): value is PromptIconKey {
    return typeof value === 'string' && PROMPT_ICON_KEYS.some((key) => key === value)
}

export const CHAT_MODES: readonly ChatMode[] = ['craft', 'ask', 'plan']

/** 校验对话模式取值：宿主读档与 Webview 收窄共用同一份白名单 */
export function isChatMode(value: unknown): value is ChatMode {
    return typeof value === 'string' && CHAT_MODES.some((mode) => mode === value)
}

/** 一条提示词模板；预设与用户自建在类型上不作区分，行为完全一致 */
export interface PromptTemplate {
    /** 稳定标识：编辑、删除与排序都按它定位，重排不改变 id */
    id: string
    /** 按钮上展示的名称，如「提交到 Git」 */
    label: string
    /** 实际发送给 CodeBuddy 的提示词正文 */
    prompt: string
    icon: PromptIconKey
    mode: ChatMode
    createdAt: number
    updatedAt: number
}

/** 新建或编辑时提交给宿主的载荷（不含时间戳等派生字段） */
export interface PromptDraft {
    id?: string
    label: string
    prompt: string
    icon: PromptIconKey
    mode: ChatMode
}

/** 收藏图标键：宿主只存字符串，Webview 侧映射到 lucide 组件 */
export type BookmarkIconKey =
    | 'globe'
    | 'code'
    | 'book'
    | 'github'
    | 'video'
    | 'news'
    | 'shopping'
    | 'music'
    | 'palette'
    | 'work'
    | 'star'
    | 'heart'
    | 'flame'
    | 'zap'
    | 'rocket'
    | 'target'
    | 'lightbulb'
    | 'shield'
    | 'cloud'
    | 'compass'

export const BOOKMARK_ICON_KEYS: readonly BookmarkIconKey[] = [
    'globe',
    'code',
    'book',
    'github',
    'video',
    'news',
    'shopping',
    'music',
    'palette',
    'work',
    'star',
    'heart',
    'flame',
    'zap',
    'rocket',
    'target',
    'lightbulb',
    'shield',
    'cloud',
    'compass',
]

/** 校验图标键取值：宿主读档、草稿收敛与 Webview 选项组共用同一份白名单 */
export function isBookmarkIconKey(value: unknown): value is BookmarkIconKey {
    return typeof value === 'string' && BOOKMARK_ICON_KEYS.some((key) => key === value)
}

/** 收藏背景色键：宿主只存字符串，Webview 侧映射到 Tailwind class */
export type BookmarkColorKey =
    'white' | 'gray' | 'black' | 'red' | 'orange' | 'yellow' | 'green' | 'cyan' | 'blue' | 'purple'

export const BOOKMARK_COLOR_KEYS: readonly BookmarkColorKey[] = [
    'white',
    'gray',
    'black',
    'red',
    'orange',
    'yellow',
    'green',
    'cyan',
    'blue',
    'purple',
]

/** 校验背景色键取值：宿主读档与 Webview 选项组共用同一份白名单 */
export function isBookmarkColorKey(value: unknown): value is BookmarkColorKey {
    return typeof value === 'string' && BOOKMARK_COLOR_KEYS.some((key) => key === value)
}

/** 新建收藏的默认外观；历史数据缺字段时也回落到这一组 */
export const DEFAULT_BOOKMARK_ICON: BookmarkIconKey = 'globe'
export const DEFAULT_BOOKMARK_COLOR: BookmarkColorKey = 'white'

/** 一条收藏网址：名称用于列表展示，url 已收敛为 http/https 绝对地址 */
export interface Bookmark {
    /** 稳定标识：打开、编辑与删除都按它定位 */
    id: string
    label: string
    url: string
    icon: BookmarkIconKey
    color: BookmarkColorKey
    createdAt: number
    updatedAt: number
}

/** 新建或编辑收藏时提交给宿主的载荷（不含时间戳等派生字段） */
export interface BookmarkDraft {
    id?: string
    label: string
    url: string
    icon: BookmarkIconKey
    color: BookmarkColorKey
}

/**
 * CodeBuddy 集成状态，用于在面板顶部提示可用性。
 * 只暴露界面真正消费的两项：命令 ID 属内部通路细节，展示层不呈现，因此不进协议。
 */
export interface CodeBuddyStatus {
    /** 是否探测到可用的发送命令 */
    detected: boolean
    /** 是否会自动触发发送 */
    autoSend: boolean
}

/** 环境维护动作标识：与提示词模板无关，不参与存储、同步与容量统计 */
export type ToolActionId = 'restartEslint' | 'restartTsServer' | 'reloadWindow'

/** 工具动作在列表中的展示元数据；命令 ID 与失败提示属宿主内部细节，不下发 */
export interface ToolActionInfo {
    id: ToolActionId
    label: string
    /** 悬停说明：交代动作后果，不重复标题 */
    description: string
}

/** 宿主推送给 Webview 的完整状态 */
export interface PromptStatePayload {
    prompts: PromptTemplate[]
    /** 整份列表序列化后的字节数，用于界面展示容量用量（上限见 shared/promptLimits） */
    usedBytes: number
    codebuddy: CodeBuddyStatus
    /** 追加在提示词列表末尾的工具动作，顺序由宿主决定 */
    tools: ToolActionInfo[]
    /** 收藏网址，顺序以持久化数组为准 */
    bookmarks: Bookmark[]
}

/** 发送结果，用于宿主内部决策是否走降级链路 */
export type SendOutcome = 'sent' | 'copied' | 'failed'
