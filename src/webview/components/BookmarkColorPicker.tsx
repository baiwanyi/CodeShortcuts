/**
 * 收藏背景色下拉菜单。
 * 选项来自 shared/types 的 BOOKMARK_COLOR_KEYS，色块 class 与短名来自 lib/icons；白名单校验收敛在本组件内。
 * 注意：触发器与菜单项取同一份色块样式，保证选前选后颜色一致；新增颜色须同步更新三处映射。
 */
import { cn } from 'cn'
import { ChevronDown } from 'lucide-react'
import { Button } from '@components/ui/button'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuRadioGroup,
    DropdownMenuRadioItem,
    DropdownMenuTrigger,
} from '@components/ui/dropdown-menu'
import type { BookmarkColorKey } from '@shared/types'
import { BOOKMARK_COLOR_KEYS, isBookmarkColorKey } from '@shared/types'
import { BOOKMARK_COLOR_CLASSES, BOOKMARK_COLOR_LABELS } from '@webview/lib/icons'
import type { JSX } from 'react'

/** 菜单固定宽度：色块与名称并排，比触发器略宽 */
const MENU_WIDTH = 'w-32'

/** 触发器与菜单项共用的圆形色块 */
function ColorSwatch({ color }: { color: BookmarkColorKey }): JSX.Element {
    return (
        <span className={cn('size-3.5 shrink-0 rounded-full border border-black/10', BOOKMARK_COLOR_CLASSES[color])} />
    )
}

interface BookmarkColorPickerProps {
    value: BookmarkColorKey
    onChange: (value: BookmarkColorKey) => void
}

export function BookmarkColorPicker({ value, onChange }: BookmarkColorPickerProps): JSX.Element {
    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="justify-between" aria-label="背景色">
                    <span className="flex items-center gap-1.5">
                        <ColorSwatch color={value} />
                        {BOOKMARK_COLOR_LABELS[value]}
                    </span>
                    <ChevronDown data-icon="inline-end" className="text-muted-foreground" />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className={`${MENU_WIDTH} max-h-60 overflow-y-auto`} align="start">
                <DropdownMenuRadioGroup
                    value={value}
                    onValueChange={(next) => {
                        if (isBookmarkColorKey(next)) {
                            onChange(next)
                        }
                    }}
                >
                    {BOOKMARK_COLOR_KEYS.map((key) => (
                        <DropdownMenuRadioItem key={key} value={key}>
                            <ColorSwatch color={key} />
                            {BOOKMARK_COLOR_LABELS[key]}
                        </DropdownMenuRadioItem>
                    ))}
                </DropdownMenuRadioGroup>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}
