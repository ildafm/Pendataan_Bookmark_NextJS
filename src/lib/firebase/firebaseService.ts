
import { collection, getDocs } from "firebase/firestore";
import { db } from "./firebaseConfig";

export interface Komik {
  id: string;
  judul: string;
  email: string;
}

// sekali fetch data
export const getKomiks = async (): Promise<Komik[]> => {
  const querySnapshot = await getDocs(collection(db, "komiks"));
  const komiks: Komik[] = querySnapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  })) as Komik[];
  
  return komiks;
};