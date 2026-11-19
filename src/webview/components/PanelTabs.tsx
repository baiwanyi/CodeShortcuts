/**
 * 面板顶部的分区切换：提示词 / 系统命令 / 收藏夹。
 * 使用 shadcn Tabs 的 line 变体，Tab 语义、键盘导航与激活下划线由 Radix 和组件样式负责；
 * Bootstrap 只持有受控的选中值，内容渲染与数据订阅仍留在 Bootstrap。
 * 容量徽章从 PromptHeader 移到这里，与分区切换并列常驻，不随标签内容切换而隐藏。
 * 注意：三个标签等宽铺满，窄侧栏下文字用 truncate 收窄而不换行；焦点环在此处覆盖为无，避免窄面板里的视觉干扰。
 */
import { PromptHeaderCapacity } from '@components/PromptHeaderCapacity'
import { Tabs, TabsList, TabsTrigger } from '@components/ui/tabs'
import type { JSX } from 'react'

/** 面板分区标识，与 Bootstrap 的内容分支共用 */
export type PanelTab = 'prompts' | 'tools' | 'bookmarks'

interface PanelTabEntry {
    key: PanelTab
    label: string
}

/** 标签顺序即展示顺序，新增分区只改这一处 */
const TAB_ENTRIES: readonly PanelTabEntry[] = [
    { key: 'prompts', label: '提示词' },
    { key: 'tools', label: '系统命令' },
    { key: 'bookmarks', label: '收藏夹' },
]

interface PanelTabsProps {
    value: PanelTab
    onChange: (value: PanelTab) => void
    /** 整份提示词列表的字节数，交给容量徽章展示 */
    usedBytes: number
}

export function PanelTabs({ value, onChange, usedBytes }: PanelTabsProps): JSX.Element {
    return (
        <div className="flex shrink-0 items-center gap-2 px-3 pb-2">
            <Tabs value={value} onValueChange={(next): void => onChange(next as PanelTab)} className="min-w-0 flex-1">
                <TabsList variant="line" className="w-full">
                    {TAB_ENTRIES.map((entry) => (
                        <TabsTrigger
                            key={entry.key}
                            value={entry.key}
                            className="min-w-0 focus-visible:border-transparent focus-visible:ring-0 focus-visible:outline-none"
                        >
                            <span className="truncate">{entry.label}</span>
                        </TabsTrigger>
                    ))}
                </TabsList>
            </Tabs>
            <PromptHeaderCapacity usedBytes={usedBytes} />
        </div>
    )
}
