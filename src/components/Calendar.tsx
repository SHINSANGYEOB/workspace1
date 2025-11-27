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
} from 'date-fns';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon } from 'lucide-react';
import { useEventStore } from '../store/useEventStore';
import EventModal from './EventModal';
import './Calendar.css';

interface CalendarProps {
    onDateChange: (date: Date) => void;
}

const Calendar: React.FC<CalendarProps> = ({ onDateChange }) => {
    const [currentDate, setCurrentDate] = useState(new Date());
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [isModalOpen, setIsModalOpen] = useState(false);

    const getEventsByDate = useEventStore((state) => state.getEventsByDate);

    const nextMonth = () => {
        const newDate = addMonths(currentDate, 1);
        setCurrentDate(newDate);
        onDateChange(newDate);
    };

    const prevMonth = () => {
        const newDate = subMonths(currentDate, 1);
        setCurrentDate(newDate);
        onDateChange(newDate);
    };

    const onDateClick = (day: Date) => {
        setSelectedDate(day);
        setIsModalOpen(true);
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
        const allDays = eachDayOfInterval({
            start: startDate,
            end: endDate
        });

        return (
            <div className="calendar-grid" style={{ borderRadius: '0 0 12px 12px', borderTop: 'none' }}>
                {allDays.map((dayItem) => {
                    const formattedDate = format(dayItem, dateFormat);
                    const cloneDay = dayItem;
                    const dayEvents = getEventsByDate(dayItem);

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

                            <div className="cell-events">
                                {dayEvents.slice(0, 2).map((event) => (
                                    <div key={event.id} className={`mini-event-pill ${event.isAllDay ? 'all-day' : ''}`}>
                                        {event.title}
                                    </div>
                                ))}
                                {dayEvents.length > 2 && (
                                    <div className="more-events">+{dayEvents.length - 2} more</div>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>
        );
    };

    return (
        <>
            <div className="calendar-container">
                {renderHeader()}
                {renderDays()}
                {renderCells()}
            </div>
            <EventModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                selectedDate={selectedDate}
            />
        </>
    );
};

export default Calendar;
