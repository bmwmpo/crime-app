import { create } from "zustand";

const useStore = create((set, get) => ({
  user: { email: "", username: "", password: "" },
  signIn: false,
  setEmail: (email) =>
    set((state) => ({ user: { ...state.user, email }, signIn: state.signIn })),
  setPassword: (password) =>
    set((state) => ({
      user: { ...state.user, password },
      signIn: state.signIn,
    })),
  setUsername: (username) =>
    set((state) => ({
      user: { ...state.user, username },
      signIn: state.signIn,
    })),
  setIsSignIn: () =>
    set((state) => ({ user: { ...state.user }, signIn: !state.signIn })),
  setSignedInUser: (email, username) =>
    set((state) => ({
      user: { ...state.user, email, username },
      signIn: true,
    })),
  setLogOutUser: () =>
    set((state) => ({
      user: { email: "", username: "", password: "" },
      signIn: false,
    })),
}));

export default useStore;
