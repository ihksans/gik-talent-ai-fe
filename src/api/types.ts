export type StreamCallbacks = {
  onToken: (token: string) => void;
  onDone: () => void;
  onError?: (err: unknown) => void;
};

export interface LoginRequest {
  username: string;
  password: string;
}

export interface LoginResponse {
  userId: string;
  token: string;
  refreshToken: string;
}
