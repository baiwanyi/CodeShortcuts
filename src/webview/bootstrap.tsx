/**
 * 提示词面板引导组件（bootstrap）：把数据订阅、编辑状态与展示组件装配成完整面板。
 * 采用「宿主推送状态 + 本地派生视图」的结构：组件本身不持久化任何数据，
 * 所有写操作通过 postToHost 发送意图，由宿主校验后回推完整列表。
 * 顶部 Tabs 只切换视图：提示词分区保留标题与搜索，系统命令分区渲染宿主工具表，收藏分区管理网址。
 * 首屏在收到首个 state 之前统一呈现加载占位，避免把「尚未读到」误报成空列表。
 * 注意：两个编辑弹窗与 Toaster 只挂载一次且位于内容分支之外，否则切换 Tabs 会连带卸载常驻提示；
 * 视图标题栏的新建命令是通用请求：收到 requestCreate 时按当前分区打开对应编辑器，系统命令分区回退到提示词。
 */
import { useCallback, useMemo, useState } from 'react'
import { BookmarkEditorDialog } from '@components/BookmarkEditorDialog'
import { BookmarkList } from '@components/BookmarkList'
import { PanelTabs, type PanelTab } from '@components/PanelTabs'
import { PromptEditorDialog } from '@components/PromptEditorDialog'
import { PromptList } from '@components/PromptList'
import { ToolList } from '@components/ToolList'
import { Toaster } from '@components/ui/sonner'
import { Spinner } from '@components/ui/spinner'
import type { HostToWebviewMessage } from '@shared/messages'
import { useBookmarkEditor } from '@webview/hooks/useBookmarkEditor'
import { useHostMessages } from '@webview/hooks/useHostMessages'
import { usePromptEditor } from '@webview/hooks/usePromptEditor'
import { usePromptState } from '@webview/hooks/usePromptState'
import { filterPrompts } from '@webview/lib/prompt-filter'
import { postToHost } from '@webview/lib/vscode'
import type { JSX } from 'react'

export function Bootstrap(): JSX.Element {
    const [query, setQuery] = useState('')
    const [tab, setTab] = useState<PanelTab>('prompts')
    const payload = usePromptState()
    const prompts = useMemo(() => payload?.prompts ?? [], [payload])
    const tools = useMemo(() => payload?.tools ?? [], [payload])
    const bookmarks = useMemo(() => payload?.bookmarks ?? [], [payload])
    const { items, isFiltering } = useMemo(() => filterPrompts(prompts, query), [prompts, query])
    const { editing, isOpen, openEdit, closeDialog, submit } = usePromptEditor(prompts)
    const bookmarkEditor = useBookmarkEditor(bookmarks)
    const { openCreate: openBookmarkCreate } = bookmarkEditor

    // 新建命令由宿主统一发出，Webview 是唯一知道当前分区的一方，因此在这里决定打开哪个编辑器
    const handleHostMessage = useCallback(
        (message: HostToWebviewMessage): void => {
            if (message.type !== 'requestCreate') {
                return
            }
            if (tab === 'bookmarks') {
                openBookmarkCreate()
                return
            }
            if (tab !== 'prompts') {
                setTab('prompts')
            }
            openEdit()
        },
        [tab, openBookmarkCreate, openEdit],
    )
    useHostMessages(handleHostMessage)

    return (
        <>
            {payload ? (
                <>
                    <PanelTabs value={tab} onChange={setTab} usedBytes={payload.usedBytes} />
                    {tab === 'prompts' ? (
                        <PromptList
                            codebuddy={payload.codebuddy}
                            count={prompts.length}
                            query={query}
                            onQueryChange={setQuery}
                            prompts={prompts}
                            items={items}
                            isFiltering={isFiltering}
                            onRun={(id) => postToHost({ type: 'runPrompt', id })}
                            onCopy={(id) => postToHost({ type: 'copyPrompt', id })}
                            onEdit={openEdit}
                            onDelete={(id) => postToHost({ type: 'deletePrompt', id })}
                            onMove={(id, direction) => postToHost({ type: 'movePrompt', id, direction })}
                        />
                    ) : null}
                    {tab === 'tools' ? (
                        <ToolList tools={tools} onRun={(id) => postToHost({ type: 'runTool', id })} />
                    ) : null}
                    {tab === 'bookmarks' ? (
                        <BookmarkList
                            bookmarks={bookmarks}
                            onOpen={(id) => postToHost({ type: 'openBookmark', id })}
                            onEdit={bookmarkEditor.openEdit}
                            onDelete={(id) => postToHost({ type: 'deleteBookmark', id })}
                        />
                    ) : null}
                </>
            ) : (
                <div className="flex min-h-0 flex-1 justify-center p-3">
                    <Spinner className="size-5 text-muted-foreground" />
                </div>
            )}

            <PromptEditorDialog
                open={isOpen}
                draft={editing}
                prompts={prompts}
                usedBytes={payload?.usedBytes ?? 0}
                onOpenChange={(open) => {
                    if (!open) {
                        closeDialog()
                    }
                }}
                onSubmit={submit}
            />

            <BookmarkEditorDialog
                open={bookmarkEditor.isOpen}
                draft={bookmarkEditor.editing}
                onOpenChange={(open) => {
                    if (!open) {
                        bookmarkEditor.closeDialog()
                    }
                }}
                onSubmit={bookmarkEditor.submit}
            />

            <Toaster />
        </>
    )
}
