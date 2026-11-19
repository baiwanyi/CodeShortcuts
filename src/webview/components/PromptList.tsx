/**
 * 提示词分区：标题区 + 渲染筛选结果的滚动列表，逐项操作由回调转发。
 * 标题参数由 Bootstrap 透传，列表本层不订阅状态；排序可用性取自模板在原列表中的位置，
 * 搜索态下一律禁止排序，否则移动结果会与用户看到的顺序不符。
 * 注意：位置索引通过 id → 原序索引的 Map 预建，避免在 map 内逐项 findIndex 造成 O(n²)；
 * 空态文案需区分「一条都没有」与「没有匹配」，两者对应的下一步动作完全不同；
 * 环境维护动作由 ToolList 固定在面板底部，不进入本列表，也就不受搜索与排序影响。
 */
import { Info } from 'lucide-react'
import { useMemo } from 'react'
import { PromptHeader } from '@components/PromptHeader'
import { PromptItem } from '@components/PromptItem'
import { Empty, EmptyDescription, EmptyHeader, EmptyMedia } from '@components/ui/empty'
import { ItemGroup } from '@components/ui/item'
import { ScrollArea } from '@components/ui/scroll-area'
import type { CodeBuddyStatus, MoveDirection, PromptTemplate } from '@shared/types'
import type { JSX } from 'react'

interface PromptListProps {
    codebuddy: CodeBuddyStatus
    /** 提示词总数，交给标题区展示 */
    count: number
    query: string
    onQueryChange: (value: string) => void
    /** 全量模板，用于判断是「还没有提示词」还是「没有匹配」以及计算排序边界 */
    prompts: PromptTemplate[]
    /** 当前要渲染的模板（筛选结果或全量） */
    items: PromptTemplate[]
    isFiltering: boolean
    onRun: (id: string) => void
    onCopy: (id: string) => void
    onEdit: (id: string) => void
    onDelete: (id: string) => void
    onMove: (id: string, direction: MoveDirection) => void
}

export function PromptList({
    codebuddy,
    count,
    query,
    onQueryChange,
    prompts,
    items,
    isFiltering,
    onRun,
    onCopy,
    onEdit,
    onDelete,
    onMove,
}: PromptListProps): JSX.Element {
    const indexById = useMemo(
        () => new Map<string, number>(prompts.map((item, index): [string, number] => [item.id, index])),
        [prompts],
    )

    return (
        <>
            <PromptHeader codebuddy={codebuddy} count={count} query={query} onQueryChange={onQueryChange} />
            <ScrollArea className="min-h-0 flex-1 p-3">
                {items.length === 0 ? (
                    <Empty className="gap-2 py-8">
                        <EmptyHeader>
                            <EmptyMedia variant="icon">
                                <Info />
                            </EmptyMedia>
                            <EmptyDescription>
                                {prompts.length === 0
                                    ? '还没有提示词，点击视图标题栏的 + 新建一条。'
                                    : '没有匹配的提示词。'}
                            </EmptyDescription>
                        </EmptyHeader>
                    </Empty>
                ) : (
                    <ItemGroup className="gap-2">
                        {items.map((prompt) => {
                            const index = indexById.get(prompt.id) ?? -1
                            // 位置规则留在列表层：搜索态下一律不可移动，否则结果顺序会与排序动作不符
                            const canMove = (direction: MoveDirection): boolean => {
                                if (isFiltering || index < 0) {
                                    return false
                                }
                                return direction === 'up' ? index > 0 : index < prompts.length - 1
                            }
                            return (
                                <PromptItem
                                    key={prompt.id}
                                    prompt={prompt}
                                    canMove={canMove}
                                    onRun={onRun}
                                    onCopy={onCopy}
                                    onEdit={onEdit}
                                    onDelete={onDelete}
                                    onMove={onMove}
                                />
                            )
                        })}
                    </ItemGroup>
                )}
            </ScrollArea>
        </>
    )
}
