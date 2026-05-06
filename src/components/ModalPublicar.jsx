import { useState } from 'react';
import './ModalPublicar.css';

function ModalPublicar({ onCerrar }) {
  const [titulo, setTitulo] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [archivo, setArchivo] = useState(null);
  const [preview, setPreview] = useState(null);
  const [error, setError] = useState('');
  const [dragging, setDragging] = useState(false);

  const procesarArchivo = (file) => {
    if (!file) return;
    setArchivo(file);
    setPreview(URL.createObjectURL(file));
  };

  const handleFileInput = (e) => {
    procesarArchivo(e.target.files[0]);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragging(false);
    procesarArchivo(e.dataTransfer.files[0]);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setDragging(true);
  };

  const handleDragLeave = () => setDragging(false);

  const handlePublicar = () => {
    setError('');

    if (!titulo.trim()) {
      setError('El título es obligatorio.');
      return;
    }
    if (!descripcion.trim()) {
      setError('La descripción es obligatoria.');
      return;
    }

    console.log('Publicando:', { titulo, descripcion, archivo });
    onCerrar();
  };

  const handleFondo = (e) => {
    if (e.target === e.currentTarget) onCerrar();
  };

  return (
    <div className="modal-fondo" onClick={handleFondo}>
      <div className="modal-publicar">

        <button className="modal-cerrar" onClick={onCerrar}>✕</button>
        <h2 className="publicar-titulo">Nueva Publicación</h2>

        {error && <p className="publicar-error">{error}</p>}

        <div
          className={`dropzone ${dragging ? 'dragging' : ''} ${preview ? 'con-preview' : ''}`}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onClick={() => document.getElementById('fileInput').click()}
        >
          {preview ? (
            archivo.type.startsWith('video') ? (
              <video src={preview} controls className="preview-media" />
            ) : (
              <img src={preview} alt="preview" className="preview-media" />
            )
          ) : (
            <p className="dropzone-texto">
              Arrastra tu foto o vídeo aquí<br />
              <span>o haz clic para seleccionar</span>
            </p>
          )}
        </div>
        <input
          id="fileInput"
          type="file"
          accept="image/*,video/*"
          style={{ display: 'none' }}
          onChange={handleFileInput}
        />

        <input
          className="publicar-input"
          type="text"
          placeholder="Título de tu publicación..."
          value={titulo}
          onChange={(e) => setTitulo(e.target.value)}
        />

        <textarea
          className="publicar-textarea"
          placeholder="Descripción de tu publicación..."
          value={descripcion}
          onChange={(e) => setDescripcion(e.target.value)}
          rows={3}
        />

        <button className="btn-publicar-modal" onClick={handlePublicar}>
          Publicar
        </button>

      </div>
    </div>
  );
}

export default ModalPublicar;
