const fs = require('fs');
const path = require('path');

const institutes = [
  { id: 'north', dir: 'rvpu-north-chatbot', name: 'RV PU College North' },
  { id: 'south', dir: 'rvpu-south-chatbot', name: 'RV PU College South' },
  { id: 'ecity', dir: 'rvpu-ecity-chatbot', name: 'RV PU College Electronic City' },
  { id: 'harohalli', dir: 'rvpu-harohalli-chatbot', name: 'RV PU College Harohalli' },
  { id: 'ssmrvpu', dir: 'ssmrvpu-chatbot', name: 'SSMRV PU College' },
  { id: 'nmkrvpu', dir: 'nmkrvpu-chatbot', name: 'NMKRV PU College for Women' },
  { id: 'mysore', dir: 'rvpu-mysore-chatbot', name: 'RV PU College Mysuru' }
];

const sharedCampusCards = [
  {
    id: 'ssmrv',
    title: 'SSMRV',
    location: 'Jayanagar 4th T Block, Bengaluru',
    streams: ['Science', 'Commerce'],
    url: 'https://ssmrvpu.edu.in/new_ssmrvpu/'
  },
  {
    id: 'nmkrv',
    title: 'NMKRV',
    location: 'Jayanagar 3rd Block, Bengaluru',
    streams: ['Science', 'Commerce'],
    url: 'https://www.nmkrvpu.edu.in/new_nmkrvpu/'
  },
  {
    id: 'rv_harohalli',
    title: 'RVPU Harohalli',
    location: 'Kanakapura Road, Harohalli',
    streams: ['Science', 'Commerce'],
    url: 'https://hrh.rvpucollege.edu.in/'
  },
  {
    id: 'rv_north',
    title: 'RVPU North',
    location: 'DPS Campus, Yelahanka / Bagalur',
    streams: ['Science', 'Commerce'],
    url: 'https://north.rvpucollege.edu.in/'
  },
  {
    id: 'rv_south',
    title: 'RVPU South',
    location: 'Jayanagar / RV Road, Bengaluru',
    streams: ['Science', 'Commerce'],
    url: 'https://south.rvpucollege.edu.in/'
  },
  {
    id: 'rv_ecity',
    title: 'RVPU E-City',
    location: 'Electronics City, Bengaluru',
    streams: ['Science', 'Commerce'],
    url: 'https://ecity.rvpucollege.edu.in/'
  },
  {
    id: 'rv_mysore',
    title: 'RVPU Mysuru',
    location: 'Vijayanagar, Mysuru',
    streams: ['Science', 'Commerce'],
    url: 'https://mys.rvpucollege.edu.in/'
  }
];

const courseSpecs = {
  PCMB: {
    title: 'PCMB (Physics, Chemistry, Mathematics, Biology)',
    keywords: ['pcmb', 'physics chemistry maths biology', 'biology combination', 'medical stream', 'neet course', 'neet batch', 'neet coaching', 'doctor course', 'biology'],
    career: 'Medical (MBBS, BDS, BAMS), Biotechnology, Pure Sciences (Research, B.Sc), Agricultural Sciences, Veterinary Science, and Engineering.',
    prep: 'Comprehensive Karnataka PU Board syllabus paired with integrated NEET & KCET coaching, test series, and laboratory practicals.'
  },
  PCMC: {
    title: 'PCMC (Physics, Chemistry, Mathematics, Computer Science)',
    keywords: ['pcmc', 'physics chemistry maths computer science', 'computer science combination', 'cs stream', 'coding stream', 'engineering combination', 'jee course', 'computer science'],
    career: 'Engineering (Computer Science, AI & ML, Robotics, Electronics, Mechanical), BCA, Data Science, and IT careers.',
    prep: 'Specialized coaching for JEE Main, JEE Advanced & KCET alongside advanced computer laboratory training in C++, Python, and algorithm design.'
  },
  SEBA: {
    title: 'SEBA (Statistics, Economics, Business Studies, Accountancy)',
    keywords: ['seba', 'statistics economics business accountancy', 'seba combination', 'commerce without maths'],
    career: 'Chartered Accountancy (CA Foundation), CS, Corporate Law, Business Management, Financial Analysis, and B.Com / BBA.',
    prep: 'Extensive business acumen, balance sheet analysis, and statistical decision-making for corporate careers.'
  },
  CEBA: {
    title: 'CEBA (Computer Science, Economics, Business Studies, Accountancy)',
    keywords: ['ceba', 'computer science economics business accountancy', 'ceba combination', 'commerce with computer science'],
    career: 'FinTech, E-Commerce, Business Analytics, BCA, Corporate Accounting, and Information Systems Management.',
    prep: 'Unites digital technology and software systems with financial accounting and economic theory.'
  },
  MEBA: {
    title: 'MEBA (Basic Mathematics, Economics, Business Studies, Accountancy)',
    keywords: ['meba', 'basic maths economics business accountancy', 'meba combination'],
    career: 'Actuarial Science, Banking & Insurance, Financial Economics, Corporate Accounting, and BBA / MBA.',
    prep: 'Quantitative mathematical problem-solving applied to macroeconomic principles and financial reporting.'
  },
  PEBA: {
    title: 'PEBA (Political Science, Economics, Business Studies, Accountancy)',
    keywords: ['peba', 'political science economics business accountancy', 'peba combination'],
    career: 'Civil Services (UPSC / KPSC), Corporate Law, Public Administration, Economic Journalism, and International Business.',
    prep: 'In-depth grounding in political institutions, macroeconomic policy, commercial law, and business accounting.'
  },
  BAMS: {
    title: 'BAMS (Business Studies, Accountancy, Basic Maths, Statistics)',
    keywords: ['bams', 'basic maths statistics', 'business accountancy basic maths statistics', 'bams combination'],
    career: 'Chartered Accountancy (CA), Company Secretary (CS), Cost Management (CMA), Actuarial Science, and Data Analytics.',
    prep: 'Combines commercial foundations with quantitative statistical modeling and accounting techniques.'
  },
  BAME: {
    title: 'BAME (Business Studies, Accountancy, Basic Maths, Economics)',
    keywords: ['bame', 'basic maths economics', 'business accountancy basic maths economics', 'bame combination'],
    career: 'Banking & Financial Markets, Economic Consulting, Investment Research, Corporate Accounting, and MBA.',
    prep: 'Balances micro/macro economic theory with practical accounting and mathematics.'
  }
};

const rvlhTracks = [
  {
    id: 'course_jee_adv',
    title: 'JEE Advanced (Main + KCET Decoded) + PU Board',
    keywords: [
      'jee advanced', 'jee adv', 'iit jee', 'jee advanced decoded', 'iit coaching',
      'jee advanced main kcet decoded pu board', 'jee advanced course'
    ],
    weight: 4.8,
    summary: 'A high-intensity national preparatory track engineered to secure top ranks in JEE Advanced for premier IITs, along with top scores in JEE Main and KCET for RV College of Engineering (RVCE).',
    campuses: [
      'RV PU North, Bengaluru',
      'RV PU South, Bengaluru',
      'RV PU College, Mysuru',
      'RV PU College, Electronic City',
      'NMKRV PU College, Bengaluru'
    ]
  },
  {
    id: 'course_jee_main',
    title: 'JEE (Main + KCET Decoded) + PU Board',
    keywords: [
      'jee main', 'jee', 'kcet decoded', 'jee kcet', 'engineering entrance',
      'jee coaching', 'jee main kcet decoded pu board', 'jee main course'
    ],
    weight: 4.8,
    summary: 'Dual-focus curriculum balancing 98%+ distinction in Karnataka PU Board exams with a 99+ percentile in JEE Main for premier NITs/IIITs and top ranks in KCET.',
    campuses: [
      'NMKRV PU College, Bengaluru',
      'SSMRV PU College, Bengaluru',
      'RV PU College North, Bengaluru',
      'RV PU College South, Bengaluru',
      'RV PU College, Electronic City',
      'RV PU College, Harohalli',
      'RV PU College, Mysuru',
      'VVN PU College, Bengaluru'
    ]
  },
  {
    id: 'course_neet_ug',
    title: 'NEET UG + KCET + PU Board',
    keywords: [
      'neet', 'neet ug', 'neet coaching', 'medical entrance', 'doctor entrance',
      'neet kcet pu board', 'neet decoded', 'mbbs coaching', 'neet ug kcet pu board'
    ],
    weight: 4.8,
    summary: 'Medical entrance mastery focusing on 100% NCERT line-by-line dissection for Biology, Chemistry, and Physics, paired with weekly OMR simulation drills for top government medical colleges (AIIMS, JIPMER, BMCRI).',
    campuses: [
      'RV PU North, Bengaluru',
      'RV PU South, Bengaluru',
      'SSMRV PU College, Bengaluru',
      'NMKRV PU College, Bengaluru',
      'RV PU College, Harohalli',
      'RV PU College, Electronic City',
      'RV PU College, Mysuru',
      'VVN PU College, Bengaluru'
    ]
  },
  {
    id: 'course_commerce_decoded',
    title: 'Commerce Decoded Programme (Commerce + CA + CLAT + PU Board)',
    keywords: [
      'commerce decoded', 'commerce decoded programme', 'ca', 'clat', 'commerce ca clat pu board',
      'ca foundation', 'clat coaching', 'ca coaching', 'law entrance', 'commerce ca clat'
    ],
    weight: 4.8,
    summary: 'Karnataka premier integrated commerce track uniting Karnataka PU Board with direct CA Foundation (ICAI), Common Law Admission Test (CLAT), and CUET mastery led by practicing Chartered Accountants and legal veterans.',
    campuses: [
      'RV PU North, Bengaluru',
      'RV PU South, Bengaluru',
      'SSMRV PU College, Bengaluru',
      'NMKRV PU College, Bengaluru',
      'RV PU College, Harohalli',
      'RV PU College, Electronic City',
      'RV PU College, Mysuru'
    ]
  }
];

function buildInstituteKnowledgeBase(data, inst) {
  const shortName = data.institute.shortName || data.institute.name;
  const fullName = data.institute.name;
  const address = data.institute.address;
  const phones = Array.isArray(data.institute.phone) ? data.institute.phone.join(', ') : data.institute.phone;
  const email = data.institute.email;
  const timings = data.institute.timings || 'Monday – Saturday: 9:00 AM – 5:00 PM';
  const website = data.institute.website;
  const principalName = (data.leadership && data.leadership.principal) ? data.leadership.principal.name : 'Principal';
  const pages = data.pages || {};

  const admissionSteps = (data.admissions && data.admissions.process) ? data.admissions.process.map((p, i) => `${i + 1}. ${p}`).join('\n') : '';
  const docsList = (data.admissions && data.admissions.required_documents) ? data.admissions.required_documents.map(d => `• ${d}`).join('\n') : '';
  const facilitiesList = (data.facilities && data.facilities.items) ? data.facilities.items.map(f => `• ${f}`).join('\n') : '';

  const combinations = data.courses.combinations || [];
  const scienceCombos = combinations.filter(c => c.stream === 'Science').map(c => `• **${c.code}**: ${c.subjects}`).join('\n');
  const commerceCombos = combinations.filter(c => c.stream === 'Commerce').map(c => `• **${c.code}**: ${c.subjects}`).join('\n');
  const compulsoryLang = data.courses.languages ? data.courses.languages.compulsory : 'English';
  const secondLangs = data.courses.languages ? data.courses.languages.second_language_options.join(', ') : 'Kannada, Hindi, Sanskrit';

  const kb = [
    {
      id: 'greeting',
      category: 'general',
      title: 'Greetings & Welcome',
      keywords: ['hi', 'hello', 'hey', 'namaste', 'good morning', 'good afternoon', 'good evening', 'start', 'help', 'menu', 'vanakkam'],
      weight: 1.0,
      answer: `Hello and welcome! 👋 I am the official AI Assistant for **${fullName}**.\n\nWhether you are exploring our academic combinations, inquiring about admissions post-SSLC, learning about our Principal, or exploring our 7 sister campuses, I'm here to guide you!\n\nHow may I assist you today?`,
      quickChips: ['About Us', 'Our Courses', 'Our Campuses', 'Facilities', 'Contact Us', 'Events']
    },
    {
      id: 'principal',
      category: 'about',
      title: 'Principal & Leadership Desk',
      keywords: [
        'princi', 'principal', 'who is principal', 'principal sir', 'principal mam', 'principal name',
        'head of college', 'headmaster', 'head of the institution', 'who heads', 'who leads', 'leadership team',
        principalName.toLowerCase(), principalName.toLowerCase().replace(/^(mr\.|mrs\.|dr\.)\s*/, '')
      ],
      weight: 4.5,
      answer: `Certainly! Let me introduce our college leadership.\n\n👨‍🏫 **Principal of ${fullName}**:\nOur college is headed by our respected Principal, **${principalName}**.\n\nUnder visionary academic leadership, ${shortName} emphasizes disciplined academic rigor, integrated entrance coaching (NEET, JEE, KCET, CA Foundation), personal mentoring, and holistic student growth.\n\nWould you like to read the Principal's message, view faculty details, or explore our academic courses?`,
      quickChips: ['About Us', 'Our Courses', 'Our Campuses', 'Facilities', 'Contact Us'],
      navigation: { label: "View Principal's Profile", url: pages.principal || pages.about || website }
    },
    {
      id: 'about_us',
      category: 'about',
      title: 'About Us & Management Trust',
      keywords: ['about us', 'about', 'about college', 'who are you', 'tell me about college', 'college info', 'overview', 'history', 'management', 'trust', 'rsst', 'rvei', 'shyam', 'murthy', 'nagaraj'],
      weight: 3.5,
      answer: `I'd be delighted to tell you about our rich heritage!\n\n🏛️ **About ${fullName}**:\n${shortName} is a premier Pre-University institution managed by the renowned **Rashtreeya Sikshana Samithi Trust (RSST)**, upholding over 80+ years of educational excellence. Affiliated with the Karnataka Pre-University Education Board (DPUE), the college is recognized for delivering outstanding board results, integrated entrance coaching, and state-of-the-art facilities.\n\n👨‍🏫 **Key Leadership**:\n• **Principal**: **${principalName}**\n• **RSST President**: Dr. M.P. Shyam\n• **Hon. Secretary (RSST)**: Dr. (h.c.) A.V.S. Murthy\n• **Hon. Joint Secretary**: Mr. D.P. Nagaraj\n• **Director, RV Learning Hub**: Mr. Mayur Goyal`,
      quickChips: ['Principal', 'Our Courses', 'Our Campuses', 'Facilities', 'Contact Us'],
      navigation: { label: 'Visit Official About Us Page', url: pages.about || website }
    },
    {
      id: 'all_campuses',
      category: 'campuses',
      title: 'Our Campuses Across Karnataka',
      keywords: [
        'our campuses', 'campuses', 'campus', 'all campuses', 'other campuses', 'sister campuses',
        'other colleges', 'branches', 'locations', 'rv colleges', 'rv campuses', 'sister institutions',
        'list of campuses', 'all rv colleges', 'where are your campuses', 'show campuses'
      ],
      weight: 4.5,
      answer: `I'd love to introduce you to our wider educational family! 🏛️\n\nUnder the prestigious Rashtreeya Sikshana Samithi Trust (RSST), RV operates 7 premier Pre-University campuses across Karnataka. Swipe through the cards below to explore each campus:`,
      cardsType: 'campus_list',
      campusCards: sharedCampusCards,
      quickChips: ['Our Courses', 'Facilities', 'Admissions', 'Contact Us']
    },
    {
      id: 'courses_all',
      category: 'academics',
      title: 'Our Courses and Combinations Offered',
      keywords: ['our courses', 'courses', 'course', 'combinations', 'combination', 'streams', 'stream', 'subjects', 'academic programs', 'programs offered', 'what courses'],
      weight: 3.5,
      answer: `We offer a comprehensive selection of Pre-University programs! Here is the complete breakdown of our streams, subjects, and integrated entrance tracks:\n\n🎓 **Academic Courses & Combinations at ${shortName}**:\n**Duration**: 2 Academic Years (I PUC & II PUC)\n**Medium of Instruction**: English (Board exams can be answered in English or Kannada)\n\n**🔬 Science Stream**:\n${scienceCombos || '• PCMB: Physics, Chemistry, Mathematics, Biology\n• PCMC: Physics, Chemistry, Mathematics, Computer Science'}\n\n${commerceCombos ? `**📊 Commerce Stream**:\n${commerceCombos}\n\n` : ''}**🗣️ Languages**:\n• Compulsory: ${compulsoryLang}\n• Second Language Options: ${secondLangs}\n\n---\n\n🚀 **RV Learning Hub (RVLH) Integrated Programmes**:\n• **JEE Advanced (Main + KCET Decoded) + PU Board**\n• **JEE (Main + KCET Decoded) + PU Board**\n• **NEET UG + KCET + PU Board**\n• **Commerce Decoded Programme (Commerce + CA + CLAT + PU Board)**`,
      quickChips: combinations.map(c => c.code).concat(['JEE Advanced', 'JEE Main', 'NEET UG', 'Commerce Decoded', 'Our Campuses']),
      navigation: { label: 'Explore Our Courses Page', url: pages.courses || website }
    }
  ];

  // Add individual combinations
  combinations.forEach(combo => {
    const code = combo.code.toUpperCase();
    const spec = courseSpecs[code] || {
      title: `${code} (${combo.stream} Stream)`,
      keywords: [code.toLowerCase(), combo.subjects.toLowerCase()],
      career: 'Higher education and professional certifications in related disciplines.',
      prep: 'Intensive Karnataka PU Board curriculum coverage with experienced faculty.'
    };

    kb.push({
      id: `course_${code.toLowerCase()}`,
      category: 'academics',
      title: spec.title,
      keywords: spec.keywords,
      weight: 4.5,
      answer: `That's a wonderful academic choice! Here is what you need to know about this combination:\n\n🎓 **${code} (${combo.stream} Stream) at ${shortName}**:\n\n• **Core Subjects**: ${combo.subjects}\n• **Compulsory Language**: ${compulsoryLang} | **Second Language**: ${secondLangs}\n• **Career Avenues**: ${spec.career}\n• **Integrated Competitive Prep**: ${spec.prep}`,
      quickChips: ['Our Courses', 'Our Campuses', 'Admissions', 'Contact Us'],
      navigation: { label: `Explore ${combo.stream} Combinations`, url: pages.courses || website }
    });
  });

  // Add RVLH Integrated Decoded Tracks
  rvlhTracks.forEach(track => {
    const campusBullets = track.campuses.map(c => `• ${c}`).join('\n');
    let introPhrase = "I'd be glad to share the details on this engineering track! 🚀";
    if (track.id.includes('neet')) {
      introPhrase = "Great ambition! Becoming a doctor requires dedicated focus, and this program is built specifically for that journey. Here are the details:";
    } else if (track.id.includes('commerce')) {
      introPhrase = "I'm delighted you asked! Commerce Decoded is an exceptional stepping stone for finance, chartered accountancy, and corporate law. Here are the program highlights:";
    } else if (track.id.includes('jee_main')) {
      introPhrase = "Certainly! This is one of our most popular integrated engineering pathways, perfectly synchronized with PU Board studies. Here are the full details:";
    }

    kb.push({
      id: track.id,
      category: 'academics',
      title: track.title,
      keywords: track.keywords,
      weight: track.weight,
      answer: `${introPhrase}\n\n🎯 **${track.title}**:\n\n${track.summary}\n\n📍 **Course available at**:\n${campusBullets}`,
      quickChips: ['Our Courses', 'Our Campuses', 'Admissions', 'Contact Us'],
      navigation: { label: 'Explore Academic Programmes', url: pages.courses || website }
    });
  });

  // Science stream overview
  kb.push({
    id: 'courses_science',
    category: 'academics',
    title: 'Science Stream Overview',
    keywords: ['science', 'science stream', 'physics', 'chemistry', 'maths', 'mathematics', 'neet', 'jee', 'kcet', 'engineering', 'medical'],
    weight: 2.5,
    answer: `Great question! Science at ${shortName} opens diverse doors in engineering, medicine, pure research, and technology:\n\n🔬 **Science Stream Combinations at ${shortName}**:\n\n${scienceCombos}\n\nAll science programs feature intensive laboratory practicals and integrated competitive exam coaching (NEET / JEE / KCET).`,
    quickChips: ['PCMB', 'PCMC', 'Our Courses', 'Our Campuses', 'Facilities'],
    navigation: { label: 'Explore Science Courses', url: pages.courses || website }
  });

  // Commerce stream overview
  if (commerceCombos) {
    kb.push({
      id: 'courses_commerce',
      category: 'academics',
      title: 'Commerce Stream Overview',
      keywords: ['commerce', 'commerce stream', 'business studies', 'accountancy', 'economics', 'statistics', 'ca', 'cs', 'finance', 'cma'],
      weight: 2.5,
      answer: `Certainly! Our Commerce department is renowned for creating future business leaders and finance professionals:\n\n📊 **Commerce Stream Combinations at ${shortName}**:\n\n${commerceCombos}\n\nThese combinations build an exceptional foundation for CA Foundation, Company Secretaryship (CS), BBA/MBA, and corporate finance.`,
      quickChips: combinations.filter(c => c.stream === 'Commerce').map(c => c.code).concat(['Our Campuses']),
      navigation: { label: 'Explore Commerce Courses', url: pages.courses || website }
    });
  }

  // Languages
  kb.push({
    id: 'languages',
    category: 'academics',
    title: 'Language Options',
    keywords: ['language', 'languages', 'second language', 'kannada', 'hindi', 'sanskrit', 'french', 'english', 'medium'],
    weight: 2.0,
    answer: `Here are the language choices offered at our campus:\n\n🗣️ **Language Options at ${shortName}**:\n\n• **Part I (Compulsory)**: ${compulsoryLang}\n• **Part II (Second Language Choice)**: ${secondLangs}\n\nMedium of instruction is English, while students are permitted to answer public examinations in either English or Kannada per DPUE regulations.`,
    quickChips: ['Our Courses', 'Our Campuses', 'Facilities', 'Contact Us']
  });

  // Faculty if available
  if (data.faculty && Array.isArray(data.faculty.teaching_staff) && data.faculty.teaching_staff.length > 0) {
    const facultyList = data.faculty.teaching_staff.map(f => `• **${f.subject}**: ${f.name}`).join('\n');
    kb.push({
      id: 'faculty',
      category: 'academics',
      title: 'Faculty & Teaching Staff',
      keywords: ['faculty', 'teachers', 'lecturers', 'staff', 'teaching staff', 'professors', 'who teaches', 'mentors', 'lecturer'],
      weight: 4.0,
      answer: `Our experienced educators are the backbone of student success! Here is our teaching team:\n\n👨‍🏫 **Distinguished Faculty at ${shortName}**:\n\n${facultyList}`,
      quickChips: ['Principal', 'Our Courses', 'Our Campuses', 'Contact Us'],
      navigation: { label: 'View Faculty Directory', url: pages.faculty || website }
    });
  }

  // Admissions
  kb.push({
    id: 'admissions_process',
    category: 'admissions',
    title: 'Admission Procedure & Steps',
    keywords: ['admission', 'admissions', 'apply', 'application', 'how to apply', 'procedure', 'process', 'enroll', 'seat', 'registration', 'form', 'dates'],
    weight: 2.5,
    answer: `We would love to welcome you to our college family! Here is how our admission process works:\n\n📝 **Admission Procedure at ${shortName}**:\n\n${admissionSteps}\n\n💡 **Helpful Tip**: Admissions commence immediately following the declaration of Class 10 / SSLC board exam results. We advise applying early as seats are allotted on merit and first-come, first-served basis.`,
    quickChips: ['Required Documents', 'Eligibility Cutoff', 'Our Courses', 'Our Campuses'],
    navigation: { label: 'Open Admission Portal', url: pages.admissions || website }
  });

  kb.push({
    id: 'admissions_documents',
    category: 'admissions',
    title: 'Required Documents for Admission',
    keywords: ['documents', 'required documents', 'certificates', 'marksheet', 'marks card', 'tc', 'transfer certificate', 'aadhaar', 'caste certificate', 'income certificate', 'photographs', 'eligibility certificate'],
    weight: 2.5,
    answer: `To make your admission verification seamless, please keep these documents ready:\n\n📄 **Documents Required for Admission at ${shortName}**:\n\n${docsList}\n\n*Note*: Ensure you bring the original certificates along with at least 3 attested photocopies for verification during counseling.`,
    quickChips: ['Admission Process', 'Eligibility Cutoff', 'Our Courses', 'Our Campuses']
  });

  kb.push({
    id: 'eligibility_cutoff',
    category: 'admissions',
    title: 'Eligibility & Cutoff Criteria',
    keywords: ['eligibility', 'cutoff', 'cut off', 'cut-off', 'percentage', 'marks', 'minimum marks', 'criteria', 'sslc percentage', 'pass marks'],
    weight: 2.5,
    answer: `Here is the eligibility and passing criteria you should know:\n\n🎯 **Eligibility & Cutoff Criteria**:\n\n• **Eligibility**: Candidates who have successfully cleared SSLC / ICSE / CBSE / 10th Standard or equivalent board.\n• **Cutoff Announcement**: Cutoffs are finalized upon declaration of 10th board results and displayed on the college notice board & website.\n• **Promotion Criteria (I PUC to II PUC)**: Minimum 30% marks in each individual subject and 35% overall aggregate in district-level promotional exams.`,
    quickChips: ['Admission Process', 'Our Courses', 'Our Campuses', 'Contact Us']
  });

  // Facilities
  kb.push({
    id: 'facilities',
    category: 'campus',
    title: 'Campus Facilities & Infrastructure',
    keywords: ['facilities', 'facility', 'infrastructure', 'labs', 'laboratory', 'library', 'sports', 'playground', 'auditorium', 'smart class', 'classrooms', 'gym', 'canteen', 'amenities'],
    weight: 3.5,
    answer: `I'd love to tell you about our campus environment! We provide state-of-the-art infrastructure for learning, sports, and overall growth:\n\n🏫 **Campus Facilities at ${shortName}**:\n\n${facilitiesList}\n\nOur campus is designed to foster both academic rigour and all-round holistic development with world-class facilities.`,
    quickChips: ['Our Courses', 'Our Campuses', 'Contact Us', 'Events'],
    navigation: { label: 'Explore Facilities Page', url: pages.facilities || website }
  });

  // Contact
  kb.push({
    id: 'contact_location',
    category: 'contact',
    title: 'Contact Us & Campus Location',
    keywords: ['contact us', 'contact', 'contacts', 'address', 'phone', 'telephone', 'mobile', 'call', 'email', 'location', 'where', 'timings', 'hours', 'working hours', 'map', 'directions', 'reach', 'helpline', 'office'],
    weight: 3.5,
    answer: `We are always happy to connect with students and parents! You can reach us or visit our admissions office here:\n\n📍 **Contact Us — ${shortName}**\n\n• **Campus Address**:\n  ${address}\n• **Phone / Helpline**: ${phones}\n• **Email**: ${email}\n• **Office Working Hours**: ${timings}\n• **Official Website**: ${website}`,
    quickChips: ['Our Campuses', 'Our Courses', 'Facilities', 'Events'],
    navigation: { label: 'Open Contact Us Page', url: pages.contact || website }
  });

  // Events
  kb.push({
    id: 'events',
    category: 'campus',
    title: 'College Events & Student Activities',
    keywords: ['events', 'event', 'activities', 'activity', 'cultural', 'cultural fest', 'fest', 'fests', 'annual day', 'sports day', 'functions', 'celebrations', 'seminars', 'workshops', 'calendar', 'competitions', 'youth festival'],
    weight: 3.5,
    answer: `Life at ${shortName} is filled with energy, talent, and excitement! Here are some of our major annual events and activities:\n\n🎉 **College Events & Activities at ${shortName}**:\n\n• **Annual Cultural Fest & Talent Day**: Grand celebration of student talent in music, dance, theatre, and creative arts.\n• **Annual Athletic Meet & Sports Day**: Inter-house track and field events, cricket, volleyball, basketball, and indoor tournaments.\n• **Science Seminars & Tech Exhibitions**: Hands-on laboratory project displays, model making, and interactive sessions with eminent academicians.\n• **National Celebrations**: Patriotic celebrations of Independence Day, Republic Day, and Kannada Rajyotsava.\n• **Student Enrichment & Leadership Activities**: Career counseling, personality development workshops, and active student club initiatives.`,
    quickChips: ['Our Courses', 'Our Campuses', 'Facilities', 'Contact Us'],
    navigation: { label: 'View College Events Page', url: pages.events || website }
  });

  // Direct Website Navigation
  kb.push({
    id: 'website_navigation',
    category: 'navigation',
    title: 'Website Direct Page Navigation',
    keywords: ['website', 'navigation', 'navigate', 'link', 'portal', 'home page', 'open', 'go to', 'take me', 'redirect', 'visit', 'browse'],
    weight: 2.0,
    answer: `🧭 **Direct Navigation Directory for ${shortName}**:\n\nClick any of the destination links below to jump directly to that section of our website:`,
    navigationMenu: [
      { title: '🏠 Home Page', url: pages.home || website },
      { title: '📖 About Us', url: pages.about || website },
      { title: '🎓 Our Courses', url: pages.courses || website },
      { title: '🏛️ Facilities', url: pages.facilities || website },
      { title: '🎉 Events', url: pages.events || website },
      { title: '📞 Contact Us', url: pages.contact || website }
    ],
    quickChips: ['About Us', 'Our Courses', 'Our Campuses', 'Facilities', 'Contact Us', 'Events']
  });

  return kb;
}

function buildKeywordsTable(knowledgeBase) {
  const keywordMap = {};
  for (const item of knowledgeBase) {
    for (const kw of item.keywords) {
      const cleanKw = kw.toLowerCase().trim();
      if (!keywordMap[cleanKw]) {
        keywordMap[cleanKw] = [];
      }
      keywordMap[cleanKw].push({ id: item.id, weight: item.weight });
    }
  }
  return keywordMap;
}

function generateEngineCode(instId, instName, instShort, brandColors, kb, keywords) {
  const embeddedKB = JSON.stringify(kb);
  const embeddedKW = JSON.stringify(keywords);
  const colorsStr = JSON.stringify(brandColors);

  return `/**
 * RVPU Intelligent Chatbot Engine — ${instName}
 * Dual-write compatible, TF-IDF weighted scoring, intent matching, website navigation & telemetry.
 */
(function(window) {
  'use strict';

  const INST_ID = '${instId}';
  const INST_NAME = ${JSON.stringify(instName)};
  const INST_SHORT = ${JSON.stringify(instShort)};
  const BRAND_COLORS = ${colorsStr};
  const DEFAULT_KB = ${embeddedKB};
  const DEFAULT_KW = ${embeddedKW};

  // Common stop words to filter
  const STOP_WORDS = new Set([
    'a', 'an', 'the', 'is', 'are', 'was', 'were', 'in', 'on', 'at', 'to', 'for', 'of', 'with',
    'by', 'about', 'like', 'through', 'over', 'before', 'between', 'after', 'since', 'without',
    'under', 'within', 'along', 'following', 'across', 'behind', 'beyond', 'plus', 'except',
    'but', 'up', 'out', 'around', 'down', 'off', 'above', 'near', 'i', 'you', 'he', 'she',
    'it', 'we', 'they', 'what', 'which', 'who', 'whom', 'this', 'that', 'these', 'those',
    'am', 'been', 'being', 'have', 'has', 'had', 'do', 'does', 'did', 'can', 'could', 'should',
    'would', 'may', 'might', 'must', 'tell', 'me', 'please', 'know', 'want', 'give', 'college', 'rv', 'pu', 'rvpu'
  ]);

  class ChatbotEngine {
    constructor(knowledgeBase, keywordMap) {
      this.kb = knowledgeBase || DEFAULT_KB;
      this.keywordMap = keywordMap || DEFAULT_KW;
      this.history = [];
    }

    tokenize(text) {
      if (!text) return [];
      return text
        .toLowerCase()
        .replace(/[^a-z0-9\\s]/g, ' ')
        .split(/\\s+/)
        .filter(token => token.length > 1 && !STOP_WORDS.has(token));
    }

    match(userQuery) {
      const raw = (userQuery || '').toLowerCase().trim();
      if (!raw) {
        return this.getDefaultResponse();
      }

      // Check direct navigation commands
      const navMatch = this.detectNavigationIntent(raw);
      if (navMatch) {
        return navMatch;
      }

      const tokens = this.tokenize(raw);
      const scores = new Map();

      // Initialize scores
      this.kb.forEach(item => scores.set(item.id, 0));

      // 1. Phrase / exact substring match boost
      this.kb.forEach(item => {
        for (const kw of item.keywords) {
          if (raw === kw) {
            scores.set(item.id, scores.get(item.id) + (item.weight * 5.0));
          } else if (raw.includes(kw)) {
            scores.set(item.id, scores.get(item.id) + (item.weight * 2.5));
          }
        }
      });

      // 2. Token / keyword occurrence scoring
      tokens.forEach(token => {
        if (this.keywordMap[token]) {
          this.keywordMap[token].forEach(entry => {
            scores.set(entry.id, scores.get(entry.id) + (entry.weight * 1.5));
          });
        }

        // Fuzzy prefix match
        Object.keys(this.keywordMap).forEach(kw => {
          if (kw.length >= 4 && (token.startsWith(kw) || kw.startsWith(token))) {
            this.keywordMap[kw].forEach(entry => {
              scores.set(entry.id, scores.get(entry.id) + (entry.weight * 0.8));
            });
          }
        });
      });

      // Find highest scoring intent
      let highestId = null;
      let maxScore = 0;
      scores.forEach((score, id) => {
        if (score > maxScore) {
          maxScore = score;
          highestId = id;
        }
      });

      // Threshold check
      if (highestId && maxScore >= 1.2) {
        const item = this.kb.find(i => i.id === highestId);
        return {
          intent: item.id,
          category: item.category,
          score: maxScore,
          answer: item.answer,
          quickChips: item.quickChips || [],
          navigation: item.navigation || null,
          navigationMenu: item.navigationMenu || null,
          cardsType: item.cardsType || null,
          campusCards: item.campusCards || null
        };
      }

      // Fallback
      return {
        intent: 'fallback',
        category: 'fallback',
        score: 0,
        answer: \`I'm sorry, I couldn't find exact details for "\${userQuery}".\\n\\nHere are some popular topics you can explore at **\${INST_SHORT}**:\`,
        quickChips: ['About Us', 'Our Courses', 'Our Campuses', 'Facilities', 'Contact Us', 'Events']
      };
    }

    detectNavigationIntent(raw) {
      const navTriggers = {
        admissions: ['take me to admission', 'open admission portal', 'go to admission page', 'admission portal link'],
        courses: ['take me to courses', 'open courses page', 'go to courses page'],
        facilities: ['take me to facilities', 'open facilities page', 'go to facilities page'],
        contact: ['take me to contact', 'open contact page', 'go to contact page'],
        about: ['take me to about', 'open about page', 'go to about page'],
        events: ['take me to events', 'open events page', 'go to events page']
      };

      for (const [key, triggers] of Object.entries(navTriggers)) {
        if (triggers.some(t => raw.includes(t))) {
          const item = this.kb.find(i => i.id.includes(key));
          if (item && item.navigation) {
            return {
              intent: 'navigation_' + key,
              category: 'navigation',
              score: 9.9,
              answer: \`🚀 Taking you directly to **\${item.title}**...\`,
              navigation: item.navigation,
              quickChips: ['About Us', 'Our Courses', 'Our Campuses', 'Facilities', 'Contact Us']
            };
          }
        }
      }
      return null;
    }

    getDefaultResponse() {
      const greeting = this.kb.find(i => i.id === 'greeting');
      return {
        intent: 'greeting',
        category: 'general',
        score: 1.0,
        answer: greeting ? greeting.answer : \`👋 Welcome to **\${INST_NAME}** AI Assistant!\`,
        quickChips: greeting ? greeting.quickChips : ['About Us', 'Our Courses', 'Our Campuses', 'Facilities', 'Contact Us']
      };
    }
  }

  // Export to window
  if (typeof window !== 'undefined') {
    window.RVPUChatbot = window.RVPUChatbot || {};
    window.RVPUChatbot[INST_ID] = {
      ChatbotEngine,
      INST_ID,
      INST_NAME,
      INST_SHORT,
      BRAND_COLORS,
      engine: new ChatbotEngine(DEFAULT_KB, DEFAULT_KW)
    };
  }

  // Node.js module export for testing
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
      ChatbotEngine,
      INST_ID,
      INST_NAME,
      INST_SHORT,
      BRAND_COLORS,
      DEFAULT_KB,
      DEFAULT_KW
    };
  }
})(typeof window !== 'undefined' ? window : global);
`;
}

function updateWidgetCSS(cssPath) {
  let content = fs.readFileSync(cssPath, 'utf8');
  if (content.includes('.rv-carousel-wrapper')) {
    return; // Already updated
  }

  const carouselCSS = `
/* ==========================================================================
   Campus Cards Horizontal Scrolling Carousel (Exact RVLH Style)
   ========================================================================== */
.rv-carousel-wrapper {
  width: 100%;
  position: relative;
  margin: 10px 0 6px 0;
}

.rv-cards-scroll {
  display: flex;
  gap: 12px;
  overflow-x: auto;
  padding: 6px 2px 10px 2px;
  width: 100%;
  scroll-snap-type: x mandatory;
  -webkit-overflow-scrolling: touch;
  scrollbar-width: none;
  -ms-overflow-style: none;
}

.rv-cards-scroll::-webkit-scrollbar {
  display: none !important;
  width: 0 !important;
  height: 0 !important;
}

.rv-campus-card {
  min-width: 220px;
  max-width: 220px;
  background: linear-gradient(180deg, #131b2e 0%, #0b1120 100%);
  border: 1px solid rgba(255, 255, 255, 0.12);
  border-radius: 14px;
  padding: 14px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  flex-shrink: 0;
  scroll-snap-align: start;
  transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.35);
  box-sizing: border-box;
}

.rv-campus-card:hover {
  border-color: rgba(59, 130, 246, 0.55);
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.5), 0 0 16px rgba(37, 99, 235, 0.2);
}

.rv-card-top {
  margin-bottom: 8px;
}

.rv-campus-card-title {
  color: #ffffff;
  font-size: 15px;
  font-weight: 700;
  line-height: 1.3;
  margin-bottom: 5px;
}

.rv-campus-card-loc {
  color: #94a3b8;
  font-size: 11px;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 5px;
  margin-bottom: 10px;
  line-height: 1.3;
}

.rv-campus-card-loc svg {
  color: #f59e0b;
  flex-shrink: 0;
}

.rv-card-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin-bottom: 12px;
}

.rv-tag {
  background: rgba(255, 255, 255, 0.08);
  border: 1px solid rgba(255, 255, 255, 0.12);
  color: #cbd5e1;
  padding: 3px 8px;
  border-radius: 6px;
  font-size: 10.5px;
  font-weight: 600;
}

.rv-campus-btn {
  width: 100%;
  padding: 8px 12px;
  background: linear-gradient(135deg, #1d4ed8, #2563eb);
  color: #ffffff !important;
  border: none;
  border-radius: 8px;
  font-size: 12px;
  font-weight: 700;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  transition: all 0.2s ease;
  text-decoration: none !important;
  box-sizing: border-box;
}

.rv-campus-btn:hover {
  background: linear-gradient(135deg, #2563eb, #3b82f6);
  box-shadow: 0 4px 14px rgba(37, 99, 235, 0.45);
  transform: translateY(-1px);
}

.rv-carousel-controls {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 6px 2px 0 2px;
}

.rv-carousel-arrow {
  background: rgba(0, 0, 0, 0.06);
  border: 1px solid rgba(0, 0, 0, 0.12);
  color: #1e293b;
  width: 28px;
  height: 28px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  font-size: 15px;
  font-weight: 700;
  transition: all 0.2s;
  user-select: none;
}

.rv-carousel-arrow:hover {
  background: var(--rv-primary);
  color: #ffffff;
  border-color: var(--rv-primary);
}

.rv-carousel-counter {
  font-size: 11px;
  color: #64748b;
  font-weight: 600;
}
`;
  fs.writeFileSync(cssPath, content + '\n' + carouselCSS, 'utf8');
}

function generateWidgetJS(instId, instName, instShort, wpUrl, vercelUrl) {
  return `/**
 * RVPU Front-End Chatbot Widget Component
 * Campus: ${instName}
 * Features: Branded UI, Keyword Chips, Horizontal Campus Cards, Deep Navigation, Dual-Write Telemetry.
 */
(function() {
  'use strict';

  const INST_ID = '${instId}';
  const INST_NAME = ${JSON.stringify(instName)};
  const INST_SHORT = ${JSON.stringify(instShort)};
  const WP_REST_URL = ${JSON.stringify(wpUrl)};
  const VERCEL_URL = ${JSON.stringify(vercelUrl)};

  let engine = (typeof window !== 'undefined' && window.RVPUChatbot && window.RVPUChatbot[INST_ID] && window.RVPUChatbot[INST_ID].engine)
    ? window.RVPUChatbot[INST_ID].engine
    : null;
  let kb = null;
  let kw = null;

  function loadDependencies(callback) {
    if (!engine && typeof window !== 'undefined' && window.RVPUChatbot && window.RVPUChatbot[INST_ID]) {
      if (window.RVPUChatbot[INST_ID].engine) {
        engine = window.RVPUChatbot[INST_ID].engine;
      } else if (window.RVPUChatbot[INST_ID].ChatbotEngine) {
        engine = new window.RVPUChatbot[INST_ID].ChatbotEngine();
      }
    }
    if (engine) {
      callback();
      return;
    }
    Promise.all([
      fetch('assets/knowledge-base.json').then(r => r.json()),
      fetch('assets/keywords.json').then(r => r.json())
    ]).then(([loadedKb, loadedKw]) => {
      kb = loadedKb;
      kw = loadedKw;
      if (window.RVPUChatbot && window.RVPUChatbot[INST_ID]) {
        engine = new window.RVPUChatbot[INST_ID].ChatbotEngine(kb, kw);
      }
      callback();
    }).catch(err => {
      console.warn('Local file fallback:', err);
      callback();
    });
  }

  function renderWidget() {
    const container = document.createElement('div');
    container.id = 'rv-chatbot-widget';
    container.innerHTML = \`
      <button class="rv-chat-launcher" id="rv-launcher-btn" aria-label="Open Admissions Chat">
        <svg viewBox="0 0 24 24"><path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 14H6l-2 2V4h16v12z"/></svg>
      </button>

      <div class="rv-chat-window" id="rv-window">
        <div class="rv-chat-header">
          <div class="rv-header-left">
            <div class="rv-avatar">RV</div>
            <div class="rv-header-title">
              <h4>\${INST_SHORT} Assistant</h4>
              <div class="rv-status-badge">
                <span class="rv-status-dot"></span>
                <span>Online • RSST Official</span>
              </div>
            </div>
          </div>
          <div class="rv-header-actions">
            <button class="rv-header-btn" id="rv-reset-btn" title="Restart Chat">↺</button>
            <button class="rv-header-btn" id="rv-close-btn" title="Close Chat">✕</button>
          </div>
        </div>

        <div class="rv-chat-messages" id="rv-messages"></div>

        <div class="rv-chat-input-area">
          <input type="text" class="rv-chat-input" id="rv-input" placeholder="Ask about combinations, admissions..." autocomplete="off"/>
          <button class="rv-send-btn" id="rv-send-btn" aria-label="Send">
            <svg viewBox="0 0 24 24"><path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/></svg>
          </button>
        </div>
      </div>
    \`;
    document.body.appendChild(container);

    attachEvents();
    showWelcome();
  }

  function attachEvents() {
    const launcher = document.getElementById('rv-launcher-btn');
    const windowEl = document.getElementById('rv-window');
    const closeBtn = document.getElementById('rv-close-btn');
    const resetBtn = document.getElementById('rv-reset-btn');
    const input = document.getElementById('rv-input');
    const sendBtn = document.getElementById('rv-send-btn');

    launcher.addEventListener('click', () => {
      windowEl.classList.toggle('rv-open');
      if (windowEl.classList.contains('rv-open')) {
        input.focus();
        sendTelemetry('chat_opened');
      }
    });

    closeBtn.addEventListener('click', () => windowEl.classList.remove('rv-open'));
    resetBtn.addEventListener('click', () => {
      document.getElementById('rv-messages').innerHTML = '';
      showWelcome();
    });

    sendBtn.addEventListener('click', () => handleUserSend());
    input.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') handleUserSend();
    });
  }

  function showWelcome() {
    const defaultResp = engine ? engine.getDefaultResponse() : {
      answer: "👋 Welcome to **" + INST_NAME + "** Official AI Assistant! How may I assist you today?",
      quickChips: ['About Us', 'Our Courses', 'Our Campuses', 'Facilities', 'Contact Us', 'Events']
    };
    appendMessage('bot', defaultResp.answer, defaultResp.quickChips, null, defaultResp.navigationMenu, defaultResp.campusCards);
  }

  function handleUserSend() {
    const input = document.getElementById('rv-input');
    const text = input.value.trim();
    if (!text) return;

    appendMessage('user', text);
    input.value = '';

    sendTelemetry('query_sent', { query: text });

    setTimeout(() => {
      if (!engine && typeof window !== 'undefined' && window.RVPUChatbot && window.RVPUChatbot[INST_ID]) {
        engine = window.RVPUChatbot[INST_ID].engine || (window.RVPUChatbot[INST_ID].ChatbotEngine ? new window.RVPUChatbot[INST_ID].ChatbotEngine() : null);
      }
      if (engine) {
        const res = engine.match(text);
        appendMessage('bot', res.answer, res.quickChips, res.navigation, res.navigationMenu, res.campusCards);
        sendTelemetry('bot_response', { intent: res.intent, score: res.score });
      } else {
        appendMessage('bot', 'Connecting to admissions database...');
      }
    }, 200);
  }

  function appendMessage(sender, text, chips, navigation, navMenu, campusCards) {
    const container = document.getElementById('rv-messages');
    const msgEl = document.createElement('div');
    msgEl.className = 'rv-message rv-' + sender;

    let formattedText = text.replace(/\\n/g, '<br/>')
                            .replace(/\\*\\*(.*?)\\*\\*/g, '<strong>$1</strong>')
                            .replace(/•/g, '&bull;')
                            .replace(/\\[(.*?)\\]\\((.*?)\\)/g, '<a href="$2" target="_blank" style="color: var(--rv-primary); font-weight: 600; text-decoration: underline;">$1 ↗</a>');

    let html = '<div class="rv-msg-bubble">' + formattedText;

    if (navigation) {
      html += '<br/><a href="' + navigation.url + '" target="_blank" class="rv-nav-action-btn">🧭 ' + navigation.label + ' →</a>';
    }

    if (navMenu && Array.isArray(navMenu) && (!campusCards || campusCards.length === 0)) {
      html += '<div style="margin-top: 10px; display: flex; flex-direction: column; gap: 4px;">';
      navMenu.forEach(item => {
        html += '<a href="' + item.url + '" target="_blank" style="color: var(--rv-primary); font-size: 12.5px; font-weight: 600; text-decoration: none;">' + item.title + ' ↗</a>';
      });
      html += '</div>';
    }

    html += '</div>';

    if (chips && chips.length > 0) {
      html += '<div class="rv-chips-container">';
      chips.forEach(chip => {
        html += '<button class="rv-chip-btn" data-chip="' + chip + '">' + chip + '</button>';
      });
      html += '</div>';
    }

    msgEl.innerHTML = html;

    if (campusCards && Array.isArray(campusCards) && campusCards.length > 0) {
      const bubble = msgEl.querySelector('.rv-msg-bubble');
      const carouselWrapper = document.createElement('div');
      carouselWrapper.className = 'rv-carousel-wrapper';

      const scrollContainer = document.createElement('div');
      scrollContainer.className = 'rv-cards-scroll';

      campusCards.forEach(card => {
        const cardEl = document.createElement('div');
        cardEl.className = 'rv-campus-card';
        const tagsHtml = (card.streams || []).map(s => \`<span class="rv-tag">\${s}</span>\`).join('');

        cardEl.innerHTML = \`
          <div class="rv-card-top">
            <div class="rv-campus-card-title">\${card.title}</div>
            <div class="rv-campus-card-loc">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/></svg>
              <span>\${card.location}</span>
            </div>
          </div>
          <div class="rv-card-tags">
            \${tagsHtml}
          </div>
          <a href="\${card.url}" target="_blank" class="rv-campus-btn">
            <span>Explore Campus</span>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="9 18 15 12 9 6"></polyline></svg>
          </a>
        \`;
        scrollContainer.appendChild(cardEl);
      });

      carouselWrapper.appendChild(scrollContainer);

      const controls = document.createElement('div');
      controls.className = 'rv-carousel-controls';
      controls.innerHTML = \`
        <button type="button" class="rv-carousel-arrow prev" title="Scroll left">‹</button>
        <span class="rv-carousel-counter">\${campusCards.length} Campuses Available</span>
        <button type="button" class="rv-carousel-arrow next" title="Scroll right">›</button>
      \`;
      controls.querySelector('.prev').addEventListener('click', (e) => {
        e.stopPropagation();
        scrollContainer.scrollBy({ left: -240, behavior: 'smooth' });
      });
      controls.querySelector('.next').addEventListener('click', (e) => {
        e.stopPropagation();
        scrollContainer.scrollBy({ left: 240, behavior: 'smooth' });
      });
      carouselWrapper.appendChild(controls);

      bubble.appendChild(carouselWrapper);
    }

    container.appendChild(msgEl);

    if (sender === 'bot') {
      setTimeout(() => {
        const targetScroll = Math.max(0, msgEl.offsetTop - container.offsetTop - 8);
        container.scrollTo({ top: targetScroll, behavior: 'smooth' });
      }, 50);
    } else {
      container.scrollTo({ top: container.scrollHeight, behavior: 'smooth' });
    }

    msgEl.querySelectorAll('.rv-chip-btn').forEach(btn => {
      btn.addEventListener('click', function() {
        const chipText = this.getAttribute('data-chip');
        document.getElementById('rv-input').value = chipText;
        handleUserSend();
      });
    });
  }

  function sendTelemetry(eventType, eventData) {
    const payload = {
      instituteId: INST_ID,
      instituteName: INST_NAME,
      event: eventType,
      data: eventData || {},
      timestamp: new Date().toISOString()
    };
    try {
      fetch(VERCEL_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      }).catch(() => {});
    } catch(e) {}
  }

  document.addEventListener('DOMContentLoaded', () => {
    loadDependencies(() => {
      renderWidget();
    });
  });
})();
`;
}

console.log('🚀 Starting Universal Chatbot Replicate Across All 7 RVPU Institutes...\n');

institutes.forEach(inst => {
  const dirPath = path.join(__dirname, inst.dir);
  const rawPath = path.join(dirPath, 'raw-data', 'scraped-data.json');
  if (!fs.existsSync(rawPath)) {
    console.warn(`⚠️ Skipped ${inst.name}: scraped-data.json not found.`);
    return;
  }

  const rawData = JSON.parse(fs.readFileSync(rawPath, 'utf8'));

  // 1. Build Knowledge Base & Keywords
  const kb = buildInstituteKnowledgeBase(rawData, inst);
  const kw = buildKeywordsTable(kb);
  const engineCode = generateEngineCode(inst.id, rawData.institute.name, rawData.institute.shortName || rawData.institute.name, rawData.colors, kb, kw);

  // 2. Write assets
  const assetsDir = path.join(dirPath, 'assets');
  if (!fs.existsSync(assetsDir)) fs.mkdirSync(assetsDir, { recursive: true });

  fs.writeFileSync(path.join(assetsDir, 'knowledge-base.json'), JSON.stringify(kb, null, 2), 'utf8');
  fs.writeFileSync(path.join(assetsDir, 'keywords.json'), JSON.stringify(kw, null, 2), 'utf8');
  fs.writeFileSync(path.join(assetsDir, 'chatbot-engine.js'), engineCode, 'utf8');

  // 3. Update CSS
  const cssPath = path.join(assetsDir, 'chatbot-widget.css');
  if (fs.existsSync(cssPath)) {
    updateWidgetCSS(cssPath);
  }

  // 4. Update Widget JS
  const jsPath = path.join(assetsDir, 'chatbot-widget.js');
  const baseWeb = (rawData.institute.website || '').replace(/\/+$/, '');
  const wpUrl = baseWeb + '/wp-json/rvpu/v1/telemetry';
  const vercelUrl = 'http://localhost:3000/api/telemetry';
  fs.writeFileSync(jsPath, generateWidgetJS(inst.id, rawData.institute.name, rawData.institute.shortName || rawData.institute.name, wpUrl, vercelUrl), 'utf8');

  console.log(`✅ [${inst.name}] Upgraded with ${kb.length} intents, ${Object.keys(kw).length} keywords, cards carousel & scroll controls!`);
});

console.log('\n🎉 ALL 7 INSTITUTES REPLICATED AND SYNCHRONIZED SUCCESSFULLY!');
