import { createContext } from 'react';
import type { Auth, User } from '../lib/api';

export type AppContextValues = {
  user: User | undefined;
  token: string | undefined;
  handleSignIn: (auth: Auth) => void;
  handleSignOut: () => void;
  score: number;
  incrementScore: () => void;
  resetScore: () => void;
  isSignedIn: boolean;
};
export const AppContext = createContext<AppContextValues>({
  user: undefined,
  token: undefined,
  handleSignIn: () => undefined,
  handleSignOut: () => undefined,
  score: 0,
  incrementScore: () => undefined,
  resetScore: () => undefined,
  isSignedIn: false,
});

export const UserProvider = AppContext.Provider;
