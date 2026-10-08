import React, { useState, useRef, useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Globe, Check, ChevronDown, Search, X } from 'lucide-react';

export const WORLD_LANGUAGES = [
  {
    code: 'en',
    name: 'English',
    nativeName: 'English',
    flag: '🇺🇸',
    region: 'United States & Global',
  },
  {
    code: 'hi',
    name: 'Hindi',
    nativeName: 'हिन्दी',
    flag: '🇮🇳',
    region: 'भारत (India & South Asia)',
  },
  {
    code: 'es',
    name: 'Spanish',
    nativeName: 'Español',
    flag: '🇪🇸',
    region: 'España & Latinoamérica',
  },
  {
    code: 'fr',
    name: 'French',
    nativeName: 'Français',
    flag: '🇫🇷',
    region: 'France, Canada & Afrique',
  },
  {
    code: 'de',
    name: 'German',
    nativeName: 'Deutsch',
    flag: '🇩🇪',
    region: 'Deutschland, Österreich, Schweiz',
  },
  {
    code: 'ja',
    name: 'Japanese',
    nativeName: '日本語',
    flag: '🇯🇵',
    region: '日本 (Japan)',
  },
  {
    code: 'it',
    name: 'Italian',
    nativeName: 'Italiano',
    flag: '🇮🇹',
    region: 'Italia & Svizzera',
  },
  {
    code: 'pt',
    name: 'Portuguese',
    nativeName: 'Português',
    flag: '🇵🇹',
    region: 'Brasil & Portugal',
  },
  {
    code: 'zh',
    name: 'Chinese',
    nativeName: '中文 (简体)',
    flag: '🇨🇳',
    region: '中国 & 亚洲 (China)',
  },
  {
    code: 'ar',
    name: 'Arabic',
    nativeName: 'العربية',
    flag: '🇸🇦',
    region: 'الشرق الأوسط & شمال أفريقيا',
  },
  {
    code: 'ru',
    name: 'Russian',
    nativeName: 'Русский',
    flag: '🇷🇺',
    region: 'Россия и Восточная Европа',
  },
];

const LanguageSelector = ({ variant = 'navbar' }) => {
  const { i18n, t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const [searchFilter, setSearchFilter] = useState('');
  const dropdownRef = useRef(null);

  const currentLang =
    WORLD_LANGUAGES.find((l) => l.code === i18n.language) || WORLD_LANGUAGES[0];

  // Filtered languages based on search input
  const filteredLanguages = useMemo(() => {
    const q = searchFilter.trim().toLowerCase();
    if (!q) return WORLD_LANGUAGES;
    return WORLD_LANGUAGES.filter(
      (l) =>
        l.name.toLowerCase().includes(q) ||
        l.nativeName.toLowerCase().includes(q) ||
        l.code.toLowerCase().includes(q) ||
        l.region.toLowerCase().includes(q)
    );
  }, [searchFilter]);

  // Close dropdown on outside click or Escape key
  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleOutsideClick);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen]);

  const handleLanguageChange = (langCode) => {
    i18n.changeLanguage(langCode);
    localStorage.setItem('wanderlust_language', langCode);
    setIsOpen(false);
    setSearchFilter('');
  };

  if (variant === 'footer') {
    return (
      <div style={{ position: 'relative' }} ref={dropdownRef}>
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="btn-language-footer"
          aria-label={t('languages.selectLanguage')}
          id="footer-language-selector-btn"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            background: 'rgba(255, 255, 255, 0.08)',
            border: '1px solid rgba(255, 255, 255, 0.16)',
            color: '#F3F4F6',
            padding: '8px 14px',
            borderRadius: 'var(--radius-full)',
            fontSize: '0.88rem',
            fontWeight: 600,
            cursor: 'pointer',
            transition: 'all var(--transition-fast)',
          }}
        >
          <Globe size={16} />
          <span>
            {currentLang.flag} {currentLang.nativeName}
          </span>
          <ChevronDown
            size={14}
            style={{
              transform: isOpen ? 'rotate(180deg)' : 'none',
              transition: 'transform 0.2s ease',
            }}
          />
        </button>

        {isOpen && (
          <div
            className="language-dropdown-menu footer-popover"
            style={{
              position: 'absolute',
              bottom: 'calc(100% + 8px)',
              right: 0,
              background: '#FFFFFF',
              color: '#111827',
              borderRadius: 'var(--radius-lg)',
              boxShadow: '0 20px 40px rgba(0, 0, 0, 0.2)',
              border: '1px solid var(--border)',
              padding: '12px',
              width: '320px',
              maxWidth: '90vw',
              zIndex: 1000,
            }}
          >
            {/* Header & Search */}
            <div style={{ marginBottom: 10 }}>
              <div
                style={{
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  color: '#6B7280',
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                  marginBottom: 8,
                }}
              >
                {t('languages.selectLanguage')}
              </div>
              <div
                style={{
                  position: 'relative',
                  display: 'flex',
                  alignItems: 'center',
                }}
              >
                <Search
                  size={14}
                  color="#9CA3AF"
                  style={{ position: 'absolute', left: 10 }}
                />
                <input
                  type="text"
                  placeholder="Search world languages..."
                  value={searchFilter}
                  onChange={(e) => setSearchFilter(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '6px 28px 6px 30px',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--border)',
                    fontSize: '0.82rem',
                    outline: 'none',
                  }}
                  autoFocus
                />
                {searchFilter && (
                  <button
                    type="button"
                    onClick={() => setSearchFilter('')}
                    style={{
                      position: 'absolute',
                      right: 8,
                      background: 'none',
                      border: 'none',
                      cursor: 'pointer',
                      padding: 0,
                      color: '#9CA3AF',
                    }}
                  >
                    <X size={14} />
                  </button>
                )}
              </div>
            </div>

            {/* Language Options List */}
            <div
              style={{
                maxHeight: '260px',
                overflowY: 'auto',
                display: 'flex',
                flexDirection: 'column',
                gap: 2,
              }}
            >
              {filteredLanguages.map((lang) => {
                const isSelected = lang.code === currentLang.code;
                return (
                  <button
                    key={lang.code}
                    type="button"
                    className="language-option-btn"
                    onClick={() => handleLanguageChange(lang.code)}
                    style={{
                      width: '100%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '8px 10px',
                      borderRadius: 'var(--radius-md)',
                      border: 'none',
                      background: isSelected ? '#F3F4F6' : 'transparent',
                      cursor: 'pointer',
                      textAlign: 'left',
                      transition: 'background var(--transition-fast)',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <span style={{ fontSize: '1.25rem' }}>{lang.flag}</span>
                      <div>
                        <div
                          style={{
                            fontWeight: isSelected ? 700 : 600,
                            fontSize: '0.88rem',
                            color: isSelected ? '#111827' : '#374151',
                          }}
                        >
                          {lang.nativeName}
                        </div>
                        <div style={{ fontSize: '0.72rem', color: '#6B7280' }}>
                          {lang.name} · {lang.region}
                        </div>
                      </div>
                    </div>
                    {isSelected && <Check size={16} color="#FF385C" />}
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>
    );
  }

  // Default 'navbar' variant
  const displayLabel = currentLang.code === 'en' ? 'US · EN' : `${currentLang.code.toUpperCase()} · ${currentLang.nativeName}`;

  return (
    <div style={{ position: 'relative' }} ref={dropdownRef}>
      <button
        type="button"
        className="navbar-lang-btn"
        onClick={() => setIsOpen(!isOpen)}
        aria-label={t('languages.selectLanguage')}
        id="navbar-language-btn"
      >
        <Globe size={16} className="navbar-lang-globe" />
        <span className="navbar-lang-text">
          {displayLabel}
        </span>
        <ChevronDown
          size={13}
          className={`navbar-lang-chevron ${isOpen ? 'open' : ''}`}
        />
      </button>

      {isOpen && (
        <div
          className="language-dropdown-menu"
          style={{
            position: 'absolute',
            top: 'calc(100% + 8px)',
            right: 0,
            background: '#FFFFFF',
            borderRadius: 'var(--radius-lg)',
            boxShadow: '0 20px 40px rgba(0, 0, 0, 0.16)',
            border: '1px solid var(--border)',
            padding: '12px',
            width: '320px',
            maxWidth: '92vw',
            zIndex: 1000,
            animation: 'fadeIn 0.15s ease-out',
          }}
        >
          {/* Header & Search */}
          <div style={{ marginBottom: 10 }}>
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: 8,
              }}
            >
              <span
                style={{
                  fontSize: '0.74rem',
                  fontWeight: 700,
                  color: '#9CA3AF',
                  textTransform: 'uppercase',
                  letterSpacing: '0.06em',
                }}
              >
                {t('languages.selectLanguage')} ({WORLD_LANGUAGES.length} Worlds)
              </span>
            </div>

            <div
              style={{
                position: 'relative',
                display: 'flex',
                alignItems: 'center',
              }}
            >
              <Search
                size={14}
                color="#9CA3AF"
                style={{ position: 'absolute', left: 10 }}
              />
              <input
                type="text"
                placeholder="Search languages..."
                value={searchFilter}
                onChange={(e) => setSearchFilter(e.target.value)}
                style={{
                  width: '100%',
                  padding: '7px 28px 7px 32px',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--border)',
                  fontSize: '0.82rem',
                  outline: 'none',
                }}
                autoFocus
              />
              {searchFilter && (
                <button
                  type="button"
                  onClick={() => setSearchFilter('')}
                  style={{
                    position: 'absolute',
                    right: 8,
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    padding: 0,
                    color: '#9CA3AF',
                  }}
                >
                  <X size={14} />
                </button>
              )}
            </div>
          </div>

          {/* Languages Scroll List */}
          <div
            style={{
              maxHeight: '300px',
              overflowY: 'auto',
              display: 'flex',
              flexDirection: 'column',
              gap: 2,
            }}
          >
            {filteredLanguages.length === 0 ? (
              <div
                style={{
                  padding: '24px 12px',
                  textAlign: 'center',
                  color: '#9CA3AF',
                  fontSize: '0.85rem',
                }}
              >
                No matching language found
              </div>
            ) : (
              filteredLanguages.map((lang) => {
                const isSelected = lang.code === currentLang.code;
                return (
                  <button
                    key={lang.code}
                    type="button"
                    className="language-option-btn"
                    onClick={() => handleLanguageChange(lang.code)}
                    id={`lang-select-${lang.code}`}
                    style={{
                      width: '100%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '8px 10px',
                      borderRadius: 'var(--radius-md)',
                      border: 'none',
                      background: isSelected ? '#FFF1F2' : 'transparent',
                      cursor: 'pointer',
                      textAlign: 'left',
                      transition: 'background var(--transition-fast)',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <span style={{ fontSize: '1.25rem' }}>{lang.flag}</span>
                      <div>
                        <div
                          style={{
                            fontWeight: isSelected ? 700 : 600,
                            fontSize: '0.88rem',
                            color: isSelected ? '#FF385C' : '#1F2937',
                          }}
                        >
                          {lang.nativeName}
                        </div>
                        <div style={{ fontSize: '0.72rem', color: '#6B7280' }}>
                          {lang.name} · {lang.region}
                        </div>
                      </div>
                    </div>

                    {isSelected && <Check size={16} color="#FF385C" strokeWidth={2.5} />}
                  </button>
                );
              })
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default LanguageSelector;
