/**
 * 收藏网址的持久化与增删改查。
 * 数据落在扩展全局状态（globalState）而非工作区，与提示词一样跨项目复用；
 * 存储键已在 activate 中登记给 Settings Sync，用户开启同步后可在多台设备间共享。
 * 读取时统一归一化：剔除结构非法或协议不受支持的条目，重复 id 只保留首个，避免脏数据进入 Webview。
 * 注意：网址落盘前必须经 URL 白名单收敛，打开时也由宿主再次校验，不允许 Webview 直接持有可执行协议。
 */
import type { Bookmark, BookmarkDraft } from '../../shared/types'
import type * as vscode from 'vscode'
import {
    isBookmarkLabelMissing,
    MAX_BOOKMARK_LABEL_LENGTH,
    normalizeBookmarkUrl,
} from '../../shared/bookmarkValidation'
import {
    DEFAULT_BOOKMARK_COLOR,
    DEFAULT_BOOKMARK_ICON,
    isBookmarkColorKey,
    isBookmarkIconKey,
} from '../../shared/types'

/**
 * 存储键：既是 globalState 的读写键，也是登记给 Settings Sync 的同步键（见 activate）。
 * 键名一旦发布就不能再改，换键等同于让用户已有的收藏全部消失。
 */
export const BOOKMARK_STORAGE_KEY = 'codeshortcuts.prompt.bookmarks.v1'

/** 把外部输入收敛为一条可信收藏，结构非法或协议不受支持时返回 null */
function normalizeBookmark(raw: unknown, index: number): Bookmark | null {
    if (typeof raw !== 'object' || raw === null) {
        return null
    }
    const label =
        'label' in raw && typeof raw.label === 'string' ? raw.label.trim().slice(0, MAX_BOOKMARK_LABEL_LENGTH) : ''
    if (isBookmarkLabelMissing(label)) {
        return null
    }
    const url = normalizeBookmarkUrl('url' in raw ? raw.url : undefined)
    if (!url) {
        return null
    }
    const id =
        'id' in raw && typeof raw.id === 'string' && raw.id.trim() ? raw.id.trim() : `custom-${Date.now()}-${index}`
    const icon = 'icon' in raw && isBookmarkIconKey(raw.icon) ? raw.icon : DEFAULT_BOOKMARK_ICON
    const color = 'color' in raw && isBookmarkColorKey(raw.color) ? raw.color : DEFAULT_BOOKMARK_COLOR
    return {
        id,
        label,
        url,
        icon,
        color,
        createdAt: 'createdAt' in raw && typeof raw.createdAt === 'number' ? raw.createdAt : Date.now(),
        updatedAt: 'updatedAt' in raw && typeof raw.updatedAt === 'number' ? raw.updatedAt : Date.now(),
    }
}

/** 把任意数组收敛为可信收藏列表：逐条归一化，重复 id 只保留首个 */
function normalizeList(raw: readonly unknown[]): Bookmark[] {
    const seenIds = new Set<string>()
    const result: Bookmark[] = []
    raw.forEach((item, index) => {
        const bookmark = normalizeBookmark(item, index)
        if (!bookmark || seenIds.has(bookmark.id)) {
            return
        }
        seenIds.add(bookmark.id)
        result.push(bookmark)
    })
    return result
}

export class BookmarkStore {
    constructor(private readonly memento: vscode.Memento) {}

    /** 读取并归一化收藏列表；从未落盘过时返回空数组，不写入任何预设数据 */
    getAll(): Bookmark[] {
        const raw = this.memento.get<unknown>(BOOKMARK_STORAGE_KEY)
        return Array.isArray(raw) ? normalizeList(raw) : []
    }

    /** 按 id 取单条收藏；不存在时返回 undefined，由调用方决定提示文案 */
    get(id: string): Bookmark | undefined {
        return this.getAll().find((item) => item.id === id)
    }

    /** 新增或更新收藏；draft.id 命中已有条目时为更新，网址始终按白名单收敛后落盘 */
    async save(draft: BookmarkDraft): Promise<Bookmark[]> {
        const list = this.getAll()
        const url = normalizeBookmarkUrl(draft.url)
        if (!url) {
            return list
        }
        const now = Date.now()
        const index = draft.id ? list.findIndex((item) => item.id === draft.id) : -1

        if (index >= 0) {
            const current = list[index]
            // index 来自 findIndex >= 0，判空只为满足 noUncheckedIndexedAccess
            if (!current) {
                return list
            }
            list[index] = {
                ...current,
                label: draft.label,
                url,
                icon: draft.icon,
                color: draft.color,
                updatedAt: now,
            }
        } else {
            list.push({
                id: `bookmark-${now}`,
                label: draft.label,
                url,
                icon: draft.icon,
                color: draft.color,
                createdAt: now,
                updatedAt: now,
            })
        }
        await this.persist(list)
        return list
    }

    /** 删除单条收藏，删掉就只留在存储的历史里 */
    async remove(id: string): Promise<Bookmark[]> {
        const list = this.getAll().filter((item) => item.id !== id)
        await this.persist(list)
        return list
    }

    private async persist(list: Bookmark[]): Promise<void> {
        await this.memento.update(BOOKMARK_STORAGE_KEY, list)
    }
}
