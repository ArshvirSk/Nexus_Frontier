import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center font-orbitron transition-all duration-200 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-neon-purple disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default:
          "bg-neon-purple text-white hover:bg-neon-purple/80 hover:shadow-[0_0_15px_rgba(176,38,255,0.5)]",
        destructive:
          "bg-neon-red text-white hover:bg-neon-red/80 hover:shadow-[0_0_15px_rgba(255,43,43,0.5)]",
        outline:
          "border border-neon-blue bg-transparent hover:bg-neon-blue/10 hover:shadow-[0_0_15px_rgba(0,243,255,0.3)]",
        secondary:
          "bg-neon-blue text-white hover:bg-neon-blue/80 hover:shadow-[0_0_15px_rgba(0,243,255,0.5)]",
        ghost:
          "hover:bg-neon-purple/10 hover:text-neon-purple",
        link: "text-neon-blue underline-offset-4 hover:underline",
        success:
          "bg-neon-green text-white hover:bg-neon-green/80 hover:shadow-[0_0_15px_rgba(15,255,80,0.5)]",
        green:
          "focus:outline-none text-white bg-green-700 hover:bg-green-800 focus:ring-4 focus:ring-green-300 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800",
        icon: "border bg-background hover:bg-accent hover:text-accent-foreground",
      },
      size: {
        default: "h-9 px-4 py-2",
        sm: "h-8 rounded-md px-3 text-sm",
        lg: "h-10 rounded-lg px-8 text-lg",
        icon: "h-9 w-9",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(
          buttonVariants({ variant, size, className }),
          "transform hover:-translate-y-0.5"
        )}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
