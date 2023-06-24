import { create } from "zustand";

const useStore = create((set, get) => ({
  user: { email: "", username: "", password: "", userID:"" },
  signIn: false,
  docID: "",
  setEmail: (email) =>
    set((state) => ({
      user: { ...state.user, email },
      signIn: state.signIn,
      docID: state.docID,
    })),
  setPassword: (password) =>
    set((state) => ({
      user: { ...state.user, password },
      signIn: state.signIn,
      docID: state.docID,
    })),
  setUsername: (username) =>
    set((state) => ({
      user: { ...state.user, username },
      signIn: state.signIn,
      docID: state.docID,
    })),
  setDocId: (docID) =>
    set((state) => ({ user: { ...state.user }, signIn: state.signIn, docID })),
  setIsSignIn: () =>
    set((state) => ({
      user: { ...state.user },
      signIn: !state.signIn,
      docID: state.docID,
    })),
  setSignedInUser: (email, username, docID, userId) =>
    set((state) => ({
      user: { ...state.user, email, username, userId },
      signIn: true,
      docID,
    })),
  setLogOutUser: () =>
    set((state) => ({
      user: { email: "", username: "", password: "", userId:'' },
      signIn: false,
      docID: "",
    })),
}));

export default useStore;
