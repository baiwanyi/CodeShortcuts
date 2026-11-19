/**
 * 收藏分区：标题行展示条数，列表按宿主下发的顺序渲染并转发逐项操作。
 * 新建入口统一放在视图标题栏并按当前分区分发，空态给出对应引导，不预置任何网址。
 * 注意：滚动区域独占剩余高度，标题行保持固定；左右内距与 PanelTabs 的 px-3 对齐，保证三个分区边缘齐平。
 */
import { Info } from 'lucide-react'
import { BookmarkItem } from '@components/BookmarkItem'
import { Badge } from '@components/ui/badge'
import { Empty, EmptyDescription, EmptyHeader, EmptyMedia } from '@components/ui/empty'
import { ItemGroup } from '@components/ui/item'
import { ScrollArea } from '@components/ui/scroll-area'
import type { Bookmark } from '@shared/types'
import type { JSX } from 'react'

interface BookmarkListProps {
    bookmarks: Bookmark[]
    onOpen: (id: string) => void
    onEdit: (id: string) => void
    onDelete: (id: string) => void
}

export function BookmarkList({ bookmarks, onOpen, onEdit, onDelete }: BookmarkListProps): JSX.Element {
    return (
        <div className="flex min-h-0 min-w-0 flex-1 flex-col">
            <div className="flex h-9 shrink-0 items-center gap-1.5 px-3">
                <span className="font-semibold">我的收藏</span>
                <Badge variant="secondary">{bookmarks.length}</Badge>
            </div>
            <ScrollArea className="min-h-0 min-w-0 flex-1 p-3">
                {bookmarks.length === 0 ? (
                    <Empty className="gap-2 py-8">
                        <EmptyHeader>
                            <EmptyMedia variant="icon">
                                <Info />
                            </EmptyMedia>
                            <EmptyDescription>还没有收藏，点击视图标题栏的 + 添加一个常用网址。</EmptyDescription>
                        </EmptyHeader>
                    </Empty>
                ) : (
                    <ItemGroup className="gap-2">
                        {bookmarks.map((bookmark) => (
                            <BookmarkItem
                                key={bookmark.id}
                                bookmark={bookmark}
                                onOpen={onOpen}
                                onEdit={onEdit}
                                onDelete={onDelete}
                            />
                        ))}
                    </ItemGroup>
                )}
            </ScrollArea>
        </div>
    )
}
