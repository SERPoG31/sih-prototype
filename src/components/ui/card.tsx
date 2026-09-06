import React from "react";
import { cn } from "@/lib/utils";

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "glass" | "bordered";
  glow?: boolean;
}

export function Card({
  className,
  variant = "default",
  glow = false,
  children,
  ...props
}: CardProps) {
  const variantStyles = {
    default: "border border-slate-800/80 bg-slate-900/60 shadow-xl",
    glass: "border border-slate-700/60 bg-slate-900/40 backdrop-blur-xl shadow-2xl",
    bordered: "border border-slate-800 bg-transparent",
  };

  return (
    <div
      className={cn(
        "rounded-xl p-6 backdrop-blur-md text-slate-100 transition-all duration-200",
        variantStyles[variant],
        glow && "card-glow",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

export function CardHeader({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn("flex flex-col space-y-1.5 pb-4", className)} {...props}>
      {children}
    </div>
  );
}

export function CardTitle({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h3
      className={cn(
        "text-lg font-semibold tracking-tight text-white flex items-center gap-2",
        className
      )}
      {...props}
    >
      {children}
    </h3>
  );
}

export function CardDescription({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLParagraphElement>) {
  return (
    <p className={cn("text-xs text-slate-400 leading-relaxed", className)} {...props}>
      {children}
    </p>
  );
}

export function CardContent({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn("pt-1", className)} {...props}>
      {children}
    </div>
  );
}

export function CardFooter({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn("flex items-center pt-4 border-t border-slate-800/60", className)} {...props}>
      {children}
    </div>
  );
}
