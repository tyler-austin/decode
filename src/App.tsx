import "./App.css";
import { Container } from "./components/Container";
import { ErrorAlert } from "./components/ErrorAlert";
import { Header } from "./components/Header";
import { MainView } from "./components/MainView";
import { Typewriter } from "./components/Typewrtier";
import { useFetchJson } from "./hooks/useFetchJson";
import { useTypewriter } from "./hooks/useTypewriter";

const TYPING_DELAY_MS = 900 as const;

const URL =
  "https://wgg522pwivhvi5gqsn675gth3q0otdja.lambda-url.us-east-1.on.aws/616d69" as const;

const VIEW_STATE = {
  IDLE: "idle",
  LOADING: "loading",
  ERROR: "error",
} as const;

type ViewState = (typeof VIEW_STATE)[keyof typeof VIEW_STATE];

const getViewState = (loading: boolean, error: boolean): ViewState => {
  if (loading) return VIEW_STATE.LOADING;
  if (error) return VIEW_STATE.ERROR;
  return VIEW_STATE.IDLE;
};

type Data = string | null;

const App = () => {
  const { data, loading, error, retry, retryCount, refetch } = useFetchJson<Data>(URL, {
    immediate: true,
  });

  const viewState = getViewState(loading, !!error);
  const source = viewState === VIEW_STATE.IDLE ? data : undefined;

  const { items: animatedChars, isDone } = useTypewriter(source, {
    delayMs: TYPING_DELAY_MS,
    runOnce: false,
  });

  return (
    <MainView>
      <Header
        error={!!error}
        loading={loading}
        retry={retry}
        retryCount={retryCount}
        refetch={refetch}
      />
      <Container>
        {viewState === VIEW_STATE.LOADING && <div style={{ letterSpacing: 2 }}>Loading...</div>}
        {viewState === VIEW_STATE.ERROR && <ErrorAlert error={error} retryCount={retryCount} />}
        {viewState === VIEW_STATE.IDLE && (
          <Typewriter
            items={animatedChars}
            blinkMs={TYPING_DELAY_MS / 3}
            isDone={isDone}
          />
        )}
      </Container>
    </MainView>
  );
};

export default App;
