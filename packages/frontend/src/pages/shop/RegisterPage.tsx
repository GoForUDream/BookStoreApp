import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useMutation } from '@apollo/client';
import { Box, Container, Card, Typography, TextField, Button, InputAdornment, IconButton, Grid } from '@mui/material';
import { Person, Email, Lock, Visibility, VisibilityOff } from '@mui/icons-material';
import { REGISTER_MUTATION } from '../../graphql/operations';
import { useAuthStore } from '../../stores/auth';
import toast from 'react-hot-toast';

const RegisterPage = () => {
  const navigate = useNavigate();
  const { setAuth } = useAuthStore();
  const [form, setForm] = useState({ firstName: '', lastName: '', email: '', password: '', confirmPassword: '' });
  const [showPassword, setShowPassword] = useState(false);

  const [register, { loading }] = useMutation(REGISTER_MUTATION, {
    onCompleted: (data) => { setAuth(data.register.user, data.register.token); toast.success('Account created!'); navigate('/'); },
    onError: (err) => toast.error(err.message),
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (form.password !== form.confirmPassword) { toast.error('Passwords do not match'); return; }
    if (form.password.length < 6) { toast.error('Password must be at least 6 characters'); return; }
    register({ variables: { input: { firstName: form.firstName, lastName: form.lastName, email: form.email, password: form.password } } });
  };

  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center', background: 'linear-gradient(135deg, #D1ECF1 0%, #E2D9F3 50%, #FFD6E0 100%)' }}>
      <Container maxWidth="sm">
        <Card sx={{ p: 4 }}>
          <Typography variant="h4" sx={{ fontFamily: "'Playfair Display', serif", fontWeight: 600, textAlign: 'center', mb: 1 }}>Create Account</Typography>
          <Typography color="text.secondary" textAlign="center" sx={{ mb: 4 }}>Join our community of book lovers</Typography>

          <form onSubmit={handleSubmit}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField fullWidth label="First Name" value={form.firstName} onChange={e => setForm({ ...form, firstName: e.target.value })} required
                  InputProps={{ startAdornment: <InputAdornment position="start"><Person /></InputAdornment> }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField fullWidth label="Last Name" value={form.lastName} onChange={e => setForm({ ...form, lastName: e.target.value })} required
                  InputProps={{ startAdornment: <InputAdornment position="start"><Person /></InputAdornment> }}
                />
              </Grid>
            </Grid>
            <TextField fullWidth label="Email" type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} required sx={{ mt: 2 }}
              InputProps={{ startAdornment: <InputAdornment position="start"><Email /></InputAdornment> }}
            />
            <TextField fullWidth label="Password" type={showPassword ? 'text' : 'password'} value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} required sx={{ mt: 2 }}
              InputProps={{
                startAdornment: <InputAdornment position="start"><Lock /></InputAdornment>,
                endAdornment: <InputAdornment position="end"><IconButton onClick={() => setShowPassword(!showPassword)}>{showPassword ? <VisibilityOff /> : <Visibility />}</IconButton></InputAdornment>,
              }}
            />
            <TextField fullWidth label="Confirm Password" type={showPassword ? 'text' : 'password'} value={form.confirmPassword} onChange={e => setForm({ ...form, confirmPassword: e.target.value })} required sx={{ mt: 2, mb: 3 }}
              InputProps={{ startAdornment: <InputAdornment position="start"><Lock /></InputAdornment> }}
            />
            <Button type="submit" variant="contained" size="large" fullWidth disabled={loading}>{loading ? 'Creating Account...' : 'Create Account'}</Button>
          </form>

          <Typography textAlign="center" sx={{ mt: 3 }}>
            Already have an account? <Link to="/login" style={{ color: '#db637c', textDecoration: 'none', fontWeight: 600 }}>Sign In</Link>
          </Typography>
        </Card>
      </Container>
    </Box>
  );
};

export default RegisterPage;
