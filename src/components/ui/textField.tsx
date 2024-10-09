// components/TextField.tsx
import React, { FC } from 'react';

interface TextFieldProps {
  placeholder: string;
  type?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const TextField: FC<TextFieldProps> = ({ placeholder, type = 'text', value, onChange }) => {
  return (
    <input
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      style={{
        width: '100%',
        padding: '10px',
        margin: '8px 0',
        boxSizing: 'border-box',
        border: 'none',
        borderRadius: '5px',
        backgroundColor: '#d3d3d3',
      }}
    />
  );
};

export default TextField;
