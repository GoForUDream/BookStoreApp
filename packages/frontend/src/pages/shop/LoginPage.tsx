import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useMutation } from '@apollo/client';
import { Box, Container, Card, Typography, TextField, Button, InputAdornment, IconButton, Alert } from '@mui/material';
import { Email, Lock, Visibility, VisibilityOff } from '@mui/icons-material';
import { LOGIN_MUTATION } from '../../graphql/operations';
import { useAuthStore } from '../../stores/auth';
import toast from 'react-hot-toast';

const LoginPage = () => {
  const navigate = useNavigate();
  const { setAuth } = useAuthStore();
  const [form, setForm] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);

  const [login, { loading }] = useMutation(LOGIN_MUTATION, {
    onCompleted: (data) => { setAuth(data.login.user, data.login.token); toast.success('Welcome back!'); navigate('/'); },
    onError: (err) => toast.error(err.message),
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    login({ variables: form });
  };

  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center', background: 'linear-gradient(135deg, #FFD6E0 0%, #E2D9F3 50%, #D1ECF1 100%)' }}>
      <Container maxWidth="sm">
        <Card sx={{ p: 4 }}>
          <Typography variant="h4" sx={{ fontFamily: "'Playfair Display', serif", fontWeight: 600, textAlign: 'center', mb: 1 }}>Welcome Back</Typography>
          <Typography color="text.secondary" textAlign="center" sx={{ mb: 4 }}>Sign in to your account</Typography>

          <form onSubmit={handleSubmit}>
            <TextField
              fullWidth label="Email" type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} required sx={{ mb: 3 }}
              InputProps={{ startAdornment: <InputAdornment position="start"><Email /></InputAdornment> }}
            />
            <TextField
              fullWidth label="Password" type={showPassword ? 'text' : 'password'} value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} required sx={{ mb: 3 }}
              InputProps={{
                startAdornment: <InputAdornment position="start"><Lock /></InputAdornment>,
                endAdornment: <InputAdornment position="end"><IconButton onClick={() => setShowPassword(!showPassword)} edge="end">{showPassword ? <VisibilityOff /> : <Visibility />}</IconButton></InputAdornment>,
              }}
            />
            <Button type="submit" variant="contained" size="large" fullWidth disabled={loading}>{loading ? 'Signing in...' : 'Sign In'}</Button>
          </form>

          <Typography textAlign="center" sx={{ mt: 3 }}>
            Don't have an account? <Link to="/register" style={{ color: '#db637c', textDecoration: 'none', fontWeight: 600 }}>Sign Up</Link>
          </Typography>

          <Alert severity="info" sx={{ mt: 3 }}>
            <Typography variant="body2"><strong>Demo Accounts:</strong></Typography>
            <Typography variant="body2">Admin: admin@bookstore.com / admin123</Typography>
            <Typography variant="body2">User: user@bookstore.com / user123</Typography>
          </Alert>
        </Card>
      </Container>
    </Box>
  );
};

export default LoginPage;
