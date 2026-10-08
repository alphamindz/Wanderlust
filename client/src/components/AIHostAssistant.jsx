import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import api from '../api/client';
import { Sparkles, Wand2, Check, Loader2, Globe } from 'lucide-react';
import { WORLD_LANGUAGES } from './LanguageSelector';

const VIBE_OPTIONS = [
  'Luxury & Serene',
  'Chic & Urban',
  'Rustic & Cozy',
  'Architectural & Modern',
  'Family & Fun',
];

const PROPERTY_TYPES = [
  'Entire Villa',
  'Cliffside Haven',
  'Glass Chalet',
  'Skyline Penthouse',
  'Historic Castle Estate',
  'Tropical Treehouse',
  'Lakefront Haven',
];

const AIHostAssistant = ({
  location,
  category,
  onApplyTitle,
  onApplyDescription,
  onApplyAmenities,
}) => {
  const { i18n } = useTranslation();
  const initialLang = (i18n.language || 'en').split('-')[0];

  const [isOpen, setIsOpen] = useState(false);
  const [outputLanguage, setOutputLanguage] = useState(initialLang);
  const [keyFeatures, setKeyFeatures] = useState('');
  const [vibe, setVibe] = useState('Luxury & Serene');
  const [propertyType, setPropertyType] = useState('Entire Villa');
  const [loading, setLoading] = useState(false);
  const [generatedData, setGeneratedData] = useState(null);

  const handleGenerate = async () => {
    if (!location) {
      alert('Please enter a City / Destination first before using AI generation.');
      return;
    }

    setLoading(true);
    try {
      const response = await api.post('/ai/generate-listing-content', {
        location,
        category: category || 'Trending',
        propertyType,
        keyFeatures: keyFeatures.split(',').map((s) => s.trim()),
        vibe,
        language: outputLanguage,
      });

      setGeneratedData(response.data.content);
    } catch (err) {
      console.error('Error generating listing content:', err);
    } finally {
      setLoading(false);
    }
  };

  const activeLangObj = WORLD_LANGUAGES.find((l) => l.code === outputLanguage) || WORLD_LANGUAGES[0];

  return (
    <div className="ai-host-box" id="ai-host-assistant-box">
      <div
        className="ai-host-trigger"
        onClick={() => setIsOpen(!isOpen)}
        style={{ cursor: 'pointer' }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div className="ai-badge-icon" style={{ width: 34, height: 34 }}>
            <Sparkles size={18} color="#FFFFFF" />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <h4 style={{ fontSize: '1rem', margin: 0, color: 'var(--dark)' }}>
                AI Description & Title Generator for Hosts
              </h4>
              <span style={{ fontSize: '0.70rem', color: '#7C3AED', background: '#F5F3FF', padding: '1px 6px', borderRadius: 4, fontWeight: 600 }}>
                {activeLangObj.flag} {activeLangObj.nativeName}
              </span>
            </div>
            <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              Create magnetic, high-converting property titles & descriptions in 11+ languages
            </p>
          </div>
        </div>
        <button
          type="button"
          className="btn btn-secondary"
          style={{
            padding: '6px 14px',
            fontSize: '0.82rem',
            background: isOpen ? '#F3F4F6' : '#FFFFFF',
          }}
        >
          {isOpen ? 'Close Assistant' : '✨ Open AI Writer'}
        </button>
      </div>

      {isOpen && (
        <div style={{ marginTop: 20, paddingTop: 16, borderTop: '1px solid var(--border)' }}>
          {/* Output Language Selector Bar */}
          <div
            style={{
              background: '#F9FAFB',
              border: '1px solid var(--border)',
              borderRadius: 'var(--radius-sm)',
              padding: '10px 14px',
              marginBottom: 16,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: 10,
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <Globe size={16} color="#7C3AED" />
              <span style={{ fontSize: '0.85rem', fontWeight: 600, color: '#374151' }}>
                AI Content Language:
              </span>
            </div>
            <select
              className="form-control"
              style={{ width: 'auto', minWidth: 200, padding: '4px 10px', fontSize: '0.85rem' }}
              value={outputLanguage}
              onChange={(e) => setOutputLanguage(e.target.value)}
            >
              {WORLD_LANGUAGES.map((lang) => (
                <option key={lang.code} value={lang.code}>
                  {lang.flag} {lang.nativeName} ({lang.name})
                </option>
              ))}
            </select>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginBottom: 14 }}>
            <div>
              <label className="ai-input-label">Property Architectural Style</label>
              <select
                className="form-control"
                value={propertyType}
                onChange={(e) => setPropertyType(e.target.value)}
              >
                {PROPERTY_TYPES.map((pt) => (
                  <option key={pt} value={pt}>
                    {pt}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="ai-input-label">Atmosphere & Vibe</label>
              <select
                className="form-control"
                value={vibe}
                onChange={(e) => setVibe(e.target.value)}
              >
                {VIBE_OPTIONS.map((v) => (
                  <option key={v} value={v}>
                    {v}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div style={{ marginBottom: 16 }}>
            <label className="ai-input-label">
              Key Features or Highlights (comma separated)
            </label>
            <input
              type="text"
              className="form-control"
              placeholder="e.g. heated infinity pool, sunset caldera view, chef kitchen, private wine cellar"
              value={keyFeatures}
              onChange={(e) => setKeyFeatures(e.target.value)}
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 16 }}>
            <button
              type="button"
              className="btn btn-primary"
              style={{
                background: 'linear-gradient(135deg, #4F46E5 0%, #7C3AED 100%)',
                fontSize: '0.9rem',
              }}
              onClick={handleGenerate}
              disabled={loading}
              id="ai-generate-content-btn"
            >
              {loading ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  <span>Generating Persuasive Copy in {activeLangObj.name}...</span>
                </>
              ) : (
                <>
                  <Wand2 size={16} />
                  <span>Generate in {activeLangObj.flag} {activeLangObj.nativeName}</span>
                </>
              )}
            </button>
          </div>

          {/* Results section */}
          {generatedData && (
            <div
              style={{
                background: '#FFFFFF',
                border: '1px solid #E0E7FF',
                borderRadius: 'var(--radius-md)',
                padding: '20px',
                boxShadow: '0 4px 12px rgba(79, 70, 229, 0.08)',
              }}
            >
              {/* Generated Titles */}
              <div style={{ marginBottom: 20 }}>
                <label
                  style={{
                    display: 'block',
                    fontSize: '0.82rem',
                    fontWeight: 700,
                    textTransform: 'uppercase',
                    color: '#4F46E5',
                    marginBottom: 8,
                  }}
                >
                  Click any suggested title to apply it:
                </label>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {generatedData.titles?.map((titleOption, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => onApplyTitle(titleOption)}
                      className="ai-suggestion-pill"
                    >
                      <span style={{ fontWeight: 600 }}>{titleOption}</span>
                      <span className="apply-btn-label">Apply Title →</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Generated Description */}
              <div style={{ marginBottom: 20 }}>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    marginBottom: 8,
                  }}
                >
                  <label
                    style={{
                      fontSize: '0.82rem',
                      fontWeight: 700,
                      textTransform: 'uppercase',
                      color: '#4F46E5',
                      margin: 0,
                    }}
                  >
                    AI Generated Description:
                  </label>
                  <button
                    type="button"
                    onClick={() => onApplyDescription(generatedData.description)}
                    className="btn btn-secondary"
                    style={{ fontSize: '0.8rem', padding: '4px 10px' }}
                  >
                    <Check size={14} />
                    <span>Apply to Description Box</span>
                  </button>
                </div>
                <div
                  style={{
                    background: '#F8FAFC',
                    padding: '14px',
                    borderRadius: 'var(--radius-sm)',
                    fontSize: '0.88rem',
                    color: '#334155',
                    lineHeight: 1.6,
                    whiteSpace: 'pre-line',
                    maxHeight: 220,
                    overflowY: 'auto',
                    border: '1px solid var(--border)',
                  }}
                >
                  {generatedData.description}
                </div>
              </div>

              {/* Recommended Amenities */}
              {generatedData.suggestedAmenities && (
                <div>
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      marginBottom: 8,
                    }}
                  >
                    <label
                      style={{
                        fontSize: '0.82rem',
                        fontWeight: 700,
                        textTransform: 'uppercase',
                        color: '#4F46E5',
                        margin: 0,
                      }}
                    >
                      AI Recommended Amenities:
                    </label>
                    <button
                      type="button"
                      onClick={() => onApplyAmenities(generatedData.suggestedAmenities)}
                      className="btn btn-secondary"
                      style={{ fontSize: '0.8rem', padding: '4px 10px' }}
                    >
                      <Check size={14} />
                      <span>Add All Amenities</span>
                    </button>
                  </div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                    {generatedData.suggestedAmenities.map((amenity, idx) => (
                      <span
                        key={idx}
                        style={{
                          background: '#EEF2FF',
                          color: '#4338CA',
                          fontSize: '0.78rem',
                          fontWeight: 600,
                          padding: '4px 10px',
                          borderRadius: 'var(--radius-full)',
                        }}
                      >
                        + {amenity}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default AIHostAssistant;
