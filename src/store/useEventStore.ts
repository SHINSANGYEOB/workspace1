import { create } from 'zustand';

export interface CalendarEvent {
    id: string;
    title: string;
    startDate: Date;
    endDate: Date;
    isAllDay: boolean;
    time: string; // Start time
    location: string;
    description: string;
    alarm: string; // e.g., 'none', '10min', '1hour', '1day'
    author: string;
    category: 'important' | 'personal1' | 'personal2' | 'joint' | 'event' | 'vacation' | 'business';
}

export const CATEGORY_COLORS = {
    important: { label: '중요', color: '#ef4444' }, // Red
    personal1: { label: '개인1', color: '#eab308' }, // Yellow
    personal2: { label: '개인2', color: '#3b82f6' }, // Blue
    joint: { label: '합동', color: '#a855f7' }, // Purple
    event: { label: '이벤트', color: '#f97316' }, // Orange
    vacation: { label: '휴가', color: '#22c55e' }, // Green
    business: { label: '출장', color: '#06b6d4' }, // Cyan
};

interface EventStore {
    events: CalendarEvent[];
    addEvent: (event: CalendarEvent) => void;
    deleteEvent: (id: string) => void;
    updateEvent: (event: CalendarEvent) => void;
    getEventsByDate: (date: Date) => CalendarEvent[];
    getEventsByMonth: (date: Date) => CalendarEvent[];
}

export const useEventStore = create<EventStore>((set, get) => ({
    events: [],
    addEvent: (event) => set((state) => ({ events: [...state.events, event] })),
    deleteEvent: (id) => set((state) => ({
        events: state.events.filter((e) => e.id !== id)
    })),
    updateEvent: (updatedEvent) => set((state) => ({
        events: state.events.map((e) => e.id === updatedEvent.id ? updatedEvent : e)
    })),
    getEventsByDate: (date) => {
        const { events } = get();
        return events.filter((event) => {
            const target = new Date(date);
            target.setHours(0, 0, 0, 0);

            const start = new Date(event.startDate);
            start.setHours(0, 0, 0, 0);

            const end = new Date(event.endDate);
            end.setHours(0, 0, 0, 0);

            return target >= start && target <= end;
        });
    },
    getEventsByMonth: (date) => {
        const { events } = get();
        return events.filter((event) =>
            event.startDate.getMonth() === date.getMonth() &&
            event.startDate.getFullYear() === date.getFullYear()
        );
    }
}));
