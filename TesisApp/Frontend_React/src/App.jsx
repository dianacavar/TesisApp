import { useState } from 'react';
import Navbar from './components/Navbar';
import SideMenu from './components/SideMenu';
import PredictorPage from './pages/PredictorPage';
import AcercaPage from './pages/AcercaPage';
import MetricasPage from './pages/MetricasPage';
import EquipoPage from './pages/EquipoPage';
import AutomatizacionPage from './pages/AutomatizacionPage';

const MENU_ITEMS = [
  {
    id: 'predictor',
    label: 'Predictor',
    icon: '🎯',
    description: 'Estima tu rendimiento Saber Pro',
  },
  {
    id: 'automatizacion',
    label: 'Pruebas masivas',
    icon: '🧪',
    description: 'Ejecuta N pruebas y descarga CSV',
  },
  {
    id: 'metricas',
    label: 'Métricas del modelo',
    icon: '📈',
    description: 'Desempeño y variables clave',
  },
  {
    id: 'acerca',
    label: 'Acerca de la tesis',
    icon: '📖',
    description: 'Objetivos, datos y modelo',
  },
  {
    id: 'equipo',
    label: 'Autor',
    icon: '👤',
    description: 'Información de contacto',
  },
];

const PAGES = {
  predictor: PredictorPage,
  automatizacion: AutomatizacionPage,
  metricas: MetricasPage,
  acerca: AcercaPage,
  equipo: EquipoPage,
};

function App() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState('predictor');

  const CurrentPageComponent = PAGES[currentPage] || PredictorPage;
  const currentMenuItem = MENU_ITEMS.find((i) => i.id === currentPage);

  return (
    <div className="app-shell">
      <Navbar
        onMenuClick={() => setMenuOpen(true)}
        currentPageLabel={currentMenuItem?.label}
      />

      <SideMenu
        isOpen={menuOpen}
        onClose={() => setMenuOpen(false)}
        items={MENU_ITEMS}
        currentPageId={currentPage}
        onNavigate={(pageId) => {
          setCurrentPage(pageId);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
      />

      <main className="app-main" key={currentPage}>
        <CurrentPageComponent />
      </main>

      <footer className="app-footer">
        Tesis · Modelo Random Forest · {new Date().getFullYear()}
      </footer>
    </div>
  );
}

export default App;
