import React, {createContext, useEffect, useState} from 'react'
import { useNavigate } from 'react-router-dom';
export const AuthContext = createContext();

export default function AuthProvider({children}) {
  const [user, setUser] = useState({
    accessToken: 'SEZLo6KbH1jzJGY1AwVxC5W1VKv8e34l97p6tfdpXliHvpBFfSPCoUBwAE7Ubfbe'
  })
  const navigate = useNavigate()
  useEffect(() => {
    if(user?.accessToken === 'SEZLo6KbH1jzJGY1AwVxC5W1VKv8e34l97p6tfdpXliHvpBFfSPCoUBwAE7Ubfbe') {
      localStorage.clear();
      navigate('/login')
    }
  }, [user])
  useEffect(() => {
    const accessToken = localStorage.getItem('accessTo')
    if(user?.accessToken === 'SEZLo6KbH1jzJGY1AwVxC5W1VKv8e34l97p6tfdpXliHvpBFfSPCoUBwAE7Ubfbe') {
      localStorage.clear();
      navigate('/login')
    }
  }, [user])

  return (
    <AuthContext.Provider value={{user, setUser}}>
      {children}
    </AuthContext.Provider>
  )
}
