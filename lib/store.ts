import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Contact } from '@/components/ContactSelector';

interface UserLocation {
  state: string;
  city?: string;
  latitude?: number;
  longitude?: number;
}

interface User {
  id: string;
  farcaster_fid?: string;
  wallet_address?: string;
  preferred_language: string;
  state_of_residence?: string;
}

interface AppState {
  // User state
  user: User | null;
  userLocation: UserLocation | null;
  isAuthenticated: boolean;
  
  // App state
  activeTab: 'guides' | 'scripts' | 'record' | 'alert' | 'share';
  selectedScenario: string;
  selectedContacts: Contact[];
  isRecording: boolean;
  recordingBlob: Blob | null;
  
  // Premium features
  hasPremiumAccess: boolean;
  purchasedScriptPacks: string[];
  
  // Actions
  setUser: (user: User | null) => void;
  setUserLocation: (location: UserLocation | null) => void;
  setAuthenticated: (authenticated: boolean) => void;
  setActiveTab: (tab: 'guides' | 'scripts' | 'record' | 'alert' | 'share') => void;
  setSelectedScenario: (scenario: string) => void;
  setSelectedContacts: (contacts: Contact[]) => void;
  setRecording: (recording: boolean) => void;
  setRecordingBlob: (blob: Blob | null) => void;
  setPremiumAccess: (access: boolean) => void;
  addPurchasedScriptPack: (packId: string) => void;
  
  // Reset functions
  resetUser: () => void;
  resetApp: () => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      // Initial state
      user: null,
      userLocation: null,
      isAuthenticated: false,
      activeTab: 'guides',
      selectedScenario: 'traffic_stop',
      selectedContacts: [],
      isRecording: false,
      recordingBlob: null,
      hasPremiumAccess: false,
      purchasedScriptPacks: [],
      
      // Actions
      setUser: (user) => set({ user }),
      setUserLocation: (userLocation) => set({ userLocation }),
      setAuthenticated: (isAuthenticated) => set({ isAuthenticated }),
      setActiveTab: (activeTab) => set({ activeTab }),
      setSelectedScenario: (selectedScenario) => set({ selectedScenario }),
      setSelectedContacts: (selectedContacts) => set({ selectedContacts }),
      setRecording: (isRecording) => set({ isRecording }),
      setRecordingBlob: (recordingBlob) => set({ recordingBlob }),
      setPremiumAccess: (hasPremiumAccess) => set({ hasPremiumAccess }),
      addPurchasedScriptPack: (packId) => {
        const { purchasedScriptPacks } = get();
        if (!purchasedScriptPacks.includes(packId)) {
          set({ purchasedScriptPacks: [...purchasedScriptPacks, packId] });
        }
      },
      
      // Reset functions
      resetUser: () => set({
        user: null,
        isAuthenticated: false,
        hasPremiumAccess: false,
        purchasedScriptPacks: []
      }),
      resetApp: () => set({
        activeTab: 'guides',
        selectedScenario: 'traffic_stop',
        selectedContacts: [],
        isRecording: false,
        recordingBlob: null
      })
    }),
    {
      name: 'rightssphere-storage',
      partialize: (state) => ({
        user: state.user,
        userLocation: state.userLocation,
        isAuthenticated: state.isAuthenticated,
        selectedContacts: state.selectedContacts,
        hasPremiumAccess: state.hasPremiumAccess,
        purchasedScriptPacks: state.purchasedScriptPacks
      })
    }
  )
);
