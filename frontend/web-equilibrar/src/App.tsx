import React from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import Blog from './pages/Blog';
import LandingRFAI from './pages/LandingRFAI';
import ServiceDetail from './pages/ServiceDetail';
import ProgramDetail from './pages/ProgramDetail';
import Hypnosis from './pages/Hypnosis';
import HypnosisCulpa from './pages/HypnosisCulpa';
import ReprogramacionMental from './pages/ReprogramacionMental';
import TestRFAI from './pages/TestRFAI';
import ResultRFAI from './pages/ResultRFAI';
import AudioReprogramacion from './pages/AudioReprogramacion';
import AudioReactividad from './pages/AudioReactividad';
import FloatingWhatsApp from './components/FloatingWhatsApp';
import TeamMemberProfile from './pages/TeamMemberProfile';
import ProblemaNoEsSientas from './pages/blog/ProblemaNoEsSientas';
import ElCuerpoVuelve from './pages/blog/ElCuerpoVuelve';
import SiemprePasaLoMismo from './pages/blog/SiemprePasaLoMismo';
import AntesDePensar from './pages/blog/AntesDePensar';
import SostenerInsuficiente from './pages/blog/SostenerInsuficiente';

// ScrollToTop component to handle scroll reset on route change
const ScrollToTop = () => {
  const { pathname } = React.useMemo(() => new URL(window.location.href), [window.location.href]);

  React.useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
};

const App: React.FC = () => {
  return (
    <Router>
      <ScrollToTop />
      <FloatingWhatsApp />
      <Routes>
        <Route path="/" element={<Layout><Home /></Layout>} />
        <Route path="/blog" element={<Layout><Blog /></Layout>} />
        <Route path="/rfai" element={<LandingRFAI />} />

        {/* SERVICES - Hydrated via API */}
        <Route
          path="/psiquiatria"
          element={
            <Layout>
              <ServiceDetail slug="psiquiatria" />
            </Layout>
          }
        />

        <Route
          path="/psicologia"
          element={
            <Layout>
              <ServiceDetail slug="psicologia" />
            </Layout>
          }
        />

        {/* PROGRAMS - Hydrated via API */}
        <Route
          path="/programa-angustia"
          element={
            <Layout>
              <ProgramDetail slug="programa-angustia" />
            </Layout>
          }
        />

        <Route
          path="/programa-culpa"
          element={
            <Layout>
              <ProgramDetail slug="programa-culpa" />
            </Layout>
          }
        />

        <Route
          path="/programa-irritabilidad"
          element={
            <Layout>
              <ProgramDetail slug="programa-irritabilidad" />
            </Layout>
          }
        />

        <Route
          path="/autoestima-y-amor-propio"
          element={
            <Layout>
              <Hypnosis />
            </Layout>
          }
        />

        <Route
          path="/reprogramacion"
          element={
            <Layout>
              <HypnosisCulpa />
            </Layout>
          }
        />

        <Route
          path="/reprogramacion-mental"
          element={
            <Layout>
              <ReprogramacionMental />
            </Layout>
          }
        />

        <Route path="/test-rfai" element={<TestRFAI />} />
        <Route path="/resultado" element={<ResultRFAI />} />
        <Route
          path="/audio-reprogramacion"
          element={
            <Layout>
              <AudioReprogramacion />
            </Layout>
          }
        />
        <Route
          path="/audio-reactividad"
          element={
            <Layout>
              <AudioReactividad />
            </Layout>
          }
        />
        {/* TEAM MEMBERS */}
        <Route
          path="/equipo/:slug"
          element={
            <Layout>
              <TeamMemberProfile />
            </Layout>
          }
        />
        {/* BLOG ARTICLES */}
        <Route path="/blog/problema-no-es-sientas" element={<Layout><ProblemaNoEsSientas /></Layout>} />
        <Route path="/blog/el-cuerpo-vuelve" element={<Layout><ElCuerpoVuelve /></Layout>} />
        <Route path="/blog/siempre-pasa-lo-mismo" element={<Layout><SiemprePasaLoMismo /></Layout>} />
        <Route path="/blog/antes-de-pensar" element={<Layout><AntesDePensar /></Layout>} />
        <Route path="/blog/sostener-insuficiente" element={<Layout><SostenerInsuficiente /></Layout>} />
        {/* Add more public routes here */}
      </Routes>
    </Router>
  );
};

export default App;