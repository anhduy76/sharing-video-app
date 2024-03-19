import React, { useContext, useEffect, useState } from 'react'
import {Typography,Button, TextField} from '@mui/material'
import { AuthContext } from '../context/AuthProvider'
import { useNavigate } from 'react-router-dom'
import { graphQLRequest } from '../utils/request';

export default function Login() {
  const {user, setUser} = useContext(AuthContext)
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const handleSignUp = () => {
    navigate('/signUp')
  }
  const onChangeEmail = (e) => {
    setEmail(e.target.value)
  }
  const onChangePassword = (e) => {
    setPassword(e.target.value)
  }
  const handleLogIn = async () => {
    const data = await onLogIn();
    if(data && data.signIn && data.signIn.token) {
      localStorage.setItem('accessToken', data.signIn.token)
      navigate('/')
    }
  }
  const onLogIn = async () => {
    const res = await graphQLRequest({
      query: `mutation signIn($form: SignInInput!) {
        signIn(form: $form) {
          token
        }
    }`,
      variables: {
        form: {
          email,
          password
        }
      },
    });
    if (!res ||!res.signIn) {
      return null;
    }
    setUser({
      ...user, accessToken: res.signIn.token,
      userName: email
    })

    return res;
  }
  useEffect(() => {
    if (user?.accessToken && 
      user?.accessToken !== 'SEZLo6KbH1jzJGY1AwVxC5W1VKv8e34l97p6tfdpXliHvpBFfSPCoUBwAE7Ubfbe') {
      localStorage.setItem('accessToken', user?.accessToken)
      navigate('/')
  
      return
    }

  }, [user])
  return (
    <>
    <div className='layout'>
    <div className='login-container'>
      <Typography variant="h3">Log In</Typography>
      <TextField  label="Email" fullWidth placeholder='Fill in email'
      value={email} onChange={onChangeEmail}></TextField>
      <TextField  id="outlined-password-input" label="Password"
          type="password" fullWidth placeholder='Fill in password'
          value={password} onChange={onChangePassword}></TextField>
      <Button variant="contained" size="medium" onClick={handleLogIn} >Login</Button>
      <div style={{display:'flex', alignItems: 'center', gap:'12px'}}>
      <Typography >Don't have an account?</Typography>
      <Button size="small" onClick={handleSignUp}>Sign Up</Button>
      </div>
    </div>
    </div>
    </>
  )
}
