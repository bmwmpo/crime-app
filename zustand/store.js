import { create } from "zustand";

const useStore = create((set, get) => ({
  user: { email: "", username: "", password: "", userID: "" },
  preference: { darkMode: false },
  signIn: false,
  docID: "",
  setEmail: (email) =>
    set((state) => ({
      user: { ...state.user, email },
      preference: { ...state.preference },
      signIn: state.signIn,
      docID: state.docID,
    })),
  setPassword: (password) =>
    set((state) => ({
      user: { ...state.user, password },
      preference: { ...state.preference },
      signIn: state.signIn,
      docID: state.docID,
    })),
  setUsername: (username) =>
    set((state) => ({
      user: { ...state.user, username },
      preference: { ...state.preference },
      signIn: state.signIn,
      docID: state.docID,
    })),
  setDocId: (docID) =>
    set((state) => ({
      user: { ...state.user },
      preference: { ...state.preference },
      signIn: state.signIn,
      docID,
    })),
  setIsDarkMode: (isDarkMode) =>
    set((state) => ({
      user: { ...state.user },
      preference: { ...state.preference, darkMode: isDarkMode },
      docID: state.docID,
      signIn: state.signIn,
    })),
  setIsSignIn: () =>
    set((state) => ({
      user: { ...state.user },
      preference: { ...state.preference },
      signIn: !state.signIn,
      docID: state.docID,
    })),
  setSignedInUser: (email, username, docID, userId, darkMode) =>
    set((state) => ({
      user: { ...state.user, email, username, userId },
      preference: { ...state.preference, darkMode },
      signIn: true,
      docID,
    })),
  setLogOutUser: () =>
    set((state) => ({
      user: { email: "", username: "", password: "", userId: "" },
      preference: { darkMode: false },
      signIn: false,
      docID: "",
    })),
}));

export default useStore;
