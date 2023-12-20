// UserContext.tsx
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  Auth,
  signOut,
  updateProfile,
} from 'firebase/auth'
import React, { createContext, useState, useContext, ReactNode } from 'react'
import app from '../firebaseConfig'
import { AuthInterface } from '../typings/Auth.interfaces'
import { UserInterface } from '../typings/User.interface'
const auth: Auth = getAuth(app)

interface UserContextProps {
  user: UserInterface | null
  login: (userData: UserInterface) => UserInterface | any
  logout: () => void
  register: (userData: UserInterface) => UserInterface | any
}

const UserContext = createContext<UserContextProps | undefined>(undefined)

interface UserProviderProps {
  children: ReactNode
}

export const UserProvider: React.FC<UserProviderProps> = ({ children }) => {
  const [user, setUser] = useState<UserInterface | null>(null)
  const register = async (userData: any) => {
    try {
      const { displayedName, email, password } = userData
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password,
      )
      const user = userCredential.user
      updateProfile(user, { displayName: displayedName })
      console.log('UserInterface registered:', user)
      return user
    } catch (error: any) {
      const errorCode = error.code
      const errorMessage = error.message
      console.error('Error during registration:', errorCode)
      return {
        error: {
          code: errorCode,
          message: errorMessage,
        },
      }
    }
  }

  const login = async (userData: any) => {
    try {
      const { email, password } = userData
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password,
      )
      // El usuario se registró correctamente
      const user = userCredential.user
      console.log('UserInterface logged in:', user)
      return user
    } catch (error: any) {
      const errorCode = error.code
      const errorMessage = error.message
      console.error('Error during login:', errorCode, errorMessage)
      return {
        error: {
          code: errorCode,
          message: errorMessage,
        },
      }
    }
  }

  const logout = async () => {
    try {
      await signOut(auth)
      console.log('UserInterface logged out')
      return true
    } catch (error: any) {
      console.error('Error during logout:', error)
      return false
    }
  }

  return (
    <UserContext.Provider value={{ user, register, login, logout }}>
      {children}
    </UserContext.Provider>
  )
}

export const useUser = (): UserContextProps => {
  const context = useContext(UserContext)
  if (!context) {
    throw new Error('useUser debe ser utilizado dentro de un UserProvider')
  }
  return context
}
