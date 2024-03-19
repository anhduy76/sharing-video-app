import React, {useContext, useEffect} from 'react'
import {Outlet, useNavigate} from 'react-router-dom'
import { AuthContext } from '../context/AuthProvider'

export default function ProtectedRoute({children}) {
  const {user} = useContext(AuthContext)
  const navigate = useNavigate();
  useEffect(() => {
    if (!localStorage.getItem('accessToken')) {
      navigate('/login')
  
      return
    }

  }, [user])
  return (
    <Outlet/>
  )
}
