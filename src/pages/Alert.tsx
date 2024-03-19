import React from 'react';

interface AlertProps {
  message: string;
  type: 'success' | 'error' | 'info';
}

const Alert: React.FC<AlertProps> = ({ message, type }) => {
  return (
    <div className={`alert alert-${type}`} role="alert">
      {message}
    </div>
  );
};

export default Alert;
