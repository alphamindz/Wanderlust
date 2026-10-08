const { GoogleGenerativeAI } = require('@google/generative-ai');

const SUPPORTED_LANGUAGES = {
  en: 'English',
  hi: 'Hindi (हिन्दी)',
  es: 'Spanish (Español)',
  fr: 'French (Français)',
  de: 'German (Deutsch)',
  ja: 'Japanese (日本語)',
  it: 'Italian (Italiano)',
  pt: 'Portuguese (Português)',
  zh: 'Chinese (中文)',
  ar: 'Arabic (العربية)',
  ru: 'Russian (Русский)',
};

const getLanguageName = (code) => {
  if (!code) return 'English';
  const clean = code.toLowerCase().split('-')[0];
  return SUPPORTED_LANGUAGES[clean] || SUPPORTED_LANGUAGES[code] || 'English';
};

const getGeminiClient = () => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey.trim() === '' || apiKey === 'your_gemini_api_key_here') {
    return null;
  }
  return new GoogleGenerativeAI(apiKey.trim());
};

/**
 * Helper to provide localized fallback budget strings
 */
const getLocalizedBudgetFallback = (lang, location, country, nightlyRate, travelStyle) => {
  const code = (lang || 'en').toLowerCase().split('-')[0];

  if (code === 'hi') {
    return {
      accommodationNotes: `संपत्ति दर $${nightlyRate}/रात के आधार पर निजी आवास।`,
      foodDesc:
        travelStyle === 'Luxury'
          ? 'उत्कृष्ट भोजन, उत्तम वाइन और प्रसिद्ध स्थानीय शेफ।'
          : travelStyle === 'Budget'
            ? 'पारंपरिक स्थानीय भोजनालय और स्ट्रीट फूड।'
            : 'स्थानीय कैफे, पारंपरिक भोजन और समुद्री दृश्य वाले रेस्टोरेंट।',
      transportMode:
        travelStyle === 'Luxury'
          ? 'निजी हवाई अड्डा स्थानांतरण और निजी कार सेवा।'
          : 'किराए की कार या क्षेत्रीय हाई-स्पीड रेल पास।',
      attractions: [
        `${location} में निजी निर्देशित वॉक टूर`,
        'सूर्यास्त बोट क्रूज या क्षेत्रीय दर्शनीय भ्रमण',
        'ऐतिहासिक संग्रहालय और सांस्कृतिक धरोहर पास',
      ],
      contingencyNotes: 'अचानक परिवहन, स्मृति चिन्ह खरीदारी और आकस्मिक खर्चों के लिए।',
      expertTips: [
        `पीक ट्रैवल सीजन के दौरान ${location} में शीर्ष रेस्टोरेंट कम से कम 2 सप्ताह पहले बुक करें।`,
        'ऑफ़लाइन नेविगेशन मैप डाउनलोड करें और देखें कि क्या म्यूज़ियम पास में प्राथमिकता लाइन की सुविधा है।',
        'स्थानीय बाजारों और सार्वजनिक परिवहन के लिए नकदी हमेशा पास रखें।',
      ],
      savingOpportunities: [
        'एजेंसी शुल्क से बचने के लिए आधिकारिक नगरपालिका पोर्टल से संग्रहालय टिकट बुक करें।',
        'सुबह के स्थानीय बाजार से ताज़ी चीजें खरीदें और विला में स्वादिष्ट नाश्ता बनाएं।',
      ],
    };
  }

  if (code === 'es') {
    return {
      accommodationNotes: `Alojamiento privado según la tarifa de $${nightlyRate}/noche.`,
      foodDesc:
        travelStyle === 'Luxury'
          ? 'Alta cocina, maridajes de vinos exclusivos y chefs de renombre.'
          : travelStyle === 'Budget'
            ? 'Bistrós locales auténticos, panaderías y mercados callejeros.'
            : 'Combinación de trattorias auténticas, cafeterías junto al mar y cenas selectas.',
      transportMode:
        travelStyle === 'Luxury'
          ? 'Traslados privados al aeropuerto y servicio de chófer.'
          : 'Alquiler de coche reservado o pases de tren regional de alta velocidad.',
      attractions: [
        `Visita guiada a pie privada por ${location}`,
        'Paseo en catamarán al atardecer o excursión regional',
        'Pases de entrada a museos históricos y monumentos culturales',
      ],
      contingencyNotes: 'Cubre transporte imprevisto, propinas, recuerdos y gastos imprevistos.',
      expertTips: [
        `Reserva los mejores restaurantes en ${location} con al menos 2 semanas de anticipación en temporada alta.`,
        'Descarga mapas sin conexión y verifica si las tarjetas turísticas incluyen acceso prioritario sin colas.',
        'Lleva siempre algo de efectivo para mercados artesanales y transporte local.',
      ],
      savingOpportunities: [
        'Reserva entradas a museos en sitios web oficiales para evitar recargos de agencias intermediarias.',
        'Visita mercados locales por la mañana para preparar desayunos frescos en tu alojamiento.',
      ],
    };
  }

  if (code === 'fr') {
    return {
      accommodationNotes: `Hébergement privé calculé sur le tarif de $${nightlyRate}/nuit.`,
      foodDesc:
        travelStyle === 'Luxury'
          ? 'Gastronomie raffinée, accords mets-vins et chefs renommés.'
          : travelStyle === 'Budget'
            ? 'Bistrots locaux authentiques et marchés de quartier.'
            : 'Mélange de trattorias authentiques, cafés côtiers et bonnes tables.',
      transportMode:
        travelStyle === 'Luxury'
          ? 'Transferts aéroport privés et chauffeur dédié.'
          : 'Location de voiture ou pass ferroviaires régionaux grande vitesse.',
      attractions: [
        `Visite privée à pied guidée de ${location}`,
        'Croisière en catamaran au coucher du soleil',
        'Pass musées historiques et monuments culturels incontournables',
      ],
      contingencyNotes: 'Couvre transports imprévus, pourboires, souvenirs et extras.',
      expertTips: [
        `Réservez les meilleures tables à ${location} au moins 2 semaines à l'avance en haute saison.`,
        'Téléchargez des cartes hors ligne et vérifiez les pass coupe-file pour les musées.',
        "Conservez toujours un peu de monnaie locale pour les marchés d'artisans.",
      ],
      savingOpportunities: [
        'Achetez les billets de musée sur les plateformes officielles pour éviter les commissions.',
        'Profitez des marchés matinaux pour concocter de savoureux petits-déjeuners à votre villa.',
      ],
    };
  }

  if (code === 'de') {
    return {
      accommodationNotes: `Private Unterkunft basierend auf der Rate von $${nightlyRate}/Nacht.`,
      foodDesc:
        travelStyle === 'Luxury'
          ? 'Gehobene Küche, exzellente Weinbegleitung und Spitzenköche.'
          : travelStyle === 'Budget'
            ? 'Authentische lokale Bistros, Bäckereien und Straßenmärkte.'
            : 'Gute Mischung aus traditionellen Lokalen und gemütlichen Cafés.',
      transportMode:
        travelStyle === 'Luxury'
          ? 'Privater Flughafentransfer und Chauffeurservice.'
          : 'Mietwagen oder regionale Hochgeschwindigkeitszug-Pässe.',
      attractions: [
        `Geführte private Stadtführung in ${location}`,
        'Katamaran-Fahrt zum Sonnenuntergang oder Tagesausflug',
        'Pässe für historische Museen und Wahrzeichen',
      ],
      contingencyNotes: 'Deckt unvorhergesehene Fahrten, Trinkgelder und Souvenirkäufe ab.',
      expertTips: [
        `Top-Restaurants in ${location} mindestens 2 Wochen im Voraus buchen.`,
        'Offline-Karten herunterladen und Museumspässe für Schnelleinlass prüfen.',
        'Immer etwas Bargeld für traditionelle Handwerksmärkte dabeihaben.',
      ],
      savingOpportunities: [
        'Museumstickets direkt über städtische Webseiten ohne Aufpreise buchen.',
        'Frische regionale Zutaten auf dem Wochenmarkt für das Frühstück besorgen.',
      ],
    };
  }

  if (code === 'ja') {
    return {
      accommodationNotes: `1泊あたり$${nightlyRate}に基づくプライベート宿泊費。`,
      foodDesc:
        travelStyle === 'Luxury'
          ? '最高峰の高級ダイニング、厳選ワインペアリング、名シェフの味。'
          : travelStyle === 'Budget'
            ? '本場のローカルビストロ、ベーカリー、活気ある屋台。'
            : '地元の人気カフェ、家庭料理レストラン、海の見える絶景ディナー。',
      transportMode:
        travelStyle === 'Luxury'
          ? '空港プライベート送迎＆専用ハイヤー。'
          : '事前予約レンタカーまたは高速鉄道パス。',
      attractions: [
        `${location}のプライベートガイド付きウォーキングツアー`,
        'サンセットカタマランクルーズまたは観光エクスカーション',
        '歴史的博物館＆文化名所エクスプレスパス',
      ],
      contingencyNotes: '予期せぬ交通費、チップ、お土産代などの予備費。',
      expertTips: [
        `${location}の人気レストランはハイシーズン中、最低2週間前には予約しましょう。`,
        'オフライン地図を保存し、優先入場できるミュージアムカードをチェックしてください。',
        '市場やローカル交通向けに少額の現金を用意しておくと安心です。',
      ],
      savingOpportunities: [
        '中間手数料を避けるため、公式市営ポータルから入場券を直接購入する。',
        '朝の地元マーケットで新鮮な食材を購入し、ヴィラで優雅な朝食を楽しむ。',
      ],
    };
  }

  if (code === 'zh') {
    return {
      accommodationNotes: `根据每晚 $${nightlyRate} 的价格计算的私人住宿预算。`,
      foodDesc:
        travelStyle === 'Luxury'
          ? '高端精致餐饮、侍酒师精选餐酒及知名主厨料理。'
          : travelStyle === 'Budget'
            ? '地道街头小吃、当地特色餐馆和热闹早市。'
            : '特色海滨餐厅、传统小酒馆与精致下午茶体验。',
      transportMode:
        travelStyle === 'Luxury'
          ? '私人专车接送机与全天候司机服务。'
          : '提前预订的租车自驾或城际高铁通票。',
      attractions: [
        `${location} 专属私人向导徒步漫游`,
        '日落双体帆船巡游或特色周边一日游',
        '历史博物馆及文化遗迹免排队通行证',
      ],
      contingencyNotes: '用于应急交通、小费、伴手礼及临时便民支出。',
      expertTips: [
        `旅游旺季请至少提前2周预订 ${location} 的高分特色餐厅。`,
        '提前下载离线地图，并确认当地博物馆通票是否支持优先快速通道。',
        '随身携带少量当地现钞，方便市集购物与本地小额交通。',
      ],
      savingOpportunities: [
        '通过官方市政网站直接预订景区门票，省去中介代订服务费。',
        '逛清晨本地市集采购新鲜食材，在度假屋中自制地道早餐。',
      ],
    };
  }

  if (code === 'ar') {
    return {
      accommodationNotes: `إقامة خاصة محسوبة على أساس سعر العقار $${nightlyRate} لكل ليلة.`,
      foodDesc:
        travelStyle === 'Luxury'
          ? 'مطاعم راقية وتجارب طهي استثنائية مع أشهر الطهاة المحليين.'
          : travelStyle === 'Budget'
            ? 'مطاعم شعبية أصيلة وأسواق أطعمة تقليدية.'
            : 'مزيج رائع من المطاعم الساحلية والمقاهي العريقة.',
      transportMode:
        travelStyle === 'Luxury'
          ? 'خدمة نقل خاصة من وإلى المطار مع سائق خاص.'
          : 'تأجير سيارة مسبقاً أو تذاكر قطار سريعة.',
      attractions: [
        `جولة سير خاصة مع مرشد محلي في ${location}`,
        'رحلة بحرية بالكاتاماران عند غروب الشمس',
        'تذاكر دخول سريعة للمتاحف والمعالم التاريخية',
      ],
      contingencyNotes: 'تغطي وسائل النقل غير المتوقعة والإكراميات وشراء الهدايا التذكارية.',
      expertTips: [
        `احجز المطاعم الشهيرة في ${location} قبل أسبوعين على الأقل خلال موسم الذروة.`,
        'قم بتحميل الخرائط دون إنترنت وتحقق من بطاقات المتاحف التي توفر دخولاً سريعاً.',
        'احتفظ دائماً ببعض العملات النقدية الصغيرة للأسواق التقليدية.',
      ],
      savingOpportunities: [
        'احجز تذاكر المتاحف مباشرة من البوابات الرسمية لتجنب الرسوم الإضافية.',
        'قم بزيارة الأسواق الصباحية لشراء منتجات طازجة وإعداد وجبات إفطار في الفيلا.',
      ],
    };
  }

  // Default English
  return {
    accommodationNotes: `Private accommodation based on property rate of $${nightlyRate}/night.`,
    foodDesc:
      travelStyle === 'Luxury'
        ? 'Fine dining, wine pairings, and signature local chefs.'
        : travelStyle === 'Budget'
          ? 'Authentic local bistros, neighborhood bakeries, and street markets.'
          : 'Mix of authentic trattorias, casual seaside cafes, and occasional dining treats.',
    transportMode:
      travelStyle === 'Luxury'
        ? 'Private airport transfers & chauffeur rides.'
        : 'Pre-booked car rental or high-speed regional rail passes.',
    attractions: [
      `Private guided walking tour in ${location}`,
      'Sunset catamaran cruise or regional excursion',
      'Historic museums & cultural landmark admission passes',
    ],
    contingencyNotes: 'Covers unexpected transit, gratuities, souvenir shopping, and convenience fees.',
    expertTips: [
      `Reserve top-rated dining spots in ${location} at least 2 weeks ahead during peak travel season.`,
      'Download offline navigation maps and verify if regional museum cards offer skip-the-line privileges.',
      'Always keep small local currency bills handy for artisanal markets and local transit.',
    ],
    savingOpportunities: [
      'Book museum entry tickets directly through official municipal portals to avoid agency surcharges.',
      'Visit local morning markets for fresh artisanal produce to prepare scenic breakfasts at your rental.',
    ],
  };
};

/**
 * 1. AI Trip Budget & Expense Estimator
 */
const estimateTripBudget = async ({
  location,
  country,
  pricePerNight,
  nights = 4,
  guests = 2,
  travelStyle = 'Moderate',
  language = 'en',
}) => {
  const genAI = getGeminiClient();
  const targetLangName = getLanguageName(language);

  if (genAI) {
    try {
      const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
      const prompt = `
You are an expert travel budget economist and concierge for Wanderlust.
Calculate a comprehensive, realistic travel expense estimate in USD for:
Destination: ${location}, ${country}
Accommodation Rate: $${pricePerNight} per night
Duration: ${nights} nights
Group Size: ${guests} traveler(s)
Travel Style: ${travelStyle} (Budget = thrift/street food/public transit, Moderate = comfortable dining/taxis/curated tickets, Luxury = private drivers/fine dining/VIP access).

CRITICAL LANGUAGE REQUIREMENT:
All user-facing textual fields (breakdown.accommodation.notes, breakdown.foodAndDining.description, breakdown.localTransportation.recommendedMode, breakdown.activitiesAndSightseeing.highlightAttractions array items, breakdown.contingencyFund.notes, expertTips array items, and savingOpportunities array items) MUST be written completely and fluently in ${targetLangName}.
All numeric values and JSON object keys must remain strictly in English as specified in the schema.

Return ONLY valid raw JSON with NO markdown code fences, matching this schema:
{
  "destination": "${location}, ${country}",
  "nights": ${nights},
  "guests": ${guests},
  "travelStyle": "${travelStyle}",
  "breakdown": {
    "accommodation": {
      "total": number,
      "perNight": number,
      "notes": string
    },
    "foodAndDining": {
      "total": number,
      "dailyPerPerson": number,
      "description": string
    },
    "localTransportation": {
      "total": number,
      "recommendedMode": string
    },
    "activitiesAndSightseeing": {
      "total": number,
      "highlightAttractions": [string, string, string]
    },
    "contingencyFund": {
      "total": number,
      "notes": string
    }
  },
  "estimatedGrandTotal": number,
  "dailyAveragePerPerson": number,
  "expertTips": [string, string, string],
  "savingOpportunities": [string, string]
}
`;
      const result = await model.generateContent(prompt);
      const text = result.response.text().trim();
      const cleaned = text.replace(/^```json\s*/i, '').replace(/```\s*$/i, '');
      return JSON.parse(cleaned);
    } catch (err) {
      console.warn('Gemini API call failed, using intelligent fallback:', err.message);
    }
  }

  // High-accuracy fallback algorithm based on destination and style
  const styleMultipliers = {
    Budget: { food: 35, transport: 15, activities: 20, contingencyPct: 0.08 },
    Moderate: { food: 75, transport: 35, activities: 50, contingencyPct: 0.1 },
    Luxury: { food: 180, transport: 95, activities: 140, contingencyPct: 0.12 },
  };

  const style = styleMultipliers[travelStyle] || styleMultipliers.Moderate;
  const numGuests = Math.max(1, Number(guests));
  const numNights = Math.max(1, Number(nights));
  const nightlyRate = Math.max(50, Number(pricePerNight));

  const accommodationTotal = nightlyRate * numNights;
  const foodTotal = style.food * numGuests * numNights;
  const transportTotal = style.transport * numGuests * numNights;
  const activitiesTotal = style.activities * numGuests * numNights;
  const subtotal = accommodationTotal + foodTotal + transportTotal + activitiesTotal;
  const contingencyTotal = Math.round(subtotal * style.contingencyPct);
  const grandTotal = subtotal + contingencyTotal;
  const dailyAverage = Math.round(grandTotal / (numNights * numGuests));

  const localized = getLocalizedBudgetFallback(language, location, country, nightlyRate, travelStyle);

  return {
    destination: `${location}, ${country}`,
    nights: numNights,
    guests: numGuests,
    travelStyle,
    breakdown: {
      accommodation: {
        total: accommodationTotal,
        perNight: nightlyRate,
        notes: localized.accommodationNotes,
      },
      foodAndDining: {
        total: foodTotal,
        dailyPerPerson: style.food,
        description: localized.foodDesc,
      },
      localTransportation: {
        total: transportTotal,
        recommendedMode: localized.transportMode,
      },
      activitiesAndSightseeing: {
        total: activitiesTotal,
        highlightAttractions: localized.attractions,
      },
      contingencyFund: {
        total: contingencyTotal,
        notes: localized.contingencyNotes,
      },
    },
    estimatedGrandTotal: grandTotal,
    dailyAveragePerPerson: dailyAverage,
    expertTips: localized.expertTips,
    savingOpportunities: localized.savingOpportunities,
  };
};

/**
 * 2. AI Smart Itinerary Planner (Day-by-Day Travel Plan)
 */
const generateItinerary = async ({
  title,
  location,
  country,
  days = 3,
  interests = ['Culture', 'Scenic Views', 'Local Food'],
  pace = 'Balanced',
  language = 'en',
}) => {
  const genAI = getGeminiClient();
  const numDays = Number(days) === 5 ? 5 : 3;
  const targetLangName = getLanguageName(language);

  if (genAI) {
    try {
      const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
      const prompt = `
You are a premier travel planner for Wanderlust.
Create an unforgettable, hyper-realistic, personalized ${numDays}-day day-by-day travel itinerary for travelers staying at:
Property: "${title}"
Location: ${location}, ${country}
Key Traveler Interests: ${interests.join(', ')}
Pace: ${pace}

CRITICAL LANGUAGE REQUIREMENT:
Generate the entire itinerary in fluent ${targetLangName}.
All user-facing strings (itineraryTitle, overview, dayTitle, morning/afternoon/evening activity, description, duration, insiderTip, diningRecommendation venue, type, specialty, packingEssentials, and localEtiquetteTips) MUST be written completely in ${targetLangName}.
Keep all JSON keys strictly in English as defined in the schema.

Return ONLY valid raw JSON with NO markdown code fences, matching this schema:
{
  "itineraryTitle": string,
  "overview": string,
  "destination": "${location}, ${country}",
  "totalDays": ${numDays},
  "pace": "${pace}",
  "days": [
    {
      "dayNumber": 1,
      "dayTitle": string,
      "morning": {
        "activity": string,
        "description": string,
        "duration": string,
        "insiderTip": string
      },
      "afternoon": {
        "activity": string,
        "description": string,
        "duration": string,
        "insiderTip": string
      },
      "evening": {
        "activity": string,
        "description": string,
        "duration": string,
        "insiderTip": string
      },
      "diningRecommendation": {
        "venue": string,
        "type": string,
        "specialty": string
      }
    }
  ],
  "packingEssentials": [string, string, string],
  "localEtiquetteTips": [string, string]
}
`;
      const result = await model.generateContent(prompt);
      const text = result.response.text().trim();
      const cleaned = text.replace(/^```json\s*/i, '').replace(/```\s*$/i, '');
      return JSON.parse(cleaned);
    } catch (err) {
      console.warn('Gemini API call failed, using intelligent itinerary fallback:', err.message);
    }
  }

  // Dynamic fallback generating detailed multi-day itinerary with language support
  const code = (language || 'en').toLowerCase().split('-')[0];

  const getDayThemes = () => {
    if (code === 'hi') {
      return [
        {
          title: `${location} का मनोरम परिचय और आगमन`,
          morning: {
            activity: `${location} के पास सुबह का चेक-इन और स्थानीय नाश्ता`,
            description: `विला में आराम करें, शानदार दृश्यों का आनंद लें और पास की बेकरी में ताज़ी कॉफी और नाश्ते का आनंद लें।`,
            duration: '2.5 घंटे',
            insiderTip: 'स्थानीय लोगों से सबसे अच्छे सूर्यास्त व्यूप्वाइंट के बारे में पूछें।',
          },
          afternoon: {
            activity: `ऐतिहासिक पुराना शहर और विरासत स्थल`,
            description: `पारंपरिक गलियों में घूमें, ऐतिहासिक चौकों को देखें और दोपहर की भीड़ से पहले सुंदर तस्वीरें लें।`,
            duration: '3.5 घंटे',
            insiderTip: 'पैदल चलने के लिए आरामदायक जूते पहनें।',
          },
          evening: {
            activity: `सुनहरी शाम के सूर्यास्त दृश्य और स्थानीय पेय`,
            description: `ऊंचाई वाली छत से ${location} पर शानदार सूर्यास्त का नजारा देखें।`,
            duration: '2.5 घंटे',
            insiderTip: 'सूर्यास्त से 45 मिनट पहले पहुंचें ताकि बेहतरीन जगह मिल सके।',
          },
          dining: {
            venue: 'हेरिटेज रेस्टोरेंट / क्लिफसाइड कैफे',
            type: 'पारंपरिक स्थानीय भोजन',
            specialty: 'स्थानीय पारंपरिक व्यंजन और विशेष मिठाई',
          },
        },
        {
          title: `तटीय आश्चर्य और छिपे हुए सांस्कृतिक रत्न`,
          morning: {
            activity: `प्राकृतिक तटीय ट्रेक या नाव की सवारी`,
            description: `समुद्र तट के किनारे सुबह की शांत सैर का आनंद लें और ताज़ी हवा महसूस करें।`,
            duration: '3.5 घंटे',
            insiderTip: 'सनस्क्रीन और धूप का चश्मा जरूर साथ रखें।',
          },
          afternoon: {
            activity: `कारीगरों की कार्यशालाएं और स्थानीय बाजार भ्रमण`,
            description: `स्थानीय कलाकारों से मिलें, हस्तशिल्प देखें और पारंपरिक मसालों और उपहारों की खरीदारी करें।`,
            duration: '3 घंटे',
            insiderTip: 'कई स्थानीय दुकानें यात्रा के लिए विशेष रूप से पैक किए गए उपहार देती हैं।',
          },
          evening: {
            activity: `समुद्र किनारे मोमबत्ती की रोशनी में रात का भोजन`,
            description: `लहरों की आवाज़ सुनते हुए तारों के नीचे रात का खाना खाएं।`,
            duration: '3 घंटे',
            insiderTip: 'दिन का ताज़ा शेफ स्पेशल व्यंजन ऑर्डर करें।',
          },
          dining: {
            venue: 'द वाटरफ्रंट सैंक्चुअरी',
            type: 'ताज़ा समुद्री और क्षेत्रीय व्यंजन',
            specialty: 'विशेष ग्रील्ड व्यंजन और स्थानीय पेय',
          },
        },
        {
          title: `सांस्कृतिक अनुभव और विदाई उत्सव`,
          morning: {
            activity: `ऐतिहासिक संग्रहालय और धरोहर स्थल`,
            description: `गाइडेड ऑडियो टूर के साथ ${country} के समृद्ध इतिहास को समझें।`,
            duration: '3 घंटे',
            insiderTip: 'लाइन से बचने के लिए ऑनलाइन टिकट पहले से बुक करें।',
          },
          afternoon: {
            activity: `पारंपरिक कुकिंग मास्टरक्लास या वाइनरी विजिट`,
            description: `स्थानीय शेफ के साथ बातचीत करके क्षेत्रीय व्यंजनों के रहस्य जानें।`,
            duration: '3.5 घंटे',
            insiderTip: 'घर पर बनाने के लिए स्थानीय मसालों के नाम नोट करें।',
          },
          evening: {
            activity: `रूफटॉप पर विदाई टोस्ट और सुनहरी यादें`,
            description: `अपनी अंतिम शाम का जश्न खूबसूरत नजारों और बातचीत के साथ मनाएं।`,
            duration: '3 घंटे',
            insiderTip: 'तारों भरे आकाश के नीचे विशेष स्थानीय मिठाई का आनंद लें।',
          },
          dining: {
            venue: 'द एपिक्यूरियन टेरेस',
            type: 'आधुनिक क्षेत्रीय व्यंजन',
            specialty: 'शेफ की सिग्नेचर मिठाई और विशेष ड्रिंक',
          },
        },
        {
          title: `पहाड़ी दृश्य और अनोखी खोज`,
          morning: {
            activity: `सुबह की प्राकृतिक वॉक और शांत वातावरण`,
            description: `पहाड़ों की ताज़ी हवा का आनंद लें और मनोरम दृश्यों को कैमरे में कैद करें।`,
            duration: '3.5 घंटे',
            insiderTip: 'मौसम बदलने पर हल्के गर्म कपड़े साथ रखें।',
          },
          afternoon: {
            activity: `पहाड़ी गांव और पारंपरिक फार्म लंच`,
            description: `पारंपरिक गांव में समय बिताएं और घर जैसा स्वादिष्ट खाना खाएं।`,
            duration: '3 घंटे',
            insiderTip: 'स्थानीय शहद और हर्बल चाय का स्वाद लें।',
          },
          evening: {
            activity: `आरामदायक स्पा या हॉट स्प्रिंग्स`,
            description: `शांत वातावरण में थकान मिटाएं और आराम करें।`,
            duration: '2.5 घंटे',
            insiderTip: 'स्पा सेशन के बाद पर्याप्त पानी पिएं।',
          },
          dining: {
            venue: 'अल्पाइन हेअर्थिक ग्रिल',
            type: 'देहाती ग्रिल और पारंपरिक व्यंजन',
            specialty: 'धीमी आंच पर पके व्यंजन और स्वादिष्ट पाई',
          },
        },
        {
          title: `भव्य समापन: विलासिता और स्मृति चिन्ह खरीदारी`,
          morning: {
            activity: `निजी छत पर इत्मीनान से नाश्ता`,
            description: `सुबह की धूप में विला की बालकनी पर बैठकर सुकून से नाश्ता करें।`,
            duration: '2 घंटे',
            insiderTip: 'अपनी यात्रा के फोटो और डायरी को संजोएं।',
          },
          afternoon: {
            activity: `बुटीक खरीदारी और विशेष स्मृति चिन्ह`,
            description: `स्थानीय कारीगरों से यादगार स्मृति चिन्ह खरीदें।`,
            duration: '3 घंटे',
            insiderTip: 'कारीगरों से हस्तशिल्प की कहानी के बारे में पूछें।',
          },
          evening: {
            activity: `विला में निजी शेफ का विशेष डिनर`,
            description: `अपनी यात्रा को एक शानदार 4-कोर्स डिनर के साथ समाप्त करें।`,
            duration: '3.5 घंटे',
            insiderTip: 'शेफ से अपनी पसंद के अनुसार व्यंजन बनाने को कहें।',
          },
          dining: {
            venue: 'प्राइवेट विला शेफ सर्विस',
            type: 'अनुकूलित लक्जरी डाइनिंग',
            specialty: 'स्थानीय मौसमी उपज से तैयार 4-कोर्स भोजन',
          },
        },
      ];
    }

    if (code === 'es') {
      return [
        {
          title: `Llegada y orientación panorámica de ${location}`,
          morning: {
            activity: `Check-in matutino y desayuno artesanal cerca de ${location}`,
            description: `Desempaca en tu alojamiento, contempla las vistas y disfruta de repostería y café local.`,
            duration: '2.5 horas',
            insiderTip: 'Pregunta al barista por su mirador secreto favorito.',
          },
          afternoon: {
            activity: `Exploración del casco histórico y plazas emblemáticas`,
            description: `Pasea por callejones empedrados y admira la arquitectura antes de las multitudes.`,
            duration: '3.5 horas',
            insiderTip: 'Zapatos cómodos con buen agarre son indispensables.',
          },
          evening: {
            activity: `Vistas doradas al atardecer y copa de bienvenida`,
            description: `Elige una terraza elevada para presenciar la puesta de sol sobre ${location}.`,
            duration: '2.5 horas',
            insiderTip: 'Llega 45 minutos antes para conseguir la mejor mesa en primera fila.',
          },
          dining: {
            venue: 'Trattoria del Acantilado / Bistró Histórico',
            type: 'Gastronomía regional auténtica',
            specialty: 'Platos al horno de leña y vinos locales',
          },
        },
        {
          title: `Maravillas costeras y joyas arquitectónicas`,
          morning: {
            activity: `Ruta costera panorámica o paseo en barco privado`,
            description: `Comienza el día navegando o caminando con la brisa marina matinal.`,
            duration: '3.5 horas',
            insiderTip: 'Lleva gafas de sol polarizadas y protector solar biodegradable.',
          },
          afternoon: {
            activity: `Talleres de artesanía y recorrido por el mercado local`,
            description: `Conoce ceramistas y productores de aceite de oliva, quesos y dulces locales.`,
            duration: '3 horas',
            insiderTip: 'Muchos talleres familiares envasan al vacío para llevar en el avión.',
          },
          evening: {
            activity: `Cena a la luz de las velas frente al mar`,
            description: `Cena bajo las estrellas escuchando las olas, seguido de un paseo nocturno.`,
            duration: '3 horas',
            insiderTip: 'Pide la pesca del día recomendada por el chef.',
          },
          dining: {
            venue: 'Santuario del Litoral',
            type: 'Pescados y mariscos frescos',
            specialty: 'Marisco fresco acompañado de vino blanco frío',
          },
        },
        {
          title: `Inmersión cultural y brindis de despedida`,
          morning: {
            activity: `Museo histórico o ruinas emblemáticas`,
            description: `Descubre la fascinante historia de ${country} con un recorrido cultural.`,
            duration: '3 horas',
            insiderTip: 'Reserva boletos en línea para acceso preferencial.',
          },
          afternoon: {
            activity: `Cata de vinos en viñedo o taller de cocina tradicional`,
            description: `Aprende los secretos culinarios regionales en una clase con un chef local.`,
            duration: '3.5 horas',
            insiderTip: 'Apunta las mezclas de especias locales para replicarlas en casa.',
          },
          evening: {
            activity: `Brindis nocturno en azotea y recuerdos memorables`,
            description: `Celebra tu última noche con vistas panorámicas iluminadas.`,
            duration: '3 horas',
            insiderTip: 'Prueba el postre artesanal con digestivo regional.',
          },
          dining: {
            venue: 'Terraza Epicúrea',
            type: 'Fusión moderna y menú degustación',
            specialty: 'Postre de la casa con licor artesanal',
          },
        },
        {
          title: `Alturas montañosas y naturaleza pura`,
          morning: {
            activity: `Senderismo matutino hacia miradores`,
            description: `Respira aire puro de montaña mientras la niebla revela vistas de ensueño.`,
            duration: '3.5 horas',
            insiderTip: 'Viste en capas porque la temperatura cambia en altitud.',
          },
          afternoon: {
            activity: `Pueblo de montaña y almuerzo tradicional`,
            description: `Visita un pueblo tranquilo y saborea comida casera reconfortante.`,
            duration: '3 horas',
            insiderTip: 'Prueba la miel silvestre y las infusiones herbales.',
          },
          evening: {
            activity: `Circuito termal y relajación en spa`,
            description: `Relaja los músculos en aguas termales con vistas a los valles.`,
            duration: '2.5 horas',
            insiderTip: 'Hidrátate bien antes y después de los baños termales.',
          },
          dining: {
            venue: 'El Asador Alpino',
            type: 'Parrilla tradicional a la leña',
            specialty: 'Guisos a fuego lento y tartas recién horneadas',
          },
        },
        {
          title: `Gran final: Ocio exclusivo y recuerdos selectos`,
          morning: {
            activity: `Desayuno relajado en tu terraza privada`,
            description: `Comienza el día sin prisas, saboreando café artesanal contemplando ${location}.`,
            duration: '2 horas',
            insiderTip: 'Dedica tiempo a ordenar tus fotos favoritas del viaje.',
          },
          afternoon: {
            activity: `Compras exclusivas y perfumería a medida`,
            description: `Encuentra recuerdos artesanales y piezas únicas hechas a mano.`,
            duration: '3 horas',
            insiderTip: 'Solicita certificados de autenticidad en artesanías de valor.',
          },
          evening: {
            activity: `Cena privada con chef en tu villa`,
            description: `Culmina el viaje con un banquete de 4 tiempos diseñado a tu gusto.`,
            duration: '3.5 horas',
            insiderTip: 'Pide maridaje personalizado para cada tiempo.',
          },
          dining: {
            venue: 'Servicio de Chef Privado en Villa',
            type: 'Alta cocina personalizada',
            specialty: 'Menú degustación de temporada de 4 tiempos',
          },
        },
      ];
    }

    // Default English themes
    return [
      {
        title: `Arrival & Panoramic Orientation of ${location}`,
        morning: {
          activity: `Morning Check-in & Artisan Breakfast near ${location}`,
          description: `Unpack at your stay, take in breathtaking views, and head to a quiet local bakery for fresh espresso and pastries.`,
          duration: '2.5 hours',
          insiderTip: 'Ask the barista for their favorite secluded lookout point.',
        },
        afternoon: {
          activity: `Historic District & Old Town Exploration`,
          description: `Stroll through iconic cobblestone alleys, visit historic squares, and capture photos before midday crowds arrive.`,
          duration: '3.5 hours',
          insiderTip: 'Comfortable walking shoes with good grip are essential for historic stone paths.',
        },
        evening: {
          activity: `Golden Hour Sunset Vistas & Aperitif`,
          description: `Find an elevated terrace to witness the magnificent sunset over ${location} with local wine.`,
          duration: '2.5 hours',
          insiderTip: 'Arrive 45 minutes before sunset to secure an unhindered front-row view.',
        },
        dining: {
          venue: 'Cliffside Trattoria / Heritage Bistro',
          type: 'Authentic Regional Dining',
          specialty: 'Wood-fired specialties and signature regional wine',
        },
      },
      {
        title: `Coastal Wonders & Hidden Architectural Gems`,
        morning: {
          activity: `Scenic Coastal Trail / Private Boat Excursion`,
          description: `Embark on a tranquil morning adventure along the coastline or scenic trails, enjoying crisp morning breezes.`,
          duration: '3.5 hours',
          insiderTip: 'Pack polarized sunglasses and reef-safe sunscreen.',
        },
        afternoon: {
          activity: `Artisanal Craft Workshops & Local Market Tour`,
          description: `Meet local sculptors, ceramic artists, or spice vendors. Sample regional cheeses, olive oils, or sweet treats.`,
          duration: '3 hours',
          insiderTip: 'Many family ateliers offer vacuum-sealed gifts perfect for traveling home.',
        },
        evening: {
          activity: `Candlelit Seaside Dinner & Stargazing`,
          description: `Dine under the stars listening to gentle ambient waves, followed by a peaceful nighttime stroll back to your villa.`,
          duration: '3 hours',
          insiderTip: 'Order the catch of the day or seasonal chef tasting recommendation.',
        },
        dining: {
          venue: 'The Waterfront Sanctuary',
          type: 'Fresh Catch & Mediterranean Dining',
          specialty: 'Locally caught seafood paired with crisp white vintage',
        },
      },
      {
        title: `Cultural Immersion & Farewell Celebration`,
        morning: {
          activity: `Landmark Heritage Museum or Castle Ruins`,
          description: `Delve into the storied history of ${country} with a guided audio tour of iconic ancient landmarks.`,
          duration: '3 hours',
          insiderTip: 'Pre-book online tickets to glide through express priority entry.',
        },
        afternoon: {
          activity: `Vineyard Wine Tasting or Cooking Masterclass`,
          description: `Learn the secrets of regional gastronomy in an interactive workshop with a passionate local chef.`,
          duration: '3.5 hours',
          insiderTip: 'Take notes on local spice blends to replicate flavors back home.',
        },
        evening: {
          activity: `Farewell Rooftop Toast & Twilight Memories`,
          description: `Celebrate your final night with panoramic vistas, sharing stories and taking final photographs under illuminated skies.`,
          duration: '3 hours',
          insiderTip: 'Savor dessert with regional digestifs under the starry night sky.',
        },
        dining: {
          venue: 'The Epicurean Terrace',
          type: 'Modern Fusion & Tasting Menu',
          specialty: 'Handcrafted signature dessert with spiced digestif',
        },
      },
      {
        title: `Mountain Heights & Off-The-Beaten-Path Discovery`,
        morning: {
          activity: `Early Morning Peak Hike or Gondola Ascent`,
          description: `Rise early to witness mountain mist clearing from panoramic viewpoints, breathing in fresh alpine air.`,
          duration: '3.5 hours',
          insiderTip: 'Layer your clothing as altitude temperatures vary quickly.',
        },
        afternoon: {
          activity: `Secluded Mountain Village & Farmstead Lunch`,
          description: `Venture into an authentic village where time stands still, enjoying traditional homestyle comfort food.`,
          duration: '3 hours',
          insiderTip: 'Sample local honeycomb and mountain herbal teas.',
        },
        evening: {
          activity: `Spa Thermal Bath Relaxation`,
          description: `Unwind tired muscles in natural hot springs or heated whirlpools overlooking dramatic valleys.`,
          duration: '2.5 hours',
          insiderTip: 'Hydrate well before and after mineral thermal sessions.',
        },
        dining: {
          venue: 'The Alpine Hearth',
          type: 'Rustic Fireplace Grill',
          specialty: 'Slow-braised specialties and warm apple tarts',
        },
      },
      {
        title: `Grand Finale: Luxury Leisure & Souvenir Keepsakes`,
        morning: {
          activity: `Leisurely Breakfast on Your Private Terrace`,
          description: `Slow down the pace. Savor room service breakfast or brew artisanal coffee while gazing across ${location}.`,
          duration: '2 hours',
          insiderTip: 'Spend time journaling or curating your trip photo album.',
        },
        afternoon: {
          activity: `Boutique Shopping & Custom Perfumery`,
          description: `Visit local perfumeries or leather craftsmen to find a bespoke, heirloom souvenir that embodies this journey.`,
          duration: '3 hours',
          insiderTip: 'Inquire about tax-free export forms for high-value artisan crafts.',
        },
        evening: {
          activity: `Private Chef Dinner at Your Villa`,
          description: `Close out your journey with a private 4-course feast prepared right inside your stay by a talented private chef.`,
          duration: '3.5 hours',
          insiderTip: 'Request personalized wine pairings for each course.',
        },
        dining: {
          venue: 'Private In-Villa Chef Service',
          type: 'Bespoke Haute Cuisine',
          specialty: 'Tailored 4-course menu celebrating local seasonal harvest',
        },
      },
    ];
  };

  const dayThemes = getDayThemes();
  const selectedDays = [];
  for (let i = 0; i < numDays; i++) {
    selectedDays.push({
      dayNumber: i + 1,
      dayTitle: dayThemes[i].title,
      morning: dayThemes[i].morning,
      afternoon: dayThemes[i].afternoon,
      evening: dayThemes[i].evening,
      diningRecommendation: dayThemes[i].dining,
    });
  }

  const packingLocalized = {
    hi: [
      'यूनिवर्सल पावर एडेप्टर और पोर्टेबल पावर बैंक',
      'पैदल चलने के लिए आरामदायक ग्रिप वाले जूते',
      'दिन में धूप और शाम की ठंडी हवा के अनुसार हल्के कपड़े',
    ],
    es: [
      'Adaptador universal de corriente y batería externa portátil',
      'Calzado cómodo y con buen agarre para calles empedradas y senderos',
      'Ropa en capas transpirables para sol de día y brisas frescas de noche',
    ],
    fr: [
      'Adaptateur secteur universel et batterie externe compacte',
      'Chaussures de marche confortables adaptées aux pavés',
      'Vêtements respirants superposables pour le jour et le soir',
    ],
    en: [
      'Universal power adapter and compact battery bank',
      'Comfortable broken-in walking shoes for cobblestones and trails',
      'Light breathable layers for warm daytime sun and cooler evening breezes',
    ],
  };

  const etiquetteLocalized = {
    hi: [
      'स्थानीय भाषा में एक विनम्र अभिवादन दुकानदारों और मेजबानों द्वारा बहुत सराहा जाता है।',
      'रेस्तरां और निजी पर्यटन में उत्कृष्ट सेवा के लिए 5-10% टिप देना प्रथागत है।',
    ],
    es: [
      'Un saludo cortés en el idioma local siempre es apreciado por anfitriones y comerciantes.',
      'Dejar entre un 5% y 10% de propina es habitual por un excelente servicio en restaurantes.',
    ],
    fr: [
      'Une formule de politesse dans la langue locale est très appréciée des commerçants.',
      'Un pourboire de 5 à 10% est de mise pour un service de qualité dans les restaurants.',
    ],
    en: [
      'A warm greeting in the local language is deeply appreciated by shopkeepers and hosts.',
      'Tipping 5-10% is customary for exceptional service in restaurants and private tours.',
    ],
  };

  const overviewLocalized = {
    hi: `${title} के मेहमानों के लिए सावधानीपूर्वक तैयार किया गया ${numDays}-दिवसीय यात्रा कार्यक्रम, जो ${interests.join(
      ', '
    )} और ${country} की प्राकृतिक सुंदरता को जोड़ता है।`,
    es: `Un itinerario de ${numDays} días diseñado para los huéspedes de ${title}, combinando ${interests.join(
      ', '
    )} con la belleza natural y la cálida hospitalidad de ${country}.`,
    fr: `Un itinéraire de ${numDays} jours créé pour les hôtes de ${title}, alliant ${interests.join(
      ', '
    )} et la beauté naturelle de ${country}.`,
    en: `An expertly crafted ${numDays}-day itinerary for guests of ${title}, balancing ${interests.join(
      ', '
    )} with the natural beauty and vibrant hospitality of ${country}.`,
  };

  return {
    itineraryTitle:
      code === 'hi'
        ? `${location} में ${numDays}-दिवसीय विशेष यात्रा`
        : code === 'es'
          ? `Viaje exclusivo de ${numDays} días en ${location}`
          : `${numDays}-Day Curated Journey in ${location}`,
    overview: overviewLocalized[code] || overviewLocalized.en,
    destination: `${location}, ${country}`,
    totalDays: numDays,
    pace,
    days: selectedDays,
    packingEssentials: packingLocalized[code] || packingLocalized.en,
    localEtiquetteTips: etiquetteLocalized[code] || etiquetteLocalized.en,
  };
};

/**
 * 3. AI Description & Title Generator for Property Hosts
 */
const generateHostListingContent = async ({
  location,
  category = 'Trending',
  propertyType = 'Entire Villa',
  keyFeatures = [],
  vibe = 'Luxury & Serene',
  language = 'en',
}) => {
  const genAI = getGeminiClient();
  const featuresList = Array.isArray(keyFeatures) ? keyFeatures.join(', ') : keyFeatures;
  const targetLangName = getLanguageName(language);

  if (genAI) {
    try {
      const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
      const prompt = `
You are an award-winning real estate copywriter and hospitality marketer for Wanderlust (an ultra-premium Airbnb alternative).
Create magnetic, high-converting property titles and an immersive, evocative listing description for a host with:
Destination: ${location}
Category: ${category}
Property Type: ${propertyType}
Atmosphere/Vibe: ${vibe}
Key Features & Amenities: ${featuresList || 'Panoramic views, chef kitchen, serene pool, designer interior'}

CRITICAL LANGUAGE REQUIREMENT:
You MUST write all titles, tagline, description, suggestedAmenities, and highlights completely and fluently in ${targetLangName}.
Keep JSON keys strictly in English as defined below.

Return ONLY valid raw JSON with NO markdown code fences, matching this schema:
{
  "titles": [
    string,
    string,
    string
  ],
  "tagline": string,
  "description": string (3 evocative paragraphs formatted with paragraph breaks: 1. Emotional hook & setting, 2. The Living space & architectural finishes, 3. The guest experience & outdoor bliss),
  "suggestedAmenities": [string, string, string, string, string],
  "highlights": [string, string, string]
}
`;
      const result = await model.generateContent(prompt);
      const text = result.response.text().trim();
      const cleaned = text.replace(/^```json\s*/i, '').replace(/```\s*$/i, '');
      return JSON.parse(cleaned);
    } catch (err) {
      console.warn('Gemini API call failed, using intelligent host generator fallback:', err.message);
    }
  }

  // Fallback intelligent copywriting
  const featuresArray = Array.isArray(keyFeatures)
    ? keyFeatures
    : typeof keyFeatures === 'string' && keyFeatures.trim()
      ? keyFeatures.split(',').map((f) => f.trim())
      : ['Infinity pool', 'Panoramic views', 'Architectural lighting', 'Private terrace'];

  const leadFeature = featuresArray[0] || 'Panoramic Views';
  const secondFeature = featuresArray[1] || 'Infinity Pool';
  const code = (language || 'en').toLowerCase().split('-')[0];

  if (code === 'hi') {
    return {
      titles: [
        `द ग्रांड होराइजन: ${location} में ${leadFeature} के साथ लक्जरी ${propertyType}`,
        `${location} में ${secondFeature} के साथ एकांत ${vibe} विला`,
        `${location} के मनोरम दृश्यों वाली आधुनिक डिजाइनर ${propertyType}`,
      ],
      tagline: `${location} में ${leadFeature} और विशेष वास्तुशिल्प डिजाइन के साथ अद्वितीय विलासिता का अनुभव करें।`,
      description: `एक ऐसे असाधारण प्रवास में आपका स्वागत है जहाँ समकालीन डिजाइन ${location} के प्राकृतिक सौंदर्य के साथ सहजता से मिलता है। मनमोहक दृश्यों और भरपूर प्राकृतिक रोशनी के साथ, यह विशेष ${propertyType} उन यात्रियों के लिए तैयार किया गया एक शांत और निजी आवास है जो विलासिता और सुकून दोनों चाहते हैं।\n\nअंदर, यह खुला और हवादार लेआउट प्रस्तुत करता है, जिसे उच्च-स्तरीय फिनिश, डिजाइनर फर्नीचर और कस्टम लाइटिंग से सजाया गया है। इसका आधुनिक किचन पूरी तरह सुसज्जित है, जबकि बेडरूम में आरामदायक यूरोपीय बिस्तर, स्पा-प्रेरित बाथरूम और बड़ी खिड़कियां हैं।\n\nनिजी छत पर कदम रखें जहाँ आपको ${secondFeature} और आरामदायक लाउंज क्षेत्र मिलेगा, जो सूर्यास्त के समय पेय और तारों भरे आसमान के नीचे भोजन के लिए उपयुक्त है। चाहे आप ${location} की जीवंत संस्कृति का अन्वेषण कर रहे हों या पूर्ण शांति में आराम कर रहे हों, यह प्रवास अविस्मरणीय यादें प्रदान करेगा।`,
      suggestedAmenities: [
        'हाई-स्पीड वाईफाई (300+ एमबीपीएस)',
        'निजी गर्म इन्फिनिटी पूल',
        'एस्प्रेसो बार के साथ शेफ किचन',
        'समर्पित एर्गोनोमिक वर्कस्पेस',
        'स्मार्ट क्लाइमेट कंट्रोल और एसी',
      ],
      highlights: [
        `${location} में मनोरम प्राकृतिक दृश्यों वाला प्रमुख स्थान`,
        `निजी ${leadFeature} और विशाल आउटडोर एंटरटेनिंग डेक`,
        'लक्जरी लिनेन, प्रीमियम बाथ उत्पाद और 24/7 कंसीयज सपोर्ट',
      ],
    };
  }

  if (code === 'es') {
    return {
      titles: [
        `El Gran Horizonte: Lujosa ${propertyType} con ${leadFeature}`,
        `Santuario exclusivo y ${vibe} con ${secondFeature} en ${location}`,
        `Refugio de diseño de vanguardia con vistas a ${location}`,
      ],
      tagline: `Sumérgete en un lujo inigualable, con ${leadFeature.toLowerCase()} y diseño a medida en ${location}.`,
      description: `Bienvenido a una escapada extraordinaria donde el diseño contemporáneo se fusiona a la perfección con la majestuosidad natural de ${location}. Diseñada para capturar vistas panorámicas y luz radiante, esta excepcional estancia funciona como un santuario ultra privado creado para viajeros exigentes.\n\nEn el interior, la residencia presenta una distribución abierta y luminosa con acabados de primera calidad, mobiliario de diseñador y cuidada iluminación ambiental. La cocina gourmet está totalmente equipada, mientras que los dormitorios cuentan con ropa de cama europea de felpa y baños tipo spa.\n\nSal a tu terraza privada para disfrutar de ${secondFeature.toLowerCase()} y áreas de estar diseñadas para cócteles al atardecer y cenas bajo el cielo estrellado.`,
      suggestedAmenities: [
        'WiFi de alta velocidad (300+ Mbps)',
        'Piscina infinita climatizada privada',
        'Cocina de chef con cafetera espresso',
        'Espacio de trabajo ergonómico dedicado',
        'Climatización inteligente y aire acondicionado',
      ],
      highlights: [
        `Ubicación privilegiada en ${location} con impresionantes vistas naturales`,
        `${leadFeature} privado y amplia terraza al aire libre`,
        'Equipado con ropa de cama de lujo, artículos de baño artesanales y conserjería',
      ],
    };
  }

  return {
    titles: [
      `The Grand Horizon: Luxury ${propertyType} with ${leadFeature}`,
      `Secluded ${vibe.split('&')[0].trim()} Sanctuary with ${secondFeature} in ${location}`,
      `Architectural Haven: Designer ${propertyType} Overlooking ${location}`,
    ],
    tagline: `Immerse yourself in unrivaled luxury, featuring ${leadFeature.toLowerCase()} and bespoke design in ${location}.`,
    description: `Welcome to an extraordinary escape where contemporary design seamlessly marries the natural majesty of ${location}. Perched to capture sweeping views and radiant daylight, this exceptional ${propertyType.toLowerCase()} serves as an ultra-private sanctuary crafted specifically for travelers who demand both elegance and peace.\n\nInside, the residence showcases an airy open-concept layout accented by high-end finishes, curated designer furnishings, and custom lighting. The gourmet kitchen is fully outfitted for culinary enthusiasts, while the bedrooms feature plush European bedding, spa-inspired ensuite bathrooms, and oversized windows that frame the breathtaking landscape.\n\nStep outside onto your private outdoor terrace to find ${secondFeature.toLowerCase()} and lounge areas designed for golden-hour cocktails and alfresco dining under starry skies. Whether you are spending your days discovering the vibrant culture of ${location} or lounging in absolute comfort, this stay promises memories that linger long after you depart.`,
    suggestedAmenities: [
      'High-Speed WiFi (300+ Mbps)',
      'Private Heated Pool',
      'Chef Kitchen with Espresso Bar',
      'Dedicated Ergonomic Workspace',
      'Smart Climate Control & AC',
    ],
    highlights: [
      `Premier location in ${location} with breathtaking natural vistas`,
      `Private ${leadFeature.toLowerCase()} and expansive alfresco entertaining deck`,
      'Thoughtfully appointed with luxury linens, artisan bath products, and concierge support',
    ],
  };
};

/**
 * 4. AI Side Chatbot Concierge with full Multilingual Support
 */
const chatWithAssistant = async ({ message, history = [], currentListing = null, language = 'en' }) => {
  const genAI = getGeminiClient();
  const targetLangName = getLanguageName(language);
  const code = (language || 'en').toLowerCase().split('-')[0];

  if (genAI) {
    try {
      const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

      let contextPrompt = `You are "WanderBot", the friendly, knowledgeable luxury AI Travel Concierge for Wanderlust (a modern full-stack vacation rental platform).
Your mission:
- Help travelers discover stays, compare destinations, and choose ideal villas/chalets/apartments.
- Answer questions on booking reservations, price breakdowns, and Wanderlust Buyer Protection.
- Guide property hosts on creating listings, pricing strategies, and using our AI Host Writer.
- Provide local travel recommendations, cultural etiquette, packing advice, and culinary tips.
${currentListing
          ? `The traveler is currently viewing: "${currentListing.title}" in ${currentListing.location}, ${currentListing.country} (Price: $${currentListing.price}/night).`
          : ''
        }

CRITICAL MULTILINGUAL INSTRUCTION:
The traveler's selected interface language is ${targetLangName} (language code: "${language}").
You MUST converse and respond completely, fluently, and warmly in ${targetLangName}.
If the user asks in another language, respond in that language or seamlessly in ${targetLangName}.
Keep your responses conversational, welcoming, and concise (2-3 short paragraphs or bullet points). Format text nicely with bold highlights where appropriate.`;

      const conversationHistory = history
        .slice(-6)
        .map((m) => `${m.role === 'user' ? 'User' : 'WanderBot'}: ${m.content}`)
        .join('\n');

      const fullPrompt = `${contextPrompt}\n\nRecent conversation:\n${conversationHistory}\nUser: ${message}\nWanderBot:`;

      const result = await model.generateContent(fullPrompt);
      const reply = result.response.text().trim();
      return { reply };
    } catch (err) {
      console.warn('Gemini chat failed, using fallback chatbot:', err.message);
    }
  }

  // Intelligent multilingual conversational fallback engine
  const lower = (message || '').toLowerCase();

  // Multi-language response matrix
  if (code === 'hi') {
    if (lower.includes('hello') || lower.includes('hi') || lower.includes('hey') || lower.includes('नमस्ते') || lower.includes('हेलो')) {
      return {
        reply: `नमस्ते! 👋 मैं **WanderBot** हूँ, आपका व्यक्तिगत Wanderlust AI यात्रा सहायक। मैं आपके लिए अनोखे विला खोजने, यात्रा बजट का सटीक अनुमान लगाने, दिन-प्रतिदिन के यात्रा कार्यक्रम की योजना बनाने या अपनी प्रॉपर्टी लिस्ट करने में मदद कर सकता हूँ। आज मैं आपकी क्या सहायता करूँ?`,
      };
    }
    if (lower.includes('budget') || lower.includes('cost') || lower.includes('price') || lower.includes('खर्च') || lower.includes('बजट') || lower.includes('दाम')) {
      return {
        reply: `Wanderlust पर प्रत्येक ठहरने के स्थान में हमारा **स्मार्ट AI ट्रिप बजट कैलकुलेटर** उपलब्ध है! यह आपकी यात्रा शैली (बजट, मध्यम, या लक्जरी) के अनुसार कुल आवास, भोजन, स्थानीय परिवहन और दर्शनीय स्थलों के खर्च का सटीक अनुमान लगाता है। किसी भी प्रॉपर्टी पेज पर *AI Trip Budget* टैब देखें!`,
      };
    }
    if (lower.includes('book') || lower.includes('reserve') || lower.includes('बुकिंग') || lower.includes('रिजर्व')) {
      return {
        reply: `Wanderlust पर ठहरने की बुकिंग बेहद सरल है! बस चेक-इन और चेक-आउट की तारीखें चुनें, अतिथियों की संख्या चुनें और **Reserve** पर क्लिक करें। सभी बुकिंग में हमारा **Wanderlust क्रेता संरक्षण गारंटी** शामिल है! आप **My Trips & Bookings** में अपनी यात्राएं देख सकते हैं।`,
      };
    }
    if (lower.includes('host') || lower.includes('list') || lower.includes('किराए') || lower.includes('होस्ट')) {
      return {
        reply: `Wanderlust पर अपनी प्रॉपर्टी लिस्ट करना आसान है! शीर्ष नेविगेशन बार में **"Wanderlust your home"** पर क्लिक करें। हमारा **AI राइटर असिस्टेंट** सेकंडों में आकर्षक शीर्षक, विवरण और अनुशंसित सुविधाएं तैयार कर देगा!`,
      };
    }
    return {
      reply: `यह एक शानदार यात्रा विचार है! Wanderlust पर आप सत्यापित लक्जरी विला देख सकते हैं, AI के साथ यात्रा खर्च का सटीक अनुमान लगा सकते हैं, और व्यक्तिगत 3 या 5-दिवसीय यात्रा कार्यक्रम बना सकते हैं। क्या आप किसी खास गंतव्य की सिफारिश चाहते हैं?`,
    };
  }

  if (code === 'es') {
    if (lower.includes('hello') || lower.includes('hi') || lower.includes('hola')) {
      return {
        reply: `¡Hola! 👋 Soy **WanderBot**, tu conserje de viajes personal con IA en Wanderlust. ¿Cómo puedo ayudarte hoy? Puedo orientarte sobre villas en Santorini, chalets alpinos o cómo publicar tu propia propiedad.`,
      };
    }
    if (lower.includes('budget') || lower.includes('cost') || lower.includes('presupuesto') || lower.includes('precio')) {
      return {
        reply: `¡Cada alojamiento en Wanderlust cuenta con nuestro **Estimador de Presupuesto con IA**! Calcula costos de estadía, gastronomía local, transporte y excursiones según tu estilo de viaje (Económico, Moderado o Lujo). ¡Revisa la pestaña *AI Trip Budget* en cualquier anuncio!`,
      };
    }
    if (lower.includes('book') || lower.includes('reserve') || lower.includes('reserva')) {
      return {
        reply: `¡Reservar en Wanderlust es rápido y seguro! Selecciona tus fechas de entrada y salida, el número de huéspedes y haz clic en **Reservar**. Incluye nuestra Garantía de Protección al Huésped. Puedes consultar tus viajes en **Mis Viajes y Reservas**.`,
      };
    }
    if (lower.includes('host') || lower.includes('anfitrión') || lower.includes('publicar')) {
      return {
        reply: `¡Ser anfitrión en Wanderlust es muy fácil! Haz clic en **"Publica tu alojamiento"** en la barra superior. Nuestro **Asistente de IA** creará títulos y descripciones magnéticas en segundos.`,
      };
    }
    return {
      reply: `¡Suena a un plan de viaje emocionante! En Wanderlust puedes descubrir estancias de lujo, estimar presupuestos con IA y generar itinerarios a medida. ¿En qué más te puedo colaborar hoy?`,
    };
  }

  if (code === 'fr') {
    if (lower.includes('bonjour') || lower.includes('salut') || lower.includes('hello') || lower.includes('hi')) {
      return {
        reply: `Bonjour ! 👋 Je suis **WanderBot**, votre concierge IA personnel sur Wanderlust. Comment puis-je vous aider aujourd'hui ? Que vous cherchiez une villa à Santorin, un chalet alpin ou souhaitiez mettre votre bien en location, je suis à votre écoute !`,
      };
    }
    if (lower.includes('budget') || lower.includes('prix') || lower.includes('coût')) {
      return {
        reply: `Chaque hébergement sur Wanderlust propose notre **Estimateur de budget IA** ! Il calcule les frais d'hébergement, de repas, de transports et d'activités selon votre profil (Éco, Modéré, Luxe). Découvrez l'onglet *AI Trip Budget* sur la page du logement !`,
      };
    }
    if (lower.includes('reserve') || lower.includes('réservation') || lower.includes('book')) {
      return {
        reply: `Réserver sur Wanderlust est simple et instantané ! Choisissez vos dates, vos voyageurs et confirmez votre réservation avec notre Garantie Protection Voyageur. Retrouvez tous vos séjours sous **Mes Voyages** !`,
      };
    }
    return {
      reply: `C'est un magnifique projet de vacances ! Sur Wanderlust, explorez des séjours exclusifs et créez des itinéraires personnalisés avec l'IA. Souhaitez-vous des recommandations pour une destination particulière ?`,
    };
  }

  if (code === 'de') {
    if (lower.includes('hallo') || lower.includes('guten tag') || lower.includes('hi') || lower.includes('hello')) {
      return {
        reply: `Hallo! 👋 Ich bin **WanderBot**, Ihr persönlicher KI-Reiseconcierge auf Wanderlust. Wie kann ich Ihnen heute helfen? Entdecken Sie traumhafte Villen, kalkulieren Sie Reisebudgets oder vermieten Sie Ihre eigene Unterkunft!`,
      };
    }
    return {
      reply: `Das klingt nach einem fantastischen Reisevorhaben! Auf Wanderlust können Sie verifizierte Unterkünfte buchen, Reisekosten mit KI kalkulieren und maßgeschneiderte Tagespläne erstellen. Wie kann ich Ihnen behilflich sein?`,
    };
  }

  if (code === 'ja') {
    return {
      reply: `こんにちは！👋 私はWanderlust専属AIコンシェルジュの **WanderBot** です。特別なヴィラの検索、旅行費用のAI試算、旅程プランの作成、またはホストとしてのリスティング作成など、どんなことでもお気軽にお尋ねください！`,
    };
  }

  if (code === 'zh') {
    return {
      reply: `您好！👋 我是您的专属AI旅行管家 **WanderBot**。我可以帮您寻找心仪的独家度假别墅、使用AI预估旅行开销、生成定制日度行程，或指导您发布房源。请问今天有什么可以帮您的？`,
    };
  }

  if (code === 'ar') {
    return {
      reply: `مرحباً بك! 👋 أنا **WanderBot**، مساعد السفر الذكي الخاص بك على واندرلوست. يمكنني مساعدتك في العثور على فيلات ساحرة، وحساب ميزانية السفر بالذكاء الاصطناعي، وإنشاء خطط يومية مخصصة، أو إرشادك لنشر عقارك. كيف يمكنني مساعدتك اليوم؟`,
    };
  }

  // Standard English fallback
  if (lower.includes('hello') || lower.includes('hi') || lower.includes('hey')) {
    return {
      reply: `Hello! 👋 I'm **WanderBot**, your personal Wanderlust AI Concierge. How can I help you today? Whether you're searching for a cliffside caldera villa in Santorini, an alpine chalet, or need help listing your own property, ask me anything!`,
    };
  }
  if (lower.includes('budget') || lower.includes('cost') || lower.includes('price') || lower.includes('expense')) {
    return {
      reply: `Every stay on Wanderlust features our **Smart AI Trip Budget Estimator**! It calculates total accommodation, local food, transportation, and sightseeing costs customized to your travel style (Budget, Moderate, or Luxury). Check the *AI Trip Budget* tab on any property detail page to see live estimates!`,
    };
  }
  if (lower.includes('book') || lower.includes('reserve') || lower.includes('reservation')) {
    return {
      reply: `Booking a stay on Wanderlust is seamless! Simply pick your check-in and checkout dates in the reservation card, select your guests count, and click **Reserve**. All bookings include our **Wanderlust Buyer Protection Guarantee** with instant confirmation. You can review all your trips under **My Trips & Bookings**!`,
    };
  }
  if (lower.includes('host') || lower.includes('list') || lower.includes('rent my') || lower.includes('earn')) {
    return {
      reply: `Hosting on Wanderlust is simple! Click **"Wanderlust your home"** in the top navigation bar. We even provide an **AI Writer Assistant** that can craft high-converting titles, descriptions, and recommended amenities for you in seconds based on your property highlights!`,
    };
  }
  if (lower.includes('beach') || lower.includes('santorini') || lower.includes('greece') || lower.includes('bali') || lower.includes('sea')) {
    return {
      reply: `For sun-soaked coastal stays, I recommend **The Royal Cliff Villa** in Oia, Santorini ($680/night) or the **Bamboo Eco Palace & Waterfall Sanctuary** in Ubud, Bali! Both feature private infinity pools and breathtaking views. Select the **Beachfront** category on the homepage to explore more!`,
    };
  }
  if (lower.includes('mountain') || lower.includes('chalet') || lower.includes('snow') || lower.includes('swiss') || lower.includes('zermatt') || lower.includes('ski')) {
    return {
      reply: `If you're looking for alpine air and ski slopes, check out the **Modern Alpine Glass Chalet** in Zermatt, Switzerland ($920/night) with panoramic views of the Matterhorn, a Finnish sauna, and ski-in/ski-out access! Click the **Cabins** tab on the homepage for more mountain hideaways.`,
    };
  }
  if (lower.includes('itinerary') || lower.includes('plan') || lower.includes('activities') || lower.includes('things to do')) {
    return {
      reply: `Our **AI Smart Itinerary Planner** generates customized 3-day or 5-day day-by-day travel plans for any stay, with morning, afternoon, and evening activities, durations, insider tips, and handpicked local dining spots! Click the *AI Smart Itinerary* tab on any property detail page to try it out.`,
    };
  }
  if (lower.includes('cancel') || lower.includes('refund')) {
    return {
      reply: `You can easily manage and cancel reservations from your **My Trips & Reservations** page. Just locate your reservation and click "Cancel". Wanderlust offers flexible cancellation options with full refund protection for eligible reservations.`,
    };
  }

  return {
    reply: `That sounds like an exciting adventure! On Wanderlust, you can browse verified luxury stays, estimate travel expenses with Gemini AI, and generate tailored day-by-day itineraries. Would you like destination recommendations, help reserving a stay, or tips on hosting your property?`,
  };
};

/**
 * 5. AI Property Description Translator
 */
const getFallbackTranslation = (text, targetLanguage) => {
  const lower = text.toLowerCase();
  const code = (targetLanguage || 'es').toLowerCase().split('-')[0];

  if (code === 'hi') {
    if (lower.includes('caldera') || lower.includes('oia') || lower.includes('santorini')) {
      return `ओइया की नाटकीय काल्डेरा चट्टानों के शीर्ष पर स्थित, यह अत्यंत शानदार गुफा विला एजियन सागर के मनोरम दृश्य, निजी गर्म क्लिफसाइड इन्फिनिटी पूल, संगमरमर के संलग्न बाथरूम और प्रतिदिन सूर्यास्त के समय चुनिंदा वाइन पेयरिंग प्रदान करता है।`;
    }
    if (lower.includes('matterhorn') || lower.includes('zermatt') || lower.includes('alpine')) {
      return `1,600 मीटर की ऊंचाई पर वास्तुशिल्प द्वारा डिजाइन की गई अल्पाइन विलासिता। फर्श से छत तक लगे कांच से मैटरहॉर्न के निर्बाध दृश्य दिखाई देते हैं। इसमें फिनिश सौना, खुली चिमनी, निजी स्की-इन/स्की-आउट सुविधा और विशेष शीपस्किन लाउंज साज-सज्जा शामिल हैं।`;
    }
    if (lower.includes('shinjuku') || lower.includes('tokyo') || lower.includes('zen garden')) {
      return `इस न्यूनतम जापानी पेंटहाउस में शिंजुकु से 40 मंजिल ऊपर ठहरने का अनुभव लें। इसमें हिनोकी देवदार का सोकिंग टब, निजी छत पर बना ज़ेन गार्डन, स्मार्ट होम लाइटिंग, तातामी चाय समारोह कक्ष और शहर के क्षितिज के मनोरम दृश्य शामिल हैं।`;
    }
    if (lower.includes('ubud') || lower.includes('bamboo') || lower.includes('bali')) {
      return `उबुद की पवित्र अयुंग नदी घाटी के भीतर शुद्ध उष्णकटिबंधीय आनंद में डूब जाएं। मुड़े हुए काले बांस से हस्तनिर्मित, यह वास्तुशिल्प चमत्कार एक ओपन-कॉन्सेप्ट लिविंग पवेलियन, प्राकृतिक ताजे पानी का प्लंज पूल और हरे-भरे जंगल की छत्रछाया प्रस्तुत करता है।`;
    }
    if (lower.includes('castle') || lower.includes('scotland') || lower.includes('highland')) {
      return `झील के किनारे 200 एकड़ के निजी देवदार के जंगल के बीच स्थित एक पुनर्निर्मित 15वीं सदी के पत्थर के महल में रॉयल्टी की तरह रहें। इसमें पत्थर की चिमनी वाला भव्य हॉल, पुरानी लाइब्रेरी, 360-डिग्री एस्टेट दृश्यों वाले बुर्ज और निजी व्हिस्की वॉल्ट शामिल हैं।`;
    }
    return `वांडरलास्ट द्वारा सत्यापित आवास: ${text.slice(0, 150)}...\n\nयह अनूठा प्रवास असाधारण आराम, प्रीमियम सुविधाएं, शांत वातावरण और अद्वितीय स्थानीय अनुभव प्रदान करता है जो आपकी यात्रा को वास्तव में यादगार बना देगा।`;
  }

  if (code === 'es') {
    if (lower.includes('caldera') || lower.includes('oia') || lower.includes('santorini')) {
      return `Encaramada sobre los impresionantes acantilados de la caldera de Oia, esta cueva-villa de ultra lujo ofrece vistas panorámicas al mar Egeo, piscina infinita climatizada privada al borde del acantilado, baños en suite de mármol y maridajes de vinos al atardecer servidos a diario.`;
    }
    if (lower.includes('matterhorn') || lower.includes('zermatt') || lower.includes('alpine')) {
      return `Lujo alpino diseñado por arquitectos a 1.600 metros de altitud. Sus ventanales de suelo a techo revelan vistas ininterrumpidas del monte Cervino (Matterhorn). Cuenta con sauna finlandesa, chimenea de leña, acceso directo a pistas de esquí (ski-in/ski-out) y mobiliario exclusivo de piel de cordero.`;
    }
    if (lower.includes('shinjuku') || lower.includes('tokyo') || lower.includes('zen garden')) {
      return `Flota a 40 pisos sobre Shinjuku en este ático japonés minimalista. Cuenta con bañera de inmersión en madera de cedro hinoki, jardín zen privado en la azotea, iluminación domótica inteligente, salón tradicional de té con tatami y vistas panorámicas del horizonte urbano de Tokio.`;
    }
    if (lower.includes('ubud') || lower.includes('bamboo') || lower.includes('bali')) {
      return `Sumérgete en la pura felicidad tropical en el sagrado valle del río Ayung en Ubud. Hecha a mano con bambú negro curvado, esta maravilla arquitectónica cuenta con pabellón de estar de concepto abierto, piscina natural de agua dulce y un frondoso dosel selvático.`;
    }
    if (lower.includes('castle') || lower.includes('scotland') || lower.includes('highland')) {
      return `Vive como la realeza en un castillo de piedra restaurado del siglo XV rodeado de 200 acres privados de bosque de pinos junto al lago. Incluye un gran salón con chimenea de piedra, biblioteca de época, torreones con vistas de 360 grados y bóveda privada de whisky.`;
    }
    return `Alojamiento exclusivo verificado por Wanderlust: ${text.slice(0, 150)}...\n\nEsta estancia única ofrece una comodidad excepcional, comodidades de primer nivel, un entorno tranquilo y una experiencia local inolvidable diseñada para que disfrutes de tu viaje al máximo.`;
  }

  if (code === 'fr') {
    if (lower.includes('caldera') || lower.includes('oia') || lower.includes('santorini')) {
      return `Perchée au sommet des falaises spectaculaires de la caldeira d'Oia, cette villa troglodyte ultra-luxueuse offre une vue panoramique sur la mer Égée, une piscine à débordement chauffée privée à flanc de falaise, des salles de bains privatives en marbre et des accords mets-vins au coucher du soleil servis quotidiennement.`;
    }
    if (lower.includes('matterhorn') || lower.includes('zermatt') || lower.includes('alpine')) {
      return `Luxe alpin conçu par des architectes à 1 600 m d'altitude. Les baies vitrées du sol au plafond révèlent des vues imprenables sur le Cervin. Comprend un sauna finlandais, une cheminée à foyer ouvert, un accès direct aux pistes de ski et un salon meublé en peau de mouton sur mesure.`;
    }
    if (lower.includes('shinjuku') || lower.includes('tokyo') || lower.includes('zen garden')) {
      return `Survolez Shinjuku à 40 étages de hauteur dans ce penthouse japonais minimaliste. Doté d'une baignoire en cèdre hinoki, d'un jardin zen privé sur le toit, d'un salon de thé traditionnel avec tatami et d'une vue spectaculaire sur la skyline tokyoïte.`;
    }
    if (lower.includes('ubud') || lower.includes('bamboo') || lower.includes('bali')) {
      return `Plongez dans la féerie tropicale au cœur de la vallée sacrée de la rivière Ayung à Ubud. Façonnée à la main en bambou noir courbé, cette merveille architecturale offre un pavillon de séjour à aire ouverte, un bassin d'eau douce naturelle et une canopée luxuriante.`;
    }
    return `Hébergement de prestige vérifié par Wanderlust: ${text.slice(0, 150)}...\n\nCe séjour d'exception garantit un confort absolu, des prestations haut de gamme et une immersion locale inoubliable pour vos vacances de rêve.`;
  }

  if (code === 'de') {
    if (lower.includes('caldera') || lower.includes('oia') || lower.includes('santorini')) {
      return `Hoch oben auf den spektakulären Caldera-Klippen von Oia gelegen, bietet diese ultraluxuriöse Höhlenvilla einen Panoramablick auf das Ägäische Meer, einen privaten beheizten Klippen-Infinity-Pool, Marmorbäder en Suite und täglich servierte Weinverkostungen zum Sonnenuntergang.`;
    }
    if (lower.includes('matterhorn') || lower.includes('zermatt') || lower.includes('alpine')) {
      return `Architekten-Alpinluxus auf 1.600 m Höhe. Raumhohe Panoramafenster bieten freie Sicht auf das weltberühmte Matterhorn. Mit finnischer Sauna, Kaminofen, privatem Ski-in/Ski-out-Zugang und handgefertigter Lammfell-Lounge-Ausstattung.`;
    }
    return `Exklusive Unterkunft verifiziert von Wanderlust: ${text.slice(0, 150)}...\n\nDieser einzigartige Rückzugsort vereint herausragenden Komfort, erstklassige Annehmlichkeiten und eine ruhige Atmosphäre für einen unvergesslichen Urlaub.`;
  }

  if (code === 'ja') {
    if (lower.includes('caldera') || lower.includes('oia') || lower.includes('santorini')) {
      return `イアのカルデラ断崖絶壁に佇む超高級洞窟ヴィラ。エーゲ海のパノラマビュー、崖沿いのプライベート温水インフィニティプール、大理石の専用バスルーム、そして毎日提供されるサンセットワインペアリングをお楽しみいただけます。`;
    }
    if (lower.includes('matterhorn') || lower.includes('zermatt') || lower.includes('alpine')) {
      return `標高1,600mに位置する建築家デザインのアルペンラグジュアリー。床から天井までの全面ガラス窓からマッターホルンの雄大な絶景を一望。フィンランド式サウナ、暖炉、スキーイン/スキーアウト直結アクセスを完備。`;
    }
    return `Wanderlust厳選ラグジュアリーステイ: ${text.slice(0, 150)}...\n\n極上の快適さ、最高峰のアメニティ、そして素晴らしいロケーションで、忘れられない特別な旅のひとときをお届けします。`;
  }

  if (code === 'zh') {
    if (lower.includes('caldera') || lower.includes('oia') || lower.includes('santorini')) {
      return `坐落在伊亚壮丽的火山口悬崖之巅，这栋超奢华洞穴别墅坐拥爱琴海全景，配备私人恒温悬崖无边泳池、大理石套房浴室，并每日尊享日落精选美酒品鉴。`;
    }
    if (lower.includes('matterhorn') || lower.includes('zermatt') || lower.includes('alpine')) {
      return `位于海拔1600米的建筑大师级高山奢享木屋。全景落地玻璃窗将马特洪峰的壮丽景致尽收眼底。配有芬兰桑拿房、开放式壁炉、私人滑雪进出通道及定制羊皮休息家具。`;
    }
    return `Wanderlust认证品质房源: ${text.slice(0, 150)}...\n\n此精选住宿提供无与伦比的奢华舒适、顶级配套设施与宁静氛围，为您的旅程留下难忘的美好回忆。`;
  }

  if (code === 'ar') {
    if (lower.includes('caldera') || lower.includes('oia') || lower.includes('santorini')) {
      return `تقع هذه الفيلا الكهفية الفاخرة للغاية على قمة منحدرات كالديرا الساحرة في أويا، وتوفر إطلالات بانورامية على بحر إيجه، ومسبحاً لا متناهياً خاصاً ومدفأ على حافة الهاوية، وحمامات رخامية داخلية فاخرة.`;
    }
    if (lower.includes('matterhorn') || lower.includes('zermatt') || lower.includes('alpine')) {
      return `شاليه ألبيني فاخر صممه كبار المهندسين المعماريين على ارتفاع 1600 متر. تكشف النوافذ الزجاجية الممتدة من الأرض إلى السقف عن إطلالات رائعة على جبل ماترهورن، مع ساونا فنلندية ومدفأة حطب.`;
    }
    return `إقامة فاخرة موثوقة من واندرلوست: ${text.slice(0, 150)}...\n\nيوفر هذا الملاذ الاستثنائي راحة فائقة، ومرافق عالمية المستوى، وأجواء هادئة لتجربة سفر لا تُنسى.`;
  }

  return text;
};

const translatePropertyDescription = async ({
  text,
  targetLanguage = 'es',
  sourceLanguage = 'en',
}) => {
  if (!text || !text.trim()) {
    return { translatedText: '', targetLanguage };
  }

  const targetLangName = getLanguageName(targetLanguage);
  const genAI = getGeminiClient();

  if (genAI) {
    try {
      const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
      const prompt = `
You are a professional luxury hospitality translator for Wanderlust vacation rentals.
Translate the following property description into ${targetLangName}.
Requirements:
1. Maintain the elegant, evocative, and welcoming tone of high-end travel.
2. Keep all specific architectural details, amenities, room specifications, and names clear and accurate.
3. Preserve paragraph breaks.
4. Output ONLY the raw translated text. Do NOT wrap in quotes, do NOT add conversational introduction or meta comments.

Original text:
"""
${text}
"""
`;
      const result = await model.generateContent(prompt);
      const translated = result.response.text().trim();
      if (translated) {
        return {
          translatedText: translated,
          targetLanguage,
          targetLangName,
          provider: 'Gemini 1.5 Flash AI',
        };
      }
    } catch (err) {
      console.warn('Gemini translation error, using intelligent fallback:', err.message);
    }
  }

  const fallback = getFallbackTranslation(text, targetLanguage);
  return {
    translatedText: fallback,
    targetLanguage,
    targetLangName,
    provider: 'Intelligent Language Engine',
  };
};

/**
   * 6. Plan Your Entire Trip with Wanderlust (End-to-End AI Trip Blueprint)
   */
  const planEntireTrip = async ({
    destination,
    days = 5,
    travelers = 2,
    travelStyle = 'Moderate',
    vibes = ['Culture & History', 'Local Culinary & Wine'],
    language = 'en',
  }) => {
    const numDays = Math.max(2, Math.min(10, Number(days) || 5));
    const numTravelers = Math.max(1, Number(travelers) || 2);
    const targetLangName = getLanguageName(language);
    const code = (language || 'en').toLowerCase().split('-')[0];

    // 1. Fetch real matching listings from MongoDB
    let matchingListings = [];
    try {
      const Listing = require('../models/Listing');
      const destRegex = new RegExp((destination || '').trim(), 'i');
      matchingListings = await Listing.find({
        $or: [{ location: destRegex }, { country: destRegex }, { title: destRegex }],
      })
        .limit(4)
        .select('title location country price image category averageRating reviewCount');

      if (matchingListings.length === 0) {
        matchingListings = await Listing.find({})
          .sort({ averageRating: -1 })
          .limit(4)
          .select('title location country price image category averageRating reviewCount');
      }
    } catch (err) {
      console.warn('Listing query in planEntireTrip warning:', err.message);
    }

    // 2. Call Gemini AI if available
    const genAI = getGeminiClient();
    if (genAI) {
      try {
        const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
        const prompt = `
You are the Chief Travel Architect for Wanderlust (an ultra-premium vacation rental platform).
Plan an entire end-to-end trip blueprint for travelers:
Destination: ${destination}
Duration: ${numDays} Days
Group Size: ${numTravelers} traveler(s)
Travel Style: ${travelStyle} (Budget, Moderate, or Luxury)
Vibes & Interests: ${Array.isArray(vibes) ? vibes.join(', ') : vibes}

CRITICAL LANGUAGE REQUIREMENT:
All user-facing strings (tripTitle, tagline, overview, bestTimeToVisit, weatherForecastSummary, dayTheme, activity titles and descriptions, insiderTips, dining recommendations, packingChecklist items, and localCheatSheet content) MUST be written completely and fluently in ${targetLangName}.
All numeric values and JSON object keys must remain strictly in English as defined below.

Return ONLY valid raw JSON with NO markdown code fences, matching this schema:
{
  "destination": "${destination}",
  "days": ${numDays},
  "travelers": ${numTravelers},
  "travelStyle": "${travelStyle}",
  "tripTitle": string,
  "tagline": string,
  "overview": string,
  "bestTimeToVisit": string,
  "weatherForecastSummary": string,
  "budgetBreakdown": {
    "accommodationTotal": number,
    "foodDiningTotal": number,
    "localTransitTotal": number,
    "activitiesSightseeingTotal": number,
    "contingencyFundTotal": number,
    "estimatedGrandTotal": number,
    "dailyAveragePerPerson": number,
    "budgetTips": [string, string, string]
  },
  "itinerary": [
    {
      "dayNumber": 1,
      "dayTheme": string,
      "morning": {
        "title": string,
        "description": string,
        "duration": string,
        "locationTip": string
      },
      "afternoon": {
        "title": string,
        "description": string,
        "duration": string,
        "locationTip": string
      },
      "evening": {
        "title": string,
        "description": string,
        "duration": string,
        "locationTip": string
      },
      "dining": {
        "venue": string,
        "cuisine": string,
        "signatureDish": string,
        "approxCost": string
      }
    }
  ],
  "packingChecklist": [
    {
      "category": string,
      "items": [string, string, string, string]
    }
  ],
  "localCheatSheet": {
    "currency": string,
    "languagePhrases": [
      { "phrase": string, "meaning": string }
    ],
    "tippingCulture": string,
    "emergencyNumber": string,
    "culturalEtiquette": [string, string, string]
  }
}
`;
        const result = await model.generateContent(prompt);
        const text = result.response.text().trim();
        const cleaned = text.replace(/^```json\s*/i, '').replace(/```\s*$/i, '');
        const parsed = JSON.parse(cleaned);
        parsed.matchingListings = matchingListings;
        return parsed;
      } catch (err) {
        console.warn('Gemini planEntireTrip error, using intelligent blueprint fallback:', err.message);
      }
    }

    // 3. High-quality intelligent fallback blueprint
    const sampleAvgNightly = matchingListings[0]?.price || 350;
    const styleMultipliers = {
      Budget: { food: 35, transit: 18, activities: 25, contingencyPct: 0.08 },
      Moderate: { food: 75, transit: 38, activities: 55, contingencyPct: 0.1 },
      Luxury: { food: 180, transit: 95, activities: 140, contingencyPct: 0.12 },
    };
    const sm = styleMultipliers[travelStyle] || styleMultipliers.Moderate;

    const accommodationTotal = sampleAvgNightly * numDays;
    const foodDiningTotal = sm.food * numTravelers * numDays;
    const localTransitTotal = sm.transit * numTravelers * numDays;
    const activitiesSightseeingTotal = sm.activities * numTravelers * numDays;
    const subtotal = accommodationTotal + foodDiningTotal + localTransitTotal + activitiesSightseeingTotal;
    const contingencyFundTotal = Math.round(subtotal * sm.contingencyPct);
    const estimatedGrandTotal = subtotal + contingencyFundTotal;
    const dailyAveragePerPerson = Math.round(estimatedGrandTotal / (numDays * numTravelers));

    // Build day-by-day plans
    const itinerary = [];
    for (let i = 1; i <= numDays; i++) {
      if (code === 'hi') {
        itinerary.push({
          dayNumber: i,
          dayTheme: i === 1 ? `${destination} में भव्य आगमन और पैनोरमिक परिचय` : i === 2 ? `तटीय आश्चर्य और छिपे हुए सांस्कृतिक रत्न` : i === 3 ? `ऐतिहासिक विरासत और स्थानीय स्वाद` : i === numDays ? `भव्य विदाई: विला में निजी शेफ और शाम का जश्न` : `रोमांचक भ्रमण और दर्शनीय स्थल`,
          morning: {
            title: `सुबह की शुरुआत और प्रसिद्ध स्थानीय नाश्ता`,
            description: `${destination} के सबसे पुराने कारीगर कैफे में ताज़ी कॉफी और पारंपरिक पेस्ट्री के साथ अपने दिन की शुरुआत करें।`,
            duration: '2.5 घंटे',
            locationTip: 'सूर्योदय देखने के लिए सुबह जल्दी निकलें।',
          },
          afternoon: {
            title: `सांस्कृतिक स्थल और ऐतिहासिक धरोहर भ्रमण`,
            description: `स्थानीय वास्तुकला और प्रसिद्ध ऐतिहासिक चौकों की खोज करें, स्थानीय कलाकारों से मिलें।`,
            duration: '3.5 घंटे',
            locationTip: 'आरामदायक जूते पहनें और ऑनलाइन टिकट साथ रखें।',
          },
          evening: {
            title: `सुनहरी शाम के सूर्यास्त दृश्य और आराम`,
            description: `पैनोरमिक व्यूप्वाइंट से सूर्यास्त का मनमोहक नजारा देखें और स्थानीय पेय का आनंद लें।`,
            duration: '2.5 घंटे',
            locationTip: 'सूर्यास्त से 40 मिनट पहले पहुंचें।',
          },
          dining: {
            venue: 'द क्लिफ हेरिटेज रेस्टोरेंट',
            type: 'पारंपरिक क्षेत्रीय व्यंजन',
            signatureDish: 'शेफ की विशेष स्थानीय थाली और मिठाई',
            approxCost: `$${sm.food} प्रति व्यक्ति`,
          },
        });
      } else if (code === 'es') {
        itinerary.push({
          dayNumber: i,
          dayTheme: i === 1 ? `Llegada triunfal y vistas panorámicas de ${destination}` : i === 2 ? `Maravillas costeras y rincones secretos` : i === 3 ? `Riqueza cultural y gastronomía de autor` : i === numDays ? `Gran despedida: Cena privada y recuerdos inolvidables` : `Aventuras panorámicas y descubrimientos locales`,
          morning: {
            title: `Desayuno artesanal y primer recorrido`,
            description: `Comienza el día en una emblemática cafetería local con café recién tostado y repostería artesanal en ${destination}.`,
            duration: '2.5 horas',
            locationTip: 'Pregunta al barista por su mirador favorito.',
          },
          afternoon: {
            title: `Exploración de monumentos y arquitectura histórica`,
            description: `Pasea por el centro histórico, admira galerías de arte y conoce creadores locales.`,
            duration: '3.5 horas',
            locationTip: 'Lleva calzado cómodo para caminar.',
          },
          evening: {
            title: `Atardecer dorado y cóctel de autor`,
            description: `Disfruta de la hora mágica desde una terraza privilegiada frente a ${destination}.`,
            duration: '2.5 horas',
            locationTip: 'Llega 30 minutos antes del ocaso para la mejor vista.',
          },
          dining: {
            venue: 'Bistró Mirador Panorámico',
            type: 'Cocina regional contemporánea',
            signatureDish: 'Especialidad de la casa con maridaje de vino local',
            approxCost: `$${sm.food} por persona`,
          },
        });
      } else {
        itinerary.push({
          dayNumber: i,
          dayTheme: i === 1 ? `Grand Arrival & Panoramic Orientation in ${destination}` : i === 2 ? `Coastal Horizons & Hidden Architectural Treasures` : i === 3 ? `Cultural Immersion & Artisanal Gastronomy` : i === numDays ? `Grand Finale: Private In-Villa Dining & Twilight Memories` : `Scenic Discovery & Off-The-Beaten-Path Exploration`,
          morning: {
            title: `Morning Check-In & Artisan Breakfast`,
            description: `Settle into your Wanderlust stay and savor freshly brewed espresso and local pastries at an artisanal bakery near ${destination}.`,
            duration: '2.5 hours',
            locationTip: 'Start early to beat the midday visitor crowds.',
          },
          afternoon: {
            title: `Landmark Heritage & Old Town Exploration`,
            description: `Stroll through iconic cobblestone avenues, visit celebrated historic plazas, and discover family-owned ateliers.`,
            duration: '3.5 hours',
            locationTip: 'Comfortable broken-in walking shoes are essential.',
          },
          evening: {
            title: `Golden Hour Sunset Vistas & Aperitif`,
            description: `Ascend to a curated viewpoint or terrace to witness breathtaking twilight views across ${destination}.`,
            duration: '2.5 hours',
            locationTip: 'Arrive 40 minutes before sunset for the best seating.',
          },
          dining: {
            venue: 'The Cliffside Sanctuary',
            type: 'Curated Regional Gastronomy',
            signatureDish: 'Chef tasting harvest with paired vintage',
            approxCost: `$${sm.food} per person`,
          },
        });
      }
    }

    // Packing list
    const packingChecklist = code === 'hi' ? [
      {
        category: 'आवश्यक दस्तावेज एवं मुद्रा',
        items: ['वैध पासपोर्ट एवं वीजा प्रतियां', 'क्रेडिट कार्ड एवं $100 स्थानीय नकदी', 'यात्रा बीमा पॉलिसी', 'Wanderlust बुकिंग पुष्टिकरण'],
      },
      {
        category: 'वस्त्र एवं जूते',
        items: ['पैदल चलने के लिए आरामदायक ग्रिप जूते', 'हल्के हवादार सूती कपड़े', 'शाम के लिए हल्का जैकेट या शॉल', 'सनग्लासेस एवं धूप की टोपी'],
      },
      {
        category: 'तकनीक एवं गैजेट्स',
        items: ['यूनिवर्सल पावर एडेप्टर', 'पोर्टेबल पावर बैंक (10,000mAh+)', 'स्मार्टफोन कैमरा और चार्जर', 'ऑफ़लाइन जीपीएस मैप्स डाउनलोड'],
      },
      {
        category: 'स्वास्थ्य एवं व्यक्तिगत देखभाल',
        items: ['रीफ-सेफ सनस्क्रीन (SPF 50+)', 'प्राथमिक चिकित्सा एवं व्यक्तिगत दवाइयां', 'पुन: प्रयोज्य पानी की बोतल', 'हैंड सैनिटाइज़र'],
      },
    ] : code === 'es' ? [
      {
        category: 'Documentos y Moneda',
        items: ['Pasaporte vigente y visas', 'Tarjetas sin comisiones internacionales y algo de efectivo', 'Seguro médico de viaje', 'Comprobantes de reserva en Wanderlust'],
      },
      {
        category: 'Ropa y Calzado',
        items: ['Calzado cómodo para caminar', 'Prendas transpirables en capas', 'Chaqueta ligera para la noche', 'Gafas de sol polarizadas y sombrero'],
      },
      {
        category: 'Tecnología',
        items: ['Adaptador universal de corriente', 'Batería externa portátil', 'Cables de carga rápida', 'Mapas sin conexión descargados'],
      },
      {
        category: 'Salud y Cuidado',
        items: ['Protector solar biodegradable', 'Botiquín de primeros auxilios y medicación', 'Botella de agua reutilizable', 'Repelente ecológico'],
      },
    ] : [
      {
        category: 'Essential Documents & Currency',
        items: ['Valid Passport & Visa documents', 'Cards with zero foreign transaction fees + $50 local cash', 'Travel medical insurance cards', 'Wanderlust reservation vouchers'],
      },
      {
        category: 'Apparel & Footwear',
        items: ['Comfortable broken-in walking shoes', 'Breathable lightweight day layers', 'Evening jacket or light sweater', 'Polarized sunglasses & sun hat'],
      },
      {
        category: 'Electronics & Connectivity',
        items: ['Universal travel power adapter', 'Compact power bank (10,000mAh+)', 'Smartphone with offline Google Maps', 'Noise-canceling earbuds'],
      },
      {
        category: 'Health & Wellness',
        items: ['Reef-safe sunscreen SPF 50+', 'Personal first-aid & prescription meds', 'Reusable insulated water bottle', 'Hydrating electrolyte packets'],
      },
    ];

    // Cheat sheet
    const localCheatSheet = code === 'hi' ? {
      currency: 'स्थानीय मुद्रा (कार्ड व्यापक रूप से स्वीकार किए जाते हैं; छोटे बाजारों के लिए नकद रखें)',
      languagePhrases: [
        { phrase: 'नमस्ते / धन्यवाद', meaning: 'विनम्र अभिवादन और आभार' },
        { phrase: 'कितने का है?', meaning: 'मूल्य पूछने के लिए' },
        { phrase: 'बिल लाएं कृपया', meaning: 'रेस्तरां में चेक मांगने के लिए' },
      ],
      tippingCulture: 'रेस्तरां और गाइड सेवाओं में 5-10% टिप देना शिष्टाचार माना जाता है।',
      emergencyNumber: '112 (अंतर्राष्ट्रीय आपातकालीन सहायता)',
      culturalEtiquette: [
        'दुकानों और कैफे में प्रवेश करते समय गर्मजोशी से नमस्ते कहें।',
        'धार्मिक या ऐतिहासिक स्थलों पर कंधे और घुटने ढककर रखें।',
        'स्थानीय लोगों की तस्वीरें लेने से पहले विनम्रता से अनुमति लें।',
      ],
    } : code === 'es' ? {
      currency: 'Moneda local (Tarjetas aceptadas; lleva algo de efectivo en mercados artesanales)',
      languagePhrases: [
        { phrase: 'Hola / Muchas gracias', meaning: 'Saludo cortés y agradecimiento' },
        { phrase: '¿Cuánto cuesta?', meaning: 'Para consultar precios en tiendas' },
        { phrase: 'La cuenta, por favor', meaning: 'Para solicitar el total en restaurantes' },
      ],
      tippingCulture: 'Se acostumbra dejar entre un 5% y 10% por un servicio excelente.',
      emergencyNumber: '112 (Línea de emergencia universal)',
      culturalEtiquette: [
        'Saluda amablemente al entrar a locales comerciales y cafeterías.',
        'Viste con decoro al visitar templos o monumentos históricos.',
        'Pide permiso antes de fotografiar artesanos o puestos de mercado.',
      ],
    } : {
      currency: 'Local currency (Cards widely accepted; keep €30-50 cash for boutique markets)',
      languagePhrases: [
        { phrase: 'Hello / Thank you very much', meaning: 'Courteous greeting and gratitude' },
        { phrase: 'How much is this?', meaning: 'Inquiring about artisanal prices' },
        { phrase: 'The bill, please', meaning: 'Requesting the check at restaurants' },
      ],
      tippingCulture: '5-10% gratuity is standard and warmly appreciated for attentive service.',
      emergencyNumber: '112 (Universal Emergency Service)',
      culturalEtiquette: [
        'Offer a warm greeting when entering small boutiques and family bistros.',
        'Dress respectfully when visiting heritage and spiritual landmarks.',
        'Always ask politely before photographing artisans in their workshops.',
      ],
    };

    const titles = {
      hi: `${destination} में आपका संपूर्ण ${numDays}-दिवसीय ड्रीम वेकेशन ब्लूप्रिंट`,
      es: `Tu viaje soñado de ${numDays} días en ${destination}`,
      en: `The Ultimate ${numDays}-Day Journey to ${destination}`,
    };

    const taglines = {
      hi: `विशेष लक्जरी विला, दिन-प्रतिदिन के साहसिक अनुभव और स्वादिष्ट स्थानीय भोजन का सही मिश्रण।`,
      es: `La combinación perfecta de estancias de lujo, experiencias curadas y alta gastronomía.`,
      en: `Bespoke luxury stays, curated daily adventures, and signature culinary memories seamlessly planned.`,
    };

    const overviews = {
      hi: `Wanderlust AI द्वारा तैयार किया गया यह व्यापक ब्लूप्रिंट आपके ${numDays} दिनों को ${destination} में अविस्मरणीय बनाएगा। इसमें सत्यापित विला, सटीक बजट पूर्वानुमान, दिन-वार यात्रा कार्यक्रम, और स्थानीय इनसाइडर टिप्स शामिल हैं।`,
      es: `Este itinerario integral creado por Wanderlust AI transformará tus ${numDays} días en ${destination} en una experiencia sin contratiempos, con estancias verificadas, desglose de costos y consejos exclusivos.`,
      en: `Designed by Wanderlust AI, this master blueprint transforms your ${numDays} days in ${destination} into an effortlessly memorable journey, combining verified stays, real-world expense forecasts, curated day-by-day itineraries, and insider secrets.`,
    };

    return {
      destination,
      days: numDays,
      travelers: numTravelers,
      travelStyle,
      tripTitle: titles[code] || titles.en,
      tagline: taglines[code] || taglines.en,
      overview: overviews[code] || overviews.en,
      bestTimeToVisit: code === 'hi' ? 'सुखद मौसम और कम भीड़ के लिए वसंत और पतझड़ के महीने सबसे अच्छे हैं।' : code === 'es' ? 'Primavera y principios de otoño para clima ideal y menor afluencia.' : 'Spring and early autumn offer radiant sunshine, comfortable temperatures, and relaxed crowds.',
      weatherForecastSummary: code === 'hi' ? 'दिन में धूप और सुहावना मौसम (22°C - 26°C), शाम को हल्की ठंडी हवाएं (16°C)।' : code === 'es' ? 'Días soleados templados (22°C - 26°C) y noches frescas agradables (16°C).' : 'Sunny, mild daytime highs (22°C - 26°C) with crisp, clear evening breezes (16°C).',
      matchingListings,
      budgetBreakdown: {
        accommodationTotal,
        foodDiningTotal,
        localTransitTotal,
        activitiesSightseeingTotal,
        contingencyFundTotal,
        estimatedGrandTotal,
        dailyAveragePerPerson,
        budgetTips: code === 'hi' ? [
          'संग्रहालय और लोकप्रिय दर्शनीय स्थलों के टिकट ऑनलाइन पहले से बुक करें।',
          'स्थानीय बेकरियों और बाजारों से ताज़ी सामग्री लेकर विला में आराम से नाश्ता करें।',
          'हवाई अड्डा स्थानांतरण Wanderlust के माध्यम से पूर्व-आरक्षित करें।',
        ] : code === 'es' ? [
          'Reserva entradas a museos en línea para evitar recargos y filas.',
          'Aprovecha los mercados matinales locales para desayunar en tu villa.',
          'Reserva traslados con antelación para mejores tarifas fijas.',
        ] : [
          'Pre-book museum passes online to bypass tourist queues and agency markups.',
          'Shop morning artisan bakeries to prepare scenic terrace breakfasts at your stay.',
          'Lock in private airport transfers early to secure guaranteed fixed rates.',
        ],
      },
      itinerary,
      packingChecklist,
      localCheatSheet,
    };
  };

  module.exports = {
    estimateTripBudget,
    generateItinerary,
    generateHostListingContent,
    chatWithAssistant,
    translatePropertyDescription,
    planEntireTrip,
  };

