import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import axios from 'axios';

interface User {
  id: string;
  email: string;
  username: string;
  name?: string;
  avatar?: string;
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  token: string | null;
  
  login: (email: string, password: string) => Promise<void>;
  register: (data: { email: string; password: string; username: string }) => Promise<boolean>;
  logout: () => void;
  clearError: () => void;
  updateUser: (user: Partial<User>) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,
      token: null,
      
      login: async (email, password) => {
        try {
          set({ isLoading: true, error: null });
          
          // In a real app, this would be an API call
          // const response = await axios.post('/api/auth/login', { email, password });
          
          // Simulating a successful login
          await new Promise(resolve => setTimeout(resolve, 1000));
          
          // Check if using demo account
          if (email === 'demo@example.com' && password === 'Demo@123') {
            const demoUser = {
              id: 'demo-user-id',
              email: 'demo@example.com',
              username: 'demouser',
              name: 'Demo User',
              avatar: 'https://avatars.githubusercontent.com/u/12345678',
            };
            
            set({
              user: demoUser,
              isAuthenticated: true,
              token: 'demo-token-xyz',
              isLoading: false,
            });
            
            return;
          }
          
          // Mock error for wrong credentials
          throw new Error('Invalid email or password');
          
        } catch (error: any) {
          set({
            isLoading: false,
            error: error.message || 'Failed to login',
            isAuthenticated: false,
            user: null,
            token: null,
          });
          throw error;
        }
      },
      
      register: async (data) => {
        try {
          set({ isLoading: true, error: null });
          
          // In a real app, this would be an API call
          // const response = await axios.post('/api/auth/register', data);
          
          // Simulating a successful registration
          await new Promise(resolve => setTimeout(resolve, 1500));
          
          const newUser = {
            id: 'new-user-' + Math.random().toString(36).substr(2, 9),
            email: data.email,
            username: data.username,
          };
          
          set({
            user: newUser,
            isAuthenticated: true,
            token: 'mock-token-' + Math.random().toString(36).substr(2, 9),
            isLoading: false,
          });
          
          return true;
        } catch (error: any) {
          set({
            isLoading: false,
            error: error.message || 'Failed to register',
            isAuthenticated: false,
            user: null,
            token: null,
          });
          return false;
        }
      },
      
      logout: () => {
        set({
          user: null,
          isAuthenticated: false,
          token: null,
          error: null,
        });
      },
      
      clearError: () => {
        set({ error: null });
      },
      
      updateUser: (userData) => {
        const currentUser = get().user;
        if (currentUser) {
          set({
            user: { ...currentUser, ...userData },
          });
        }
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
        token: state.token,
      }),
    }
  )
);

// Define a type for the deck store
interface Deck {
  id: string;
  name: string;
  description?: string;
  userId: string;
  cardCount: number;
  isPublic: boolean;
  createdAt: string;
  updatedAt: string;
}

interface Card {
  id: string;
  question: string;
  answer: string;
  deckId: string;
  difficulty?: 'easy' | 'medium' | 'hard';
  tags?: string[];
  nextReviewAt?: string;
  createdAt: string;
  updatedAt: string;
}

interface DecksState {
  decks: Deck[];
  activeDeck: Deck | null;
  cards: Card[];
  isLoading: boolean;
  error: string | null;
  
  fetchDecks: () => Promise<void>;
  fetchDeckById: (id: string) => Promise<Deck | null>;
  createDeck: (data: Partial<Deck>) => Promise<Deck | null>;
  updateDeck: (id: string, data: Partial<Deck>) => Promise<Deck | null>;
  deleteDeck: (id: string) => Promise<boolean>;
  
  fetchCards: (deckId: string) => Promise<void>;
  createCard: (data: Partial<Card>) => Promise<Card | null>;
  updateCard: (id: string, data: Partial<Card>) => Promise<Card | null>;
  deleteCard: (id: string) => Promise<boolean>;
}

// This is a simplified mock implementation
export const useDecksStore = create<DecksState>()((set, get) => ({
  decks: [],
  activeDeck: null,
  cards: [],
  isLoading: false,
  error: null,
  
  fetchDecks: async () => {
    try {
      set({ isLoading: true, error: null });
      
      // In a real app, this would be an API call
      // const response = await axios.get('/api/decks');
      
      // Simulating API response
      await new Promise(resolve => setTimeout(resolve, 800));
      
      const mockDecks: Deck[] = [
        {
          id: 'deck-1',
          name: 'JavaScript Fundamentals',
          description: 'Basic concepts of JavaScript programming language',
          userId: 'user-1',
          cardCount: 25,
          isPublic: true,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        {
          id: 'deck-2',
          name: 'React Hooks',
          description: 'All about React hooks and their usage',
          userId: 'user-1',
          cardCount: 15,
          isPublic: true,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        {
          id: 'deck-3',
          name: 'CSS Grid & Flexbox',
          description: 'Modern CSS layout techniques',
          userId: 'user-1',
          cardCount: 18,
          isPublic: false,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
      ];
      
      set({ decks: mockDecks, isLoading: false });
    } catch (error: any) {
      set({
        isLoading: false,
        error: error.message || 'Failed to fetch decks',
      });
    }
  },
  
  fetchDeckById: async (id) => {
    try {
      set({ isLoading: true, error: null });
      
      // In a real app, this would be an API call
      // const response = await axios.get(`/api/decks/${id}`);
      
      // Simulating API response
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const deck = get().decks.find(d => d.id === id) || null;
      
      set({ activeDeck: deck, isLoading: false });
      return deck;
    } catch (error: any) {
      set({
        isLoading: false,
        error: error.message || `Failed to fetch deck with ID: ${id}`,
      });
      return null;
    }
  },
  
  createDeck: async (data) => {
    try {
      set({ isLoading: true, error: null });
      
      // In a real app, this would be an API call
      // const response = await axios.post('/api/decks', data);
      
      // Simulating API response
      await new Promise(resolve => setTimeout(resolve, 800));
      
      const newDeck: Deck = {
        id: 'deck-' + Math.random().toString(36).substr(2, 9),
        name: data.name || 'Untitled Deck',
        description: data.description,
        userId: 'user-1',
        cardCount: 0,
        isPublic: data.isPublic || false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      
      set(state => ({
        decks: [...state.decks, newDeck],
        activeDeck: newDeck,
        isLoading: false,
      }));
      
      return newDeck;
    } catch (error: any) {
      set({
        isLoading: false,
        error: error.message || 'Failed to create deck',
      });
      return null;
    }
  },
  
  updateDeck: async (id, data) => {
    try {
      set({ isLoading: true, error: null });
      
      // In a real app, this would be an API call
      // const response = await axios.put(`/api/decks/${id}`, data);
      
      // Simulating API response
      await new Promise(resolve => setTimeout(resolve, 600));
      
      const updatedDeck = {
        ...get().decks.find(d => d.id === id),
        ...data,
        updatedAt: new Date().toISOString(),
      } as Deck;
      
      set(state => ({
        decks: state.decks.map(d => d.id === id ? updatedDeck : d),
        activeDeck: state.activeDeck?.id === id ? updatedDeck : state.activeDeck,
        isLoading: false,
      }));
      
      return updatedDeck;
    } catch (error: any) {
      set({
        isLoading: false,
        error: error.message || `Failed to update deck with ID: ${id}`,
      });
      return null;
    }
  },
  
  deleteDeck: async (id) => {
    try {
      set({ isLoading: true, error: null });
      
      // In a real app, this would be an API call
      // const response = await axios.delete(`/api/decks/${id}`);
      
      // Simulating API response
      await new Promise(resolve => setTimeout(resolve, 500));
      
      set(state => ({
        decks: state.decks.filter(d => d.id !== id),
        activeDeck: state.activeDeck?.id === id ? null : state.activeDeck,
        isLoading: false,
      }));
      
      return true;
    } catch (error: any) {
      set({
        isLoading: false,
        error: error.message || `Failed to delete deck with ID: ${id}`,
      });
      return false;
    }
  },
  
  fetchCards: async (deckId) => {
    try {
      set({ isLoading: true, error: null });
      
      // In a real app, this would be an API call
      // const response = await axios.get(`/api/decks/${deckId}/cards`);
      
      // Simulating API response
      await new Promise(resolve => setTimeout(resolve, 700));
      
      const mockCards: Card[] = [
        {
          id: 'card-1',
          question: 'What is a closure in JavaScript?',
          answer: 'A closure is the combination of a function bundled together with references to its surrounding state (the lexical environment).',
          deckId,
          difficulty: 'medium',
          tags: ['javascript', 'functions'],
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        {
          id: 'card-2',
          question: 'Explain the difference between let, const, and var.',
          answer: 'var: function-scoped, can be redeclared, hoisted. let: block-scoped, cannot be redeclared, not hoisted. const: block-scoped, cannot be reassigned or redeclared, not hoisted.',
          deckId,
          difficulty: 'easy',
          tags: ['javascript', 'variables'],
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        {
          id: 'card-3',
          question: 'What is event delegation?',
          answer: 'Event delegation is a technique where you attach an event listener to a parent element instead of multiple child elements. Events triggered by the children bubble up to the parent where they can be handled.',
          deckId,
          difficulty: 'hard',
          tags: ['javascript', 'events'],
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
      ];
      
      set({ cards: mockCards, isLoading: false });
    } catch (error: any) {
      set({
        isLoading: false,
        error: error.message || `Failed to fetch cards for deck with ID: ${deckId}`,
      });
    }
  },
  
  createCard: async (data) => {
    try {
      set({ isLoading: true, error: null });
      
      // In a real app, this would be an API call
      // const response = await axios.post(`/api/decks/${data.deckId}/cards`, data);
      
      // Simulating API response
      await new Promise(resolve => setTimeout(resolve, 600));
      
      const newCard: Card = {
        id: 'card-' + Math.random().toString(36).substr(2, 9),
        question: data.question || '',
        answer: data.answer || '',
        deckId: data.deckId || '',
        difficulty: data.difficulty,
        tags: data.tags,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      
      set(state => ({
        cards: [...state.cards, newCard],
        isLoading: false,
      }));
      
      // Update card count in the deck
      if (data.deckId) {
        const currentDeck = get().decks.find(d => d.id === data.deckId);
        if (currentDeck) {
          get().updateDeck(data.deckId, {
            cardCount: (currentDeck.cardCount || 0) + 1,
          });
        }
      }
      
      return newCard;
    } catch (error: any) {
      set({
        isLoading: false,
        error: error.message || 'Failed to create card',
      });
      return null;
    }
  },
  
  updateCard: async (id, data) => {
    try {
      set({ isLoading: true, error: null });
      
      // In a real app, this would be an API call
      // const response = await axios.put(`/api/cards/${id}`, data);
      
      // Simulating API response
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const updatedCard = {
        ...get().cards.find(c => c.id === id),
        ...data,
        updatedAt: new Date().toISOString(),
      } as Card;
      
      set(state => ({
        cards: state.cards.map(c => c.id === id ? updatedCard : c),
        isLoading: false,
      }));
      
      return updatedCard;
    } catch (error: any) {
      set({
        isLoading: false,
        error: error.message || `Failed to update card with ID: ${id}`,
      });
      return null;
    }
  },
  
  deleteCard: async (id) => {
    try {
      set({ isLoading: true, error: null });
      
      // In a real app, this would be an API call
      // const response = await axios.delete(`/api/cards/${id}`);
      
      // Simulating API response
      await new Promise(resolve => setTimeout(resolve, 400));
      
      const cardToDelete = get().cards.find(c => c.id === id);
      
      set(state => ({
        cards: state.cards.filter(c => c.id !== id),
        isLoading: false,
      }));
      
      // Update card count in the deck
      if (cardToDelete?.deckId) {
        const currentDeck = get().decks.find(d => d.id === cardToDelete.deckId);
        if (currentDeck && currentDeck.cardCount > 0) {
          get().updateDeck(cardToDelete.deckId, {
            cardCount: currentDeck.cardCount - 1,
          });
        }
      }
      
      return true;
    } catch (error: any) {
      set({
        isLoading: false,
        error: error.message || `Failed to delete card with ID: ${id}`,
      });
      return false;
    }
  },
})); 