import Calendar from './components/Calendar';
import './App.css';

function App() {
  return (
    <div className="app-container">
      <header className="app-header">
        <h1>My Browser Calendar</h1>
        <p>Manage your schedule with ease</p>
      </header>
      <main>
        <Calendar />
      </main>
    </div>
  );
}

export default App;
