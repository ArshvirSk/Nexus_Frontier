import { VariantProps, cva } from "class-variance-authority";
import { cn } from "@/lib/utils";

const loaderVariants = cva("relative inline-flex", {
  variants: {
    variant: {
      default: "[&>div]:border-neon-blue [&>div]:border-t-transparent",
      purple: "[&>div]:border-neon-purple [&>div]:border-t-transparent",
      success: "[&>div]:border-neon-green [&>div]:border-t-transparent",
      destructive: "[&>div]:border-neon-red [&>div]:border-t-transparent",
    },
    size: {
      default: "h-8 w-8",
      sm: "h-6 w-6",
      lg: "h-12 w-12",
    },
  },
  defaultVariants: {
    variant: "default",
    size: "default",
  },
});

interface LoaderProps extends VariantProps<typeof loaderVariants> {
  className?: string;
}

export function Loader({ variant, size, className }: LoaderProps) {
  return (
    <div className={cn(loaderVariants({ variant, size, className }))}>
      <div className="absolute h-full w-full rounded-full border-4 border-solid animate-[spin_1s_linear_infinite]" />
      <div className="absolute h-full w-full rounded-full border-4 border-solid animate-[spin_3s_linear_infinite] scale-75 opacity-75" />
      <div className="absolute h-full w-full rounded-full border-4 border-solid animate-[spin_5s_linear_infinite] scale-50 opacity-50" />
    </div>
  );
}

export function LoadingOverlay() {
  return (
    <div className="fixed inset-0 bg-darker-gray/80 backdrop-blur flex items-center justify-center z-50">
      <div className="text-center">
        <Loader variant="purple" size="lg" />
        <p className="mt-4 font-cyber text-neon-purple animate-pulse">
          Initializing...
        </p>
      </div>
    </div>
  );
}
