import { useEffect, useState } from 'react';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';

export default function Home() {
  const [users, setUsers] = useState([]);
  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/users`)
      .then(res => res.json())
      .then(setUsers)
      .catch(() => setUsers([]));
  }, []);
  return (
    <Container>
      <Typography variant="h4" gutterBottom>Users</Typography>
      <List>
        {users.map(user => (
          <ListItem key={user.id}>
            {user.name} ({user.email})
          </ListItem>
        ))}
      </List>
    </Container>
  );
}
