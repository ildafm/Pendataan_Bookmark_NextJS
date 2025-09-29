
import { collection, getDocs } from "firebase/firestore";
import { auth, db } from "./firebaseConfig";
import { onAuthStateChanged } from "firebase/auth";

export interface Komik {
  id: string;
  judul: string;
  email: string;
}

// sekali fetch data
export const getKomiks = async (): Promise<Komik[]> => {

  // if (!auth.currentUser) {
  //   throw new Error("User not logged in");
  // }

  // const querySnapshot = await getDocs(collection(db, "komiks"));
  // return querySnapshot.docs.map((doc) => ({
  //   id: doc.id,
  //   ...doc.data(),
  // })) as Komik[];

    onAuthStateChanged(auth, (user) => {
      if (user) {
        console.log("User login:", user.uid);
      } else {
        console.log("Belum login");
      }
    });


  return new Promise((resolve, reject) => {
    onAuthStateChanged(auth, async (user) => {
      if (!user) {
        reject(new Error("User not logged in"));
        return;
      }

      try {
        const querySnapshot = await getDocs(collection(db, "komiks"));
        const komiks = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as Komik[];

        resolve(komiks);
      } catch (err) {
        reject(err);
      }
    });
  });
};

