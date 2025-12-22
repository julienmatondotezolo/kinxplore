"use client";

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

import type { ChatRecommendation } from "@/types/chat.types";

export interface SavedTrip {
  id: string;
  name: string;
  recommendations: ChatRecommendation;
  createdAt: string;
  updatedAt: string;
}

interface TripStore {
  savedTrips: SavedTrip[];
  currentTrip: SavedTrip | null;
  
  // Actions
  saveTrip: (name: string, recommendations: ChatRecommendation) => Promise<string>;
  updateTrip: (id: string, data: Partial<SavedTrip>) => Promise<void>;
  deleteTrip: (id: string) => Promise<void>;
  getTrip: (id: string) => SavedTrip | undefined;
  setCurrentTrip: (trip: SavedTrip | null) => void;
  loadTrips: () => Promise<void>;
}

export const useTripStore = create<TripStore>()(
  persist(
    (set, get) => ({
      savedTrips: [],
      currentTrip: null,

      saveTrip: async (name: string, recommendations: ChatRecommendation) => {
        const newTrip: SavedTrip = {
          id: crypto.randomUUID(),
          name,
          recommendations,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };

        set((state) => ({
          savedTrips: [...state.savedTrips, newTrip],
          currentTrip: newTrip,
        }));

        // Also save to IndexedDB
        await saveTripToIndexedDB(newTrip);
        
        return newTrip.id;
      },

      updateTrip: async (id: string, data: Partial<SavedTrip>) => {
        set((state) => ({
          savedTrips: state.savedTrips.map((trip) =>
            trip.id === id
              ? { ...trip, ...data, updatedAt: new Date().toISOString() }
              : trip
          ),
        }));

        const trip = get().savedTrips.find((t) => t.id === id);
        if (trip) {
          await saveTripToIndexedDB(trip);
        }
      },

      deleteTrip: async (id: string) => {
        set((state) => ({
          savedTrips: state.savedTrips.filter((trip) => trip.id !== id),
          currentTrip: state.currentTrip?.id === id ? null : state.currentTrip,
        }));

        await deleteTripFromIndexedDB(id);
      },

      getTrip: (id: string) => {
        return get().savedTrips.find((trip) => trip.id === id);
      },

      setCurrentTrip: (trip: SavedTrip | null) => {
        set({ currentTrip: trip });
      },

      loadTrips: async () => {
        const trips = await loadTripsFromIndexedDB();
        set({ savedTrips: trips });
      },
    }),
    {
      name: "kinxplore-trips",
      storage: createJSONStorage(() => localStorage),
    }
  )
);

// IndexedDB utilities
const DB_NAME = "kinxplore-db";
const STORE_NAME = "trips";
const DB_VERSION = 1;

function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(request.result);

    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: "id" });
      }
    };
  });
}

async function saveTripToIndexedDB(trip: SavedTrip): Promise<void> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction([STORE_NAME], "readwrite");
    const store = transaction.objectStore(STORE_NAME);
    const request = store.put(trip);

    request.onsuccess = () => resolve();
    request.onerror = () => reject(request.error);
  });
}

async function deleteTripFromIndexedDB(id: string): Promise<void> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction([STORE_NAME], "readwrite");
    const store = transaction.objectStore(STORE_NAME);
    const request = store.delete(id);

    request.onsuccess = () => resolve();
    request.onerror = () => reject(request.error);
  });
}

async function loadTripsFromIndexedDB(): Promise<SavedTrip[]> {
  try {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction([STORE_NAME], "readonly");
      const store = transaction.objectStore(STORE_NAME);
      const request = store.getAll();

      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  } catch (error) {
    console.error("Error loading trips from IndexedDB:", error);
    return [];
  }
}

