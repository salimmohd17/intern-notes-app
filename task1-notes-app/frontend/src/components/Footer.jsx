import React from 'react';
import { ExternalLink } from 'lucide-react';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="app-footer">
      <div className="footer-container">
        <p className="footer-copyright">
          &copy; {currentYear} <strong>Salim Mohamed</strong>. All rights reserved.
        </p>

        <a
          href="https://salim-mwamkoba.netlify.app"
          target="_blank"
          rel="noopener noreferrer"
          className="footer-btn"
          aria-label="Visit BMS Techs portfolio by Salim Mohamed"
        >
          <span>Designed by BMS Techs</span>
          <ExternalLink size={14} className="footer-btn-icon" />
        </a>
      </div>
    </footer>
  );
}
