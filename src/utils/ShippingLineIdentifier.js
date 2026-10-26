/**
 * ISO 6346 Container Prefix & Shipping Line Identifier
 * 100% Free, Instant, Offline & API-independent.
 * Identifies the Owner / Shipping Line / Leasing Company from the 3/4-letter prefix.
 */

export const SHIPPING_LINES_REGISTRY = {
  // Top Global Ocean Carriers
  MSC: {
    name: "Mediterranean Shipping Company (MSC)",
    shortName: "MSC",
    country: "Switzerland",
    flag: "🇨🇭",
    hq: "Geneva, Switzerland",
    website: "https://www.msc.com",
    trackingUrl: (no) => `https://www.msc.com/en/track-a-shipment?reference=${no}`,
    type: "Shipping Line",
    color: "amber",
  },
  MED: {
    name: "Mediterranean Shipping Company (MSC)",
    shortName: "MSC",
    country: "Switzerland",
    flag: "🇨🇭",
    hq: "Geneva, Switzerland",
    website: "https://www.msc.com",
    trackingUrl: (no) => `https://www.msc.com/en/track-a-shipment?reference=${no}`,
    type: "Shipping Line",
    color: "amber",
  },
  MAE: {
    name: "A.P. Moller – Maersk",
    shortName: "Maersk Line",
    country: "Denmark",
    flag: "🇩🇰",
    hq: "Copenhagen, Denmark",
    website: "https://www.maersk.com",
    trackingUrl: (no) => `https://www.maersk.com/tracking/${no}`,
    type: "Shipping Line",
    color: "sky",
  },
  MSK: {
    name: "A.P. Moller – Maersk",
    shortName: "Maersk Line",
    country: "Denmark",
    flag: "🇩🇰",
    hq: "Copenhagen, Denmark",
    website: "https://www.maersk.com",
    trackingUrl: (no) => `https://www.maersk.com/tracking/${no}`,
    type: "Shipping Line",
    color: "sky",
  },
  APM: {
    name: "APM Terminals / Maersk",
    shortName: "Maersk",
    country: "Denmark",
    flag: "🇩🇰",
    hq: "The Hague, Netherlands",
    website: "https://www.maersk.com",
    trackingUrl: (no) => `https://www.maersk.com/tracking/${no}`,
    type: "Shipping Line",
    color: "sky",
  },
  CMA: {
    name: "CMA CGM Group",
    shortName: "CMA CGM",
    country: "France",
    flag: "🇫🇷",
    hq: "Marseille, France",
    website: "https://www.cma-cgm.com",
    trackingUrl: (no) => `https://www.cma-cgm.com/ebusiness/tracking/search?SearchBy=Container&Reference=${no}`,
    type: "Shipping Line",
    color: "blue",
  },
  CMD: {
    name: "CMA CGM Group",
    shortName: "CMA CGM",
    country: "France",
    flag: "🇫🇷",
    hq: "Marseille, France",
    website: "https://www.cma-cgm.com",
    trackingUrl: (no) => `https://www.cma-cgm.com/ebusiness/tracking/search?SearchBy=Container&Reference=${no}`,
    type: "Shipping Line",
    color: "blue",
  },
  CGM: {
    name: "Compagnie Générale Maritime (CMA CGM)",
    shortName: "CMA CGM",
    country: "France",
    flag: "🇫🇷",
    hq: "Marseille, France",
    website: "https://www.cma-cgm.com",
    trackingUrl: (no) => `https://www.cma-cgm.com/ebusiness/tracking/search?SearchBy=Container&Reference=${no}`,
    type: "Shipping Line",
    color: "blue",
  },
  ANL: {
    name: "ANL Container Line (CMA CGM Subsidiary)",
    shortName: "ANL",
    country: "Australia / France",
    flag: "🇦🇺",
    hq: "Melbourne, Australia",
    website: "https://www.anl.com.au",
    trackingUrl: (no) => `https://www.anl.com.au/ebusiness/tracking/search?SearchBy=Container&Reference=${no}`,
    type: "Shipping Line",
    color: "blue",
  },
  COS: {
    name: "COSCO Shipping Lines",
    shortName: "COSCO",
    country: "China",
    flag: "🇨🇳",
    hq: "Shanghai, China",
    website: "https://lines.coscoshipping.com",
    trackingUrl: (no) => `https://lines.coscoshipping.com/ebusiness/cargoTracking?trackingType=CONTAINER&trackingNo=${no}`,
    type: "Shipping Line",
    color: "blue",
  },
  CBH: {
    name: "COSCO Shipping Lines",
    shortName: "COSCO",
    country: "China",
    flag: "🇨🇳",
    hq: "Shanghai, China",
    website: "https://lines.coscoshipping.com",
    trackingUrl: (no) => `https://lines.coscoshipping.com/ebusiness/cargoTracking?trackingType=CONTAINER&trackingNo=${no}`,
    type: "Shipping Line",
    color: "blue",
  },
  CCL: {
    name: "COSCO Container Lines",
    shortName: "COSCO",
    country: "China",
    flag: "🇨🇳",
    hq: "Shanghai, China",
    website: "https://lines.coscoshipping.com",
    trackingUrl: (no) => `https://lines.coscoshipping.com/ebusiness/cargoTracking?trackingType=CONTAINER&trackingNo=${no}`,
    type: "Shipping Line",
    color: "blue",
  },
  HLC: {
    name: "Hapag-Lloyd AG",
    shortName: "Hapag-Lloyd",
    country: "Germany",
    flag: "🇩🇪",
    hq: "Hamburg, Germany",
    website: "https://www.hapag-lloyd.com",
    trackingUrl: (no) => `https://www.hapag-lloyd.com/en/online-business/track/track-by-container-solution.html?container=${no}`,
    type: "Shipping Line",
    color: "orange",
  },
  HLX: {
    name: "Hapag-Lloyd AG",
    shortName: "Hapag-Lloyd",
    country: "Germany",
    flag: "🇩🇪",
    hq: "Hamburg, Germany",
    website: "https://www.hapag-lloyd.com",
    trackingUrl: (no) => `https://www.hapag-lloyd.com/en/online-business/track/track-by-container-solution.html?container=${no}`,
    type: "Shipping Line",
    color: "orange",
  },
  ONE: {
    name: "Ocean Network Express (ONE)",
    shortName: "ONE",
    country: "Japan / Singapore",
    flag: "🇯🇵",
    hq: "Singapore / Tokyo, Japan",
    website: "https://www.one-line.com",
    trackingUrl: (no) => `https://ecomm.one-line.com/one-ecom/manage-shipment/cargo-tracking?ctrac-field=${no}`,
    type: "Shipping Line",
    color: "pink",
  },
  NYK: {
    name: "Nippon Yusen Kaisha (merged into ONE)",
    shortName: "NYK Line / ONE",
    country: "Japan",
    flag: "🇯🇵",
    hq: "Tokyo, Japan",
    website: "https://www.one-line.com",
    trackingUrl: (no) => `https://ecomm.one-line.com/one-ecom/manage-shipment/cargo-tracking?ctrac-field=${no}`,
    type: "Shipping Line",
    color: "pink",
  },
  MOL: {
    name: "Mitsui O.S.K. Lines (merged into ONE)",
    shortName: "MOL / ONE",
    country: "Japan",
    flag: "🇯🇵",
    hq: "Tokyo, Japan",
    website: "https://www.one-line.com",
    trackingUrl: (no) => `https://ecomm.one-line.com/one-ecom/manage-shipment/cargo-tracking?ctrac-field=${no}`,
    type: "Shipping Line",
    color: "pink",
  },
  KLF: {
    name: "Kawasaki Kisen Kaisha (K Line / ONE)",
    shortName: "K Line / ONE",
    country: "Japan",
    flag: "🇯🇵",
    hq: "Tokyo, Japan",
    website: "https://www.one-line.com",
    trackingUrl: (no) => `https://ecomm.one-line.com/one-ecom/manage-shipment/cargo-tracking?ctrac-field=${no}`,
    type: "Shipping Line",
    color: "pink",
  },
  EGL: {
    name: "Evergreen Marine Corporation",
    shortName: "Evergreen",
    country: "Taiwan",
    flag: "🇹🇼",
    hq: "Taoyuan City, Taiwan",
    website: "https://www.evergreen-marine.com",
    trackingUrl: (no) => `https://ct.shipmentlink.com/servlet/TTrk_Tracking?quick_type=C&quick_num=${no}`,
    type: "Shipping Line",
    color: "emerald",
  },
  EMC: {
    name: "Evergreen Marine Corporation",
    shortName: "Evergreen",
    country: "Taiwan",
    flag: "🇹🇼",
    hq: "Taoyuan City, Taiwan",
    website: "https://www.evergreen-marine.com",
    trackingUrl: (no) => `https://ct.shipmentlink.com/servlet/TTrk_Tracking?quick_type=C&quick_num=${no}`,
    type: "Shipping Line",
    color: "emerald",
  },
  EIS: {
    name: "Evergreen Marine (EIS)",
    shortName: "Evergreen",
    country: "Taiwan",
    flag: "🇹🇼",
    hq: "Taoyuan City, Taiwan",
    website: "https://www.evergreen-marine.com",
    trackingUrl: (no) => `https://ct.shipmentlink.com/servlet/TTrk_Tracking?quick_type=C&quick_num=${no}`,
    type: "Shipping Line",
    color: "emerald",
  },
  HDM: {
    name: "HMM (Hyundai Merchant Marine)",
    shortName: "HMM",
    country: "South Korea",
    flag: "🇰🇷",
    hq: "Seoul, South Korea",
    website: "https://www.hmm21.com",
    trackingUrl: (no) => `https://www.hmm21.com/cms/business/ebiz/trackTrace/trackTrace/index.do`,
    type: "Shipping Line",
    color: "red",
  },
  YML: {
    name: "Yang Ming Marine Transport Corp.",
    shortName: "Yang Ming",
    country: "Taiwan",
    flag: "🇹🇼",
    hq: "Keelung, Taiwan",
    website: "https://www.yangming.com",
    trackingUrl: (no) => `https://www.yangming.com/e-service/track_trace/track_trace_cargo_tracking.aspx?type=container&number=${no}`,
    type: "Shipping Line",
    color: "indigo",
  },
  ZIM: {
    name: "ZIM Integrated Shipping Services",
    shortName: "ZIM",
    country: "Israel",
    flag: "🇮🇱",
    hq: "Haifa, Israel",
    website: "https://www.zim.com",
    trackingUrl: (no) => `https://www.zim.com/tools/track-a-shipment?cons=${no}`,
    type: "Shipping Line",
    color: "yellow",
  },
  OOL: {
    name: "Orient Overseas Container Line (OOCL)",
    shortName: "OOCL",
    country: "Hong Kong",
    flag: "🇭🇰",
    hq: "Hong Kong",
    website: "https://www.oocl.com",
    trackingUrl: (no) => `https://www.oocl.com/eng/ourservices/eservices/cargotracking/Pages/cargotracking.aspx?query=${no}`,
    type: "Shipping Line",
    color: "red",
  },
  WHL: {
    name: "Wan Hai Lines",
    shortName: "Wan Hai",
    country: "Taiwan",
    flag: "🇹🇼",
    hq: "Taipei, Taiwan",
    website: "https://www.wanhai.com",
    trackingUrl: (no) => `https://www.wanhai.com/views/cargoTracking/cargoTracking.xhtml`,
    type: "Shipping Line",
    color: "blue",
  },
  PIL: {
    name: "Pacific International Lines (PIL)",
    shortName: "PIL",
    country: "Singapore",
    flag: "🇸🇬",
    hq: "Singapore",
    website: "https://www.pilship.com",
    trackingUrl: (no) => `https://www.pilship.com/en-our-track-and-trace/120.html?refno=${no}`,
    type: "Shipping Line",
    color: "red",
  },
  PCI: {
    name: "Pacific International Lines (PIL)",
    shortName: "PIL",
    country: "Singapore",
    flag: "🇸🇬",
    hq: "Singapore",
    website: "https://www.pilship.com",
    trackingUrl: (no) => `https://www.pilship.com/en-our-track-and-trace/120.html?refno=${no}`,
    type: "Shipping Line",
    color: "red",
  },
  SML: {
    name: "SM Line Corporation",
    shortName: "SM Line",
    country: "South Korea",
    flag: "🇰🇷",
    hq: "Seoul, South Korea",
    website: "https://esvc.smlines.com",
    trackingUrl: (no) => `https://esvc.smlines.com/smline/CUP_HOM_3301.do?cntr_no=${no}`,
    type: "Shipping Line",
    color: "teal",
  },
  SUD: {
    name: "Hamburg Süd (Maersk Group)",
    shortName: "Hamburg Süd",
    country: "Germany",
    flag: "🇩🇪",
    hq: "Hamburg, Germany",
    website: "https://www.hamburgsud.com",
    trackingUrl: (no) => `https://www.maersk.com/tracking/${no}`,
    type: "Shipping Line",
    color: "red",
  },
  SCI: {
    name: "Shipping Corporation of India (SCI)",
    shortName: "SCI",
    country: "India",
    flag: "🇮🇳",
    hq: "Mumbai, India",
    website: "https://www.shipindia.com",
    trackingUrl: (no) => `https://www.shipindia.com/`,
    type: "National Shipping Line",
    color: "indigo",
  },
  SHY: {
    name: "Shreyas Shipping & Logistics (Transworld)",
    shortName: "Shreyas Line",
    country: "India",
    flag: "🇮🇳",
    hq: "Mumbai, India",
    website: "https://www.transworld.com",
    trackingUrl: (no) => `https://www.transworld.com/`,
    type: "Coastal / Feeder Line",
    color: "blue",
  },

  // Major Global Container Leasing Companies (Own ~50% of world containers)
  TGH: {
    name: "Textainer Group Holdings",
    shortName: "Textainer",
    country: "USA / Bermuda",
    flag: "🇺🇸",
    hq: "Hamilton, Bermuda / San Francisco, USA",
    website: "https://www.textainer.com",
    trackingUrl: (no) => `https://www.textainer.com/equipment-sales/`,
    type: "Container Lessor",
    color: "emerald",
  },
  TEX: {
    name: "Textainer Group Holdings",
    shortName: "Textainer",
    country: "USA / Bermuda",
    flag: "🇺🇸",
    hq: "Hamilton, Bermuda / San Francisco, USA",
    website: "https://www.textainer.com",
    trackingUrl: (no) => `https://www.textainer.com/equipment-sales/`,
    type: "Container Lessor",
    color: "emerald",
  },
  TEM: {
    name: "Textainer Equipment Management",
    shortName: "Textainer",
    country: "USA / Bermuda",
    flag: "🇺🇸",
    hq: "Hamilton, Bermuda / San Francisco, USA",
    website: "https://www.textainer.com",
    trackingUrl: (no) => `https://www.textainer.com/equipment-sales/`,
    type: "Container Lessor",
    color: "emerald",
  },
  TCL: {
    name: "Triton International",
    shortName: "Triton",
    country: "USA / Bermuda",
    flag: "🇺🇸",
    hq: "Purchase, New York, USA",
    website: "https://www.tritoncontainer.com",
    trackingUrl: (no) => `https://www.tritoncontainer.com/`,
    type: "Container Lessor",
    color: "blue",
  },
  TRL: {
    name: "Triton International",
    shortName: "Triton",
    country: "USA / Bermuda",
    flag: "🇺🇸",
    hq: "Purchase, New York, USA",
    website: "https://www.tritoncontainer.com",
    trackingUrl: (no) => `https://www.tritoncontainer.com/`,
    type: "Container Lessor",
    color: "blue",
  },
  TTN: {
    name: "Triton Container",
    shortName: "Triton",
    country: "USA / Bermuda",
    flag: "🇺🇸",
    hq: "Purchase, New York, USA",
    website: "https://www.tritoncontainer.com",
    trackingUrl: (no) => `https://www.tritoncontainer.com/`,
    type: "Container Lessor",
    color: "blue",
  },
  FCI: {
    name: "Florens Container Leasing",
    shortName: "Florens",
    country: "Hong Kong / China",
    flag: "🇭🇰",
    hq: "Hong Kong",
    website: "https://www.florens.com",
    trackingUrl: (no) => `https://www.florens.com/`,
    type: "Container Lessor",
    color: "sky",
  },
  SEG: {
    name: "Seaco Global",
    shortName: "Seaco",
    country: "Singapore / UK",
    flag: "🇸🇬",
    hq: "Singapore",
    website: "https://www.seacoglobal.com",
    trackingUrl: (no) => `https://www.seacoglobal.com/`,
    type: "Container Lessor",
    color: "blue",
  },
  GES: {
    name: "GE SeaCo / Seaco Global",
    shortName: "Seaco",
    country: "Singapore / UK",
    flag: "🇸🇬",
    hq: "Singapore",
    website: "https://www.seacoglobal.com",
    trackingUrl: (no) => `https://www.seacoglobal.com/`,
    type: "Container Lessor",
    color: "blue",
  },
  CAI: {
    name: "CAI International",
    shortName: "CAI",
    country: "USA",
    flag: "🇺🇸",
    hq: "San Francisco, USA",
    website: "https://www.capps.com",
    trackingUrl: (no) => `https://www.capps.com/`,
    type: "Container Lessor",
    color: "purple",
  },
  BEA: {
    name: "Beacon Intermodal Leasing",
    shortName: "Beacon",
    country: "USA",
    flag: "🇺🇸",
    hq: "Boston, USA",
    website: "https://www.beaconintermodal.com",
    trackingUrl: (no) => `https://www.beaconintermodal.com/`,
    type: "Container Lessor",
    color: "cyan",
  },
  TOA: {
    name: "Touax Global Container Solutions",
    shortName: "Touax",
    country: "France",
    flag: "🇫🇷",
    hq: "Paris, France",
    website: "https://www.touax-container.com",
    trackingUrl: (no) => `https://www.touax-container.com/`,
    type: "Container Lessor",
    color: "orange",
  },
  BSI: {
    name: "Blue Sky Intermodal",
    shortName: "Blue Sky",
    country: "UK",
    flag: "🇬🇧",
    hq: "London, UK",
    website: "https://www.bluesky-intermodal.com",
    trackingUrl: (no) => `https://www.bluesky-intermodal.com/`,
    type: "Container Lessor",
    color: "sky",
  },
  SIT: {
    name: "SITC Container Lines",
    shortName: "SITC",
    country: "China",
    flag: "🇨🇳",
    hq: "Shanghai, China",
    website: "https://www.sitc.com",
    trackingUrl: (no) => `https://www.sitc.com/`,
    type: "Regional Shipping Line",
    color: "blue",
  },
  KMT: {
    name: "Korea Marine Transport Co. (KMTC)",
    shortName: "KMTC",
    country: "South Korea",
    flag: "🇰🇷",
    hq: "Seoul, South Korea",
    website: "https://www.kmtc.co.kr",
    trackingUrl: (no) => `https://www.kmtc.co.kr/`,
    type: "Shipping Line",
    color: "blue",
  },
};

/**
 * Validates ISO 6346 Container Number and Calculates Check Digit
 * Letters A-Z mapped to numeric values (skipping multiples of 11: 11, 22, 33)
 */
export function validateISO6346(containerNo) {
  if (!containerNo || typeof containerNo !== "string") {
    return { valid: false, message: "Empty container number" };
  }

  const clean = containerNo.replace(/\s+/g, "").toUpperCase();

  // Pattern: 4 letters + 7 numbers (standard ISO 6346)
  const pattern = /^[A-Z]{4}\d{7}$/;
  const isStandardFormat = pattern.test(clean);

  // Character mapping values according to ISO 6346 standard
  const charValues = {
    A: 10, B: 12, C: 13, D: 14, E: 15, F: 16, G: 17, H: 18, I: 19, J: 20,
    K: 21, L: 23, M: 24, N: 25, O: 26, P: 27, Q: 28, R: 29, S: 30, T: 31,
    U: 32, V: 34, W: 35, X: 36, Y: 37, Z: 38,
  };

  if (!isStandardFormat) {
    return {
      valid: false,
      isStandardFormat: false,
      message: "Container number should ideally follow ISO format (e.g. MSCU1234567)",
      clean,
    };
  }

  // Calculate check digit
  let sum = 0;
  for (let i = 0; i < 10; i++) {
    const char = clean[i];
    const val = isNaN(char) ? charValues[char] || 0 : parseInt(char, 10);
    sum += val * Math.pow(2, i);
  }

  let calculatedCheckDigit = sum % 11;
  if (calculatedCheckDigit === 10) calculatedCheckDigit = 0;

  const actualCheckDigit = parseInt(clean[10], 10);
  const isCheckDigitValid = calculatedCheckDigit === actualCheckDigit;

  return {
    valid: isCheckDigitValid,
    isStandardFormat: true,
    calculatedCheckDigit,
    actualCheckDigit,
    clean,
    message: isCheckDigitValid
      ? "Valid ISO 6346 Container Number"
      : `Check digit mismatch (expected ${calculatedCheckDigit}, got ${actualCheckDigit})`,
  };
}

/**
 * Identify Shipping Line / Owner from Container Number
 * 100% Free, Instant, Offline
 */
export function identifyShippingLine(containerNo) {
  if (!containerNo || typeof containerNo !== "string") return null;

  const clean = containerNo.replace(/[^A-Za-z0-9]/g, "").toUpperCase();
  if (clean.length < 3) return null;

  const prefix3 = clean.substring(0, 3);
  const prefix4 = clean.substring(0, 4);
  const categoryChar = clean.length >= 4 ? clean[3] : "";

  // Category identifier explanation (4th character)
  let categoryName = "Freight Container";
  if (categoryChar === "U") categoryName = "Freight Container (Standard Intermodal)";
  else if (categoryChar === "J") categoryName = "Detachable Equipment (Clips/Genset)";
  else if (categoryChar === "Z") categoryName = "Trailers & Chassis";

  const carrierInfo = SHIPPING_LINES_REGISTRY[prefix3] || SHIPPING_LINES_REGISTRY[prefix4];

  const validation = validateISO6346(clean);

  if (carrierInfo) {
    return {
      found: true,
      ownerCode: prefix3 + (categoryChar || "U"),
      carrierName: carrierInfo.name,
      shortName: carrierInfo.shortName,
      country: carrierInfo.country,
      flag: carrierInfo.flag,
      hq: carrierInfo.hq,
      website: carrierInfo.website,
      trackingUrl: carrierInfo.trackingUrl(clean),
      type: carrierInfo.type,
      color: carrierInfo.color,
      category: categoryName,
      validation,
      freeBicRegistryUrl: `https://www.bic-code.org/bic-codes/`,
    };
  }

  // Fallback for unregistered or less common prefixes
  return {
    found: false,
    ownerCode: prefix3 + (categoryChar || "U"),
    carrierName: `Carrier / Lessor with BIC Code '${prefix3}'`,
    shortName: prefix3,
    country: "International",
    flag: "🌐",
    hq: "Registered with BIC (Bureau International des Containers)",
    website: "https://www.bic-code.org",
    trackingUrl: `https://www.google.com/search?q=${clean}+container+tracking`,
    type: "Intermodal Container",
    color: "gray",
    category: categoryName,
    validation,
    freeBicRegistryUrl: `https://www.bic-code.org/bic-codes/`,
  };
}
