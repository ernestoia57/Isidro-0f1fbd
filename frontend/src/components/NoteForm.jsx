import { useState } from 'react';
import { createNote } from '../services/noteService';

export default function NoteForm({ onSuccess, notes, setTab }) {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [categoryInput, setCategoryInput] = useState('');
  const [categories, setCategories] = useState([]);
  const knownCategories = [...new Set(notes.flatMap(n => n.categories || []))];
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title || !content) return;

    await createNote({ title, content, categories });
    setTitle('');
    setContent('');
    setCategories([]);
    onSuccess();
    setTab('all');
  };

  const addCategory = () => {
    const trimmed = categoryInput.trim();
    if (!trimmed) return;

    if (!categories.includes(trimmed)) {
      if (!knownCategories.includes(trimmed)) {
        const confirmCreate = window.confirm("Unknown category. Create?");
        if (!confirmCreate) return;
      }
      setCategories([...categories, trimmed]);
    }
    setCategoryInput('');
  };

  const removeCategory = (catToRemove) => {
    setCategories(categories.filter(cat => cat !== catToRemove));
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3 w-full max-w-md mx-auto">
      <h3 className="text-center font-semibold">Nueva Nota</h3>
        <div className="flex flex-col gap-3">
        
        <input
          type="text"
          placeholder="Title"
          value={title}
          onChange={e => setTitle(e.target.value)}
          className="block w-full min-w-0 bg-neutral-800 border border-neutral-700 rounded px-4 py-2 text-white"
        />
        <div></div>
        <textarea
          placeholder="Content"
          value={content}
          onChange={e => setContent(e.target.value)}
          className="block w-full min-w-0 bg-neutral-800 border border-neutral-700 rounded px-4 py-2 text-white"
        />

      </div>

      <div className="flex items-center gap-4">
        <input
          type="text"
          placeholder="New category"
          value={categoryInput}
          onChange={e => setCategoryInput(e.target.value)}
          className="w-full block min-w-0 bg-neutral-800 border border-neutral-700 rounded px-4 py-2 text-white"
        />
        <button
          type="button"
          onClick={addCategory}
          className="w-8 h-8 bg-neutral-800 border border-neutral-700 rounded text-white text-sm flex items-center justify-center"
        >
          +
        </button>
      </div>

      <div className="flex flex-wrap gap-2">
        {categories.map(cat => (
          <span
            key={cat}
            className="bg-neutral-700 text-white px-3 py-1 rounded-full text-sm flex items-center gap-2"
          >
            <button
              type="button"
              title="Delete"
              onClick={() => removeCategory(cat)}
              className="text-white bg-red-600 hover:bg-red-700 rounded-full w-5 h-5 flex items-center justify-center text-xs"
            >
              {cat}
            </button>
          </span>
        ))}
      </div>

      <button
        type="submit"
        disabled={!title.trim() || !content.trim()}
        className={`px-4 py-2 rounded transition ${
          !title.trim() || !content.trim()
            ? 'bg-gray-500 cursor-not-allowed text-white'
            : 'bg-white text-black hover:bg-gray-300'
        }`}
      >
        Add Note
      </button>
    </form>
  );
}
