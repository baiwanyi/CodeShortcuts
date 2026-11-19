/**
 * 提示词标题区：连接状态指示、条数徽标与按需展开的搜索。
 * 连接语义由 lib/connection-state 产出、展开态由 useSearchOverlay 承接，本组件只做布局装配。
 * 容量徽章已移至 PanelTabs 与分区切换并列显示，本组件不再接收用量字段。
 * 注意：覆盖层必须给不透明背景，否则下层标题会透出；展开时标题行用 invisible 保留占位，
 * 不能改成条件渲染，否则行宽/行高跳动会让搜索框位移。
 */
import { cn } from 'cn'
import { PromptHeaderConnection } from '@components/PromptHeaderConnection'
import { PromptHeaderSearch } from '@components/PromptHeaderSearch'
import { Badge } from '@components/ui/badge'
import type { CodeBuddyStatus } from '@shared/types'
import { useSearchOverlay } from '@webview/hooks/useSearchOverlay'
import { describeConnection } from '@webview/lib/connection-state'
import type { JSX } from 'react'

interface PromptHeaderProps {
    codebuddy: CodeBuddyStatus
    /** 提示词总数，展示在标题右侧 */
    count: number
    query: string
    onQueryChange: (value: string) => void
}

export function PromptHeader({ codebuddy, count, query, onQueryChange }: PromptHeaderProps): JSX.Element {
    const connection = describeConnection(codebuddy)
    const search = useSearchOverlay(query, onQueryChange)

    return (
        <header className="shrink-0 px-3">
            <div className="relative flex h-9 items-center gap-1.5">
                <div className={cn('flex min-w-0 items-center gap-1.5', search.isOpen && 'invisible')}>
                    <PromptHeaderConnection tone={connection.tone} text={connection.text} />
                    <span className="font-semibold">提示词</span>
                    <Badge variant="secondary">{count}</Badge>
                </div>

                <PromptHeaderSearch search={search} query={query} onQueryChange={onQueryChange} />
            </div>
        </header>
    )
}
