import { useState } from 'react';
import { useMutation } from '@apollo/client';
import { Box, Container, Typography, Card, Grid, TextField, Button, Avatar, Tabs, Tab } from '@mui/material';
import { UPDATE_PROFILE_MUTATION, CHANGE_PASSWORD_MUTATION } from '../../graphql/operations';
import { useAuthStore } from '../../stores/auth';
import toast from 'react-hot-toast';

const ProfilePage = () => {
  const { user, updateUser } = useAuthStore();
  const [tabValue, setTabValue] = useState(0);
  const [profileForm, setProfileForm] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    phone: user?.phone || '',
    address: user?.address || '',
    city: user?.city || '',
    country: user?.country || '',
    zipCode: user?.zipCode || '',
  });
  const [passwordForm, setPasswordForm] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });

  const [updateProfile, { loading: profileLoading }] = useMutation(UPDATE_PROFILE_MUTATION, {
    onCompleted: (data) => { updateUser(data.updateProfile); toast.success('Profile updated'); },
    onError: (err) => toast.error(err.message),
  });

  const [changePassword, { loading: passwordLoading }] = useMutation(CHANGE_PASSWORD_MUTATION, {
    onCompleted: () => { toast.success('Password changed'); setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' }); },
    onError: (err) => toast.error(err.message),
  });

  const handleProfileSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile({ variables: { input: profileForm } });
  };

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordForm.newPassword !== passwordForm.confirmPassword) { toast.error('Passwords do not match'); return; }
    if (passwordForm.newPassword.length < 6) { toast.error('Password must be at least 6 characters'); return; }
    changePassword({ variables: { currentPassword: passwordForm.currentPassword, newPassword: passwordForm.newPassword } });
  };

  return (
    <Box sx={{ py: 4 }}>
      <Container maxWidth="md">
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 3, mb: 4 }}>
          <Avatar sx={{ width: 100, height: 100, bgcolor: 'primary.main', fontSize: 40 }}>{user?.firstName?.[0]}</Avatar>
          <Box>
            <Typography variant="h4" sx={{ fontFamily: "'Playfair Display', serif", fontWeight: 600 }}>{user?.fullName}</Typography>
            <Typography color="text.secondary">{user?.email}</Typography>
            <Typography variant="body2" color="text.secondary">Member since {new Date(user?.createdAt || '').toLocaleDateString('en-US', { year: 'numeric', month: 'long' })}</Typography>
          </Box>
        </Box>

        <Card>
          <Tabs value={tabValue} onChange={(_, v) => setTabValue(v)} sx={{ borderBottom: 1, borderColor: 'divider', px: 2 }}>
            <Tab label="Profile" />
            <Tab label="Security" />
          </Tabs>

          {tabValue === 0 && (
            <Box component="form" onSubmit={handleProfileSubmit} sx={{ p: 3 }}>
              <Grid container spacing={3}>
                <Grid item xs={12} sm={6}><TextField fullWidth label="First Name" value={profileForm.firstName} onChange={e => setProfileForm({ ...profileForm, firstName: e.target.value })} required /></Grid>
                <Grid item xs={12} sm={6}><TextField fullWidth label="Last Name" value={profileForm.lastName} onChange={e => setProfileForm({ ...profileForm, lastName: e.target.value })} required /></Grid>
                <Grid item xs={12}><TextField fullWidth label="Phone" value={profileForm.phone} onChange={e => setProfileForm({ ...profileForm, phone: e.target.value })} /></Grid>
                <Grid item xs={12}><TextField fullWidth label="Address" value={profileForm.address} onChange={e => setProfileForm({ ...profileForm, address: e.target.value })} /></Grid>
                <Grid item xs={12} sm={6}><TextField fullWidth label="City" value={profileForm.city} onChange={e => setProfileForm({ ...profileForm, city: e.target.value })} /></Grid>
                <Grid item xs={12} sm={6}><TextField fullWidth label="Zip Code" value={profileForm.zipCode} onChange={e => setProfileForm({ ...profileForm, zipCode: e.target.value })} /></Grid>
                <Grid item xs={12}><TextField fullWidth label="Country" value={profileForm.country} onChange={e => setProfileForm({ ...profileForm, country: e.target.value })} /></Grid>
              </Grid>
              <Button type="submit" variant="contained" sx={{ mt: 3 }} disabled={profileLoading}>Save Changes</Button>
            </Box>
          )}

          {tabValue === 1 && (
            <Box component="form" onSubmit={handlePasswordSubmit} sx={{ p: 3 }}>
              <Grid container spacing={3}>
                <Grid item xs={12}><TextField fullWidth type="password" label="Current Password" value={passwordForm.currentPassword} onChange={e => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })} required /></Grid>
                <Grid item xs={12}><TextField fullWidth type="password" label="New Password" value={passwordForm.newPassword} onChange={e => setPasswordForm({ ...passwordForm, newPassword: e.target.value })} required /></Grid>
                <Grid item xs={12}><TextField fullWidth type="password" label="Confirm New Password" value={passwordForm.confirmPassword} onChange={e => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })} required /></Grid>
              </Grid>
              <Button type="submit" variant="contained" sx={{ mt: 3 }} disabled={passwordLoading}>Change Password</Button>
            </Box>
          )}
        </Card>
      </Container>
    </Box>
  );
};

export default ProfilePage;
