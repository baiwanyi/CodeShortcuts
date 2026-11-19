/**
 * 自定义滚动容器（shadcn registry 官方实现）。
 * 滚动条样式与 Viewport 由组件内部维护，调用方只需控制容器高度。
 * 注意：容器必须有确定高度（父级 flex-1 + min-h-0），否则不会产生内部滚动；
 * Radix 内容层默认按内容最大宽度铺开，长文本会把整行顶出视口，这里把内容层固定为视口宽度，
 * 让条目的 w-full 与 truncate 在可用宽度内生效，纵向高度仍由内容决定、不影响滚动测量。
 */
import * as React from 'react'
import { cn } from 'cn'
import { ScrollArea as ScrollAreaPrimitive } from 'radix-ui'

function ScrollArea({ className, children, ...props }: React.ComponentProps<typeof ScrollAreaPrimitive.Root>) {
    return (
        <ScrollAreaPrimitive.Root data-slot="scroll-area" className={cn('relative', className)} {...props}>
            <ScrollAreaPrimitive.Viewport
                data-slot="scroll-area-viewport"
                className="size-full rounded-[inherit] transition-[color,box-shadow] outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50 focus-visible:outline-1 [&>div]:block! [&>div]:min-w-0! [&>div]:w-full!"
            >
                {children}
            </ScrollAreaPrimitive.Viewport>
            <ScrollBar />
            <ScrollAreaPrimitive.Corner />
        </ScrollAreaPrimitive.Root>
    )
}

function ScrollBar({
    className,
    orientation = 'vertical',
    ...props
}: React.ComponentProps<typeof ScrollAreaPrimitive.ScrollAreaScrollbar>) {
    return (
        <ScrollAreaPrimitive.ScrollAreaScrollbar
            data-slot="scroll-area-scrollbar"
            data-orientation={orientation}
            orientation={orientation}
            className={cn(
                'flex touch-none p-px transition-colors select-none data-horizontal:h-2.5 data-horizontal:flex-col data-horizontal:border-t data-horizontal:border-t-transparent data-vertical:h-full data-vertical:w-2.5 data-vertical:border-l data-vertical:border-l-transparent',
                className,
            )}
            {...props}
        >
            <ScrollAreaPrimitive.ScrollAreaThumb
                data-slot="scroll-area-thumb"
                className="relative flex-1 rounded-full bg-border"
            />
        </ScrollAreaPrimitive.ScrollAreaScrollbar>
    )
}

export { ScrollArea, ScrollBar }
