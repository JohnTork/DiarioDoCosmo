import { useEffect, useState } from "react";
import ApodCard from "./components/ApodCard";
import DateSelector from "./components/DateSelector";
import ErrorMessage from "./components/ErrorMessage";
import Header from "./components/Header";
import Loading from "./components/Loading";
import { fetchApod } from "./services/apodService";
import type { Apod } from "./types/Apod";
import { getTodayDate } from "./types/Apod";

function App() {
  const [selectedDate, setSelectedDate] = useState(getTodayDate);
  const [apod, setApod] = useState<Apod | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);

  useEffect(() => {
    const controller = new AbortController();
    setIsLoading(true);
    setApod(null);
    setErrorMessage(null);

    fetchApod(selectedDate, controller.signal)
      .then(setApod)
      .catch((error: unknown) => {
        if (controller.signal.aborted) {
          return;
        }

        setErrorMessage(
          error instanceof Error
            ? error.message
            : "Ocorreu um erro inesperado. Tente novamente.",
        );
      })
      .finally(() => {
        if (!controller.signal.aborted) {
          setIsLoading(false);
        }
      });

    return () => controller.abort();
  }, [selectedDate, retryCount]);

  function retryRequest() {
    setRetryCount((count) => count + 1);
  }

  return (
    <div className="app-shell">
      <Header />
      <main className="page-content">
        <section className="page-intro">
          <p className="eyebrow">O UNIVERSO, UM DIA DE CADA VEZ</p>
          <h1>Uma nova perspectiva do cosmos.</h1>
          <p className="intro-copy">
            Explore a imagem astronômica escolhida hoje pelos especialistas da
            NASA.
          </p>
        </section>

        <DateSelector
          selectedDate={selectedDate}
          onDateChange={setSelectedDate}
        />

        <div className="content-stage" aria-live="polite" aria-busy={isLoading}>
          {isLoading && <Loading />}
          {!isLoading && errorMessage && (
            <ErrorMessage message={errorMessage} onRetry={retryRequest} />
          )}
          {!isLoading && !errorMessage && apod && <ApodCard apod={apod} />}
        </div>

        <footer className="site-footer">
          <span>Conteúdo fornecido pela NASA Astronomy Picture of the Day</span>
          <span>Uma jornada pelo espaço, todos os dias.</span>
        </footer>
      </main>
    </div>
  );
}

export default App;
