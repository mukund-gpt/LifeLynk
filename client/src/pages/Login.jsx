import React, { useState } from 'react';
import { TextField, Button, Card, Typography } from '@mui/material';
import { loginUser } from '../apis/userApi'; 

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const data = await loginUser(email, password);
      console.log(data); 
    } catch (err) {
      alert(err.response?.data?.message || 'Login failed');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 to-white">
      <Card className="p-8 w-full max-w-md shadow-2xl rounded-2xl">
        <Typography variant="h5" className="mb-6 text-center font-semibold text-blue-700">
          Login to Your Account
        </Typography>
        <form onSubmit={handleLogin} className="flex flex-col gap-4">
          <TextField
            label="Email"
            type="email"
            variant="outlined"
            fullWidth
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <TextField
            label="Password"
            type="password"
            variant="outlined"
            fullWidth
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <Button
            variant="contained"
            type="submit"
            fullWidth
            className="!mt-4 !bg-blue-600 hover:!bg-blue-700"
          >
            Login
          </Button>
        </form>
      </Card>
    </div>
  );
};

export default LoginPage;
