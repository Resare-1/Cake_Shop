import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva } from "class-variance-authority";
import { cn } from "../../lib/utils"; // adjust path if needed

// Dropdown variants using your button theme as reference
const dropdownVariants = cva(
  "rounded-md border border-input bg-background text-sm font-medium text-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90",
        outline: "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
        secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
      },
      size: {
        default: "h-10 px-4",
        sm: "h-9 px-3",
        lg: "h-11 px-8",
      },
    },
    defaultVariants: {
      variant: "outline",
      size: "default",
    },
  }
);

const Dropdown = React.forwardRef(({ label, options, value, onChange, variant, size, className }, ref) => {
  return (
    <div className="flex items-center gap-2">
      {label && <label className="font-medium text-gray-700">{label}</label>}
      <select
        ref={ref}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={cn(dropdownVariants({ variant, size, className }))}
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  );
});

Dropdown.displayName = "Dropdown";

export { Dropdown };
