// pages/login.tsx
import React from 'react';
import TextField from '../../../components/ui/textField';
import Theme from '../../../../styles/theme';
import Button from '@/components/ui/Button';

const LoginPage: React.FC = () => {
  return (
    <div style={{ 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center', 
      minHeight: '100vh', 
      width: '100vw',
      backgroundColor: '#f5f5f5',
      overflow: 'hidden' // Prevent scrolling
    }}>
      <div style={{ 
        backgroundColor: Theme.colors.background, 
        padding: '20px', 
        borderRadius: '10px', 
        boxShadow: '0 2px 5px rgba(0, 0, 0, 0.2)',
        maxWidth: '90vw', // Ensures responsiveness on smaller screens
        width: '100%', 
        maxHeight: '80vh', // Prevents the container from becoming too large on taller screens
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <h2 style={{ textAlign: 'center', color: Theme.colors.text, marginBottom: '10px' }}>Login Page</h2>
        <TextField placeholder="Unique ID" />
        <TextField placeholder="Password" type="password" />
        <div style={{ textAlign: 'right', margin: '8px 0', color: '#333', cursor: 'pointer', fontSize: '0.9em' }}>
          <a href="#" style={{ textDecoration: 'none', color: '#333' }}>Forgot password?</a>
        </div>
        <TextField placeholder="Login as" />
        <Button text="Login" />
      </div>
    </div>
  );
};

export default LoginPage;
