export type VideoItem = {
  title: string;
  url: string;
  channel: string;
};

const VIDEO_DB: Record<string, VideoItem[]> = {
  physics: [
    { title: "Classical Mechanics Fundamentals", url: "https://www.youtube.com/results?search_query=classical+mechanics+tutorial", channel: "Educational" },
    { title: "Kinematics and Motion Explained", url: "https://www.youtube.com/results?search_query=kinematics+tutorial", channel: "Educational" },
    { title: "Newton's Laws of Motion", url: "https://www.youtube.com/results?search_query=newtons+laws+motion", channel: "Educational" },
    { title: "Force and Acceleration", url: "https://www.youtube.com/results?search_query=force+acceleration+physics", channel: "Educational" },
    { title: "Energy and Momentum", url: "https://www.youtube.com/results?search_query=energy+momentum+conservation", channel: "Educational" },
  ],
  chemistry: [
    { title: "Organic Reactions Overview", url: "https://www.youtube.com/results?search_query=organic+chemistry+reactions", channel: "Educational" },
    { title: "Chemical Bonding Explained", url: "https://www.youtube.com/results?search_query=chemical+bonding+tutorial", channel: "Educational" },
    { title: "Stoichiometry and Moles", url: "https://www.youtube.com/results?search_query=stoichiometry+calculations", channel: "Educational" },
    { title: "Acid-Base Chemistry", url: "https://www.youtube.com/results?search_query=acid+base+titration+chemistry", channel: "Educational" },
    { title: "Redox Reactions", url: "https://www.youtube.com/results?search_query=redox+reactions+oxidation", channel: "Educational" },
  ],
  mathematics: [
    { title: "Calculus Fundamentals", url: "https://www.youtube.com/results?search_query=calculus+limits+derivatives", channel: "Educational" },
    { title: "Integration Techniques", url: "https://www.youtube.com/results?search_query=integration+calculus", channel: "Educational" },
    { title: "Algebra Problem Solving", url: "https://www.youtube.com/results?search_query=algebra+equations+solving", channel: "Educational" },
    { title: "Trigonometry Basics", url: "https://www.youtube.com/results?search_query=trigonometry+sine+cosine+tangent", channel: "Educational" },
    { title: "Matrices and Vectors", url: "https://www.youtube.com/results?search_query=linear+algebra+matrices", channel: "Educational" },
  ],
  biology: [
    { title: "Cell Biology Essentials", url: "https://www.youtube.com/results?search_query=cell+biology+mitochondria", channel: "Educational" },
    { title: "Genetics and DNA", url: "https://www.youtube.com/results?search_query=genetics+dna+inheritance", channel: "Educational" },
    { title: "Evolution and Natural Selection", url: "https://www.youtube.com/results?search_query=evolution+natural+selection", channel: "Educational" },
    { title: "Photosynthesis and Respiration", url: "https://www.youtube.com/results?search_query=photosynthesis+cellular+respiration", channel: "Educational" },
    { title: "Ecology and Ecosystems", url: "https://www.youtube.com/results?search_query=ecology+food+chain+ecosystem", channel: "Educational" },
  ],
  cryptography: [
    { title: "Cryptography Fundamentals", url: "https://www.youtube.com/results?search_query=cryptography+basics+tutorial", channel: "Educational" },
    { title: "RSA and Public Key Cryptography", url: "https://www.youtube.com/results?search_query=rsa+public+key+cryptography", channel: "Educational" },
    { title: "AES Encryption Explained", url: "https://www.youtube.com/results?search_query=aes+encryption+algorithm", channel: "Educational" },
    { title: "Hash Functions and Digital Signatures", url: "https://www.youtube.com/results?search_query=hash+functions+digital+signatures", channel: "Educational" },
    { title: "Blockchain and Cryptographic Security", url: "https://www.youtube.com/results?search_query=blockchain+cryptography+security", channel: "Educational" },
  ],
  computerscience: [
    { title: "Data Structures Explained", url: "https://www.youtube.com/results?search_query=data+structures+tutorial", channel: "Educational" },
    { title: "Algorithms and Complexity", url: "https://www.youtube.com/results?search_query=algorithms+big+o+complexity", channel: "Educational" },
    { title: "Object-Oriented Programming", url: "https://www.youtube.com/results?search_query=oop+object+oriented+programming", channel: "Educational" },
    { title: "Database Design Basics", url: "https://www.youtube.com/results?search_query=database+design+sql", channel: "Educational" },
    { title: "Web Development Fundamentals", url: "https://www.youtube.com/results?search_query=web+development+html+css+javascript", channel: "Educational" },
  ],
  astronomy: [
    { title: "Introduction to Astronomy", url: "https://www.youtube.com/results?search_query=astronomy+basics+tutorial", channel: "Educational" },
    { title: "Stars and Galaxies Overview", url: "https://www.youtube.com/results?search_query=stars+galaxies+lecture", channel: "Educational" },
    { title: "Cosmology Explained", url: "https://www.youtube.com/results?search_query=cosmology+big+bang+tutorial", channel: "Educational" },
    { title: "Telescopes and Observational Astronomy", url: "https://www.youtube.com/results?search_query=telescopes+astronomy+tutorial", channel: "Educational" },
  ],
  economics: [
    { title: "Microeconomics Basics", url: "https://www.youtube.com/results?search_query=microeconomics+basics+tutorial", channel: "Educational" },
    { title: "Macroeconomics Overview", url: "https://www.youtube.com/results?search_query=macroeconomics+overview+tutorial", channel: "Educational" },
    { title: "Supply and Demand Explained", url: "https://www.youtube.com/results?search_query=supply+demand+economics+tutorial", channel: "Educational" },
    { title: "International Trade Basics", url: "https://www.youtube.com/results?search_query=international+trade+economics", channel: "Educational" },
  ],
  history: [
    { title: "World History Overview", url: "https://www.youtube.com/results?search_query=world+history+overview+tutorial", channel: "Educational" },
    { title: "Ancient Civilizations", url: "https://www.youtube.com/results?search_query=ancient+civilizations+history", channel: "Educational" },
    { title: "Modern History Summaries", url: "https://www.youtube.com/results?search_query=modern+history+lecture", channel: "Educational" },
    { title: "Historical Analysis Techniques", url: "https://www.youtube.com/results?search_query=historical+analysis+tutorial", channel: "Educational" },
  ],
  psychology: [
    { title: "Introduction to Psychology", url: "https://www.youtube.com/results?search_query=intro+psychology+tutorial", channel: "Educational" },
    { title: "Cognitive Psychology Basics", url: "https://www.youtube.com/results?search_query=cognitive+psychology+tutorial", channel: "Educational" },
    { title: "Behavioral Psychology Explained", url: "https://www.youtube.com/results?search_query=behavioral+psychology+tutorial", channel: "Educational" },
    { title: "Developmental Psychology Overview", url: "https://www.youtube.com/results?search_query=developmental+psychology+lecture", channel: "Educational" },
  ],
  sociology: [
    { title: "Sociology Basics", url: "https://www.youtube.com/results?search_query=sociology+basics+tutorial", channel: "Educational" },
    { title: "Social Structures and Institutions", url: "https://www.youtube.com/results?search_query=social+structures+institutions", channel: "Educational" },
    { title: "Research Methods in Sociology", url: "https://www.youtube.com/results?search_query=sociology+research+methods", channel: "Educational" },
    { title: "Sociological Theories", url: "https://www.youtube.com/results?search_query=sociological+theories+tutorial", channel: "Educational" },
  ],
  geography: [
    { title: "Physical Geography Basics", url: "https://www.youtube.com/results?search_query=physical+geography+tutorial", channel: "Educational" },
    { title: "Human Geography Overview", url: "https://www.youtube.com/results?search_query=human+geography+tutorial", channel: "Educational" },
    { title: "Geographic Information Systems (GIS)", url: "https://www.youtube.com/results?search_query=gis+tutorial+introduction", channel: "Educational" },
    { title: "Maps and Cartography", url: "https://www.youtube.com/results?search_query=maps+cartography+tutorial", channel: "Educational" },
  ],
  philosophy: [
    { title: "Introduction to Philosophy", url: "https://www.youtube.com/results?search_query=introduction+to+philosophy+tutorial", channel: "Educational" },
    { title: "Ethics and Moral Philosophy", url: "https://www.youtube.com/results?search_query=ethics+philosophy+lecture", channel: "Educational" },
    { title: "Logic and Critical Thinking", url: "https://www.youtube.com/results?search_query=logic+critical+thinking+tutorial", channel: "Educational" },
    { title: "Philosophy of Science", url: "https://www.youtube.com/results?search_query=philosophy+of+science+tutorial", channel: "Educational" },
  ],
  engineering: [
    { title: "Engineering Fundamentals", url: "https://www.youtube.com/results?search_query=engineering+fundamentals+tutorial", channel: "Educational" },
    { title: "Mechanical Engineering Basics", url: "https://www.youtube.com/results?search_query=mechanical+engineering+basics", channel: "Educational" },
    { title: "Electrical Engineering Overview", url: "https://www.youtube.com/results?search_query=electrical+engineering+basics", channel: "Educational" },
    { title: "Civil Engineering Concepts", url: "https://www.youtube.com/results?search_query=civil+engineering+concepts", channel: "Educational" },
  ],
  statistics: [
    { title: "Statistics for Beginners", url: "https://www.youtube.com/results?search_query=statistics+basics+tutorial", channel: "Educational" },
    { title: "Probability Theory Overview", url: "https://www.youtube.com/results?search_query=probability+theory+tutorial", channel: "Educational" },
    { title: "Statistical Inference", url: "https://www.youtube.com/results?search_query=statistical+inference+tutorial", channel: "Educational" },
    { title: "Applied Statistics with Examples", url: "https://www.youtube.com/results?search_query=applied+statistics+examples", channel: "Educational" },
  ],
  machinelearning: [
    { title: "Machine Learning Basics", url: "https://www.youtube.com/results?search_query=machine+learning+basics+tutorial", channel: "Educational" },
    { title: "Supervised vs Unsupervised Learning", url: "https://www.youtube.com/results?search_query=supervised+unsupervised+learning+tutorial", channel: "Educational" },
    { title: "Neural Networks Explained", url: "https://www.youtube.com/results?search_query=neural+networks+tutorial", channel: "Educational" },
    { title: "Model Evaluation and Metrics", url: "https://www.youtube.com/results?search_query=model+evaluation+metrics+tutorial", channel: "Educational" },
  ],
  datascience: [
    { title: "Data Science Crash Course", url: "https://www.youtube.com/results?search_query=data+science+crash+course", channel: "Educational" },
    { title: "Data Cleaning and Preprocessing", url: "https://www.youtube.com/results?search_query=data+cleaning+preprocessing+tutorial", channel: "Educational" },
    { title: "Exploratory Data Analysis", url: "https://www.youtube.com/results?search_query=exploratory+data+analysis+tutorial", channel: "Educational" },
    { title: "Visualization Techniques", url: "https://www.youtube.com/results?search_query=data+visualization+tutorial", channel: "Educational" },
  ],
  programming: [
    { title: "Programming Basics", url: "https://www.youtube.com/results?search_query=programming+basics+tutorial", channel: "Educational" },
    { title: "Python for Beginners", url: "https://www.youtube.com/results?search_query=python+for+beginners+tutorial", channel: "Educational" },
    { title: "JavaScript Fundamentals", url: "https://www.youtube.com/results?search_query=javascript+fundamentals+tutorial", channel: "Educational" },
    { title: "Software Engineering Principles", url: "https://www.youtube.com/results?search_query=software+engineering+principles+tutorial", channel: "Educational" },
  ],
  art: [
    { title: "Drawing and Sketching Basics", url: "https://www.youtube.com/results?search_query=drawing+sketching+basics", channel: "Educational" },
    { title: "Color Theory and Painting", url: "https://www.youtube.com/results?search_query=color+theory+painting+tutorial", channel: "Educational" },
    { title: "Art History Overview", url: "https://www.youtube.com/results?search_query=art+history+overview", channel: "Educational" },
    { title: "Digital Art Techniques", url: "https://www.youtube.com/results?search_query=digital+art+techniques+tutorial", channel: "Educational" },
  ],
  music: [
    { title: "Music Theory Basics", url: "https://www.youtube.com/results?search_query=music+theory+basics+tutorial", channel: "Educational" },
    { title: "Learning Guitar for Beginners", url: "https://www.youtube.com/results?search_query=guitar+for+beginners+tutorial", channel: "Educational" },
    { title: "Piano Basics", url: "https://www.youtube.com/results?search_query=piano+basics+tutorial", channel: "Educational" },
    { title: "Music Production Introduction", url: "https://www.youtube.com/results?search_query=music+production+introduction", channel: "Educational" },
  ],
  languages: [
    { title: "English Grammar Essentials", url: "https://www.youtube.com/results?search_query=english+grammar+essentials", channel: "Educational" },
    { title: "Spanish for Beginners", url: "https://www.youtube.com/results?search_query=spanish+for+beginners+tutorial", channel: "Educational" },
    { title: "Language Learning Techniques", url: "https://www.youtube.com/results?search_query=language+learning+techniques+tutorial", channel: "Educational" },
    { title: "Pronunciation Practice", url: "https://www.youtube.com/results?search_query=pronunciation+practice+tutorial", channel: "Educational" },
  ],
  medicine: [
    { title: "Human Anatomy Basics", url: "https://www.youtube.com/results?search_query=human+anatomy+basics+tutorial", channel: "Educational" },
    { title: "Physiology Overview", url: "https://www.youtube.com/results?search_query=physiology+overview+tutorial", channel: "Educational" },
    { title: "Medical Terminology", url: "https://www.youtube.com/results?search_query=medical+terminology+tutorial", channel: "Educational" },
    { title: "Clinical Skills Basics", url: "https://www.youtube.com/results?search_query=clinical+skills+basics+tutorial", channel: "Educational" },
  ],
  law: [
    { title: "Introduction to Law", url: "https://www.youtube.com/results?search_query=introduction+to+law+tutorial", channel: "Educational" },
    { title: "Constitutional Law Overview", url: "https://www.youtube.com/results?search_query=constitutional+law+overview", channel: "Educational" },
    { title: "Criminal Law Basics", url: "https://www.youtube.com/results?search_query=criminal+law+basics+tutorial", channel: "Educational" },
    { title: "Contract Law Essentials", url: "https://www.youtube.com/results?search_query=contract+law+essentials+tutorial", channel: "Educational" },
  ],
  finance: [
    { title: "Personal Finance Basics", url: "https://www.youtube.com/results?search_query=personal+finance+basics+tutorial", channel: "Educational" },
    { title: "Investing 101", url: "https://www.youtube.com/results?search_query=investing+101+tutorial", channel: "Educational" },
    { title: "Financial Modeling Overview", url: "https://www.youtube.com/results?search_query=financial+modeling+overview", channel: "Educational" },
    { title: "Corporate Finance Basics", url: "https://www.youtube.com/results?search_query=corporate+finance+basics+tutorial", channel: "Educational" },
  ],
  business: [
    { title: "Business Strategy Fundamentals", url: "https://www.youtube.com/results?search_query=business+strategy+fundamentals+tutorial", channel: "Educational" },
    { title: "Marketing Basics", url: "https://www.youtube.com/results?search_query=marketing+basics+tutorial", channel: "Educational" },
    { title: "Entrepreneurship Overview", url: "https://www.youtube.com/results?search_query=entrepreneurship+overview+tutorial", channel: "Educational" },
    { title: "Operations Management", url: "https://www.youtube.com/results?search_query=operations+management+tutorial", channel: "Educational" },
  ],
  environmental: [
    { title: "Environmental Science Basics", url: "https://www.youtube.com/results?search_query=environmental+science+basics+tutorial", channel: "Educational" },
    { title: "Climate Change Explained", url: "https://www.youtube.com/results?search_query=climate+change+explained+tutorial", channel: "Educational" },
    { title: "Sustainability Practices", url: "https://www.youtube.com/results?search_query=sustainability+practices+tutorial", channel: "Educational" },
    { title: "Ecosystems and Biodiversity", url: "https://www.youtube.com/results?search_query=ecosystems+biodiversity+tutorial", channel: "Educational" },
  ],
  default: [
    { title: "Khan Academy Tutorials", url: "https://www.youtube.com/c/khanacademy", channel: "Khan Academy" },
    { title: "Crash Course Overview", url: "https://www.youtube.com/c/crashcourse", channel: "Crash Course" },
    { title: "Search Related Topics", url: "https://www.youtube.com/results?search_query=educational+tutorials", channel: "YouTube" },
  ],
};

function extractKeywords(text: string): string[] {
  if (!text) return [];
  const t = text.toLowerCase();
  const keywords: string[] = [];

  // Cryptography keywords
  if (/(crypto|encryption|decryption|cipher|rsa|aes|hash|signature|blockchain|bitcoin|public.key|private.key|symmetric|asymmetric)/.test(t)) {
    keywords.push("cryptography");
  }

  // Computer Science keywords
  if (/(algorithm|data.structure|tree|graph|array|linked.list|stack|queue|sort|search|dynamic.programming|programming|code|developer|software|database|sql)/.test(t)) {
    keywords.push("computerscience");
  }

  // Physics keywords
  if (/(force|kinematic|motion|mechanics|newton|velocity|acceleration|momentum|energy|gravity|wave|light|sound|electromagnetic)/.test(t)) {
    keywords.push("physics");
  }

  // Chemistry keywords
  if (/(organic|inorganic|stoichiometry|reaction|mole|acid|base|titration|bonding|atom|molecule|redox|oxidation|reduction|compound|element)/.test(t)) {
    keywords.push("chemistry");
  }

  // Mathematics keywords
  if (/(integral|derivative|calculus|algebra|matrix|trigonometry|limit|sine|cosine|tangent|equation|function|logarithm|probability|statistics)/.test(t)) {
    keywords.push("mathematics");
  }

  // Biology keywords
  if (/(cell|dna|gene|genetics|ecology|evolution|photosynthesis|mitochondria|protein|enzyme|organism|tissue|anatomy|physiology)/.test(t)) {
    keywords.push("biology");
  }

  return Array.from(new Set(keywords));
}

export function generateYoutubeVideosFromContent(
  content: string | null | undefined,
  subjectHint?: string,
  topicHint?: string,
): VideoItem[] {
  const text = content || "";
  const kws = extractKeywords(text);

  // If topicHint is provided, prefer it first. Use exact category match, otherwise generate a YouTube search result for the topic.
  if (topicHint && topicHint.trim().length > 0) {
    const tKey = topicHint.toLowerCase().replace(/\s+/g, "").trim();
    // If topic maps to a category in our DB, return that
    if (VIDEO_DB[tKey]) {
      return VIDEO_DB[tKey].slice(0, 5);
    }
    // Otherwise return a YouTube search result for the topic (useful when topic is specific)
    const searchUrl = `https://www.youtube.com/results?search_query=${encodeURIComponent(topicHint + ' tutorial')}`;
    return [
      { title: `Search: ${topicHint} tutorials`, url: searchUrl, channel: 'YouTube' },
    ];
  }

  // Normalize subject hint
  const normalizedHint = subjectHint ? subjectHint.toLowerCase().replace(/\s+/g, "").trim() : "";

  // If no useful subject hint, attempt a lightweight topic override for common domains based on keywords
  if (!normalizedHint || normalizedHint === "general" || normalizedHint === "unknown") {
    // Cryptography-specific quick check (high-priority)
    if (/(crypto|cryptography|encryption|decryption|cipher|rsa|aes|hash|signature|blockchain|bitcoin|public key|private key|symmetric|asymmetric|plaintext|ciphertext)/i.test(text)) {
      return VIDEO_DB.cryptography.slice(0, 5);
    }
    // Computer science quick check
    if (/(algorithm|data structure|tree|graph|array|linked list|stack|queue|sort|search|dynamic programming|programming|code|software|database|sql)/i.test(text)) {
      return VIDEO_DB.computerscience.slice(0, 5);
    }
  }

  // If subject hint is provided and matches a category, prioritize it exclusively
  if (normalizedHint && normalizedHint.length > 0) {
    const key = normalizedHint;
    if (VIDEO_DB[key]) {
      return VIDEO_DB[key].slice(0, 5);
    }
  }

  // If we have keyword categories, collate videos from those categories
  const results: VideoItem[] = [];
  for (const kw of kws) {
    if (VIDEO_DB[kw]) {
      VIDEO_DB[kw].forEach((v) => results.push(v));
    }
  }

  // If none found, try subject hint (as fallback using normalized key)
  if (results.length === 0 && subjectHint) {
    const key = subjectHint.toLowerCase().replace(/\s+/g, "").trim();
    if (VIDEO_DB[key]) results.push(...VIDEO_DB[key]);
  }

  // Fallback to default
  if (results.length === 0) results.push(...VIDEO_DB.default);

  // Return up to 5 unique videos - shuffle to get variety
  const uniq: VideoItem[] = [];
  const seen = new Set<string>();

  // Shuffle results to get variety
  const shuffled = results.sort(() => Math.random() - 0.5);

  for (const v of shuffled) {
    if (!seen.has(v.url)) {
      uniq.push(v);
      seen.add(v.url);
    }
    if (uniq.length >= 5) break;
  }

  return uniq;
}

export default generateYoutubeVideosFromContent;
