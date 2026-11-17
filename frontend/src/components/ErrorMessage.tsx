interface ErrorMessageProps {
  message: string;
  onRetry: () => void;
}

function ErrorMessage({ message, onRetry }: ErrorMessageProps) {
  return (
    <section className="error-state" role="alert">
      <span className="error-symbol" aria-hidden="true">
        !
      </span>
      <div>
        <h2>Não foi possível carregar o conteúdo</h2>
        <p>{message}</p>
        <button className="retry-button" type="button" onClick={onRetry}>
          Tentar novamente
        </button>
      </div>
    </section>
  );
}

export default ErrorMessage;
