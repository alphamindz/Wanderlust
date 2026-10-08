import React from 'react';
import { useTranslation } from 'react-i18next';
import { DollarSign } from 'lucide-react';
import LanguageSelector from './LanguageSelector';

const Footer = () => {
  const { t } = useTranslation();

  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-inner">
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
            <span>© {new Date().getFullYear()} {t('nav.brand')}, Inc.</span>
            <span>·</span>
            <a href="#privacy" className="footer-link">
              {t('footer.privacy')}
            </a>
            <span>·</span>
            <a href="#terms" className="footer-link">
              {t('footer.terms')}
            </a>
            <span>·</span>
            <a href="#sitemap" className="footer-link">
              {t('footer.sitemap')}
            </a>
            <span>·</span>
            <span style={{ color: '#FF385C', fontWeight: 600 }}>
              Built with Ankur Yadav
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            {/* Multi-Language Selector */}
            <LanguageSelector variant="footer" />

            <div style={{ display: 'flex', alignItems: 'center', gap: 4, fontWeight: 600 }}>
              <DollarSign size={16} />
              <span>USD</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
