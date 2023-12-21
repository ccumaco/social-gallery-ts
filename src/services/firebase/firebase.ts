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
    return user
  } catch (error: any) {
    const errorCode = error.code
    const errorMessage = error.message
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
    const user = userCredential.user
    return user
  } catch (error: any) {
    const errorCode = error.code
    const errorMessage = error.message
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
    return true
  } catch (error: any) {
    return false
  }
}
