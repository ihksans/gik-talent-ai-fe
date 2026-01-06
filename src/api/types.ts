export type StreamCallbacks = {
  onToken: (token: string) => void;
  onDone: () => void;
  onError?: (err: unknown) => void;
};
