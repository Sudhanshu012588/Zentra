import {create} from 'zustand';

 export const useStore = create((set) => ({
  User: {  
    id: "",
    name: "",
    email: "",
    profilephoto:"",
    coverImage:"",
    isLoggedIn: false,
  },
  setUser: (newUser) => set((state) => ({ User: { ...state.User, ...newUser } })), 
}));
