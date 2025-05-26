import { useState, useEffect, useRef } from 'react';

export default function NoteItem({ note, onDelete, onUpdate }) {
  const [showMenu, setShowMenu] = useState(false);
  const [showCategoryEditor, setShowCategoryEditor] = useState(false);
  const [newCategory, setNewCategory] = useState('');
  const menuRef = useRef(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState(note.title);
  const [editedContent, setEditedContent] = useState(note.content);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setShowMenu(false);
      }
    };

    if (showMenu) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showMenu]);

  const handleArchiveToggle = async () => {
    await fetch(`http://localhost:3000/notes/${note.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ archived: !note.archived }),
    });
    onUpdate();
  };

  const handleDelete = async () => {
    await onDelete(note.id);
  };

  const updateNoteCategories = async (categories) => {
    await fetch(`http://localhost:3000/notes/${note.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ categories }),
    });
    onUpdate();
  };

  const handleAddCategory = async () => {
    const trimmed = newCategory.trim();
    if (!trimmed) return;
    const updated = [...new Set([...(note.categories || []), trimmed])];
    await updateNoteCategories(updated);
    setNewCategory('');
  };

  const handleRemoveCategory = async (catToRemove) => {
    const updated = (note.categories || []).filter(cat => cat !== catToRemove);
    await updateNoteCategories(updated);
  };

  const formattedDate = new Date(note.createdAt).toLocaleString();

  return (
    <div style={{
      border: '1px solid #666',
      borderRadius: '8px',
      padding: '16px',
      margin: '10px',
      backgroundColor: '#222',
      color: 'white',
      position: 'relative',
      width: '250px',
      minHeight: '160px'
    }}>
      <h3 style={{ marginBottom: '8px' }}>{note.title}</h3>
      <p style={{ fontSize: '14px', marginBottom: '8px' }}>{note.content}</p>
      <p style={{ fontSize: '12px', opacity: 0.7 }}>{formattedDate}</p>

      {/* Categorías como chips */}
      <div style={{ display: 'flex', gap: '5px', flexWrap: 'wrap', marginTop: '5px' }}>
        {(note.categories?.length ? note.categories : ['Uncategorized']).map((cat) => (
          <span
            key={cat}
            style={{
              background: '#444',
              padding: '2px 8px',
              borderRadius: '12px',
              fontSize: '12px'
            }}
          >
            {cat}
          </span>
        ))}
      </div>

      {/* Botón de menú (⋮) */}
      <button
        onClick={() => setShowMenu(!showMenu)}
        style={{
          position: 'absolute',
          top: '8px',
          right: '8px',
          background: 'none',
          border: 'none',
          color: 'white',
          fontSize: '18px',
          cursor: 'pointer'
        }}
      >
        ⋮
      </button>

      {/* Menú contextual */}
      {showMenu && (
        <div
          ref={menuRef}
          style={{
            position: 'absolute',
            top: '35px',
            right: '8px',
            backgroundColor: '#333',
            border: '1px solid #777',
            borderRadius: '6px',
            padding: '5px',
            zIndex: 10
          }}>
          <button onClick={() => {setIsEditing(true); setShowMenu(false)}} style={menuItemStyle}>
            Editar nota
          </button>
          <button onClick={() => {setShowCategoryEditor(!showCategoryEditor); setShowMenu(false)}} style={menuItemStyle}>
            Editar categorías
          </button>
          <button onClick={()=> {handleArchiveToggle(); setShowMenu(false)}} style={menuItemStyle}>
            {note.archived ? 'Desarchivar' : 'Archivar'}
          </button>
          <button onClick={async () => { await handleDelete(); setShowMenu(false); }} style={menuItemStyle}>
            Eliminar
          </button>
        </div>
      )}

      {/* Editor de categorías */}
      {showCategoryEditor && (
        <div style={{ marginTop: '10px' }}>
          <input
            type="text"
            placeholder="Agregar categoría"
            value={newCategory}
            onChange={e => setNewCategory(e.target.value)}
            style={{ padding: '4px', marginRight: '6px' }}
          />
          <button onClick={handleAddCategory}>+</button>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '5px', marginTop: '6px' }}>
            {note.categories?.map(cat => (
              <span key={cat} style={{
                background: '#444',
                padding: '2px 6px',
                borderRadius: '10px',
                display: 'flex',
                alignItems: 'center'
              }}>
                {cat}
                <button onClick={() => handleRemoveCategory(cat)} style={{
                  marginLeft: '4px',
                  background: 'none',
                  border: 'none',
                  color: 'red',
                  cursor: 'pointer'
                }}>×</button>
              </span>
            ))}
          </div>

          {/* Botón de cierre (check) */}
          <div style={{ marginTop: '8px' }}>
            <button
              onClick={() => setShowCategoryEditor(false)}
              style={{
                background: '#1f8f2f',
                border: 'none',
                color: 'white',
                borderRadius: '6px',
                padding: '4px 10px',
                cursor: 'pointer'
              }}
            >
              ✔
            </button>
          </div>
        </div>
      )}

      {/* Editor de título y contenido */}
      {isEditing && (
        <div style={{ marginTop: '12px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
          <input
            type="text"
            value={editedTitle}
            onChange={(e) => setEditedTitle(e.target.value)}
            placeholder="Nuevo título"
            style={{ padding: '4px', borderRadius: '4px' }}
          />
          <textarea
            value={editedContent}
            onChange={(e) => setEditedContent(e.target.value)}
            placeholder="Nuevo contenido"
            style={{ padding: '4px', borderRadius: '4px', resize: 'vertical' }}
          />
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
            <button
              onClick={() => {
                setIsEditing(false);
                setEditedTitle(note.title);
                setEditedContent(note.content);
              }}
              style={{
                background: 'gray',
                color: 'white',
                border: 'none',
                padding: '4px 10px',
                borderRadius: '4px'
              }}
            >
              Cancelar
            </button>
            <button
              onClick={async () => {
                if (!editedTitle.trim() || !editedContent.trim()) {
                  alert("El título y el contenido no pueden estar vacíos.");
                  return;
                }

                await fetch(`http://localhost:3000/notes/${note.id}`, {
                  method: 'PATCH',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({ title: editedTitle, content: editedContent }),
                });

                setIsEditing(false);
                onUpdate();
              }}
              style={{
                background: '#2e8b57',
                color: 'white',
                border: 'none',
                padding: '4px 10px',
                borderRadius: '4px'
              }}
            >
              Guardar
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

const menuItemStyle = {
  display: 'block',
  background: 'none',
  border: 'none',
  color: 'white',
  padding: '5px 10px',
  width: '100%',
  textAlign: 'left',
  cursor: 'pointer'
};
