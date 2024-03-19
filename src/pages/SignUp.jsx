import React, { useState } from 'react'
import {Typography,Button, TextField} from '@mui/material'
import { graphQLRequest } from '../utils/request';
import { useNavigate } from 'react-router-dom'
import Alert from './Alert';

export default function SignUp() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [showAlert, setShowAlert] =  useState(false);
  const navigate = useNavigate();
  const handleDirectLogin = () => {
    navigate('/login')
  }
  const onChangeEmail = (e) => {
    setEmail(e.target.value)
  }
  const onChangePassword = (e) => {
    setPassword(e.target.value)
  }
  const handleSignUp = async () => {
  
    const res = await graphQLRequest({
      query: `mutation signUp($form: SignUpInput!) {
        signUp(form: $form) {
          token
        }
    }`,
      variables: {
        form: {
          email,
          fullName: email,
          password: password
        }
      },
    });
    console.log(res);
    if(!res.isError) {
      navigate('/login')
      setMessage('Sign up successfully!')
      setShowAlert(true)

      return;
    }
    if(res.isError) {
      setMessage(`${res.message} !`)
      setShowAlert(true)
    }
  }
  return (
    <>
    <div className='layout'>
    <div className='login-container'>
      {showAlert && (
          <Alert
            message={message}
            type="success"
          />
        )}
      <Typography variant="h3">Sign Up</Typography>
      <TextField label="Email" fullWidth placeholder='Fill in email'
      value={email} onChange={onChangeEmail}></TextField>
      <TextField  id="outlined-password-input" label="Password"
          type="password" fullWidth placeholder='Fill in password'
          value={password} onChange={onChangePassword}></TextField>
      <Button variant="contained" size="medium"  onClick={handleSignUp}>Sign Up</Button>
      <div style={{display:'flex', alignItems: 'center', gap:'12px'}}>
      <Typography >Already have an account?</Typography>
      <Button size="small" onClick={handleDirectLogin}>Login</Button>
      </div>
    </div>
    </div>
    </>
  )
}
