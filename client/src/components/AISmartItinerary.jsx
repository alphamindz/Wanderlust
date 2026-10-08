import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import api from '../api/client';
import {
  Compass,
  Wand2,
  Clock,
  Utensils,
  Lightbulb,
  CheckCircle,
  Copy,
  Loader2,
  Luggage,
} from 'lucide-react';
import { WORLD_LANGUAGES } from './LanguageSelector';

const INTEREST_OPTIONS_MAP = {
  hi: [
    'संस्कृति और इतिहास',
    'स्थानीय भोजन और वाइन',
    'प्राकृतिक दृश्य',
    'छिपे हुए दर्शनीय स्थल',
    'विश्राम और वेलनेस',
    'फोटोग्राफी और वास्तुकला',
  ],
  es: [
    'Cultura e Historia',
    'Gastronomía local y Vino',
    'Naturaleza y Paisajes',
    'Joyas Ocultas',
    'Bienestar y Relax',
    'Fotografía y Arquitectura',
  ],
  fr: [
    'Culture & Histoire',
    'Gastronomie & Vin local',
    'Nature & Panoramas',
    'Trésors cachés',
    'Détente & Bien-être',
    'Photographie & Architecture',
  ],
  en: [
    'Culture & History',
    'Local Culinary & Wine',
    'Scenic & Nature',
    'Hidden Gems',
    'Relaxation & Wellness',
    'Photography & Architecture',
  ],
};

const AISmartItinerary = ({ listing }) => {
  const { i18n } = useTranslation();
  const currentLang = (i18n.language || 'en').split('-')[0];
  const activeLangObj = WORLD_LANGUAGES.find((l) => l.code === currentLang) || WORLD_LANGUAGES[0];

  const availableInterests = INTEREST_OPTIONS_MAP[currentLang] || INTEREST_OPTIONS_MAP.en;

  const [days, setDays] = useState(3);
  const [pace, setPace] = useState('Balanced');
  const [selectedInterests, setSelectedInterests] = useState([
    availableInterests[0] || 'Culture & History',
    availableInterests[1] || 'Local Culinary & Wine',
    availableInterests[2] || 'Scenic & Nature',
  ]);
  const [loading, setLoading] = useState(false);
  const [itinerary, setItinerary] = useState(null);
  const [activeDayIndex, setActiveDayIndex] = useState(0);
  const [copied, setCopied] = useState(false);

  const toggleInterest = (interest) => {
    if (selectedInterests.includes(interest)) {
      setSelectedInterests(selectedInterests.filter((i) => i !== interest));
    } else {
      setSelectedInterests([...selectedInterests, interest]);
    }
  };

  const handleGenerateItinerary = async () => {
    setLoading(true);
    try {
      const response = await api.post('/ai/generate-itinerary', {
        title: listing.title,
        location: listing.location,
        country: listing.country,
        days,
        interests: selectedInterests,
        pace,
        language: currentLang,
      });
      setItinerary(response.data.itinerary);
      setActiveDayIndex(0);
    } catch (err) {
      console.error('Error generating itinerary:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCopyItinerary = () => {
    if (!itinerary) return;
    const text = `${itinerary.itineraryTitle}\n\n${itinerary.overview}\n\n` +
      itinerary.days
        .map(
          (d) =>
            `Day ${d.dayNumber}: ${d.dayTitle}\n` +
            `• Morning: ${d.morning?.activity} (${d.morning?.duration}) - ${d.morning?.description}\n` +
            `• Afternoon: ${d.afternoon?.activity} (${d.afternoon?.duration}) - ${d.afternoon?.description}\n` +
            `• Evening: ${d.evening?.activity} (${d.evening?.duration}) - ${d.evening?.description}\n` +
            `• Dining: ${d.diningRecommendation?.venue} (${d.diningRecommendation?.type})\n`
        )
        .join('\n\n');

    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  };

  // Localized Labels
  const labels = {
    hi: {
      title: 'AI स्मार्ट यात्रा कार्यक्रम योजनाकार',
      subtitle: `${listing.title} के आसपास व्यक्तिगत दर्शनीय स्थल और गतिविधियां`,
      duration: 'यात्रा कार्यक्रम की अवधि',
      dayPlan3: '📅 3-दिवसीय योजना',
      dayPlan5: '🌟 5-दिवसीय योजना',
      pace: 'यात्रा की गति',
      interests: 'यात्रा रुचियां और ध्यान केंद्रित करें',
      btnGenerating: 'आपकी यात्रा की योजना बन रही है...',
      btnGenerate: 'स्मार्ट यात्रा कार्यक्रम तैयार करें',
      btnCopy: 'यात्रा कार्यक्रम कॉपी करें',
      btnCopied: 'क्लिपबोर्ड पर कॉपी हो गया!',
      schedule: 'शेड्यूल',
      morning: 'सुबह',
      afternoon: 'दोपहर',
      evening: 'शाम',
      tip: 'टिप',
      curatedDining: 'क्यूरेटेड डाइनिंग सिफारिश',
      packing: 'पैकिंग के लिए आवश्यक वस्तुएं',
      etiquette: 'स्थानीय आतिथ्य शिष्टाचार',
    },
    es: {
      title: 'Planificador de Itinerarios Inteligente con IA',
      subtitle: `Visitas turísticas y actividades personalizadas en torno a ${listing.title}`,
      duration: 'Duración del itinerario',
      dayPlan3: '📅 Plan de 3 días',
      dayPlan5: '🌟 Plan de 5 días',
      pace: 'Ritmo de viaje',
      interests: 'Intereses y enfoque del viaje',
      btnGenerating: 'Diseñando tu viaje...',
      btnGenerate: 'Generar itinerario inteligente',
      btnCopy: 'Copiar itinerario',
      btnCopied: '¡Copiado al portapapeles!',
      schedule: 'Horario',
      morning: 'Mañana',
      afternoon: 'Tarde',
      evening: 'Noche',
      tip: 'Consejo',
      curatedDining: 'Recomendación gastronómica selecta',
      packing: 'Artículos esenciales de equipaje',
      etiquette: 'Etiqueta y cortesía local',
    },
    fr: {
      title: 'Planificateur d\'itinéraire intelligent par IA',
      subtitle: `Activités et visites personnalisées autour de ${listing.title}`,
      duration: 'Durée du séjour',
      dayPlan3: '📅 Programme 3 jours',
      dayPlan5: '🌟 Programme 5 jours',
      pace: 'Rythme du voyage',
      interests: 'Centres d\'intérêt & envies',
      btnGenerating: 'Création de votre séjour...',
      btnGenerate: 'Générer l\'itinéraire par IA',
      btnCopy: 'Copier l\'itinéraire',
      btnCopied: 'Copié dans le presse-papier !',
      schedule: 'Planning',
      morning: 'Matin',
      afternoon: 'Après-midi',
      evening: 'Soirée',
      tip: 'Conseil',
      curatedDining: 'Bonne table recommandée',
      packing: 'Indispensables pour la valise',
      etiquette: 'Coutumes et étiquette locale',
    },
    en: {
      title: 'AI Smart Itinerary Planner',
      subtitle: `Personalized sightseeing & activities surrounding ${listing.title}`,
      duration: 'Itinerary Duration',
      dayPlan3: '📅 3-Day Plan',
      dayPlan5: '🌟 5-Day Plan',
      pace: 'Travel Pace',
      interests: 'Travel Interests & Focus',
      btnGenerating: 'Designing Your Journey...',
      btnGenerate: 'Generate Smart Itinerary',
      btnCopy: 'Copy Itinerary',
      btnCopied: 'Copied to Clipboard!',
      schedule: 'Schedule',
      morning: 'Morning',
      afternoon: 'Afternoon',
      evening: 'Evening',
      tip: 'Tip',
      curatedDining: 'Curated Dining Recommendation',
      packing: 'Packing Essentials',
      etiquette: 'Local Hospitality Etiquette',
    },
  };

  const ui = labels[currentLang] || labels.en;

  return (
    <div className="ai-card" id="ai-smart-itinerary-card">
      <div className="ai-card-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div className="ai-badge-icon">
            <Compass size={22} color="#FFFFFF" />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
              <h3 style={{ fontSize: '1.35rem', margin: 0 }}>
                {ui.title}
              </h3>
              <span className="ai-pill-tag">Day-by-Day Plan</span>
              <span style={{ fontSize: '0.75rem', color: '#7C3AED', background: '#F5F3FF', padding: '2px 8px', borderRadius: '12px', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                {activeLangObj.flag} {activeLangObj.nativeName}
              </span>
            </div>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', margin: 0 }}>
              {ui.subtitle}
            </p>
          </div>
        </div>
      </div>

      {/* Configuration bar */}
      <div
        style={{
          marginTop: 20,
          background: '#F9FAFB',
          padding: '20px',
          borderRadius: 'var(--radius-md)',
          border: '1px solid var(--border)',
        }}
      >
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16, marginBottom: 16 }}>
          <div>
            <label className="ai-input-label">{ui.duration}</label>
            <div style={{ display: 'flex', gap: 8 }}>
              <button
                type="button"
                className={`style-toggle-btn ${days === 3 ? 'active' : ''}`}
                onClick={() => setDays(3)}
              >
                {ui.dayPlan3}
              </button>
              <button
                type="button"
                className={`style-toggle-btn ${days === 5 ? 'active' : ''}`}
                onClick={() => setDays(5)}
              >
                {ui.dayPlan5}
              </button>
            </div>
          </div>

          <div>
            <label className="ai-input-label">{ui.pace}</label>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              {['Relaxed', 'Balanced', 'Fast-paced'].map((p) => (
                <button
                  key={p}
                  type="button"
                  className={`style-toggle-btn ${pace === p ? 'active' : ''}`}
                  onClick={() => setPace(p)}
                >
                  {p}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div>
          <label className="ai-input-label">{ui.interests}</label>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
            {availableInterests.map((interest) => {
              const active = selectedInterests.includes(interest);
              return (
                <button
                  key={interest}
                  type="button"
                  onClick={() => toggleInterest(interest)}
                  style={{
                    padding: '6px 12px',
                    borderRadius: 'var(--radius-full)',
                    border: active ? '1px solid #7C3AED' : '1px solid var(--border)',
                    background: active ? '#F5F3FF' : '#FFFFFF',
                    color: active ? '#7C3AED' : 'var(--text-main)',
                    fontSize: '0.82rem',
                    fontWeight: 600,
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                  }}
                >
                  {interest}
                </button>
              );
            })}
          </div>
        </div>

        <div style={{ marginTop: 20, display: 'flex', justifyContent: 'flex-end' }}>
          <button
            className="btn btn-primary"
            style={{
              background: 'linear-gradient(135deg, #7C3AED 0%, #EC4899 100%)',
              boxShadow: '0 4px 14px rgba(124, 58, 237, 0.35)',
            }}
            onClick={handleGenerateItinerary}
            disabled={loading}
            id="generate-itinerary-button"
          >
            {loading ? (
              <>
                <Loader2 size={16} className="animate-spin" />
                <span>{ui.btnGenerating}</span>
              </>
            ) : (
              <>
                <Wand2 size={16} />
                <span>{ui.btnGenerate}</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Itinerary Display */}
      {itinerary && (
        <div style={{ marginTop: 28 }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: 12,
              marginBottom: 16,
            }}
          >
            <div>
              <h4 style={{ fontSize: '1.4rem', margin: '0 0 4px 0' }}>
                {itinerary.itineraryTitle}
              </h4>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.92rem', margin: 0 }}>
                {itinerary.overview}
              </p>
            </div>

            <button
              onClick={handleCopyItinerary}
              className="btn btn-secondary"
              style={{ fontSize: '0.85rem', padding: '8px 14px' }}
            >
              <Copy size={15} />
              <span>{copied ? ui.btnCopied : ui.btnCopy}</span>
            </button>
          </div>

          {/* Day Navigation Tabs */}
          <div className="itinerary-tabs-row">
            {itinerary.days?.map((day, idx) => (
              <button
                key={day.dayNumber}
                className={`itinerary-day-tab ${activeDayIndex === idx ? 'active' : ''}`}
                onClick={() => setActiveDayIndex(idx)}
              >
                <div style={{ fontSize: '0.75rem', textTransform: 'uppercase', opacity: 0.8 }}>
                  Day {day.dayNumber}
                </div>
                <div style={{ fontWeight: 700, fontSize: '0.92rem' }}>
                  {day.dayTitle?.split('&')[0]?.trim() || `Day ${day.dayNumber}`}
                </div>
              </button>
            ))}
          </div>

          {/* Active Day Card */}
          {itinerary.days && itinerary.days[activeDayIndex] && (
            <div className="active-day-card">
              <div
                style={{
                  paddingBottom: 16,
                  borderBottom: '1px solid var(--border-light)',
                  marginBottom: 20,
                }}
              >
                <span
                  style={{
                    background: '#F5F3FF',
                    color: '#7C3AED',
                    fontWeight: 700,
                    fontSize: '0.75rem',
                    padding: '3px 8px',
                    borderRadius: 'var(--radius-full)',
                    textTransform: 'uppercase',
                  }}
                >
                  Day {itinerary.days[activeDayIndex].dayNumber} {ui.schedule}
                </span>
                <h3 style={{ fontSize: '1.3rem', margin: '8px 0 0 0' }}>
                  {itinerary.days[activeDayIndex].dayTitle}
                </h3>
              </div>

              {/* Time Slots: Morning, Afternoon, Evening */}
              <div className="timeline-container">
                {/* Morning */}
                <div className="timeline-slot">
                  <div className="timeline-indicator morning">
                    <span>{ui.morning}</span>
                  </div>
                  <div className="timeline-content">
                    <div className="timeline-title-row">
                      <h4 className="timeline-title">
                        {itinerary.days[activeDayIndex].morning?.activity}
                      </h4>
                      <span className="timeline-duration">
                        <Clock size={13} />
                        {itinerary.days[activeDayIndex].morning?.duration}
                      </span>
                    </div>
                    <p className="timeline-desc">
                      {itinerary.days[activeDayIndex].morning?.description}
                    </p>
                    {itinerary.days[activeDayIndex].morning?.insiderTip && (
                      <div className="timeline-tip">
                        <Lightbulb size={14} color="#EAB308" />
                        <span>{ui.tip}: {itinerary.days[activeDayIndex].morning?.insiderTip}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Afternoon */}
                <div className="timeline-slot">
                  <div className="timeline-indicator afternoon">
                    <span>{ui.afternoon}</span>
                  </div>
                  <div className="timeline-content">
                    <div className="timeline-title-row">
                      <h4 className="timeline-title">
                        {itinerary.days[activeDayIndex].afternoon?.activity}
                      </h4>
                      <span className="timeline-duration">
                        <Clock size={13} />
                        {itinerary.days[activeDayIndex].afternoon?.duration}
                      </span>
                    </div>
                    <p className="timeline-desc">
                      {itinerary.days[activeDayIndex].afternoon?.description}
                    </p>
                    {itinerary.days[activeDayIndex].afternoon?.insiderTip && (
                      <div className="timeline-tip">
                        <Lightbulb size={14} color="#EAB308" />
                        <span>{ui.tip}: {itinerary.days[activeDayIndex].afternoon?.insiderTip}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Evening */}
                <div className="timeline-slot">
                  <div className="timeline-indicator evening">
                    <span>{ui.evening}</span>
                  </div>
                  <div className="timeline-content">
                    <div className="timeline-title-row">
                      <h4 className="timeline-title">
                        {itinerary.days[activeDayIndex].evening?.activity}
                      </h4>
                      <span className="timeline-duration">
                        <Clock size={13} />
                        {itinerary.days[activeDayIndex].evening?.duration}
                      </span>
                    </div>
                    <p className="timeline-desc">
                      {itinerary.days[activeDayIndex].evening?.description}
                    </p>
                    {itinerary.days[activeDayIndex].evening?.insiderTip && (
                      <div className="timeline-tip">
                        <Lightbulb size={14} color="#EAB308" />
                        <span>{ui.tip}: {itinerary.days[activeDayIndex].evening?.insiderTip}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Dining recommendation */}
                {itinerary.days[activeDayIndex].diningRecommendation && (
                  <div
                    style={{
                      background: '#FFFBEB',
                      border: '1px solid #FDE68A',
                      padding: '16px',
                      borderRadius: 'var(--radius-md)',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 14,
                      marginTop: 16,
                    }}
                  >
                    <div
                      style={{
                        width: 40,
                        height: 40,
                        borderRadius: '50%',
                        background: '#F59E0B',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: '#FFF',
                        flexShrink: 0,
                      }}
                    >
                      <Utensils size={20} />
                    </div>
                    <div>
                      <div style={{ fontWeight: 700, color: '#92400E', fontSize: '0.92rem' }}>
                        {ui.curatedDining}:{' '}
                        {itinerary.days[activeDayIndex].diningRecommendation?.venue}
                      </div>
                      <div style={{ fontSize: '0.85rem', color: '#B45309' }}>
                        {itinerary.days[activeDayIndex].diningRecommendation?.type} ·{' '}
                        {itinerary.days[activeDayIndex].diningRecommendation?.specialty}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Packing & Etiquette advice */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 16, marginTop: 24 }}>
            <div style={{ background: '#F8FAFC', padding: '16px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontWeight: 700, marginBottom: 8 }}>
                <Luggage size={18} color="#6366F1" />
                <span>{ui.packing}</span>
              </div>
              <ul style={{ paddingLeft: 18, margin: 0, fontSize: '0.85rem', color: '#475569', lineHeight: 1.6 }}>
                {itinerary.packingEssentials?.map((item, i) => (
                  <li key={i}>{item}</li>
                ))}
              </ul>
            </div>

            <div style={{ background: '#F8FAFC', padding: '16px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontWeight: 700, marginBottom: 8 }}>
                <CheckCircle size={18} color="#10B981" />
                <span>{ui.etiquette}</span>
              </div>
              <ul style={{ paddingLeft: 18, margin: 0, fontSize: '0.85rem', color: '#475569', lineHeight: 1.6 }}>
                {itinerary.localEtiquetteTips?.map((tip, i) => (
                  <li key={i}>{tip}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AISmartItinerary;
