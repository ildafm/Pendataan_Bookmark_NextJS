import { getAuth, signInWithEmailAndPassword, signOut } from "firebase/auth";
import { auth } from "./firebaseConfig";

export async function userLoginWithEmail(email: string, password: string){
    const userCredential = await signInWithEmailAndPassword(auth, email, password);

    // ✅ User berhasil login
    const user = userCredential.user;
    // console.log("Login berhasil, UID:", user.uid);
    // console.log("Email:", user.email);

    // Mendapatkan token setelah login berhasil
    const token = await user.getIdToken();
    // console.log("ID Token:", token);

    // Set cookie menggunakan nookies
    // setCookie(null, "token", idToken, {
    //   maxAge: 30 * 24 * 60 * 60, // 30 hari
    //   path: "/", // Dapat diakses di seluruh aplikasi
    // });
    // return user;
}

export async function userLogout(): Promise<void> {
    // method untuk logout
    alert("Proses Logout")
    const auth = getAuth();
    try {
        await signOut(auth);
        console.log("User berhasil logout");
    } catch (error) {
        console.error("Error saat logout:", error);
    }
}