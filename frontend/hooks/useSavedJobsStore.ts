import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface SavedJobsState {
  savedJobIds: string[];
  toggleSaveJob: (jobId: string) => void;
  isJobSaved: (jobId: string) => boolean;
}

export const useSavedJobsStore = create<SavedJobsState>()(
  persist(
    (set, get) => ({
      savedJobIds: [],
      toggleSaveJob: (jobId) => {
        const currentSaved = get().savedJobIds;
        if (currentSaved.includes(jobId)) {
          set({ savedJobIds: currentSaved.filter(id => id !== jobId) });
        } else {
          set({ savedJobIds: [...currentSaved, jobId] });
        }
      },
      isJobSaved: (jobId) => get().savedJobIds.includes(jobId),
    }),
    {
      name: 'saved-jobs-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
