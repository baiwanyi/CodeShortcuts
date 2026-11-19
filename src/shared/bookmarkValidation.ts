/**
 * 收藏网址的跨端口径：长度限制、名称判定与 URL 白名单。
 * 宿主读档、草稿校验与 Webview 输入限制共用同一份规则，避免两侧出现「前端能填、保存被拒」的错位。
 * 关键约束：只接受 http/https 绝对地址，相对路径与 javascript: 等危险协议一律拒绝；
 * 落盘前必须再收敛一次，防止历史数据或被篡改的消息把任意协议交给 openExternal。
 */
import { MAX_LABEL_LENGTH } from './promptLimits'

/** 收藏名称长度上限，与提示词名称共用同一限制 */
export const MAX_BOOKMARK_LABEL_LENGTH = MAX_LABEL_LENGTH

/** 收藏网址长度上限，避免整键同步体积失控 */
export const MAX_BOOKMARK_URL_LENGTH = 2048

/** 名称缺失判定：去除首尾空白后为空即视为缺失 */
export function isBookmarkLabelMissing(value: string): boolean {
    return value.trim().length === 0
}

/**
 * 把任意输入收敛为受支持的绝对网址，非法时返回 null。
 * 用 URL 构造器解析而不是正则匹配：它可以挡掉协议混淆、空格与畸形端口等边界输入。
 */
export function normalizeBookmarkUrl(value: unknown): string | null {
    if (typeof value !== 'string') {
        return null
    }
    const trimmed = value.trim()
    if (!trimmed || trimmed.length > MAX_BOOKMARK_URL_LENGTH) {
        return null
    }
    try {
        const parsed = new URL(trimmed)
        return parsed.protocol === 'http:' || parsed.protocol === 'https:' ? parsed.toString() : null
    } catch {
        return null
    }
}
