import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import { useRouter } from 'next/navigation';

export default function Home() {
    const router = useRouter();

  return (
    <Container>
      <Box sx={{ mt: 4, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
       <Button 
       variant="contained" 
       component="label"
       onClick={() => router.push('/edicao')}
       >
        Edição
      </Button>
      </Box>
    </Container>
  );
}
