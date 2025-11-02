import React from "react";
import { cn } from "../../lib/utils";

const Input = React.forwardRef((props, ref) => {
  const { className, type, onChange, ...rest } = props;

  // Handle input changes normally
  const handleChange = (e) => {
    if (onChange) onChange(e);
  };

  // Block comma key
  const handleKeyDown = (e) => {
    if (e.key === ",") {
      e.preventDefault(); // stop comma from being typed
    }
  };

  return (
    <input
      type={type}
      className={cn(
        "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
        className
      )}
      ref={ref}
      onChange={handleChange}
      onKeyDown={handleKeyDown} // prevent comma typing
      {...rest}
    />
  );
});

Input.displayName = "Input";

export { Input };
