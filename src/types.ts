
/* MAIN */

type Callback = () => void;

type Disposer = () => void;

type Event = 'add' | 'change' | 'ready' | 'unlink';

type Handler = ( event: Event ) => void;

type Options = {
  ignoreInitial?: boolean,
  ignoreReady?: boolean,
  pollingInterval?: number
};

/* EXPORT */

export type {Callback, Disposer, Event, Handler, Options};
