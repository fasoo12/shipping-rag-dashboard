"use client";

import * as React from "react";
import { format, parse } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface DatePickerProps {
  value?: Date;
  onChange?: (date: Date | undefined) => void;
  placeholder?: string;
}

export function DatePicker({
  value,
  onChange,
  placeholder = "날짜 선택 또는 입력 (YYYY-MM-DD)",
}: DatePickerProps) {
  const [date, setDate] = React.useState<Date | undefined>(value);
  const [inputValue, setInputValue] = React.useState<string>(
    date ? format(date, "yyyy-MM-dd") : ""
  );

  const handleDateChange = (newDate: Date | undefined) => {
    setDate(newDate);
    setInputValue(newDate ? format(newDate, "yyyy-MM-dd") : "");
    onChange?.(newDate);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInputValue(value);

    // Try to parse the input as a date (YYYY-MM-DD format)
    if (value.match(/^\d{4}-\d{2}-\d{2}$/)) {
      try {
        const parsedDate = parse(value, "yyyy-MM-dd", new Date());
        if (!isNaN(parsedDate.getTime())) {
          setDate(parsedDate);
          onChange?.(parsedDate);
        }
      } catch (err) {
        // Invalid date format
      }
    }
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={cn(
            "w-full justify-start text-left font-normal",
            !date && "text-muted-foreground"
          )}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {date ? format(date, "yyyy-MM-dd") : placeholder}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-3" align="start">
        <div className="space-y-3">
          <Input
            type="text"
            placeholder="YYYY-MM-DD (예: 2026-03-10)"
            value={inputValue}
            onChange={handleInputChange}
            className="w-full"
          />
          <Calendar
            mode="single"
            selected={date}
            onSelect={handleDateChange}
            disabled={(date) =>
              date > new Date() || date < new Date("1900-01-01")
            }
            initialFocus
          />
        </div>
      </PopoverContent>
    </Popover>
  );
}
