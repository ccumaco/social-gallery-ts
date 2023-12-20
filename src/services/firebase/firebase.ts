import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  Auth,
  signOut,
  updateProfile,
} from 'firebase/auth'
import app from '../../firebaseConfig'
import { AuthInterface } from '../../typings/Auth.interfaces'
const auth: Auth = getAuth(app)

export const register = async (userData: AuthInterface) => {
  try {
    const { displayedName, email, password } = userData
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password,
    )
    const user = userCredential.user
    updateProfile(user, { displayName: displayedName })
    console.log('User registered:', user)
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

export const login = async (userData: AuthInterface) => {
  try {
    const { email, password } = userData
    const userCredential = await signInWithEmailAndPassword(
      auth,
      email,
      password,
    )
    // El usuario se registró correctamente
    const user = userCredential.user
    console.log('User logged in:', user)
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

export const logout = async () => {
  try {
    await signOut(auth)
    console.log('User logged out')
    return true
  } catch (error: any) {
    console.error('Error during logout:', error)
    return false
  }
}
