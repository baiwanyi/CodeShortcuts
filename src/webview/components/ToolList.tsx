/**
 * 环境维护工具分区：按宿主下发的顺序渲染为可滚动列表。
 * 列表自身接管滚动容器，调用方无需再包裹 ScrollArea；没有工具项时整块不渲染，
 * 避免在分区里留下空白滚动区。
 * 注意：滚动区域独占剩余高度；左右内距与 PromptList 的 px-3 对齐，保证两类条目的边缘齐平。
 */
import { ToolItem } from '@components/ToolItem'
import { ItemGroup } from '@components/ui/item'
import { ScrollArea } from '@components/ui/scroll-area'
import type { ToolActionId, ToolActionInfo } from '@shared/types'
import type { JSX } from 'react'

interface ToolListProps {
    /** 上下发的顺序渲染，本层不排序也不过滤 */
    tools: ToolActionInfo[]
    onRun: (id: ToolActionId) => void
}

export function ToolList({ tools, onRun }: ToolListProps): JSX.Element | null {
    if (tools.length === 0) {
        return null
    }

    return (
        <ScrollArea className="min-h-0 flex-1 p-3">
            <ItemGroup className="gap-2">
                {tools.map((tool) => (
                    <ToolItem key={tool.id} tool={tool} onRun={onRun} />
                ))}
            </ItemGroup>
        </ScrollArea>
    )
}
