import React from 'react'
import FormAuth from '../components/FormAuth'
import { useLocation } from 'react-router'
import { useUser } from './../context/UserProvider'
import { Navigate } from 'react-router-dom'

const Login = () => {
  const location = useLocation()
  const { user } = useUser()
  if (user) {
    return (
      <Navigate
        to='/'
        replace
      />
    )
  }
  const isRegister = location.pathname === '/register'
  return (
    <div className='flex justify-center items-center min-h-screen'>
      <FormAuth isRegister={isRegister} />
    </div>
  )
}

export default Login
