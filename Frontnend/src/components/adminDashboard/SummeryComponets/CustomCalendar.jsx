import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { DayPicker } from 'react-day-picker';
import 'react-day-picker/dist/style.css';
import './customecss/calendar.css';

function CustomCalendar({
  className,
  classNames,
  showOutsideDays = true,
  selected,
  onSelect,
  daysWithData = [],
  components,
  ...props
}) {
  return (
    <div className="custom-calendar-container">
      <DayPicker
        showOutsideDays={showOutsideDays}
        className={`custom-calendar ${className || ''}`}
        selected={selected}
        onDayClick={onSelect}
        modifiers={{
          hasData: daysWithData,
        }}
        classNames={{
          months: 'custom-calendar-months',
          month: 'custom-calendar-month',
          caption: 'custom-calendar-caption',
          caption_label: 'custom-calendar-caption-label',
          nav: 'custom-calendar-nav',
          button: 'custom-calendar-nav-button',
          button_previous: 'custom-calendar-nav-button-prev',
          button_next: 'custom-calendar-nav-button-next',
          month_grid: 'custom-calendar-table',
          weekdays: 'custom-calendar-head-row',
          weekday: 'custom-calendar-head-cell',
          week: 'custom-calendar-row',
          day: 'custom-calendar-cell',
          day_button: 'custom-calendar-day',
          selected: 'custom-calendar-day-selected',
          today: 'custom-calendar-day-today',
          outside: 'custom-calendar-day-outside',
          disabled: 'custom-calendar-day-disabled',
          ...classNames,
        }}
        components={{
          Chevron: ({ orientation }) => 
            orientation === 'left' ? 
            <ChevronLeft className="custom-calendar-icon" /> : 
            <ChevronRight className="custom-calendar-icon" />,
          ...components,
        }}
        {...props}
      />
    </div>
  );
}

export default CustomCalendar;