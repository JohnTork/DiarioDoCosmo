import type { Apod } from "../types/Apod";

interface ApodCardProps {
  apod: Apod;
}

function formatDate(date: string): string {
  return new Intl.DateTimeFormat("pt-BR", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(`${date}T00:00:00.000Z`));
}

function ApodCard({ apod }: ApodCardProps) {
  return (
    <article className="apod-card">
      <div className="media-frame">
        {apod.media_type === "image" ? (
          <img
            className="apod-image"
            src={apod.url}
            alt={apod.title}
            loading="eager"
          />
        ) : (
          <iframe
            className="apod-video"
            src={apod.url}
            title={`Vídeo astronômico: ${apod.title}`}
            sandbox="allow-scripts allow-same-origin allow-presentation"
            allow="picture-in-picture; encrypted-media"
            allowFullScreen
            referrerPolicy="strict-origin-when-cross-origin"
          />
        )}
      </div>

      <div className="apod-content">
        <div className="apod-meta">
          <span className="media-label">
            {apod.media_type === "image" ? "IMAGEM DO DIA" : "VÍDEO DO DIA"}
          </span>
          <time dateTime={apod.date}>{formatDate(apod.date)}</time>
        </div>
        <h2>{apod.title}</h2>
        <section className="explanation" aria-labelledby="explanation-heading">
          <h3 id="explanation-heading">Sobre esta descoberta</h3>
          <p>{apod.explanation}</p>
        </section>
        {apod.copyright && (
          <p className="copyright">Créditos: {apod.copyright}</p>
        )}
      </div>
    </article>
  );
}

export default ApodCard;
