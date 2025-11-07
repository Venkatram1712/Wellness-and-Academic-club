import { Container, Typography } from '@mui/material';
const NotFound = () => (
  <Container sx={{ mt: 4, textAlign: 'center' }}>
    <Typography variant="h3" color="error" gutterBottom>404</Typography>
    <Typography variant="h5">Page Not Found</Typography>
    <Typography>The page you are looking for does not exist.</Typography>
  </Container>
);
export default NotFound;