import React, { createContext, useContext, useState, useEffect } from 'react';
import { db, auth } from '../lib/firebase';
import { doc, getDoc, setDoc, onSnapshot } from 'firebase/firestore';
import { GoogleAuthProvider, signInWithPopup, onAuthStateChanged, User } from 'firebase/auth';
import { DEFAULT_CONTENT } from '../constants/defaultContent';

interface ContentContextType {
  content: typeof DEFAULT_CONTENT;
  loading: boolean;
  user: User | null;
  isAdmin: boolean;
  login: () => Promise<void>;
  updateContent: (newContent: typeof DEFAULT_CONTENT) => Promise<void>;
}

const ContentContext = createContext<ContentContextType | null>(null);

export const ContentProvider = ({ children }: { children: React.ReactNode }) => {
  const [content, setContent] = useState(DEFAULT_CONTENT);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const unsubContent = onSnapshot(doc(db, 'settings', 'landing-page'), (docSnap) => {
      if (docSnap.exists()) {
        setContent(docSnap.data() as typeof DEFAULT_CONTENT);
      } else {
        // Seed initial data if it doesn't exist
        setDoc(doc(db, 'settings', 'landing-page'), DEFAULT_CONTENT);
      }
      setLoading(false);
    });

    const unsubAuth = onAuthStateChanged(auth, async (user) => {
      setUser(user);
      if (user) {
        const adminSnap = await getDoc(doc(db, 'admins', user.uid));
        setIsAdmin(adminSnap.exists());
      } else {
        setIsAdmin(false);
      }
    });

    return () => {
      unsubContent();
      unsubAuth();
    };
  }, []);

  const login = async () => {
    const provider = new GoogleAuthProvider();
    await signInWithPopup(auth, provider);
  };

  const updateContent = async (newContent: typeof DEFAULT_CONTENT) => {
    if (!isAdmin) throw new Error('Unauthorized');
    await setDoc(doc(db, 'settings', 'landing-page'), newContent);
  };

  return (
    <ContentContext.Provider value={{ content, loading, user, isAdmin, login, updateContent }}>
      {children}
    </ContentContext.Provider>
  );
};

export const useContent = () => {
  const context = useContext(ContentContext);
  if (!context) throw new Error('useContent must be used within ContentProvider');
  return context;
};
