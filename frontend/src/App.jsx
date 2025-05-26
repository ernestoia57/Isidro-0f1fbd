import './App.css';
import NoteList from './components/NoteList';
import Login from './components/Login';
import { useEffect, useState } from 'react';

function App() {
  const [loggedIn, setLoggedIn] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    setLoggedIn(!!token);
  }, []);

  const handleLogin = () => {
    setLoggedIn(true);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setLoggedIn(false);
  };

  return (
    <div className="App">
      {loggedIn ? (
        <>
          <button onClick={handleLogout} style={{ position: 'absolute', top: 10, right: 10 }}>
            Cerrar sesión
          </button>
          <NoteList />
        </>
      ) : (
        <Login onLogin={handleLogin} />
      )}
    </div>
  );
}

export default App;
