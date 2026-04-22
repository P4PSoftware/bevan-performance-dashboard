import React from "react";

type BadgeProps = React.HTMLAttributes<HTMLDivElement> & {
  variant?: string;
};

export function Badge({ className = "", ...props }: BadgeProps) {
  return <div className={`inline-flex items-center text-xs font-medium ${className}`} {...props} />;
}