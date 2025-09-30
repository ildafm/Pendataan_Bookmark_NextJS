
import { collection, getDocs } from "firebase/firestore";
import { auth, db } from "./firebaseConfig";

export interface Komik {
  id: string;
  judul: string;
  email: string;
}

// sekali fetch data
export const getKomiks = async (): Promise<Komik[]> => {
  const user = auth.currentUser;
  console.log(user);
  
  if (!user) {
    throw new Error("User not logged in")
    // console.error("User not logged in");
    // return []; // atau throw Error kalau mau hard-fail
  }

  try {
    const querySnapshot = await getDocs(collection(db, "komiks"));
    return querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as Komik[];
  } catch (err) {
    console.error("Error fetch komiks:", err);
    return [];
  }
};