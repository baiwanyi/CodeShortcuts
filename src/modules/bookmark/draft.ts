/**
 * 收藏草稿的边界收敛与业务校验。
 * Webview 传来的草稿视为不可信输入：parseBookmarkDraft 只做结构收敛，validateBookmarkDraft 再给出可读错误；
 * 二者都不触碰持久化与视图，便于宿主保存入口与后续命令入口共用。
 * 注意：网址只在校验阶段做协议白名单判定，真正落盘时由 BookmarkStore 再次收敛，防止时序间被改写。
 */
import type { BookmarkDraft } from '../../shared/types'
import {
    isBookmarkLabelMissing,
    MAX_BOOKMARK_LABEL_LENGTH,
    MAX_BOOKMARK_URL_LENGTH,
    normalizeBookmarkUrl,
} from '../../shared/bookmarkValidation'
import { isRecord } from '../../shared/guards'
import {
    DEFAULT_BOOKMARK_COLOR,
    DEFAULT_BOOKMARK_ICON,
    isBookmarkColorKey,
    isBookmarkIconKey,
} from '../../shared/types'

/** 把消息载荷收敛为可信草稿：字段缺失或类型错误时返回 null */
export function parseBookmarkDraft(value: unknown): BookmarkDraft | null {
    if (!isRecord(value)) {
        return null
    }
    const { label, url } = value
    if (typeof label !== 'string' || typeof url !== 'string') {
        return null
    }
    const id = typeof value.id === 'string' && value.id.trim() ? value.id.trim() : undefined
    const icon = isBookmarkIconKey(value.icon) ? value.icon : DEFAULT_BOOKMARK_ICON
    const color = isBookmarkColorKey(value.color) ? value.color : DEFAULT_BOOKMARK_COLOR
    return { id, label: label.trim(), url: url.trim(), icon, color }
}

/** 校验草稿，返回错误信息数组（空数组表示通过） */
export function validateBookmarkDraft(draft: BookmarkDraft): string[] {
    const errors: string[] = []
    if (isBookmarkLabelMissing(draft.label)) {
        errors.push('名称不能为空')
    } else if (draft.label.length > MAX_BOOKMARK_LABEL_LENGTH) {
        errors.push(`名称不能超过 ${MAX_BOOKMARK_LABEL_LENGTH} 个字符`)
    }
    if (draft.url.length > MAX_BOOKMARK_URL_LENGTH) {
        errors.push(`网址不能超过 ${MAX_BOOKMARK_URL_LENGTH} 个字符`)
    } else if (!normalizeBookmarkUrl(draft.url)) {
        errors.push('网址必须是有效的 http 或 https 地址')
    }
    return errors
}
