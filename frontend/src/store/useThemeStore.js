//save the theme to the local storage so that when we refresh the page we still have our selected theme
import { create } from "zustand";

export const useThemeStore = create((set) => ({
  theme: localStorage.getItem("chat-theme") || "coffee",
  setTheme: (theme)=> {
    localStorage.setItem("chat-theme", theme)
    set({ theme })
  }
}))