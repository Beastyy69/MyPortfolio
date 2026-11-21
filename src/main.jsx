/**
 * Entry point.
 * Wraps the app in its providers (outermost first):
 *   MotionConfig    – honours the visitor's reduced‑motion setting for every animation
 *   ModeProvider    – current theme (AI/ML or Game) and the animated mode switch
 *   ToastProvider   – small pop‑up messages
 *   ProfileProvider – the "About My Work" / "Player Profile" panel
 * All stylesheets are imported here; refine.css is last so it wins.
 */
import React from 'react';
import ReactDOM from 'react-dom/client';
import { MotionConfig } from 'framer-motion';
import { ModeProvider } from './context/ModeContext.jsx';
import { ToastProvider } from './context/ToastContext.jsx';
import { ProfileProvider } from './context/ProfileContext.jsx';
import App from './App.jsx';

import './styles/tokens.css';
import './styles/base.css';
import './styles/effects.css';
import './styles/layout.css';
import './styles/preloader.css';
import './styles/hero.css';
import './styles/about.css';
import './styles/skills.css';
import './styles/projects.css';
import './styles/cases.css';
import './styles/certificates.css';
import './styles/journey.css';
import './styles/arcade.css';
import './styles/contact.css';
import './styles/profile.css';
import './styles/portraits.css';
import './styles/runner.css';
import './styles/world.css';
import './styles/missions.css';
import './styles/fhd.css';
import './styles/transition.css';
import './styles/refine.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <MotionConfig reducedMotion="user">
      <ModeProvider>
        <ToastProvider>
          <ProfileProvider>
            <App />
          </ProfileProvider>
        </ToastProvider>
      </ModeProvider>
    </MotionConfig>
  </React.StrictMode>,
);
