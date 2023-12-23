// UserContext.tsx
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  Auth,
  signOut,
  updateProfile,
  onAuthStateChanged,
  GoogleAuthProvider,
  signInWithPopup,
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
import {
  addDoc,
  collection,
  getDocs,
  getFirestore,
  query,
  where,
} from 'firebase/firestore'

const auth: Auth = getAuth(app)

interface UserContextProps {
  user: UserInterface | null
  login: (userData: any) => Promise<UserInterface | any>
  logout: () => Promise<boolean>
  register: (userData: any) => Promise<UserInterface | any>
  registerAndSignIn: (userData: any) => Promise<UserInterface | any>
  signInWithGoogle: (userData: any) => Promise<UserInterface | any>
}

const UserContext = createContext<UserContextProps | undefined>(undefined)

interface UserProviderProps {
  children: ReactNode
}

export const UserProvider: React.FC<UserProviderProps> = ({ children }) => {
  const navigate = useNavigate()
  const [user, setUser] = useState<UserInterface | null>(null)
  const signInWithGoogle = async () => {
    try {
      const provider = new GoogleAuthProvider()
      const result = await signInWithPopup(auth, provider)
      const user = result.user
      const db = getFirestore()
      const usersCollection = collection(db, 'Users')
      const userQuerySnapshot = await getDocs(
        query(usersCollection, where('uid', '==', user.uid)),
      )

      if (userQuerySnapshot.empty) {
        await addDoc(usersCollection, {
          uid: user.uid,
          displayName: user.displayName,
        })
      }

      console.log('User signed in with Google:', user)
      navigate('/')
      return user
    } catch (error) {
      console.error('Error during Google sign-in:', error)
      return {
        error: {
          message: 'Error during Google sign-in',
        },
      }
    }
  }
  const registerAndSignIn = async ({
    displayedName,
  }: {
    displayedName: string
  }) => {
    try {
      if (!displayedName) {
        return {
          error: {
            code: '400',
            message: 'Nickname is required',
          },
        }
      }

      const auth = getAuth()
      const provider = new GoogleAuthProvider()
      const userCredential = await signInWithPopup(auth, provider)
      const user = userCredential.user

      await updateProfile(user, { displayName: displayedName })

      const db = getFirestore()
      const usersCollection = collection(db, 'Users')
      await addDoc(usersCollection, {
        uid: user.uid,
        displayedName,
      })

      console.log('User registered and signed in:', user)
      navigate('/')
      return user
    } catch (error) {
      console.error('Error during registration and sign-in:', error)
      return {
        error: {
          message: 'Error during registration and sign-in',
        },
      }
    }
  }

  const register = async (userData: any) => {
    try {
      const { displayedName, email, password } = userData
      const auth = getAuth()
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password,
      )
      const user = userCredential.user

      const db = getFirestore()
      const usersCollection = collection(db, 'Users')
      await addDoc(usersCollection, {
        uid: user.uid,
        displayName: displayedName,
      })

      // Actualiza el perfil del usuario con el displayName
      await updateProfile(user, { displayName: displayedName })

      console.log('User registered:', user)
      navigate('/') // Ajusta según tu lógica de navegación
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
    <UserContext.Provider
      value={{
        user,
        register,
        login,
        logout,
        registerAndSignIn,
        signInWithGoogle,
      }}
    >
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
