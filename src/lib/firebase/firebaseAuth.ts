import { getAuth, signInWithEmailAndPassword, signOut } from "firebase/auth";
import { auth } from "./firebaseConfig";


export async function userLoginWithEmail(email: string, password: string) {
  const userCredential = await signInWithEmailAndPassword(auth, email, password);
  const user = userCredential.user;

  // Dapatkan ID token dan refresh token
  const idToken = await user.getIdToken();
  const refreshToken = user.refreshToken;

  // Simpan keduanya di cookie (1 bulan)
  document.cookie = `token=${idToken}; path=/; max-age=${60 * 60 * 24 * 30}; Secure; SameSite=Lax`;
  document.cookie = `refreshToken=${refreshToken}; path=/; max-age=${60 * 60 * 24 * 30}; Secure; SameSite=Lax`;

  console.log("✅ Login berhasil, cookie tersimpan");
}


export async function userLogout(): Promise<void> {
  if (confirm("Are you sure to logout?")) {
    try {
      const auth = getAuth();
      await signOut(auth);

      // Hapus kedua cookie
      document.cookie = "token=; path=/; max-age=0; Secure; SameSite=Lax";
      document.cookie = "refreshToken=; path=/; max-age=0; Secure; SameSite=Lax";

      console.log("✅ User berhasil logout & cookie dihapus");
      window.location.href = "/auth/sign-in";
    } catch (error) {
      console.error("Error saat logout:", error);
    }
  }
}