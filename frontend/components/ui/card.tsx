import { HTMLAttributes, forwardRef } from "react";
import { VariantProps, cva } from "class-variance-authority";
import { cn } from "@/lib/utils";

const cardVariants = cva(
  "rounded-lg border bg-dark-gray text-white transition-all duration-200",
  {
    variants: {
      variant: {
        default: "border-neon-blue shadow-[0_0_10px_rgba(0,243,255,0.2)]",
        purple: "border-neon-purple shadow-[0_0_10px_rgba(176,38,255,0.2)]",
        success: "border-neon-green shadow-[0_0_10px_rgba(15,255,80,0.2)]",
        destructive: "border-neon-red shadow-[0_0_10px_rgba(255,43,43,0.2)]",
      },
      hover: {
        true: "hover:shadow-[0_0_20px_rgba(0,243,255,0.3)] hover:-translate-y-0.5",
        false: "",
      },
      glass: {
        true: "bg-dark-gray/50 backdrop-blur",
        false: "",
      },
    },
    defaultVariants: {
      variant: "default",
      hover: false,
      glass: false,
    },
  }
);

export interface CardProps
  extends HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof cardVariants> {}

const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ className, variant, hover, glass, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(cardVariants({ variant, hover, glass, className }))}
      {...props}
    />
  )
);
Card.displayName = "Card";

const CardHeader = forwardRef<
  HTMLDivElement,
  HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex flex-col space-y-1.5 p-6 font-cyber", className)}
    {...props}
  />
));
CardHeader.displayName = "CardHeader";

const CardTitle = forwardRef<
  HTMLParagraphElement,
  HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h3
    ref={ref}
    className={cn(
      "text-2xl font-cyber font-semibold leading-none tracking-tight text-neon-purple",
      className
    )}
    {...props}
  />
));
CardTitle.displayName = "CardTitle";

const CardDescription = forwardRef<
  HTMLParagraphElement,
  HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn("text-sm text-neon-blue/80", className)}
    {...props}
  />
));
CardDescription.displayName = "CardDescription";

const CardContent = forwardRef<
  HTMLDivElement,
  HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("p-6 pt-0", className)} {...props} />
));
CardContent.displayName = "CardContent";

const CardFooter = forwardRef<
  HTMLDivElement,
  HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex items-center p-6 pt-0", className)}
    {...props}
  />
));
CardFooter.displayName = "CardFooter";

export { Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent };
