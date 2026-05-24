function EquipoPage() {
  return (
    <>
      <header className="page-header">
        <div className="page-header-badge">👤 Autor</div>
        <h1>Equipo del proyecto</h1>
        <p>
          Información sobre el autor y los datos de contacto para temas
          relacionados con la tesis.
        </p>
      </header>

      <div className="app-card">
        <div className="profile-card">
          <div className="profile-info">
            <h2>Diana Carolina Valencia Arévalo</h2>
            <ul className="profile-meta">
              <li>📧 dianacavar@gmail.com</li>
              <li>🎓 Universidad CAECE</li>
              <li>📅 {new Date().getFullYear()}</li>
            </ul>
          </div>
        </div>

        <section className="content-section">
          <h2>Agradecimientos</h2>
          <p>
            Espacio reservado para reconocer a directores, asesores y demás
            personas que apoyaron el desarrollo del proyecto.
          </p>
        </section>
      </div>
    </>
  );
}

export default EquipoPage;
