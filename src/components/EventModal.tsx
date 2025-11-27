import React, { useState, useEffect } from 'react';
import { X, MapPin, Bell, Calendar as CalendarIcon } from 'lucide-react';
import { useEventStore } from '../store/useEventStore';
import './EventModal.css';
import { format } from 'date-fns';

interface EventModalProps {
    isOpen: boolean;
    onClose: () => void;
    selectedDate: Date;
}

const EventModal: React.FC<EventModalProps> = ({ isOpen, onClose, selectedDate }) => {
    const addEvent = useEventStore((state) => state.addEvent);

    const [title, setTitle] = useState('');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [isAllDay, setIsAllDay] = useState(false);
    const [time, setTime] = useState('12:00');
    const [location, setLocation] = useState('');
    const [description, setDescription] = useState('');
    const [alarm, setAlarm] = useState('none');

    // Reset form when modal opens with a new date
    useEffect(() => {
        if (isOpen) {
            setTitle('');
            // Format date for input[type="date"] which requires YYYY-MM-DD
            const dateStr = format(selectedDate, 'yyyy-MM-dd');
            setStartDate(dateStr);
            setEndDate(dateStr);
            setIsAllDay(false);
            setTime('12:00');
            setLocation('');
            setDescription('');
            setAlarm('none');
        }
    }, [isOpen, selectedDate]);

    if (!isOpen) return null;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        addEvent({
            id: crypto.randomUUID(),
            title,
            startDate: new Date(startDate),
            endDate: new Date(endDate),
            isAllDay,
            time: isAllDay ? 'All Day' : time,
            location,
            description,
            alarm
        });

        onClose();
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                    <h2>Add Event</h2>
                    <button className="nav-btn" onClick={onClose} style={{ width: '32px', height: '32px' }}>
                        <X size={18} />
                    </button>
                </div>

                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <input
                            type="text"
                            className="form-input title-input"
                            placeholder="Add title"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            required
                            autoFocus
                        />
                    </div>

                    <div className="form-row">
                        <div className="form-group" style={{ flex: 1 }}>
                            <label><CalendarIcon size={14} style={{ marginRight: '4px' }} /> Start</label>
                            <input
                                type="date"
                                className="form-input"
                                value={startDate}
                                onChange={(e) => setStartDate(e.target.value)}
                                required
                            />
                        </div>
                        <div className="form-group" style={{ flex: 1 }}>
                            <label>End</label>
                            <input
                                type="date"
                                className="form-input"
                                value={endDate}
                                onChange={(e) => setEndDate(e.target.value)}
                                required
                            />
                        </div>
                    </div>

                    <div className="form-group checkbox-group">
                        <input
                            type="checkbox"
                            id="allDay"
                            checked={isAllDay}
                            onChange={(e) => setIsAllDay(e.target.checked)}
                        />
                        <label htmlFor="allDay">All Day</label>
                    </div>

                    {!isAllDay && (
                        <div className="form-group">
                            <label>Time</label>
                            <input
                                type="time"
                                className="form-input"
                                value={time}
                                onChange={(e) => setTime(e.target.value)}
                                required
                            />
                        </div>
                    )}

                    <div className="form-group">
                        <label><MapPin size={14} style={{ marginRight: '4px' }} /> Location (Naver Map)</label>
                        <div className="input-with-icon">
                            <input
                                type="text"
                                className="form-input"
                                placeholder="Search location..."
                                value={location}
                                onChange={(e) => setLocation(e.target.value)}
                            />
                            <button type="button" className="icon-btn" title="Open Map (Requires API Key)">
                                <MapPin size={16} />
                            </button>
                        </div>
                        <small style={{ color: 'var(--text-secondary)', fontSize: '0.75rem' }}>
                            * Map integration requires a valid Naver Cloud Platform Client ID.
                        </small>
                    </div>

                    <div className="form-group">
                        <label><Bell size={14} style={{ marginRight: '4px' }} /> Notification (KakaoTalk)</label>
                        <select
                            className="form-input"
                            value={alarm}
                            onChange={(e) => setAlarm(e.target.value)}
                        >
                            <option value="none">None</option>
                            <option value="10min">10 minutes before</option>
                            <option value="30min">30 minutes before</option>
                            <option value="1hour">1 hour before</option>
                            <option value="1day">1 day before</option>
                        </select>
                        {alarm !== 'none' && (
                            <small style={{ color: 'var(--accent-color)', fontSize: '0.75rem', display: 'block', marginTop: '4px' }}>
                                * KakaoTalk message will be sent (Mock).
                            </small>
                        )}
                    </div>

                    <div className="form-group">
                        <label>Description</label>
                        <textarea
                            className="form-textarea"
                            placeholder="Add description"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                        />
                    </div>

                    <div className="modal-actions">
                        <button type="button" className="btn-cancel" onClick={onClose}>
                            Cancel
                        </button>
                        <button type="submit" className="btn-save">
                            Save
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EventModal;
