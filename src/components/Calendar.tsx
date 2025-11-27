import React, { useState } from 'react';
import {
    format,
    addMonths,
    subMonths,
    startOfMonth,
    endOfMonth,
    startOfWeek,
    endOfWeek,
    eachDayOfInterval,
    isSameMonth,
    isSameDay,
    addDays
} from 'date-fns';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon } from 'lucide-react';
import './Calendar.css';

const Calendar: React.FC = () => {
    const [currentDate, setCurrentDate] = useState(new Date());
    const [selectedDate, setSelectedDate] = useState(new Date());

    const nextMonth = () => {
        setCurrentDate(addMonths(currentDate, 1));
    };

    const prevMonth = () => {
        setCurrentDate(subMonths(currentDate, 1));
    };

    const onDateClick = (day: Date) => {
        setSelectedDate(day);
    };

    const renderHeader = () => {
        return (
            <div className="calendar-header">
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <div style={{
                        background: 'var(--accent-color)',
                        padding: '0.5rem',
                        borderRadius: '12px',
                        display: 'flex',
                        boxShadow: '0 0 15px var(--accent-glow)'
                    }}>
                        <CalendarIcon color="white" size={24} />
                    </div>
                    <h2 className="calendar-title">
                        {format(currentDate, 'MMMM yyyy')}
                    </h2>
                </div>
                <div className="calendar-nav">
                    <button className="nav-btn" onClick={prevMonth}>
                        <ChevronLeft size={20} />
                    </button>
                    <button className="nav-btn" onClick={nextMonth}>
                        <ChevronRight size={20} />
                    </button>
                </div>
            </div>
        );
    };

    const renderDays = () => {
        const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        return (
            <div className="calendar-grid" style={{ borderBottom: 'none', borderRadius: '12px 12px 0 0' }}>
                {days.map((day) => (
                    <div className="calendar-day-header" key={day}>
                        {day}
                    </div>
                ))}
            </div>
        );
    };

    const renderCells = () => {
        const monthStart = startOfMonth(currentDate);
        const monthEnd = endOfMonth(monthStart);
        const startDate = startOfWeek(monthStart);
        const endDate = endOfWeek(monthEnd);

        const dateFormat = "d";
        const rows = [];
        let days = [];
        let day = startDate;
        let formattedDate = "";

        // Generate all days to be shown
        const allDays = eachDayOfInterval({
            start: startDate,
            end: endDate
        });

        return (
            <div className="calendar-grid" style={{ borderRadius: '0 0 12px 12px', borderTop: 'none' }}>
                {allDays.map((dayItem, index) => {
                    formattedDate = format(dayItem, dateFormat);
                    const cloneDay = dayItem;

                    return (
                        <div
                            className={`calendar-cell
                ${!isSameMonth(dayItem, monthStart) ? "disabled" : ""}
                ${isSameDay(dayItem, selectedDate) ? "selected" : ""}
                ${isSameDay(dayItem, new Date()) ? "today" : ""}
              `}
                            key={dayItem.toString()}
                            onClick={() => onDateClick(cloneDay)}
                        >
                            <span className="day-number">{formattedDate}</span>
                            {/* Placeholder for events */}
                            {isSameDay(dayItem, new Date()) && (
                                <div style={{
                                    fontSize: '0.75rem',
                                    color: 'var(--accent-color)',
                                    marginTop: '0.25rem',
                                    fontWeight: 600
                                }}>
                                    Today
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>
        );
    };

    return (
        <div className="calendar-container">
            {renderHeader()}
            {renderDays()}
            {renderCells()}
        </div>
    );
};

export default Calendar;
