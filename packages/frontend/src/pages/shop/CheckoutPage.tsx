import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMutation } from '@apollo/client';
import { Box, Container, Typography, Grid, Card, TextField, Button, Stepper, Step, StepLabel, FormControl, FormControlLabel, Radio, RadioGroup, Divider } from '@mui/material';
import { CreditCard, AccountBalance, Payment } from '@mui/icons-material';
import { CHECKOUT_MUTATION } from '../../graphql/operations';
import { useCart } from '../../hooks/useCart';
import toast from 'react-hot-toast';

const CheckoutPage = () => {
  const navigate = useNavigate();
  const { cart, refetch } = useCart();
  const [activeStep, setActiveStep] = useState(0);
  const [form, setForm] = useState({ shippingAddress: '', shippingCity: '', shippingCountry: 'USA', shippingZipCode: '', paymentMethod: 'credit_card', notes: '' });

  const [checkout, { loading }] = useMutation(CHECKOUT_MUTATION, {
    onCompleted: (data) => { toast.success('Order placed successfully!'); refetch(); navigate(`/orders/${data.checkout.id}`); },
    onError: (err) => toast.error(err.message),
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => setForm({ ...form, [e.target.name]: e.target.value });
  const handleNext = () => setActiveStep(s => s + 1);
  const handleBack = () => setActiveStep(s => s - 1);
  const handleSubmit = () => checkout({ variables: { input: form } });

  const isShippingValid = form.shippingAddress && form.shippingCity && form.shippingCountry && form.shippingZipCode;

  if (cart.items.length === 0) { navigate('/cart'); return null; }

  return (
    <Box sx={{ py: 4 }}>
      <Container maxWidth="lg">
        <Typography variant="h3" sx={{ fontFamily: "'Playfair Display', serif", fontWeight: 600, mb: 4 }}>Checkout</Typography>
        <Stepper activeStep={activeStep} sx={{ mb: 4 }}>{['Shipping', 'Payment', 'Review'].map(label => <Step key={label}><StepLabel>{label}</StepLabel></Step>)}</Stepper>
        <Grid container spacing={4}>
          <Grid item xs={12} md={8}>
            <Card sx={{ p: 3 }}>
              {activeStep === 0 && (
                <Box>
                  <Typography variant="h6" fontWeight={600} gutterBottom>Shipping Address</Typography>
                  <Grid container spacing={2}>
                    <Grid item xs={12}><TextField fullWidth label="Street Address" name="shippingAddress" value={form.shippingAddress} onChange={handleChange} required /></Grid>
                    <Grid item xs={12} sm={6}><TextField fullWidth label="City" name="shippingCity" value={form.shippingCity} onChange={handleChange} required /></Grid>
                    <Grid item xs={12} sm={6}><TextField fullWidth label="ZIP Code" name="shippingZipCode" value={form.shippingZipCode} onChange={handleChange} required /></Grid>
                    <Grid item xs={12}><TextField fullWidth select label="Country" name="shippingCountry" value={form.shippingCountry} onChange={handleChange} SelectProps={{ native: true }}>{['USA', 'UK', 'Canada', 'Australia', 'Germany', 'France'].map(c => <option key={c} value={c}>{c}</option>)}</TextField></Grid>
                  </Grid>
                  <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 3 }}><Button variant="contained" onClick={handleNext} disabled={!isShippingValid}>Continue to Payment</Button></Box>
                </Box>
              )}
              {activeStep === 1 && (
                <Box>
                  <Typography variant="h6" fontWeight={600} gutterBottom>Payment Method</Typography>
                  <FormControl component="fieldset">
                    <RadioGroup name="paymentMethod" value={form.paymentMethod} onChange={handleChange}>
                      {[{ value: 'credit_card', label: 'Credit Card', icon: <CreditCard /> }, { value: 'paypal', label: 'PayPal', icon: <Payment /> }, { value: 'bank_transfer', label: 'Bank Transfer', icon: <AccountBalance /> }].map(opt => (
                        <Card key={opt.value} sx={{ mb: 2, p: 2, border: form.paymentMethod === opt.value ? '2px solid' : '1px solid', borderColor: form.paymentMethod === opt.value ? 'primary.main' : 'divider' }}>
                          <FormControlLabel value={opt.value} control={<Radio />} label={<Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>{opt.icon}{opt.label}</Box>} />
                        </Card>
                      ))}
                    </RadioGroup>
                  </FormControl>
                  <TextField fullWidth multiline rows={2} label="Order Notes (optional)" name="notes" value={form.notes} onChange={handleChange} sx={{ mt: 2 }} />
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 3 }}><Button onClick={handleBack}>Back</Button><Button variant="contained" onClick={handleNext}>Review Order</Button></Box>
                </Box>
              )}
              {activeStep === 2 && (
                <Box>
                  <Typography variant="h6" fontWeight={600} gutterBottom>Review Your Order</Typography>
                  <Box sx={{ mb: 3 }}><Typography color="text.secondary" gutterBottom>Shipping Address</Typography><Typography>{form.shippingAddress}, {form.shippingCity}, {form.shippingZipCode}, {form.shippingCountry}</Typography></Box>
                  <Box sx={{ mb: 3 }}><Typography color="text.secondary" gutterBottom>Payment Method</Typography><Typography sx={{ textTransform: 'capitalize' }}>{form.paymentMethod.replace('_', ' ')}</Typography></Box>
                  <Divider sx={{ my: 2 }} />
                  <Typography fontWeight={600} gutterBottom>Items ({cart.itemCount})</Typography>
                  {cart.items.map(item => (
                    <Box key={item.id} sx={{ display: 'flex', justifyContent: 'space-between', py: 1 }}>
                      <Typography>{item.book.title} × {item.quantity}</Typography>
                      <Typography fontWeight={500}>${item.subtotal.toFixed(2)}</Typography>
                    </Box>
                  ))}
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 3 }}><Button onClick={handleBack}>Back</Button><Button variant="contained" onClick={handleSubmit} disabled={loading}>{loading ? 'Processing...' : 'Place Order'}</Button></Box>
                </Box>
              )}
            </Card>
          </Grid>
          <Grid item xs={12} md={4}>
            <Card sx={{ p: 3, position: 'sticky', top: 100 }}>
              <Typography variant="h6" fontWeight={600} gutterBottom>Order Summary</Typography>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}><Typography color="text.secondary">Subtotal</Typography><Typography>${cart.subtotal.toFixed(2)}</Typography></Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}><Typography color="text.secondary">Shipping</Typography><Typography>{cart.shipping === 0 ? 'Free' : `$${cart.shipping.toFixed(2)}`}</Typography></Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}><Typography color="text.secondary">Tax</Typography><Typography>${cart.tax.toFixed(2)}</Typography></Box>
              <Divider sx={{ my: 2 }} />
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}><Typography variant="h6" fontWeight={600}>Total</Typography><Typography variant="h6" fontWeight={600} color="primary.main">${cart.total.toFixed(2)}</Typography></Box>
            </Card>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default CheckoutPage;
