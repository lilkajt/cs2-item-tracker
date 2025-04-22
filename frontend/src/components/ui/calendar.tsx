import * as React from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { DayPicker } from "react-day-picker"

import { cn } from "@/lib/utils"
import { buttonVariants } from "@/components/ui/button"

function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  ...props
}: React.ComponentProps<typeof DayPicker>) {
  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      className={cn("p-3 bg-midnight outline-2 outline-green-300 rounded-md text-beige-100", className)}
      classNames={{
        months: "flex flex-col sm:flex-row gap-2",
        month: "flex flex-col gap-4",
        caption: "flex justify-center pt-1 relative items-center w-full text-beige-100",
        caption_label: "text-sm font-medium text-beige-100",
        nav: "flex items-center gap-1",
        nav_button: cn(
          buttonVariants({ variant: "outline" }),
          "size-7 bg-transparent p-0 opacity-50 hover:opacity-100 border-none shadow-none text-beige-100"
        ),
        nav_button_previous: "absolute left-1",
        nav_button_next: "absolute right-1",
        table: "w-full border-collapse space-x-1",
        head_row: "flex",
        head_cell:
          "text-beige-100 rounded-md w-8 font-normal text-[0.8rem]",
        row: "flex w-full mt-2",
        cell: cn(
          "relative p-0 text-center text-sm focus-within:relative focus-within:z-20 [&:has([aria-selected])]:bg-midnight [&:has([aria-selected].day-range-end)]:rounded-r-md",
          props.mode === "range"
            ? "[&:has(>.day-range-end)]:rounded-r-md [&:has(>.day-range-start)]:rounded-l-md first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md"
            : "[&:has([aria-selected])]:rounded-md"
        ),
        day: cn(
          buttonVariants({ variant: "ghost"}),
          "size-8 p-0 font-normal aria-selected:opacity-100 shadow-none text-beige-100 hover:bg-midnight"
        ),
        day_range_start:
          "day-range-start aria-selected:bg-green-300 aria-selected:text-midnight",
        day_range_end:
          "day-range-end aria-selected:bg-green-300 aria-selected:text-midnight",
        day_selected:
          "bg-green-300 text-midnight hover:bg-green-300 hover:text-midnight focus:bg-green-300 focus:text-midnight",
        day_today: "bg-midnight text-beige-100 outline outline-1 outline-green-300",
        day_outside:
          "day-outside text-beige-200/50 aria-selected:text-beige-200/50",
        day_disabled: "text-beige-200/50 opacity-30",
        day_range_middle:
          "aria-selected:bg-midnight aria-selected:text-beige-100",
        day_hidden: "invisible",
        ...classNames,
      }}
      components={{
        IconLeft: ({ className, ...props }) => (
          <ChevronLeft className={cn("size-4 text-beige-100", className)} {...props} />
        ),
        IconRight: ({ className, ...props }) => (
          <ChevronRight className={cn("size-4 text-beige-100", className)} {...props} />
        ),
      }}
      {...props}
    />
  )
}

export { Calendar }