function Loading() {
  return (
    <div className="loading-state" role="status" aria-live="polite">
      <span className="loading-spinner" aria-hidden="true" />
      <p>Buscando uma janela para o universo...</p>
    </div>
  );
}

export default Loading;
