import { auth } from '@/lib/firebase/firebaseConfig';
import { getKomiks } from '@/lib/firebase/firebaseService'
import { countByStatus, countByKualitas } from '@/utils/komikHandler'
import { onAuthStateChanged } from 'firebase/auth';

export async function getOverviewData() {
  const komiks = await new Promise((resolve, reject) => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      unsubscribe(); // stop listening setelah sekali dipanggil
      if (user) {
        try {
          const data = await getKomiks();
          resolve(data);
        } catch (err) {
          reject(err);
        }
      } else {
        resolve([]); // kalau belum login → kosong
      }
    });
  });
  
  return {
    total_komiks: {
      value: komiks.length,
      growthRate: 0.43,
    },
    sedang_dibaca: {
      value: countByStatus(komiks, "SD"), // filter semua komik sedang dibaca
      growthRate: 4.35,
    },
    menunggu_update: {
      value: countByStatus(komiks, "MU"), // filter semua komik menunggu update,
      growthRate: 2.59,
    },
    komik_bagus: {
      value: countByKualitas(komiks, ["5", "4"]),
      growthRate: -0.95,
    },
  };
}

export async function getChatsData() {
  // Fake delay
  await new Promise((resolve) => setTimeout(resolve, 1000));

  return [
    {
      name: "Jacob Jones",
      profile: "/images/user/user-01.png",
      isActive: true,
      lastMessage: {
        content: "See you tomorrow at the meeting!",
        type: "text",
        timestamp: "2024-12-19T14:30:00Z",
        isRead: false,
      },
      unreadCount: 3,
    },
    {
      name: "Wilium Smith",
      profile: "/images/user/user-03.png",
      isActive: true,
      lastMessage: {
        content: "Thanks for the update",
        type: "text",
        timestamp: "2024-12-19T10:15:00Z",
        isRead: true,
      },
      unreadCount: 0,
    },
    {
      name: "Johurul Haque",
      profile: "/images/user/user-04.png",
      isActive: false,
      lastMessage: {
        content: "What's up?",
        type: "text",
        timestamp: "2024-12-19T10:15:00Z",
        isRead: true,
      },
      unreadCount: 0,
    },
    {
      name: "M. Chowdhury",
      profile: "/images/user/user-05.png",
      isActive: false,
      lastMessage: {
        content: "Where are you now?",
        type: "text",
        timestamp: "2024-12-19T10:15:00Z",
        isRead: true,
      },
      unreadCount: 2,
    },
    {
      name: "Akagami",
      profile: "/images/user/user-07.png",
      isActive: false,
      lastMessage: {
        content: "Hey, how are you?",
        type: "text",
        timestamp: "2024-12-19T10:15:00Z",
        isRead: true,
      },
      unreadCount: 0,
    },
  ];
}