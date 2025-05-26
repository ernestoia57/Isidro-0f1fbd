import { useEffect, useState } from 'react';
import { getNotes, deleteNote } from '../services/noteService';
import NoteItem from './NoteItem';
import NoteForm from './NoteForm';

export default function NoteList() {
  const [notes, setNotes] = useState([]);
  const [tab, setTab] = useState('all');

  const loadNotes = async () => {
    const res = await getNotes();
    setNotes(res.data);
  };

  useEffect(() => {
    loadNotes();
  }, []);

  const handleDelete = async (id) => {
    await deleteNote(id);
    loadNotes();
  };

  const allCategories = [...new Set(
    notes.filter(n => !n.archived).flatMap(n => n.categories || [])
  )];

  const renderNotes = () => {
    if (tab === 'archived') {
      const archivedNotes = notes.filter(note => note.archived);
      return archivedNotes.length > 0 ? (
        <div style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: '16px',
          justifyContent: 'center'
        }}>
          {archivedNotes.map(note => (
            <NoteItem key={note.id} note={note} onDelete={handleDelete} onUpdate={loadNotes} />
          ))}
        </div>
      ) : (
        <p>No hay notas archivadas.</p>
      );
    }

    if (tab === 'listActive') {
      const activeNotes = notes.filter(note => !note.archived);
      return (
        <ul>
          {activeNotes.map(note => (
            <li key={note.id}>
              {note.title} | {new Date(note.createdAt).toLocaleString()} | {note.categories?.[0] || 'Uncategorized'}
            </li>
          ))}
        </ul>
      );
    }

    if (tab === 'listArchived') {
      const archivedNotes = notes.filter(note => note.archived);
      return (
        <ul>
          {archivedNotes.map(note => (
            <li key={note.id}>
              {note.title} | {new Date(note.createdAt).toLocaleString()} | {note.categories?.[0] || 'Uncategorized'}
            </li>
          ))}
        </ul>
      );
    }

    const filteredNotes = tab === 'all'
      ? notes.filter(note => !note.archived)
      : notes.filter(note => !note.archived && note.categories?.includes(tab));

    return (
      <div style={{
        display: 'flex',
        flexWrap: 'wrap',
        gap: '16px',
        justifyContent: 'center'
      }}>
        {(tab === 'all') && (
          <NoteForm onSuccess={loadNotes} notes={notes} setTab={setTab} />
        )}
        {filteredNotes.length > 0 ? (
          filteredNotes.map(note => (
            <NoteItem key={note.id} note={note} onDelete={handleDelete} onUpdate={loadNotes} />
          ))
        ) : (
          <p style={{ color: 'white' }}>No hay notas para esta categoría.</p>
        )}
      </div>
    );
  };

  return (
    <div>
      <h1>Notas</h1>

      {/* ✅ Mantén los botones de filtrado */}
      <div style={{
        display: 'flex',
        flexWrap: 'wrap',
        gap: '10px',
        marginBottom: '20px',
        justifyContent: 'center'
      }}>
        <button onClick={() => setTab('all')}>Todas</button>
        {allCategories.map(cat => (
          <button key={cat} onClick={() => setTab(cat)}>{cat}</button>
        ))}
        <button onClick={() => setTab('archived')}>♻︎ Archivadas</button>
        <button onClick={() => setTab('listActive')}>☑︎ Lista activas</button>
        <button onClick={() => setTab('listArchived')}>◻︎ Lista archivadas</button>
      </div>

      {/* ✅ El renderizado de las notas, que incluye el formulario */}
      {renderNotes()}
    </div>
  );
}
