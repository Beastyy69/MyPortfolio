/**
 * Page layout and section order.
 * Starts Lenis smooth scrolling, locks scrolling until the preloader finishes,
 * and renders the fixed layers (background, cursor, nav, progress rail) plus
 * the sections. The Arcade section only exists in Game mode.
 */
import { useEffect } from 'react';
import { AnimatePresence } from 'framer-motion';
import { useMode } from './context/ModeContext.jsx';
import { initSmoothScroll, handleAnchorClicks, startScroll, stopScroll } from './lib/smoothScroll.js';
import Preloader from './components/preloader/Preloader.jsx';
import ModeTransition from './components/effects/ModeTransition.jsx';
import Backdrop from './components/effects/Backdrop.jsx';
import SafeBoundary from './components/ui/SafeBoundary.jsx';
import Cursor from './components/effects/Cursor.jsx';
import ScrollProgress from './components/layout/ScrollProgress.jsx';
import Navbar from './components/layout/Navbar.jsx';
import Footer from './components/layout/Footer.jsx';
import Hero from './components/sections/Hero.jsx';
import About from './components/sections/About.jsx';
import Skills from './components/sections/Skills.jsx';
import Projects from './components/sections/Projects.jsx';
import Certificates from './components/sections/Certificates.jsx';
import Journey from './components/sections/Journey.jsx';
import Arcade from './components/sections/Arcade.jsx';
import Contact from './components/sections/Contact.jsx';
import ProfileModal from './components/profile/ProfileModal.jsx';

export default function App() {
  const { booted, setBooted, isRetro } = useMode();

  useEffect(() => {
    const stopLenis = initSmoothScroll();
    const stopAnchors = handleAnchorClicks();
    return () => {
      stopLenis();
      stopAnchors();
    };
  }, []);

  useEffect(() => {
    document.body.style.overflow = booted ? '' : 'hidden';
    if (booted) startScroll();
    else stopScroll();
  }, [booted]);

  return (
    <>
      <a href="#main" className="skip-link">
        Skip to content
      </a>
      <SafeBoundary>
        <Backdrop />
      </SafeBoundary>
      <Cursor />
      <AnimatePresence>{!booted && <Preloader key="preloader" onDone={() => setBooted(true)} />}</AnimatePresence>
      <ModeTransition />
      <Navbar />
      <ScrollProgress />
      <main id="main" tabIndex={-1}>
        <Hero />
        <About />
        <Skills />
        <Projects />
        <Certificates />
        <Journey />
        {isRetro && <Arcade />}
        <Contact />
      </main>
      <Footer />
      <ProfileModal />
    </>
  );
}
