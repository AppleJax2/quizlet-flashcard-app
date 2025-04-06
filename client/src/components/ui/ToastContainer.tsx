import * as React from 'react'

import { useToast } from '@/hooks/useToast'
import { Toast } from '@/components/ui/Toast'

export function ToastContainer() {
  const { toasts, dismiss } = useToast()

  return (
    <div className="fixed bottom-0 right-0 z-[100] flex max-h-screen w-full flex-col-reverse gap-2 p-4 sm:bottom-0 sm:right-0 sm:top-auto sm:flex-col md:max-w-[420px]">
      {toasts.map(({ id, title, description, variant, ...props }) => (
        <Toast
          key={id}
          variant={variant}
          title={title}
          description={description}
          onClose={() => dismiss(id)}
          {...props}
        />
      ))}
    </div>
  )
} 