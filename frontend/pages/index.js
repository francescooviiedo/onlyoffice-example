import { useEffect, useState } from 'react';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import Box from '@mui/material/Box';
import { styled } from '@mui/material/styles';
import Button from '@mui/material/Button';

const VisuallyHiddenInput = styled('input')({
  clip: 'rect(0 0 0 0)',
  clipPath: 'inset(50%)',
  height: 1,
  overflow: 'hidden',
  position: 'absolute',
  bottom: 0,
  left: 0,
  whiteSpace: 'nowrap',
  width: 1,
});

export default function Home() {
  const [users, setUsers] = useState([]);
  const [file, setFile] = useState(null);
  const [status, setStatus] = useState('');
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/users`)
      .then(res => res.json())
      .then(setUsers)
      .catch(() => setUsers([]));
  }, []);

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

  useEffect(() => {
    getFiles();
  }, []);

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
      const response = await fetch('http://localhost:3055/files', {
        method: 'POST',
        body: formData,
      });
      if (response.ok) {
        setStatus('Upload realizado com sucesso!');
        getFiles();
      } else {
        setStatus('Falha no upload.');
      }
    } catch (error) {
      setStatus('Erro ao enviar arquivo.');
    }
  };

  return (
    <Container>
      <Box sx={{ mt: 4, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
        <form onSubmit={handleUpload} style={{ marginTop: 16 }}>
        <Button
          component="label"
          role={undefined}
          variant="contained"
          tabIndex={-1}
        >
          Upload files
          <VisuallyHiddenInput
            type="file"
            onChange={handleChange}
            multiple
          />
        </Button>
        <Button
          type="submit"
          variant="contained"
          color="primary"
          sx={{ ml: 2 }}
        >
          Enviar
        </Button>
        </form>
        {loading && <div>Carregando...</div>}

        <ul>
          {files.map(file => (
            <li key={file.filename}>
              <a
                href={`http://localhost:3055${file.url}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                {file.filename}
              </a>
            </li>
          ))}
        </ul>
      </Box>
    </Container>
  );
}
