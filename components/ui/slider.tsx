"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

export interface SliderProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  step?: number;
  min?: number;
  max?: number;
}

const Slider = React.forwardRef<HTMLInputElement, SliderProps>(
  ({ className, min = 0, max = 100, step = 1, value, onChange, ...props }, ref) => {
    const [val, setVal] = React.useState<string | number>(
      typeof value === "string" || typeof value === "number" ? value : 50
    );

    React.useEffect(() => {
      if (typeof value === "string" || typeof value === "number") {
        setVal(value);
      }
    }, [value]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setVal(e.target.value);
      onChange?.(e);
    };

    return (
      <input
        ref={ref}
        type="range"
        min={min}
        max={max}
        step={step}
        value={val}
        onChange={handleChange}
        className={cn(
          "h-2 w-full cursor-pointer appearance-none rounded-lg bg-slate-200 outline-none accent-blue-600",
          className
        )}
        {...props}
      />
    );
  }
);
Slider.displayName = "Slider";

export { Slider };
