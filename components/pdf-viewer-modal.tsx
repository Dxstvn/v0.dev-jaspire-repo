"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { X, Loader2 } from "lucide-react"

interface PdfViewerModalProps {
  isOpen: boolean
  onClose: () => void
  pdfUrl: string
  title: string
}

export function PdfViewerModal({ isOpen, onClose, pdfUrl, title }: PdfViewerModalProps) {
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (isOpen) {
      setLoading(true)
    }
  }, [isOpen])

  const handleIframeLoad = () => {
    setLoading(false)
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-4xl w-[90vw] h-[80vh] max-h-[80vh] p-0 overflow-hidden">
        <DialogHeader className="p-4 border-b flex-row justify-between items-center">
          <DialogTitle>{title}</DialogTitle>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </DialogHeader>
        <div className="relative flex-1 h-full">
          {loading && (
            <div className="absolute inset-0 flex items-center justify-center bg-background/80 z-10">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          )}
          <iframe
            src={`${pdfUrl}#toolbar=0&navpanes=0`}
            className="w-full h-full"
            onLoad={handleIframeLoad}
            title={title}
          />
        </div>
      </DialogContent>
    </Dialog>
  )
}
