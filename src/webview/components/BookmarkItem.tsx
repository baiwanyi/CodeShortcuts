/**
 * 收藏条目：整行即打开入口，左侧展示用户选择的图标与背景色，与提示词/工具动作区分。
 * 图标与颜色只存稳定字符串键，展示时经 lib/icons 映射到 lucide 组件与 Tailwind class；
 * 编辑与删除放在「更多」菜单里，由列表注入回调；网址以说明文字常显，便于打开前确认目标。
 * 注意：Radix 打开菜单时会阻止 pointerdown 的默认行为，紧随其后的 click 可能落到整行容器上；
 * 菜单开合刷新时间戳并在保护窗口内吞掉整行点击，触发按钮自身也阻止冒泡，双重避免误开浏览器。
 */
import { cn } from 'cn'
import { ChevronRight, MoreHorizontal, Pencil, Trash2 } from 'lucide-react'
import { useRef } from 'react'
import { Button } from '@components/ui/button'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@components/ui/dropdown-menu'
import { Item, ItemActions, ItemContent, ItemDescription, ItemMedia, ItemTitle } from '@components/ui/item'
import type { Bookmark } from '@shared/types'
import { BOOKMARK_COLOR_CLASSES, BOOKMARK_ICON_MAP } from '@webview/lib/icons'
import type { JSX, MouseEvent } from 'react'

/** 菜单开合后的保护窗口：此期间的整行点击视为菜单交互，不进入打开网址 */
const MENU_GUARD_MS = 300

/** 行内交互元素自己处理点击，命中这些节点时不触发整行打开 */
const INTERACTIVE_SELECTOR = 'button, a, input, [role="menu"], [role="menuitem"]'

interface BookmarkItemProps {
    bookmark: Bookmark
    onOpen: (id: string) => void
    onEdit: (id: string) => void
    onDelete: (id: string) => void
}

export function BookmarkItem({ bookmark, onOpen, onEdit, onDelete }: BookmarkItemProps): JSX.Element {
    const menuTouchedAtRef = useRef(0)
    const Icon = BOOKMARK_ICON_MAP[bookmark.icon]

    const handleMenuOpenChange = (): void => {
        menuTouchedAtRef.current = Date.now()
    }

    const handleRowClick = (event: MouseEvent<HTMLDivElement>): void => {
        if (Date.now() - menuTouchedAtRef.current < MENU_GUARD_MS) {
            return
        }
        const target = event.target
        if (target instanceof Element && target.closest(INTERACTIVE_SELECTOR)) {
            return
        }
        onOpen(bookmark.id)
    }

    return (
        <Item variant="outline" className="cursor-pointer hover:bg-accent" onClick={handleRowClick}>
            <ItemMedia
                variant="image"
                className={cn(
                    BOOKMARK_COLOR_CLASSES[bookmark.color],
                    bookmark.color === 'white' ? 'text-gray-800' : 'text-white',
                )}
            >
                <Icon className="size-5" />
            </ItemMedia>
            <ItemContent className="min-w-0">
                <ItemTitle className="min-w-0">
                    <span className="truncate">{bookmark.label}</span>
                </ItemTitle>
                <ItemDescription className="truncate text-xs">{bookmark.url}</ItemDescription>
            </ItemContent>
            <ItemActions onClick={(event): void => event.stopPropagation()}>
                <DropdownMenu onOpenChange={handleMenuOpenChange}>
                    <DropdownMenuTrigger asChild>
                        <Button
                            variant="ghost"
                            size="icon-xs"
                            className="text-muted-foreground"
                            aria-label={`「${bookmark.label}」的更多操作`}
                            onClick={(event): void => event.stopPropagation()}
                        >
                            <MoreHorizontal />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuGroup>
                            <DropdownMenuItem
                                onSelect={(): void => {
                                    onEdit(bookmark.id)
                                }}
                            >
                                <Pencil />
                                编辑
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                                variant="destructive"
                                onSelect={(): void => {
                                    onDelete(bookmark.id)
                                }}
                            >
                                <Trash2 />
                                删除
                            </DropdownMenuItem>
                        </DropdownMenuGroup>
                    </DropdownMenuContent>
                </DropdownMenu>
            </ItemActions>
            <ChevronRight className="size-3.5 shrink-0 text-muted-foreground" />
        </Item>
    )
}
