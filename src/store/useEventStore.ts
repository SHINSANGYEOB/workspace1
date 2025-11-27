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
}

interface EventStore {
    events: CalendarEvent[];
    addEvent: (event: CalendarEvent) => void;
    deleteEvent: (id: string) => void;
    getEventsByDate: (date: Date) => CalendarEvent[];
    getEventsByMonth: (date: Date) => CalendarEvent[];
}

export const useEventStore = create<EventStore>((set, get) => ({
    events: [],
    addEvent: (event) => set((state) => ({ events: [...state.events, event] })),
    deleteEvent: (id) => set((state) => ({
        events: state.events.filter((e) => e.id !== id)
    })),
    getEventsByDate: (date) => {
        const { events } = get();
        return events.filter((event) =>
            event.startDate.toDateString() === date.toDateString()
        );
    },
    getEventsByMonth: (date) => {
        const { events } = get();
        return events.filter((event) =>
            event.startDate.getMonth() === date.getMonth() &&
            event.startDate.getFullYear() === date.getFullYear()
        );
    }
}));
