/**
 * 收藏网址的新建/编辑对话框。
 * 协议固定为 https 并由 InputGroup 前缀呈现，表单只存主机与路径；提交时才拼成完整网址交给宿主。
 * 外观由 20 个图标与 10 个背景色组成，通过两个下拉菜单选择，选项取自 shared/types 的白名单与 lib/icons 的映射。
 * 表单状态在渲染期按「props 变化」重置，避免重新打开时先闪一帧旧内容；校验态经 Field 的 data-invalid 与 aria-invalid 成对呈现。
 * 注意：粘贴内容可能自带 http:// 或 https://，输入时立即剥离，避免前缀重复或被改写成非预期协议；
 * 图标与颜色只存稳定字符串键，宿主读档时会按白名单收敛，历史数据缺字段时回落到默认外观。
 */
import { useState } from 'react'
import { BookmarkColorPicker } from '@components/BookmarkColorPicker'
import { BookmarkIconPicker } from '@components/BookmarkIconPicker'
import { Button } from '@components/ui/button'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@components/ui/dialog'
import { Field, FieldDescription, FieldError, FieldGroup, FieldLabel, FieldTitle } from '@components/ui/field'
import { Input } from '@components/ui/input'
import { InputGroup, InputGroupAddon, InputGroupInput, InputGroupText } from '@components/ui/input-group'
import {
    isBookmarkLabelMissing,
    MAX_BOOKMARK_LABEL_LENGTH,
    MAX_BOOKMARK_URL_LENGTH,
    normalizeBookmarkUrl,
} from '@shared/bookmarkValidation'
import { DEFAULT_BOOKMARK_COLOR, DEFAULT_BOOKMARK_ICON } from '@shared/types'
import type { BookmarkDraft } from '@shared/types'
import type { JSX } from 'react'

/** 固定协议前缀，输入框只呈现其后的主机与路径 */
const URL_PREFIX = 'https://'

/** 新建收藏的初始值，外观取共享默认值 */
const EMPTY_DRAFT: BookmarkDraft = {
    label: '',
    url: '',
    icon: DEFAULT_BOOKMARK_ICON,
    color: DEFAULT_BOOKMARK_COLOR,
}

/** 去掉粘贴内容自带的协议（大小写不敏感），让输入框只保留主机与路径 */
function stripProtocol(value: string): string {
    return value.trim().replace(/^https?:\/\//iu, '')
}

interface BookmarkEditorDialogProps {
    open: boolean
    draft: BookmarkDraft | null
    onOpenChange: (open: boolean) => void
    onSubmit: (draft: BookmarkDraft) => void
}

export function BookmarkEditorDialog({ open, draft, onOpenChange, onSubmit }: BookmarkEditorDialogProps): JSX.Element {
    const [form, setForm] = useState<BookmarkDraft>(() =>
        draft ? { ...draft, url: stripProtocol(draft.url) } : EMPTY_DRAFT,
    )
    const [isTouched, setIsTouched] = useState(false)
    const [syncSource, setSyncSource] = useState<{ draft: BookmarkDraft | null; open: boolean }>({ draft, open })

    // 切换编辑对象或重新打开时重置表单：条件只成立一次，不会形成渲染循环
    if (syncSource.draft !== draft || syncSource.open !== open) {
        setSyncSource({ draft, open })
        setForm(draft ? { ...draft, url: stripProtocol(draft.url) } : EMPTY_DRAFT)
        setIsTouched(false)
    }

    const trimmedUrl = form.url.trim()
    const fullUrl = `${URL_PREFIX}${trimmedUrl}`
    const isUrlValid = normalizeBookmarkUrl(fullUrl) !== null
    const isLabelInvalid = isTouched && isBookmarkLabelMissing(form.label)
    const urlError = isTouched && !isUrlValid ? (trimmedUrl === '' ? '网址不能为空' : '请输入有效的网址') : null

    const handleSubmit = (): void => {
        setIsTouched(true)
        if (isBookmarkLabelMissing(form.label) || trimmedUrl === '' || !isUrlValid) {
            return
        }
        onSubmit({ ...form, label: form.label.trim(), url: fullUrl })
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent showCloseButton={false} className="px-2 py-4">
                <DialogHeader>
                    <DialogTitle>{draft?.id ? '编辑收藏' : '新建收藏'}</DialogTitle>
                    <DialogDescription>常用网址，点击即在 VS Code 浏览器中打开。</DialogDescription>
                </DialogHeader>

                <FieldGroup className="gap-3">
                    <Field data-invalid={isLabelInvalid}>
                        <FieldLabel htmlFor="bookmark-label">名称</FieldLabel>
                        <Input
                            id="bookmark-label"
                            value={form.label}
                            maxLength={MAX_BOOKMARK_LABEL_LENGTH}
                            placeholder="例如：组件文档"
                            aria-invalid={isLabelInvalid}
                            onChange={(event) => setForm((prev) => ({ ...prev, label: event.target.value }))}
                        />
                        <FieldError>{isLabelInvalid ? '名称不能为空' : null}</FieldError>
                    </Field>

                    <Field data-invalid={urlError !== null}>
                        <FieldLabel htmlFor="bookmark-url">网址</FieldLabel>
                        <InputGroup>
                            <InputGroupAddon align="inline-start">
                                <InputGroupText>{URL_PREFIX}</InputGroupText>
                            </InputGroupAddon>
                            <InputGroupInput
                                id="bookmark-url"
                                type="text"
                                inputMode="url"
                                value={form.url}
                                maxLength={MAX_BOOKMARK_URL_LENGTH - URL_PREFIX.length}
                                placeholder="example.com"
                                aria-invalid={urlError !== null}
                                onChange={(event) =>
                                    setForm((prev) => ({ ...prev, url: stripProtocol(event.target.value) }))
                                }
                            />
                        </InputGroup>
                        <FieldDescription>
                            默认使用 https；粘贴含 http 或 https 的网址时会自动去掉协议。
                        </FieldDescription>
                        <FieldError>{urlError}</FieldError>
                    </Field>

                    <FieldGroup className="grid grid-cols-2 gap-3">
                        <Field>
                            <FieldTitle>图标</FieldTitle>
                            <BookmarkIconPicker
                                value={form.icon}
                                onChange={(next) => setForm((prev) => ({ ...prev, icon: next }))}
                            />
                        </Field>

                        <Field>
                            <FieldTitle>背景色</FieldTitle>
                            <BookmarkColorPicker
                                value={form.color}
                                onChange={(next) => setForm((prev) => ({ ...prev, color: next }))}
                            />
                        </Field>
                    </FieldGroup>
                </FieldGroup>

                <DialogFooter>
                    <Button variant="secondary" onClick={() => onOpenChange(false)}>
                        取消
                    </Button>
                    <Button onClick={handleSubmit}>保存</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
