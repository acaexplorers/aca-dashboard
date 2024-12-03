export interface AuthState {
  token: string | null;
  username: string | null;
  loading: boolean;
  error: any | null;
}

export const initialAuthState: AuthState = {
  token: null,
  username: null,
  loading: false,
  error: null,
};
