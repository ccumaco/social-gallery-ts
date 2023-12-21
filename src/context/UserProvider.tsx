// UserContext.tsx
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  Auth,
  signOut,
  updateProfile,
  onAuthStateChanged,
} from 'firebase/auth'
import React, {
  createContext,
  useState,
  useContext,
  ReactNode,
  useEffect,
} from 'react'
import app from '../firebaseConfig'
import { UserInterface } from '../typings/User.interface'
import { useNavigate } from 'react-router-dom'

const auth: Auth = getAuth(app)

interface UserContextProps {
  user: UserInterface | null
  login: (userData: any) => Promise<UserInterface | any>
  logout: () => Promise<boolean>
  register: (userData: any) => Promise<UserInterface | any>
}

const UserContext = createContext<UserContextProps | undefined>(undefined)

interface UserProviderProps {
  children: ReactNode
}

export const UserProvider: React.FC<UserProviderProps> = ({ children }) => {
  const navigate = useNavigate()
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
      await updateProfile(user, { displayName: displayedName })
      console.log('User registered:', user)
      navigate('/')
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
      const user = userCredential.user
      console.log('User logged in:', user)
      navigate('/')
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
      console.log('User logged out')
      navigate('/login')

      return true
    } catch (error: any) {
      console.error('Error during logout:', error)
      return false
    }
  }

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (authUser) => {
      const user = authUser
        ? {
            uid: authUser.uid,
            email: authUser.email || '',
            displayName: authUser.displayName || '',
          }
        : null
      setUser(user)
    })

    return () => unsubscribe()
  }, [])

  return (
    <UserContext.Provider value={{ user, register, login, logout }}>
      {children}
    </UserContext.Provider>
  )
}

export const useUser = (): UserContextProps => {
  const context = useContext(UserContext)
  if (!context) {
    console.log(context, 'contextcontext')

    throw new Error(
      'useUser debe ser utilizado dentro de un UserProvider' + context,
    )
  }
  return context
}
