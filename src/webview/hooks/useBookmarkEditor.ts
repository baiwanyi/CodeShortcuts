/**
 * 收藏编辑弹窗的状态机。
 * 负责「按 id 取收藏并转成草稿」、开关弹窗与提交；提交只把 BookmarkDraft 交给宿主，校验与持久化都在宿主侧完成。
 * 新建入口由收藏分区自己的按钮触发，不复用提示词的宿主新建命令，避免两个分区互相抢弹窗。
 * 注意：id 查不到时保持弹窗关闭——此时收藏多半已被删除，弹出空表单会被误当成「新建」。
 */
import { useCallback, useState } from 'react'
import type { Bookmark, BookmarkDraft } from '@shared/types'
import { postToHost } from '@webview/lib/vscode'

/** 从完整收藏裁出可编辑字段，不把时间戳带进表单状态 */
function toDraft(bookmark: Bookmark): BookmarkDraft {
    return { id: bookmark.id, label: bookmark.label, url: bookmark.url, icon: bookmark.icon, color: bookmark.color }
}

export interface BookmarkEditorApi {
    editing: BookmarkDraft | null
    isOpen: boolean
    openCreate: () => void
    openEdit: (id: string) => void
    closeDialog: () => void
    submit: (draft: BookmarkDraft) => void
}

export function useBookmarkEditor(bookmarks: Bookmark[]): BookmarkEditorApi {
    const [editing, setEditing] = useState<BookmarkDraft | null>(null)
    const [isOpen, setIsOpen] = useState(false)

    const openCreate = useCallback((): void => {
        setEditing(null)
        setIsOpen(true)
    }, [])

    const openEdit = useCallback(
        (id: string): void => {
            const target = bookmarks.find((item) => item.id === id)
            if (!target) {
                return
            }
            setEditing(toDraft(target))
            setIsOpen(true)
        },
        [bookmarks],
    )

    const closeDialog = useCallback((): void => {
        setIsOpen(false)
        setEditing(null)
    }, [])

    const submit = useCallback((draft: BookmarkDraft): void => {
        postToHost({ type: 'saveBookmark', draft })
        setIsOpen(false)
        setEditing(null)
    }, [])

    return { editing, isOpen, openCreate, openEdit, closeDialog, submit }
}
