// components/Button.tsx
import React, { FC } from 'react';

interface ButtonProps {
  text: string;
  onClick?: () => void;
}

const Button: FC<ButtonProps> = ({ text, onClick }) => {
  return (
    <button
      onClick={onClick}
      style={{
        width: '100%',
        padding: '12px',
        backgroundColor: '#333',
        color: '#ccc',
        border: 'none',
        borderRadius: '5px',
        cursor: 'pointer',
        marginTop: '10px',
      }}
    >
      {text}
    </button>
  );
};

export default Button;
