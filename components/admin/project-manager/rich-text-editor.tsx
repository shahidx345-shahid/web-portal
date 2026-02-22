'use client'

import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Underline from '@tiptap/extension-underline'
import TextAlign from '@tiptap/extension-text-align'
import Link from '@tiptap/extension-link'
import CodeBlock from '@tiptap/extension-code-block'
import Highlight from '@tiptap/extension-highlight'
import Placeholder from '@tiptap/extension-placeholder'
import { useEffect, useCallback, useState } from 'react'
import { cn } from '@/lib/utils'
import {
    Bold, Italic, Underline as UnderlineIcon, Link as LinkIcon,
    Code, Highlighter, AlignLeft, AlignCenter, AlignRight, AlignJustify,
    List, ListOrdered, Undo2, Redo2, Minus,
    Heading1, Heading2, Heading3, Type, Eye, Edit3
} from 'lucide-react'

// ─── Toolbar button ───────────────────────────────────────────────────────────

function ToolBtn({
    onClick, active, title, children, disabled,
}: {
    onClick: () => void; active?: boolean; title: string; children: React.ReactNode; disabled?: boolean
}) {
    return (
        <button
            type="button"
            onMouseDown={e => { e.preventDefault(); onClick() }}
            title={title}
            disabled={disabled}
            className={cn(
                'p-1.5 rounded-lg transition-all duration-150 flex items-center justify-center flex-shrink-0',
                'hover:bg-accent hover:text-accent-foreground',
                active
                    ? 'bg-violet-500/15 text-violet-700 dark:text-violet-300'
                    : 'text-foreground/70',
                disabled && 'opacity-30 cursor-not-allowed pointer-events-none'
            )}
        >
            {children}
        </button>
    )
}

function Divider() {
    return <div className="w-px h-5 bg-border/60 mx-1 flex-shrink-0" />
}

// ─── Props ────────────────────────────────────────────────────────────────────

interface RichTextEditorProps {
    value?: string
    onChange?: (html: string) => void
    placeholder?: string
    minHeight?: number
    className?: string
    readOnly?: boolean
}

// ─── Component ────────────────────────────────────────────────────────────────

export function RichTextEditor({
    value, onChange, placeholder = 'Start writing…', minHeight = 220, className, readOnly,
}: RichTextEditorProps) {
    const [isPreview, setIsPreview] = useState(false)

    const editor = useEditor({
        immediatelyRender: false,
        extensions: [
            StarterKit.configure({
                heading: { levels: [1, 2, 3] },
                codeBlock: false,
            }),
            Underline,
            TextAlign.configure({ types: ['heading', 'paragraph'] }),
            Link.configure({ openOnClick: false, autolink: true }),
            CodeBlock.configure({ languageClassPrefix: 'language-' }),
            Highlight.configure({ multicolor: false }),
            Placeholder.configure({
                placeholder,
                emptyEditorClass: 'is-editor-empty',
            }),
        ],
        content: value || '',
        editable: !readOnly,
        onUpdate({ editor }) {
            onChange?.(editor.getHTML())
        },
    })

    // Sync external value changes
    useEffect(() => {
        if (editor && value !== undefined && editor.getHTML() !== value) {
            editor.commands.setContent(value)
        }
    }, [value, editor])

    const setLink = useCallback(() => {
        if (!editor) return
        const prev = editor.getAttributes('link').href
        const url = window.prompt('Enter URL', prev)
        if (url === null) return
        if (url === '') { editor.chain().focus().unsetLink().run(); return }
        editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run()
    }, [editor])

    if (!editor) return null

    const btn = (fn: () => void, active: boolean, title: string, Icon: React.ElementType) => (
        <ToolBtn onClick={fn} active={active} title={title}>
            <Icon className="w-4 h-4" />
        </ToolBtn>
    )

    return (
        <div className={cn('rounded-xl border border-border/50 overflow-hidden bg-background shadow-sm', className)}>

            {/* ── Toolbar ─────────────────────────────────────────────────── */}
            {!readOnly && (
                <div className="flex items-center justify-between px-3 py-2 border-b border-border/40 bg-muted/5">
                    <div className="flex items-center flex-wrap gap-0.5">
                        {/* History */}
                        <ToolBtn onClick={() => editor.chain().focus().undo().run()}
                            title="Undo (Ctrl+Z)" disabled={!editor.can().undo()}>
                            <Undo2 className="w-4 h-4" />
                        </ToolBtn>
                        <ToolBtn onClick={() => editor.chain().focus().redo().run()}
                            title="Redo (Ctrl+Y)" disabled={!editor.can().redo()}>
                            <Redo2 className="w-4 h-4" />
                        </ToolBtn>

                        <Divider />

                        {/* Headings */}
                        {btn(() => editor.chain().focus().setParagraph().run(),
                            editor.isActive('paragraph') && !editor.isActive('heading'), 'Paragraph', Type)}
                        {btn(() => editor.chain().focus().toggleHeading({ level: 1 }).run(),
                            editor.isActive('heading', { level: 1 }), 'Heading 1', Heading1)}
                        {btn(() => editor.chain().focus().toggleHeading({ level: 2 }).run(),
                            editor.isActive('heading', { level: 2 }), 'Heading 2', Heading2)}
                        {btn(() => editor.chain().focus().toggleHeading({ level: 3 }).run(),
                            editor.isActive('heading', { level: 3 }), 'Heading 3', Heading3)}

                        <Divider />

                        {/* Inline marks */}
                        {btn(() => editor.chain().focus().toggleBold().run(),
                            editor.isActive('bold'), 'Bold', Bold)}
                        {btn(() => editor.chain().focus().toggleItalic().run(),
                            editor.isActive('italic'), 'Italic', Italic)}
                        {btn(() => editor.chain().focus().toggleUnderline().run(),
                            editor.isActive('underline'), 'Underline', UnderlineIcon)}
                        {btn(() => editor.chain().focus().toggleHighlight().run(),
                            editor.isActive('highlight'), 'Highlight', Highlighter)}
                        <ToolBtn onClick={setLink} active={editor.isActive('link')} title="Insert Link">
                            <LinkIcon className="w-4 h-4" />
                        </ToolBtn>

                        <Divider />

                        {/* Alignment */}
                        {btn(() => editor.chain().focus().setTextAlign('left').run(),
                            editor.isActive({ textAlign: 'left' }), 'Align Left', AlignLeft)}
                        {btn(() => editor.chain().focus().setTextAlign('center').run(),
                            editor.isActive({ textAlign: 'center' }), 'Align Centre', AlignCenter)}
                    </div>

                    <div className="flex items-center gap-2 ml-4">
                        <button
                            type="button"
                            onClick={() => setIsPreview(!isPreview)}
                            className={cn(
                                "flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-all",
                                isPreview
                                    ? "bg-violet-600 text-white shadow-md shadow-violet-500/20"
                                    : "bg-muted text-muted-foreground hover:bg-muted/80"
                            )}
                        >
                            {isPreview ? <Edit3 className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                            {isPreview ? 'Back to Editor' : 'Preview'}
                        </button>
                    </div>
                </div>
            )}

            {/* ── Editor area ──────────────────────────────────────────────── */}
            <div className="relative bg-card/10">
                {isPreview ? (
                    <div
                        className="rich-editor-content p-6 prose-slate dark:prose-invert max-w-none overflow-y-auto"
                        style={{ minHeight }}
                        dangerouslySetInnerHTML={{ __html: value || '' }}
                    />
                ) : (
                    <EditorContent
                        editor={editor}
                        className="rich-editor-content"
                        style={{ minHeight }}
                    />
                )}
            </div>
        </div>
    )
}
