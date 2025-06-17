import React, { useState } from 'react';

function UploadFile() {
  const [file, setFile] = useState(null);
  const [status, setStatus] = useState('');

  const handleChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file) {
      setStatus('Selecione um arquivo primeiro.');
      return;
    }
    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch('http://localhost:3001/upload', {
        method: 'POST',
        body: formData,
      });
      if (response.ok) {
        setStatus('Upload realizado com sucesso!');
      } else {
        setStatus('Falha no upload.');
      }
    } catch (error) {
      setStatus('Erro ao enviar arquivo.');
    }
  };

  return (
    <form onSubmit={handleUpload}>
      <input type="file" onChange={handleChange} />
      <button type="submit">Enviar</button>
      <div>{status}</div>
    </form>
  );
}

function App() {
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(false);

  const getFiles = async () => {
    setLoading(true);
    try {
      const response = await fetch('http://localhost:3055/files');
      if (response.ok) {
        const data = await response.json();
        setFiles(data.files || []);
      }
    } catch (e) {
      setFiles([]);
    }
    setLoading(false);
  };

  return (
    <div>
      <UploadFile />
      <button onClick={getFiles}>Listar arquivos</button>
      {loading && <div>Carregando...</div>}
      <ul>
        {files.map(file => (
          <li key={file.filename}>
            <a href={`http://localhost:3055${file.url}`} target="_blank" rel="noopener noreferrer">
              {file.filename}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;