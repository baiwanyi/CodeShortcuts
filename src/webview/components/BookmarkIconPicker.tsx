/**
 * 收藏图标下拉菜单。
 * 选项来自 shared/types 的 BOOKMARK_ICON_KEYS，图标实例与短名来自 lib/icons；白名单校验收敛在本组件内。
 * 注意：触发器与菜单项取同一份标签表，避免措辞漂移；菜单内容过高时由 DropdownMenuContent 自带滚动。
 */
import { ChevronDown } from 'lucide-react'
import { Button } from '@components/ui/button'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuRadioGroup,
    DropdownMenuRadioItem,
    DropdownMenuTrigger,
} from '@components/ui/dropdown-menu'
import type { BookmarkIconKey } from '@shared/types'
import { BOOKMARK_ICON_KEYS, isBookmarkIconKey } from '@shared/types'
import { BOOKMARK_ICON_LABELS, BOOKMARK_ICON_MAP } from '@webview/lib/icons'
import type { JSX } from 'react'

/** 菜单固定宽度：容纳图标与名称，超出部分由内容区滚动处理 */
const MENU_WIDTH = 'w-40'

interface BookmarkIconPickerProps {
    value: BookmarkIconKey
    onChange: (value: BookmarkIconKey) => void
}

export function BookmarkIconPicker({ value, onChange }: BookmarkIconPickerProps): JSX.Element {
    const CurrentIcon = BOOKMARK_ICON_MAP[value]

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="justify-between" aria-label="图标">
                    <span className="flex items-center gap-1.5">
                        <CurrentIcon data-icon="inline-start" />
                        {BOOKMARK_ICON_LABELS[value]}
                    </span>
                    <ChevronDown data-icon="inline-end" className="text-muted-foreground" />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className={`${MENU_WIDTH} max-h-60 overflow-y-auto`} align="start">
                <DropdownMenuRadioGroup
                    value={value}
                    onValueChange={(next) => {
                        if (isBookmarkIconKey(next)) {
                            onChange(next)
                        }
                    }}
                >
                    {BOOKMARK_ICON_KEYS.map((key) => {
                        const Icon = BOOKMARK_ICON_MAP[key]
                        return (
                            <DropdownMenuRadioItem key={key} value={key}>
                                <Icon />
                                {BOOKMARK_ICON_LABELS[key]}
                            </DropdownMenuRadioItem>
                        )
                    })}
                </DropdownMenuRadioGroup>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}
