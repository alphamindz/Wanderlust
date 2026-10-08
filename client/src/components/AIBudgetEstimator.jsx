import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import api from '../api/client';
import WLogo from './WLogo';
import {
  DollarSign,
  Utensils,
  Car,
  Compass,
  Lightbulb,
  PiggyBank,
  Loader2,
} from 'lucide-react';
import { WORLD_LANGUAGES } from './LanguageSelector';

const AIBudgetEstimator = ({ listing }) => {
  const { i18n } = useTranslation();
  const currentLang = (i18n.language || 'en').split('-')[0];
  const activeLangObj = WORLD_LANGUAGES.find((l) => l.code === currentLang) || WORLD_LANGUAGES[0];

  const [nights, setNights] = useState(4);
  const [guests, setGuests] = useState(listing?.guests || 2);
  const [travelStyle, setTravelStyle] = useState('Moderate');
  const [loading, setLoading] = useState(false);
  const [budgetData, setBudgetData] = useState(null);

  const fetchBudgetEstimate = async () => {
    setLoading(true);
    try {
      const response = await api.post('/ai/estimate-budget', {
        location: listing.location,
        country: listing.country,
        pricePerNight: listing.price,
        nights,
        guests,
        travelStyle,
        language: currentLang,
      });
      setBudgetData(response.data.budget);
    } catch (err) {
      console.error('Error calculating budget:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (listing) {
      fetchBudgetEstimate();
    }
  }, [listing?.location, nights, guests, travelStyle, currentLang]);

  const bd = budgetData?.breakdown;

  // Localized UI Labels
  const labels = {
    hi: {
      title: 'AI ट्रिप बजट और व्यय कैलकुलेटर',
      subtitle: `${listing.location}, ${listing.country} के लिए स्मार्ट रीयल-टाइम खर्च पूर्वानुमान`,
      duration: 'अवधि (रातें)',
      groupSize: 'समूह का आकार (अतिथि)',
      travelStyle: 'यात्रा शैली',
      estimatedGrandTotal: 'अनुमानित कुल बजट',
      dailyAverage: 'दैनिक औसत',
      perPersonDay: '/ व्यक्ति / दिन',
      accommodation: 'आवास',
      stayRate: `ठहरने की दर ($${listing.price}/रात)`,
      foodAndDining: 'भोजन और खानपान',
      localTransportation: 'स्थानीय परिवहन',
      transportSub: 'टैक्सी, पारगमन, स्थानांतरण',
      sightseeing: 'दर्शनीय स्थल और पर्यटन',
      sightseeingSub: 'अनुभव और सांस्कृतिक स्थल',
      insiderTips: `के लिए AI इनसाइडर टिप्स`,
      savingOpp: 'स्मार्ट बचत के अवसर',
      analyzing: `${listing.location} में भोजन, पारगमन और दर्शनीय स्थलों के खर्च का विश्लेषण किया जा रहा है...`,
    },
    es: {
      title: 'Estimador de Presupuesto de Viaje con IA',
      subtitle: `Previsiones inteligentes de gastos en tiempo real para ${listing.location}, ${listing.country}`,
      duration: 'Duración (Noches)',
      groupSize: 'Tamaño del grupo (Huéspedes)',
      travelStyle: 'Estilo de viaje',
      estimatedGrandTotal: 'Total General Estimado',
      dailyAverage: 'Promedio diario',
      perPersonDay: '/ persona / día',
      accommodation: 'Alojamiento',
      stayRate: `Tarifa de estancia ($${listing.price}/noche)`,
      foodAndDining: 'Alimentación y Gastronomía',
      localTransportation: 'Transporte Local',
      transportSub: 'Tránsito, taxis, traslados',
      sightseeing: 'Visitas y Excursiones',
      sightseeingSub: 'Experiencias y monumentos',
      insiderTips: `Consejos de expertos con IA para`,
      savingOpp: 'Oportunidades inteligentes de ahorro',
      analyzing: `Analizando economía de gastronomía, transporte y atracciones en ${listing.location}...`,
    },
    fr: {
      title: 'Estimateur de budget de voyage par IA',
      subtitle: `Prévisions intelligentes de dépenses en temps réel pour ${listing.location}, ${listing.country}`,
      duration: 'Durée (Nuits)',
      groupSize: 'Nombre de voyageurs (Hôtes)',
      travelStyle: 'Style de voyage',
      estimatedGrandTotal: 'Total général estimé',
      dailyAverage: 'Moyenne quotidienne',
      perPersonDay: '/ personne / jour',
      accommodation: 'Hébergement',
      stayRate: `Tarif nuitée ($${listing.price}/nuit)`,
      foodAndDining: 'Restauration et gastronomie',
      localTransportation: 'Transports locaux',
      transportSub: 'Transports, taxis, navettes',
      sightseeing: 'Visites et attractions',
      sightseeingSub: 'Expériences et monuments',
      insiderTips: `Conseils d'experts IA pour`,
      savingOpp: 'Astuces pour économiser intelligemment',
      analyzing: `Analyse des coûts locaux à ${listing.location}...`,
    },
    en: {
      title: 'AI Trip Budget & Expense Estimator',
      subtitle: `Smart real-time expense forecasts for ${listing.location}, ${listing.country}`,
      duration: 'Duration (Nights)',
      groupSize: 'Group Size (Guests)',
      travelStyle: 'Travel Style',
      estimatedGrandTotal: 'Estimated Grand Total',
      dailyAverage: 'Daily Average',
      perPersonDay: '/ person / day',
      accommodation: 'Accommodation',
      stayRate: `Stay rate ($${listing.price}/night)`,
      foodAndDining: 'Food & Dining',
      localTransportation: 'Local Transportation',
      transportSub: 'Transit, taxis, transfers',
      sightseeing: 'Sightseeing & Tours',
      sightseeingSub: 'Experiences & landmarks',
      insiderTips: `AI Insider Tips for`,
      savingOpp: 'Smart Saving Opportunities',
      analyzing: `Analyzing local dining, transit, and attraction economics in ${listing.location}...`,
    },
  };

  const ui = labels[currentLang] || labels.en;

  return (
    <div className="ai-card" id="ai-budget-estimator-card">
      <div className="ai-card-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div className="ai-badge-icon" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <WLogo size={20} />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
              <h3 style={{ fontSize: '1.35rem', margin: 0 }}>
                {ui.title}
              </h3>
              <span className="ai-pill-tag">Wanderlust AI</span>
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

      {/* Inputs controls */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
          gap: 16,
          marginTop: 20,
          background: '#F9FAFB',
          padding: '16px',
          borderRadius: 'var(--radius-md)',
          border: '1px solid var(--border)',
        }}
      >
        <div>
          <label className="ai-input-label">{ui.duration}</label>
          <input
            type="number"
            min="1"
            max="30"
            className="form-control"
            value={nights}
            onChange={(e) => setNights(Number(e.target.value))}
          />
        </div>

        <div>
          <label className="ai-input-label">{ui.groupSize}</label>
          <input
            type="number"
            min="1"
            max="20"
            className="form-control"
            value={guests}
            onChange={(e) => setGuests(Number(e.target.value))}
          />
        </div>

        <div style={{ gridColumn: 'span 2' }}>
          <label className="ai-input-label">{ui.travelStyle}</label>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            {['Budget', 'Moderate', 'Luxury'].map((style) => (
              <button
                key={style}
                type="button"
                className={`style-toggle-btn ${travelStyle === style ? 'active' : ''}`}
                onClick={() => setTravelStyle(style)}
              >
                {style === 'Budget' && '🎒 Budget'}
                {style === 'Moderate' && '⚖️ Moderate'}
                {style === 'Luxury' && '👑 Luxury'}
              </button>
            ))}
          </div>
        </div>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '60px 0' }}>
          <Loader2 size={32} color="#8B5CF6" className="animate-spin" style={{ margin: '0 auto 12px' }} />
          <p style={{ color: 'var(--text-muted)', fontWeight: 600 }}>
            {ui.analyzing}
          </p>
        </div>
      ) : budgetData ? (
        <div style={{ marginTop: 24 }}>
          {/* Grand Total Headline */}
          <div className="budget-summary-banner">
            <div>
              <div style={{ fontSize: '0.85rem', color: '#6B7280', textTransform: 'uppercase', fontWeight: 700 }}>
                {ui.estimatedGrandTotal} ({nights} Nights · {guests} {guests === 1 ? 'Guest' : 'Guests'})
              </div>
              <div style={{ fontSize: '2.2rem', fontWeight: 800, color: 'var(--dark)' }}>
                ${budgetData.estimatedGrandTotal?.toLocaleString()}
              </div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: '0.85rem', color: '#6B7280', fontWeight: 600 }}>
                {ui.dailyAverage}
              </div>
              <div style={{ fontSize: '1.4rem', fontWeight: 700, color: '#10B981' }}>
                ${budgetData.dailyAveragePerPerson}{' '}
                <span style={{ fontSize: '0.85rem', color: '#6B7280', fontWeight: 400 }}>
                  {ui.perPersonDay}
                </span>
              </div>
            </div>
          </div>

          {/* Breakdown items */}
          <div className="budget-breakdown-grid">
            <div className="budget-card-item">
              <div className="budget-item-top">
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <div className="budget-icon-circle" style={{ background: '#FFF1F2', color: '#FF385C' }}>
                    <DollarSign size={18} />
                  </div>
                  <div>
                    <div className="budget-item-title">{ui.accommodation}</div>
                    <div className="budget-item-sub">{ui.stayRate}</div>
                  </div>
                </div>
                <div className="budget-item-amount">${bd?.accommodation?.total}</div>
              </div>
              <p className="budget-item-desc">{bd?.accommodation?.notes}</p>
            </div>

            <div className="budget-card-item">
              <div className="budget-item-top">
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <div className="budget-icon-circle" style={{ background: '#FEF3C7', color: '#D97706' }}>
                    <Utensils size={18} />
                  </div>
                  <div>
                    <div className="budget-item-title">{ui.foodAndDining}</div>
                    <div className="budget-item-sub">${bd?.foodAndDining?.dailyPerPerson}/day/guest</div>
                  </div>
                </div>
                <div className="budget-item-amount">${bd?.foodAndDining?.total}</div>
              </div>
              <p className="budget-item-desc">{bd?.foodAndDining?.description}</p>
            </div>

            <div className="budget-card-item">
              <div className="budget-item-top">
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <div className="budget-icon-circle" style={{ background: '#EFF6FF', color: '#2563EB' }}>
                    <Car size={18} />
                  </div>
                  <div>
                    <div className="budget-item-title">{ui.localTransportation}</div>
                    <div className="budget-item-sub">{ui.transportSub}</div>
                  </div>
                </div>
                <div className="budget-item-amount">${bd?.localTransportation?.total}</div>
              </div>
              <p className="budget-item-desc">{bd?.localTransportation?.recommendedMode}</p>
            </div>

            <div className="budget-card-item">
              <div className="budget-item-top">
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <div className="budget-icon-circle" style={{ background: '#F5F3FF', color: '#7C3AED' }}>
                    <Compass size={18} />
                  </div>
                  <div>
                    <div className="budget-item-title">{ui.sightseeing}</div>
                    <div className="budget-item-sub">{ui.sightseeingSub}</div>
                  </div>
                </div>
                <div className="budget-item-amount">${bd?.activitiesAndSightseeing?.total}</div>
              </div>
              <p className="budget-item-desc">
                {bd?.activitiesAndSightseeing?.highlightAttractions?.join(' · ')}
              </p>
            </div>
          </div>

          {/* Expert Tips & Savings */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 16, marginTop: 20 }}>
            <div style={{ background: '#F8FAFC', padding: '16px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontWeight: 700, color: '#0F172A', marginBottom: 8 }}>
                <Lightbulb size={18} color="#EAB308" />
                <span>{ui.insiderTips} {listing.location}</span>
              </div>
              <ul style={{ paddingLeft: 18, margin: 0, fontSize: '0.85rem', color: '#475569', lineHeight: 1.6 }}>
                {budgetData.expertTips?.map((tip, idx) => (
                  <li key={idx} style={{ marginBottom: 4 }}>
                    {tip}
                  </li>
                ))}
              </ul>
            </div>

            <div style={{ background: '#ECFDF5', padding: '16px', borderRadius: 'var(--radius-md)', border: '1px solid #A7F3D0' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontWeight: 700, color: '#065F46', marginBottom: 8 }}>
                <PiggyBank size={18} color="#10B981" />
                <span>{ui.savingOpp}</span>
              </div>
              <ul style={{ paddingLeft: 18, margin: 0, fontSize: '0.85rem', color: '#047857', lineHeight: 1.6 }}>
                {budgetData.savingOpportunities?.map((sav, idx) => (
                  <li key={idx} style={{ marginBottom: 4 }}>
                    {sav}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default AIBudgetEstimator;
