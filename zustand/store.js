import { create } from "zustand";

const useStore = create((set, get) => ({
  user: { email: "", username: "", password: "", userId: "" },
  preference: { darkMode: false, avatarColor: "#9400D3", autoDarkMode: false },
  location: { coords: null, enabled: false },
  signIn: false,
  docID: "",
  setEmail: (email) =>
    set((state) => ({
      user: { ...state.user, email },
      preference: { ...state.preference },
      location: { ...state.location },
      signIn: state.signIn,
      docID: state.docID,
    })),
  setPassword: (password) =>
    set((state) => ({
      user: { ...state.user, password },
      preference: { ...state.preference },
      location: { ...state.location },
      signIn: state.signIn,
      docID: state.docID,
    })),
  setUsername: (username) =>
    set((state) => ({
      user: { ...state.user, username },
      preference: { ...state.preference },
      location: { ...state.location },
      signIn: state.signIn,
      docID: state.docID,
    })),
  setDocId: (docID) =>
    set((state) => ({
      user: { ...state.user },
      preference: { ...state.preference },
      location: { ...state.location },
      signIn: state.signIn,
      docID,
    })),
  setIsDarkMode: (isDarkMode) =>
    set((state) => ({
      user: { ...state.user },
      preference: { ...state.preference, darkMode: isDarkMode },
      location: { ...state.location },
      docID: state.docID,
      signIn: state.signIn,
    })),
  setIsAutoDarkMode: (isAutoDarkMode) =>
    set((state) => ({
      user: { ...state.user },
      preference: { ...state.preference, autoDarkMode: isAutoDarkMode },
      location: { ...state.location },
      docID: state.docID,
      signIn: state.signIn,
    })),
  setAvatarColor: (color) =>
    set((state) => ({
      user: { ...state.user },
      preference: { ...state.preference, avatarColor: color },
      location: { ...state.location },
      docID: state.docID,
      signIn: state.signIn,
    })),
  setLocationCoords: (coords) =>
    set((state) => ({
      user: { ...state.user },
      preference: { ...state.preference },
      location: { ...state.location, coords },
      docID: state.docID,
      signIn: state.signIn,
    })),
  setLocationEnabled: (enabled) =>
    set((state) => ({
      user: { ...state.user },
      preference: { ...state.preference },
      location: { ...state.location, enabled },
      docID: state.docID,
      signIn: state.signIn,
    })),
  setIsSignIn: () =>
    set((state) => ({
      user: { ...state.user },
      preference: { ...state.preference },
      location: { ...state.location },
      signIn: !state.signIn,
      docID: state.docID,
    })),
  setSignedInUser: (
    email,
    username,
    docID,
    userId,
    darkMode,
    avatarColor,
    autoDarkMode,
    coords,
    enabled
  ) =>
    set((state) => ({
      user: { ...state.user, email, username, userId },
      preference: { ...state.preference, darkMode, avatarColor, autoDarkMode },
      location: { ...state.location, coords, enabled },
      signIn: true,
      docID,
    })),
  setLogOutUser: () =>
    set((state) => ({
      user: { email: "", username: "", password: "", userId: "" },
      preference: {
        darkMode: false,
        avatarColor: "#9400D3",
        autoDarkMode: false,
      },
      location: { coords: null, enabled: false },
      signIn: false,
      docID: "",
    })),
}));

export default useStore;
