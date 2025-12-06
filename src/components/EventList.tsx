import React from 'react';
import { useEventStore, CATEGORY_COLORS } from '../store/useEventStore';
import { format } from 'date-fns';
import { MapPin, Clock, User } from 'lucide-react';
import './EventList.css';

interface EventListProps {
    currentDate: Date;
}

const EventList: React.FC<EventListProps> = ({ currentDate }) => {
    const events = useEventStore((state) => state.events);

    const filteredEvents = events.filter((event) =>
        new Date(event.startDate).getMonth() === currentDate.getMonth() &&
        new Date(event.startDate).getFullYear() === currentDate.getFullYear()
    ).sort((a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime());

    return (
        <div className="event-list-container">
            <div className="event-list-header">
                <h3>Events for {format(currentDate, 'MMMM')}</h3>
            </div>

            <div className="event-list-content">
                {filteredEvents.length === 0 ? (
                    <div className="empty-state">
                        No events scheduled for this month.
                    </div>
                ) : (
                    filteredEvents.map((event) => {
                        const categoryColor = CATEGORY_COLORS[event.category as keyof typeof CATEGORY_COLORS]?.color || 'var(--accent-color)';

                        return (
                            <div key={event.id} className="event-item" style={{ borderLeft: `4px solid ${categoryColor}` }}>
                                <div className="event-item-header">
                                    <span className="event-item-title">{event.title}</span>
                                    <span className="event-item-date">{format(new Date(event.startDate), 'MMM d')}</span>
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
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '4px', fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                                        <User size={12} />
                                        <span>{event.author || 'Unknown'}</span>
                                    </div>
                                </div>
                            </div>
                        );
                    })
                )}
            </div>
        </div>
    );
};

export default EventList;
