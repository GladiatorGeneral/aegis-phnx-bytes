import * as React from "react"
import { cn } from "@/lib/utils"

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link'
    size?: 'default' | 'sm' | 'lg' | 'icon'
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "default", size = "default", ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
           // Dark mode styled variants
           variant === "default" && "bg-blue-600 text-white hover:bg-blue-700 shadow-md",
           variant === "destructive" && "bg-red-600 text-white hover:bg-red-700 shadow-sm",
           variant === "outline" && "border border-white/20 bg-transparent hover:bg-white/10 text-white",
           variant === "secondary" && "bg-gray-800 text-white hover:bg-gray-700 shadow-sm",
           variant === "ghost" && "hover:bg-white/10 text-white",
           variant === "link" && "text-blue-400 underline-offset-4 hover:underline",
           
           size === "default" && "h-10 px-4 py-2",
           size === "sm" && "h-9 rounded-md px-3",
           size === "lg" && "h-11 rounded-md px-8",
           size === "icon" && "h-10 w-10",
          className
        )}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button }
