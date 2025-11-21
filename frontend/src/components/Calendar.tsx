import React, { useState } from 'react';
import '../styles/Calendar.css';

interface CalendarProps {
  selectedDate?: Date;
  onDateSelect?: (date: Date) => void;
}

const Calendar: React.FC<CalendarProps> = ({ selectedDate, onDateSelect }) => {
  const [currentDate, setCurrentDate] = useState(selectedDate || new Date());

  const isLeapYear = (year: number): boolean => {
    return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
  };

  const getDaysInMonth = (month: number, year: number): number => {
    const daysInMonth = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
    if (month === 1 && isLeapYear(year)) {
      return 29;
    }
    return daysInMonth[month];
  };

  const getFirstDayOfMonth = (month: number, year: number): number => {
    return new Date(year, month, 1).getDay();
  };

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const currentMonth = currentDate.getMonth();
  const currentYear = currentDate.getFullYear();
  const daysInMonth = getDaysInMonth(currentMonth, currentYear);
  const firstDayOfMonth = getFirstDayOfMonth(currentMonth, currentYear);

  const previousMonth = () => {
    setCurrentDate(new Date(currentYear, currentMonth - 1, 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(currentYear, currentMonth + 1, 1));
  };

  const handleDateClick = (day: number) => {
    const selected = new Date(currentYear, currentMonth, day);
    if (onDateSelect) {
      onDateSelect(selected);
    }
  };

  const renderCalendarDays = () => {
    const days = [];
    const today = new Date();
    const isToday = (day: number) => {
      return (
        day === today.getDate() &&
        currentMonth === today.getMonth() &&
        currentYear === today.getFullYear()
      );
    };

    // Add empty cells for days before the first day of the month
    for (let i = 0; i < firstDayOfMonth; i++) {
      days.push(
        <div key={`empty-${i}`} className="calendar-day empty"></div>
      );
    }

    // Add cells for each day of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const classes = ['calendar-day'];
      if (isToday(day)) {
        classes.push('today');
      }
      if (selectedDate && 
          day === selectedDate.getDate() && 
          currentMonth === selectedDate.getMonth() && 
          currentYear === selectedDate.getFullYear()) {
        classes.push('selected');
      }

      days.push(
        <div
          key={`day-${day}`}
          className={classes.join(' ')}
          onClick={() => handleDateClick(day)}
        >
          {day}
        </div>
      );
    }

    return days;
  };

  return (
    <div className="calendar-widget">
      <div className="calendar-header">
        <button className="calendar-nav" onClick={previousMonth}>
          &#8249;
        </button>
        <h3 className="calendar-month">
          {monthNames[currentMonth]} {currentYear}
        </h3>
        <button className="calendar-nav" onClick={nextMonth}>
          &#8250;
        </button>
      </div>
      <div className="calendar-weekdays">
        {dayNames.map((day) => (
          <div key={day} className="calendar-weekday">
            {day}
          </div>
        ))}
      </div>
      <div className="calendar-days">{renderCalendarDays()}</div>
    </div>
  );
};

export default Calendar;

