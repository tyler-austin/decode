import { useEffect, useLayoutEffect, useReducer, useRef } from "react";

const PHASE = {
  IDLE: "idle",
  RUNNING: "running",
  DONE: "done",
} as const;

type TypewriterPhase = (typeof PHASE)[keyof typeof PHASE];

const ACTION = {
  START: "START",
  APPEND: "APPEND",
  COMPLETE: "COMPLETE",
} as const;

type TypewriterActions = (typeof ACTION)[keyof typeof ACTION];

export type TypewriterItem = {
  id: number;
  ch: string;
};

type UseTypewriterOptions = {
  delayMs?: number;
  runOnce?: boolean;
};

type TypewriterState = {
  items: TypewriterItem[];
  currentIndex: number;
  totalLength: number;
  phase: TypewriterPhase;
};

type TypewriterAction = {
  type: TypewriterActions;
  totalLength?: number;
  item?: TypewriterItem;
};

const reducer = (state: TypewriterState, action: TypewriterAction): TypewriterState => {
  const stateActions = {
    [ACTION.START]: (state: TypewriterState, action: TypewriterAction) => {
      return {
        ...state,
        items: [],
        currentIndex: 0,
        totalLength: action.totalLength ?? 0,
        phase: action.totalLength === 0 ? PHASE.DONE : PHASE.RUNNING,
      };
    },
    [ACTION.APPEND]: (state: TypewriterState, action: TypewriterAction) => {
      return {
        ...state,
        items: [...state.items, ...(action.item ? [action.item] : [])],
        currentIndex: state.currentIndex + 1,
        phase: PHASE.RUNNING,
      };
    },
    [ACTION.COMPLETE]: (state: TypewriterState) => {
      return {
        ...state,
        items: [...state.items, { id: state.currentIndex, ch: "" }],
        currentIndex: state.currentIndex + 1,
        phase: PHASE.DONE,
      };
    },
  };

  return stateActions[action.type](state, action) ?? {
    ...state,
    items: [],
    currentIndex: 0,
    totalLength: 0,
    phase: PHASE.IDLE,
  };
};

export const useTypewriter = (
  source: string | null | undefined,
  options?: UseTypewriterOptions
) => {
  const { delayMs = 500, runOnce = true } = options ?? {};

  const [state, dispatch] = useReducer(reducer, {
    items: [],
    currentIndex: 0,
    totalLength: 0,
    phase: PHASE.IDLE,
  });

  const nextIdRef = useRef<number>(0);
  const hasRunRef = useRef<boolean>(false);
  const charsRef = useRef<string[]>([]);
  const prevSourceRef = useRef<string | undefined>(undefined);
  const currentSourceRef = useRef<string | undefined>(undefined);

  useLayoutEffect(() => {
    if (!source || source.length === 0) {
      prevSourceRef.current = undefined;
      return;
    }

    if (runOnce && hasRunRef.current) return;

    const shouldStart = prevSourceRef.current === undefined || prevSourceRef.current !== source;
    if (!shouldStart) return;

    hasRunRef.current = true;
    prevSourceRef.current = source;
    currentSourceRef.current = source;
    nextIdRef.current = 0;
    charsRef.current = Array.from(source);
    dispatch({ type: ACTION.START, totalLength: charsRef.current.length });
  }, [source, runOnce]);

  useEffect(() => {
    if (state.phase !== PHASE.RUNNING) return;
    if (state.currentIndex >= state.totalLength) return;

    const timeoutId = window.setTimeout(() => {
      const ch = charsRef.current[state.currentIndex];
      dispatch({ type: ACTION.APPEND, item: { id: nextIdRef.current++, ch } });
      if (state.currentIndex + 1 >= state.totalLength) {
        dispatch({ type: ACTION.COMPLETE });
      }
    }, delayMs);

    return () => window.clearTimeout(timeoutId);
  }, [state.phase, state.currentIndex, state.totalLength, delayMs]);

  const itemsForCurrentSource =
    source && source === currentSourceRef.current ? state.items : [];

  return {
    items: itemsForCurrentSource,
    isRunning: state.phase === PHASE.RUNNING,
    isDone: state.phase === PHASE.DONE,
  };
};


