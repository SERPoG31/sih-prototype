"use client";

import React from "react";
import { cn } from "@/lib/utils";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost" | "destructive" | "accent" | "ghost-accent";
  size?: "sm" | "md" | "lg" | "icon";
  isLoading?: boolean;
  loading?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      children,
      variant = "primary",
      size = "md",
      isLoading = false,
      loading = false,
      disabled,
      ...props
    },
    ref
  ) => {
    const isBusy = isLoading || loading;
    const baseStyles =
      "inline-flex items-center justify-center font-medium rounded-md transition-colors duration-150 focus:outline-none focus:ring-1 focus:ring-zinc-600 disabled:opacity-40 disabled:cursor-not-allowed select-none active:scale-[0.99] text-xs";

    const variants = {
      primary:
        "bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-semibold shadow-none border-0",
      accent:
        "bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-semibold shadow-none border-0",
      secondary:
        "bg-zinc-900 hover:bg-zinc-800 text-zinc-200 border border-zinc-800 shadow-none",
      outline:
        "bg-transparent hover:bg-zinc-900 text-zinc-300 border border-zinc-800 shadow-none",
      ghost:
        "bg-transparent hover:bg-zinc-900 text-zinc-400 hover:text-zinc-200 shadow-none",
      destructive:
        "bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/30 shadow-none",
      "ghost-accent":
        "bg-zinc-900 hover:bg-zinc-800 text-emerald-400 border border-zinc-800 shadow-none",
    };

    const sizes = {
      sm: "text-xs px-2.5 py-1.5 gap-1.5",
      md: "text-xs px-3.5 py-2 gap-2",
      lg: "text-sm px-4 py-2.5 gap-2",
      icon: "p-1.5 w-8 h-8",
    };

    return (
      <button
        ref={ref}
        disabled={disabled || isBusy}
        className={cn(baseStyles, variants[variant], sizes[size], className)}
        {...props}
      >
        {isBusy && (
          <svg
            className="animate-spin -ml-1 mr-2 h-3.5 w-3.5 text-current"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
        )}
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";
