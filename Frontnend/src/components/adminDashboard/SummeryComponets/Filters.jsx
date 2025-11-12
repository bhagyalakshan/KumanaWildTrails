
import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { DayPicker } from 'react-day-picker';
import { cn } from '@/lib/utils';
import { buttonVariants } from '@/components/ui/adminDashboard-ui/button';

function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  selected,
  onSelect,
  components,
  ...props
}) {
  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      className={cn('p-3', className)}
      selected={selected}
      onDayClick={onSelect}
      modifiers={{
        hasData: props.daysWithData || [],
      }}
      modifiersStyles={{
        hasData: {
          position: 'relative',
          '--dot-color': 'var(--bs-primary)',
        },
      }}
      classNames={{
        months: 'd-flex flex-column flex-sm-row gap-3',
        month: 'd-flex flex-column gap-3',
        caption: 'd-flex justify-content-center pt-1 position-relative align-items-center',
        caption_label: 'small fw-medium',
        nav: 'd-flex align-items-center gap-1',
        nav_button: cn(
          buttonVariants({ variant: 'outline' }),
          'btn btn-outline-primary btn-sm p-0 opacity-50 hover-opacity-100'
        ),
        nav_button_previous: 'position-absolute start-0',
        nav_button_next: 'position-absolute end-0',
        table: 'w-100 border-collapse',
        head_row: 'd-flex',
        head_cell: 'text-muted rounded w-32px fw-normal small',
        row: 'd-flex w-100 mt-2',
        cell: cn(
          'h-32px w-32px text-center small p-0 position-relative',
          '[&:has([aria-selected].day-range-end)]:rounded-end',
          '[&:has([aria-selected].day-outside)]:bg-light',
          '[&:has([aria-selected])]:bg-light',
          'first:[&:has([aria-selected])]:rounded-start',
          'last:[&:has([aria-selected])]:rounded-end',
          'focus-within:position-relative focus-within:z-20'
        ),
        day: cn(
          buttonVariants({ variant: 'link' }),
          'h-32px w-32px p-0 fw-normal aria-selected:opacity-100'
        ),
        day_range_end: 'day-range-end',
        day_selected:
          'bg-primary text-white hover:bg-primary hover:text-white focus:bg-primary focus:text-white',
        day_today: 'bg-light text-dark',
        day_outside:
          'day-outside text-muted opacity-50 aria-selected:bg-light aria-selected:text-muted aria-selected:opacity-30',
        day_disabled: 'text-muted opacity-50',
        day_range_middle: 'aria-selected:bg-light aria-selected:text-dark',
        day_hidden: 'invisible',
        ...classNames,
      }}
      components={{
        IconLeft: () => <ChevronLeft className="h-4 w-4" />,
        IconRight: () => <ChevronRight className="h-4 w-4" />,
        ...components,
      }}
      {...props}
    />
  );
}
Calendar.displayName = 'Calendar';

export { Calendar };
