import { getAuth, signInWithEmailAndPassword, signOut } from "firebase/auth";
import { auth } from "./firebaseConfig";

export async function userLoginWithEmail(email: string, password: string){
    // const auth = getAuth();

    const userCredential = await signInWithEmailAndPassword(auth, email, password);

    // ✅ User berhasil login
    const user = userCredential.user;
    // console.log("Login berhasil, UID:", user.uid);
    // console.log("Email:", user.email);

    // Mendapatkan token setelah login berhasil
    const token = await user.getIdToken();
    // console.log("ID Token:", token);

     // Simpan token ke cookie (supaya bisa dibaca middleware)
    document.cookie = `token=${token}; path=/; max-age=3600; Secure; SameSite=Lax`;

    // Set cookie menggunakan nookies
    // setCookie(null, "token", idToken, {
    //   maxAge: 30 * 24 * 60 * 60, // 30 hari
    //   path: "/", // Dapat diakses di seluruh aplikasi
    // });
    // return user;
}

export async function userLogout(): Promise<void> {
    if (confirm("Are you sure to logout?")){
        // method untuk logout
        const auth = getAuth();
        try {
            await signOut(auth);

            // ❌ hapus cookie token
            document.cookie = "token=; path=/; max-age=0; Secure; SameSite=Lax";

            console.log("✅ User berhasil logout & cookie dihapus");
            window.location.href = "/login"; // redirect ke login
        } catch (error) {
            console.error("Error saat logout:", error);
        }
    }

}
