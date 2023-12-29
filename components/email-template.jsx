import React from 'react';

const EmailTemplate = ({ token }) => {
  const containerStyle = {
    backgroundColor: '#f7f7f7',
    minHeight: '100vh',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    padding: '20px',
    fontFamily: 'Arial, sans-serif',
  };

  const cardStyle = {
    maxWidth: '500px',
    width: '100%',
    backgroundColor: '#ffffff',
    borderRadius: '8px',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
    padding: '40px',
    textAlign: 'center',
  };

  const headingStyle = {
    fontSize: '28px',
    fontWeight: 'bold',
    marginBottom: '20px',
    color: '#333333',
  };

  const textStyle = {
    fontSize: '16px',
    color: '#555555',
    lineHeight: '1.6',
  };

  const tokenStyle = {
    fontSize: '18px',
    color: '#1a73e8',
    fontWeight: 'bold',
  };

  const buttonStyle = {
    backgroundColor: '#1a73e8',
    color: '#ffffff',
    fontSize: '16px',
    padding: '12px 24px',
    borderRadius: '5px',
    textDecoration: 'none',
    display: 'inline-block',
    marginTop: '30px',
  };

  const verifyURL = `https://sadegh-authentication-system.vercel.app/verify-account/${token}`;

  return (
    <div style={containerStyle}>
      <div style={cardStyle}>
        <h1 style={headingStyle}>Welcome to Our sadegh-authentication-system!</h1>
        <p style={textStyle}>
          Thank you for joining us. Your unique verification token is:{' '}
          <span style={tokenStyle}>{token}</span>
        </p>
        <p style={textStyle}>
          We're thrilled to have you on board! To get started, please verify your account by clicking the button below.
        </p>
        <a href={verifyURL} style={buttonStyle}>
          Verify Account
        </a>
      </div>
    </div>
  );
};

export default EmailTemplate;
