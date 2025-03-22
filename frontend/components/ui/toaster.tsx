import {
  Toast,
  ToastClose,
  ToastDescription,
  ToastProvider,
  ToastTitle,
  ToastViewport,
} from "@/components/ui/toast"
import { useToast } from "@/components/ui/use-toast"

export function Toaster() {
  const { toasts } = useToast()

  return (
    <ToastProvider>
      {toasts.map(function ({ id, title, description, action, ...props }) {
        return (
          <Toast key={id} {...props}>
            <div className="grid gap-2">
              {title && (
                <ToastTitle className="text-sm font-cyber tracking-wide">
                  {title}
                </ToastTitle>
              )}
              {description && (
                <ToastDescription className="text-sm text-cyan-300/80">
                  {description}
                </ToastDescription>
              )}
            </div>
            {action}
            <ToastClose className="hover:text-cyan-400 focus:text-cyan-400" />
          </Toast>
        )
      })}
      <ToastViewport className="sm:right-4 sm:bottom-4" />
    </ToastProvider>
  )
}
