import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  Auth,
} from "firebase/auth";
import app from "../../firebaseConfig";

const auth: Auth = getAuth(app);

export const register = async (email: string, password: string) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );
    // El usuario se registró correctamente
    const user = userCredential.user;
    console.log("User registered:", user);
  } catch (error: any) {
    const errorCode = error.code;
    const errorMessage = error.message;
    console.error("Error during registration:", errorCode, errorMessage);
  }
};

export const login = async (email: string, password: string) => {
  try {
    const userCredential = await signInWithEmailAndPassword(
      auth,
      email,
      password
    );
    // El usuario se registró correctamente
    const user = userCredential.user;
    console.log("User logged in:", user);
  } catch (error: any) {
    const errorCode = error.code;
    const errorMessage = error.message;
    console.error("Error during login:", errorCode, errorMessage);
  }
};

export const logout = async () => {
  try {
    await auth.signOut();
    console.log("User logged out");
  } catch (error: any) {
    console.error("Error during logout:", error);
  }
};
