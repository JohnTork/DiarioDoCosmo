function Header() {
  return (
    <header className="site-header">
      <a className="brand" href="/" aria-label="Diário do Cosmo, início">
        <span className="brand-mark" aria-hidden="true">
          ✦
        </span>
        <span>
          <strong>Diário do Cosmo</strong>
          <span className="brand-caption">NASA Astronomy Picture of the Day</span>
        </span>
      </a>
      <span className="header-tag">UMA JANELA PARA O UNIVERSO</span>
    </header>
  );
}

export default Header;
