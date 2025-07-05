import {create} from 'zustand';

export const useCommunityStore = create((set) => ({
  Action:"",
  setAction: (newAction) => set(() => ({ Action: newAction })),
 selectedCommunity: {
    id: "",
    name: "",
    avatar:"",
    description: "",
    members: [],
    admin: []
  },
  setSelectedCommunity: (newData) =>
    set((state) => ({
      selectedCommunity: {
        ...state.selectedCommunity,
        ...newData
      }
    }))
}));