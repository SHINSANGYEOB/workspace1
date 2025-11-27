import React from 'react';
import { useEventStore } from '../store/useEventStore';
import { format } from 'date-fns';
import { MapPin, Clock } from 'lucide-react';
import './EventList.css';

interface EventListProps {
    currentDate: Date;
}

const EventList: React.FC<EventListProps> = ({ currentDate }) => {
    const getEventsByMonth = useEventStore((state) => state.getEventsByMonth);
    const events = getEventsByMonth(currentDate).sort((a, b) => a.startDate.getTime() - b.startDate.getTime());

    return (
        <div className="event-list-container">
            <div className="event-list-header">
                <h3>Events for {format(currentDate, 'MMMM')}</h3>
            </div>

            <div className="event-list-content">
                {events.length === 0 ? (
                    <div className="empty-state">
                        No events scheduled for this month.
                    </div>
                ) : (
                    events.map((event) => (
                        <div key={event.id} className="event-item">
                            <div className="event-item-header">
                                <span className="event-item-title">{event.title}</span>
                                <span className="event-item-date">{format(event.startDate, 'MMM d')}</span>
                            </div>
                            <div className="event-item-details">
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                    <Clock size={14} />
                                    <span>{event.isAllDay ? 'All Day' : event.time}</span>
                                </div>
                                {event.location && (
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                        <MapPin size={14} />
                                        <span>{event.location}</span>
                                    </div>
                                )}
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default EventList;
