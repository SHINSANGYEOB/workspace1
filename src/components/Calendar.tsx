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
    differenceInCalendarDays,
    addDays,
} from 'date-fns';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon } from 'lucide-react';
import { useEventStore } from '../store/useEventStore';
import EventModal from './EventModal';
import './Calendar.css';
import { CATEGORY_COLORS } from '../store/useEventStore';

interface CalendarProps {
    onDateChange: (date: Date) => void;
}

const Calendar: React.FC<CalendarProps> = ({ onDateChange }) => {
    const [currentDate, setCurrentDate] = useState(new Date());
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [eventToEdit, setEventToEdit] = useState<any>(null);

    const updateEvent = useEventStore((state) => state.updateEvent);
    const events = useEventStore((state) => state.events);

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
        setEventToEdit(null); // Clear edit mode
        setIsModalOpen(true);
    };

    const onEventClick = (event: any) => {
        setEventToEdit(event);
        setSelectedDate(event.startDate);
        setIsModalOpen(true);
    };

    const onEventDrop = (eventId: string, newDate: Date) => {
        const event = events.find(e => e.id === eventId);
        if (event) {
            const dayDiff = newDate.getTime() - new Date(event.startDate).setHours(0, 0, 0, 0);
            const newStartDate = new Date(new Date(event.startDate).getTime() + dayDiff);
            const newEndDate = new Date(new Date(event.endDate).getTime() + dayDiff);

            updateEvent({
                ...event,
                startDate: newStartDate,
                endDate: newEndDate
            });
        }
    };

    const renderHeader = () => {
        return (
            <div className="calendar-header-container">
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

                <div className="category-legend">
                    {Object.entries(CATEGORY_COLORS).map(([key, { label, color }]) => (
                        <div key={key} className="legend-item">
                            <span className="legend-dot" style={{ background: color }}></span>
                            <span className="legend-label">{label}</span>
                        </div>
                    ))}
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

        // Split days into weeks
        const weeks: Date[][] = [];
        for (let i = 0; i < allDays.length; i += 7) {
            weeks.push(allDays.slice(i, i + 7));
        }

        return (
            <div className="calendar-grid" style={{ borderRadius: '0 0 12px 12px', borderTop: 'none' }}>
                {weeks.map((weekDays, weekIndex) => {
                    // 1. Filter events for this week
                    const weekStart = weekDays[0];
                    const weekEnd = weekDays[6];

                    // Set times to cover full days
                    const weekStartVal = new Date(weekStart).setHours(0, 0, 0, 0);
                    const weekEndVal = new Date(weekEnd).setHours(23, 59, 59, 999);

                    const weekEvents = events.filter(event => {
                        const eventStart = new Date(event.startDate).setHours(0, 0, 0, 0);
                        const eventEnd = new Date(event.endDate).setHours(0, 0, 0, 0);
                        return eventStart <= weekEndVal && eventEnd >= weekStartVal;
                    });

                    // 2. Sort events: Start Date (asc), Duration (desc)
                    weekEvents.sort((a, b) => {
                        const startA = new Date(a.startDate).setHours(0, 0, 0, 0);
                        const startB = new Date(b.startDate).setHours(0, 0, 0, 0);
                        if (startA !== startB) return startA - startB;

                        const durA = new Date(a.endDate).getTime() - new Date(a.startDate).getTime();
                        const durB = new Date(b.endDate).getTime() - new Date(b.startDate).getTime();
                        return durB - durA;
                    });

                    // 3. Assign slots
                    // slots[dayIndex] = [eventId | null, ...]
                    const slots = Array(7).fill(null).map(() => [] as (string | null)[]);

                    weekEvents.forEach(event => {
                        const eventStart = new Date(event.startDate);
                        const eventEnd = new Date(event.endDate);
                        eventStart.setHours(0, 0, 0, 0);
                        eventEnd.setHours(0, 0, 0, 0);

                        // Calculate start/end indices in this week (0-6)
                        const startOffset = Math.max(0, differenceInCalendarDays(eventStart, weekStart));
                        const endOffset = Math.min(6, differenceInCalendarDays(eventEnd, weekStart));

                        // Find first free lane
                        let lane = 0;
                        while (true) {
                            let isFree = true;
                            for (let d = startOffset; d <= endOffset; d++) {
                                if (slots[d][lane] !== undefined && slots[d][lane] !== null) {
                                    isFree = false;
                                    break;
                                }
                            }
                            if (isFree) break;
                            lane++;
                        }

                        // Assign event to lane for all its days in this week
                        for (let d = startOffset; d <= endOffset; d++) {
                            while (slots[d].length <= lane) slots[d].push(null);
                            slots[d][lane] = event.id;
                        }
                    });

                    // 4. Render days in this week
                    return weekDays.map((dayItem, dayIndex) => {
                        const formattedDate = format(dayItem, dateFormat);
                        const cloneDay = dayItem;
                        const daySlots = slots[dayIndex];

                        return (
                            <div
                                className={`calendar-cell
                    ${!isSameMonth(dayItem, monthStart) ? "disabled" : ""}
                    ${isSameDay(dayItem, selectedDate) ? "selected" : ""}
                    ${isSameDay(dayItem, new Date()) ? "today" : ""}
                  `}
                                key={dayItem.toString()}
                                onClick={() => onDateClick(cloneDay)}
                                onDragOver={(e) => e.preventDefault()}
                                onDrop={(e) => {
                                    e.preventDefault();
                                    const eventId = e.dataTransfer.getData("text/plain");
                                    if (eventId) {
                                        onEventDrop(eventId, cloneDay);
                                    }
                                }}
                            >
                                <span className="day-number">{formattedDate}</span>

                                <div className="cell-events">
                                    {daySlots.map((eventId, index) => {
                                        if (!eventId) {
                                            return <div key={`spacer-${index}`} className="event-spacer"></div>;
                                        }

                                        const event = events.find(e => e.id === eventId);
                                        if (!event) return null;

                                        const eventStart = new Date(event.startDate);
                                        const eventEnd = new Date(event.endDate);
                                        eventStart.setHours(0, 0, 0, 0);
                                        eventEnd.setHours(0, 0, 0, 0);
                                        const currentDay = new Date(dayItem);
                                        currentDay.setHours(0, 0, 0, 0);

                                        const isStart = currentDay.getTime() === eventStart.getTime();
                                        const isEnd = currentDay.getTime() === eventEnd.getTime();
                                        const categoryColor = CATEGORY_COLORS[event.category as keyof typeof CATEGORY_COLORS]?.color || 'var(--accent-color)';

                                        return (
                                            <div
                                                key={event.id}
                                                className={`mini-event-pill ${event.isAllDay ? 'all-day' : ''}`}
                                                style={{
                                                    backgroundColor: categoryColor,
                                                    borderTopLeftRadius: isStart ? '4px' : '0',
                                                    borderBottomLeftRadius: isStart ? '4px' : '0',
                                                    borderTopRightRadius: isEnd ? '4px' : '0',
                                                    borderBottomRightRadius: isEnd ? '4px' : '0',
                                                    marginLeft: isStart ? '2px' : '-1px',
                                                    marginRight: isEnd ? '2px' : '-1px',
                                                    width: isStart && isEnd ? 'calc(100% - 4px)' :
                                                        isStart ? 'calc(100% - 1px)' :
                                                            isEnd ? 'calc(100% - 1px)' : 'calc(100% + 2px)',
                                                    opacity: 0.9,
                                                    border: 'none'
                                                }}
                                                draggable
                                                onDragStart={(e) => {
                                                    e.dataTransfer.setData("text/plain", event.id);
                                                    e.stopPropagation();
                                                }}
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    onEventClick(event);
                                                }}
                                            >
                                                {isStart || dayItem.getDay() === 0 ? event.title : '\u00A0'}
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        );
                    });
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
                eventToEdit={eventToEdit}
            />
        </>
    );
};

export default Calendar;
