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
      className={cn("p-4 bg-midnight outline-2 outline-green-300 rounded-md text-beige-100 w-auto min-w-[300px] sm:min-w-[350px] md:min-w-[400px]", className)}
      classNames={{
        months: "flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0",
        month: "flex flex-col space-y-6",
        caption: "flex justify-center pt-2 relative items-center w-full text-beige-100",
        caption_label: "text-lg font-medium text-beige-100",
        nav: "flex items-center gap-1",
        nav_button: cn(
          buttonVariants({ variant: "outline" }),
          "size-10 bg-transparent p-0 opacity-70 hover:opacity-100 border-none shadow-none text-beige-100"
        ),
        nav_button_previous: "absolute left-1",
        nav_button_next: "absolute right-1",
        table: "w-full border-collapse space-y-2",
        head_row: "flex",
        head_cell:
          "text-beige-100 rounded-md w-12 sm:w-14 font-medium text-base",
        row: "flex w-full mt-3",
        cell: cn(
          "relative p-0 text-center focus-within:relative focus-within:z-20 [&:has([aria-selected])]:bg-midnight [&:has([aria-selected].day-range-end)]:rounded-r-md",
          props.mode === "range"
            ? "[&:has(>.day-range-end)]:rounded-r-md [&:has(>.day-range-start)]:rounded-l-md first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md"
            : "[&:has([aria-selected])]:rounded-md"
        ),
        day: cn(
          buttonVariants({ variant: "ghost"}),
          "size-12 sm:size-14 p-0 font-normal aria-selected:opacity-100 shadow-none text-beige-100 hover:bg-midnight text-lg sm:text-xl"
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
          <ChevronLeft className={cn("size-6 sm:size-7 text-beige-100", className)} {...props} />
        ),
        IconRight: ({ className, ...props }) => (
          <ChevronRight className={cn("size-6 sm:size-7 text-beige-100", className)} {...props} />
        ),
      }}
      {...props}
    />
  )
}

export { Calendar }