import { useState, useCallback } from 'react'
import { type ToastProps } from '@/components/ui/Toast'

export interface Toast extends Omit<ToastProps, 'onClose'> {
  id: string
}

let count = 0

function genId() {
  count = (count + 1) % Number.MAX_VALUE
  return count.toString()
}

export function useToast() {
  const [toasts, setToasts] = useState<Toast[]>([])

  const toast = useCallback(({ ...props }: Omit<Toast, 'id'>) => {
    const id = genId()
    const newToast = { ...props, id, variant: props.variant || 'default' }
    
    setToasts((currentToasts) => [newToast, ...currentToasts].slice(0, 5))
    
    // Auto dismiss after 5 seconds
    setTimeout(() => {
      setToasts((currentToasts) => 
        currentToasts.filter((toast) => toast.id !== id)
      )
    }, 5000)

    return {
      id,
      dismiss: () => setToasts((currentToasts) => 
        currentToasts.filter((toast) => toast.id !== id)
      ),
    }
  }, [])

  const dismiss = useCallback((toastId: string) => {
    setToasts((currentToasts) => 
      currentToasts.filter((toast) => toast.id !== toastId)
    )
  }, [])

  return {
    toasts,
    toast,
    dismiss,
  }
} 