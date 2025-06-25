"use client";

import { create } from 'zustand';

interface User {
  id: number;
  name: string;
  email: string;
  role: 'admin' | 'user';
}

interface UserState {
  users: User[];
  isLoading: boolean;
  error: string | null;
  addUser: (user: User) => void;
  removeUser: (userId: number) => void;
  setLoading: (isLoading: boolean) => void;
  setError: (error: string | null) => void;
}

const useUserStore = create<UserState>((set) => ({
  users: [],
  isLoading: false,
  error: null,

  addUser: (user) =>
    set((state) => ({
      users: [...state.users, user],
    })),

  removeUser: (userId) =>
    set((state) => ({
      users: state.users.filter((u) => u.id !== userId),
    })),

  setLoading: (isLoading) =>
    set(() => ({
      isLoading,
    })),

  setError: (error) =>
    set(() => ({
      error,
    })),
}));

export default useUserStore; 