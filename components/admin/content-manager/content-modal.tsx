'use client'

import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from '@/components/ui/dialog'
import { ContentForm } from './content-form'
import { ScrollArea } from '@/components/ui/scroll-area'

interface ContentModalProps {
    isOpen: boolean
    onClose: () => void
    editingItem?: any
}

export function ContentModal({ isOpen, onClose, editingItem }: ContentModalProps) {
    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-4xl max-h-[90vh] p-0 overflow-hidden border-border/50 bg-background/95 backdrop-blur-2xl shadow-2xl rounded-2xl">
                <div className="p-8 pb-0">
                    <DialogHeader className="mb-6">
                        <DialogTitle className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-indigo-500">
                            {editingItem ? 'Edit Content Item' : 'Create New Unified Content'}
                        </DialogTitle>
                        <DialogDescription className="text-muted-foreground font-medium">
                            Fill in all the details below. This unified system handles Pages, Blogs, Links, and Media in one place.
                        </DialogDescription>
                    </DialogHeader>
                </div>

                <ScrollArea className="max-h-[70vh] px-8 pb-8">
                    <ContentForm onClose={onClose} initialData={editingItem} />
                </ScrollArea>
            </DialogContent>
        </Dialog>
    )
}
