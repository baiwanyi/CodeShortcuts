/**
 * 图标键到 lucide 组件的映射。
 * 宿主只持久化稳定的字符串键，图标实例由 Webview 侧解析，避免把 React 组件写进存储；
 * 新增图标键时必须同步 shared/types 的 PromptIconKey 联合类型，否则会漏映射。
 */
import {
    BookOpen,
    Briefcase,
    Bug,
    Cloud,
    Code2,
    Compass,
    FileText,
    Flame,
    GitBranch,
    GitCommit,
    Globe,
    Heart,
    Lightbulb,
    ListOrdered,
    Music,
    Newspaper,
    Palette,
    Rocket,
    Search,
    Shield,
    ShieldCheck,
    ShoppingCart,
    Sparkles,
    Star,
    Target,
    Terminal,
    Upload,
    Video,
    Wrench,
    Zap,
    type LucideIcon,
} from 'lucide-react'
import type { BookmarkColorKey, BookmarkIconKey, PromptIconKey } from '@shared/types'

export const PROMPT_ICON_MAP: Record<PromptIconKey, LucideIcon> = {
    gitCommit: GitCommit,
    gitPush: Upload,
    listOrdered: ListOrdered,
    wrench: Wrench,
    shieldCheck: ShieldCheck,
    sparkles: Sparkles,
    bug: Bug,
    search: Search,
    fileText: FileText,
    terminal: Terminal,
}

export const PROMPT_ICON_LABELS: Record<PromptIconKey, string> = {
    gitCommit: '提交',
    gitPush: '推送',
    listOrdered: '顺序',
    wrench: '修复',
    shieldCheck: '审查',
    sparkles: '推荐',
    bug: '缺陷',
    search: '检索',
    fileText: '文档',
    terminal: '终端',
}

/** 收藏图标键到 lucide 组件的映射，与 shared/types 的 BOOKMARK_ICON_KEYS 一一对应 */
export const BOOKMARK_ICON_MAP: Record<BookmarkIconKey, LucideIcon> = {
    globe: Globe,
    code: Code2,
    book: BookOpen,
    github: GitBranch,
    video: Video,
    news: Newspaper,
    shopping: ShoppingCart,
    music: Music,
    palette: Palette,
    work: Briefcase,
    star: Star,
    heart: Heart,
    flame: Flame,
    zap: Zap,
    rocket: Rocket,
    target: Target,
    lightbulb: Lightbulb,
    shield: Shield,
    cloud: Cloud,
    compass: Compass,
}

export const BOOKMARK_ICON_LABELS: Record<BookmarkIconKey, string> = {
    globe: '地球',
    code: '代码',
    book: '书籍',
    github: 'GitHub',
    video: '视频',
    news: '资讯',
    shopping: '购物',
    music: '音乐',
    palette: '设计',
    work: '工作',
    star: '星标',
    heart: '喜爱',
    flame: '热门',
    zap: '闪电',
    rocket: '火箭',
    target: '目标',
    lightbulb: '灵感',
    shield: '防护',
    cloud: '云端',
    compass: '探索',
}

/** 收藏背景色键到 Tailwind class 的映射；写成静态字面量供构建期扫描 */
export const BOOKMARK_COLOR_CLASSES: Record<BookmarkColorKey, string> = {
    white: 'bg-gray-100 hover:bg-gray-200 dark:hover:bg-gray-200',
    gray: 'bg-gray-400 hover:bg-gray-500 dark:hover:bg-gray-500',
    black: 'bg-gray-900 hover:bg-gray-900 dark:hover:bg-gray-900',
    red: 'bg-red-500 hover:bg-red-600 dark:hover:bg-red-600',
    orange: 'bg-orange-500 hover:bg-orange-600 dark:hover:bg-orange-600',
    yellow: 'bg-yellow-500 hover:bg-yellow-600 dark:hover:bg-yellow-600',
    green: 'bg-green-500 hover:bg-green-600 dark:hover:bg-green-600',
    cyan: 'bg-cyan-500 hover:bg-cyan-600 dark:hover:bg-cyan-600',
    blue: 'bg-blue-500 hover:bg-blue-600 dark:hover:bg-blue-600',
    purple: 'bg-purple-500 hover:bg-purple-600 dark:hover:bg-purple-600',
}

export const BOOKMARK_COLOR_LABELS: Record<BookmarkColorKey, string> = {
    white: '白',
    gray: '灰',
    black: '黑',
    red: '红',
    orange: '橙',
    yellow: '黄',
    green: '绿',
    cyan: '青',
    blue: '蓝',
    purple: '紫',
}
