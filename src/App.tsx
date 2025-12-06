import { useState } from 'react';
import Calendar from './components/Calendar';
import EventList from './components/EventList';
import './App.css';

function App() {
  const [currentDate, setCurrentDate] = useState(new Date());

  return (
    <div className="app-container">
      <header className="app-header">
        <h1>행동양식</h1>
      </header>
      <main className="main-content">
        <div className="calendar-section">
          <Calendar onDateChange={setCurrentDate} />
        </div>
        <div className="sidebar-section">
          <EventList currentDate={currentDate} />
        </div>
      </main>
    </div>
  );
}

export default App;
