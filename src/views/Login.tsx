import React from 'react'
import FormAuth from '../components/FormAuth'
import { useLocation } from 'react-router'

const Login = () => {
  const location = useLocation()
  const isRegister = location.pathname === '/register'
  return (
    <div className='flex justify-center items-center min-h-screen'>
      <FormAuth isRegister={isRegister} />
    </div>
  )
}

export default Login
