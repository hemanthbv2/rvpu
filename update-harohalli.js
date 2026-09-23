const fs = require('fs');
const path = require('path');

const HAROHALLI_DIR = path.join(__dirname, 'rvpu-harohalli-chatbot');
const rawDataPath = path.join(HAROHALLI_DIR, 'raw-data', 'scraped-data.json');
const rawData = JSON.parse(fs.readFileSync(rawDataPath, 'utf8'));

const allCampusesData = [
  { name: 'RV PU College North', location: 'DPS Campus, Yelahanka / Bagalur', streams: 'Science (PCMB, PCMC) & Commerce (SEBA)', url: 'https://north.rvpucollege.edu.in/' },
  { name: 'RV PU College South', location: 'Jayanagar / RV Road, Bengaluru', streams: 'Science (PCMB, PCMC) & Commerce (SEBA, CEBA)', url: 'https://south.rvpucollege.edu.in/' },
  { name: 'RV PU College Electronic City', location: 'Tech Corridor, Bengaluru', streams: 'Science (PCMB, PCMC) & Commerce (SEBA, BAMS)', url: 'https://ecity.rvpucollege.edu.in/' },
  { name: 'RV PU College Harohalli (Residential)', location: 'Green Bell Campus, Kanakapura Road', streams: 'Science (PCMB, PCMC) & Commerce (BAMS, BAME, SEBA)', url: 'https://hrh.rvpucollege.edu.in/' },
  { name: 'SSMRV PU College', location: 'Jayanagar 4th T Block, Bengaluru', streams: 'Science (PCMB, PCMC) & Commerce (BAMS, SEBA)', url: 'https://ssmrvpu.edu.in/new_ssmrvpu/' },
  { name: 'NMKRV PU College for Women', location: 'Jayanagar 3rd Block, Bengaluru', streams: 'Science (PCMB, PCMC) & Commerce (BAMS, SEBA)', url: 'https://www.nmkrvpu.edu.in/new_nmkrvpu/' },
  { name: 'RV PU College Mysuru', location: 'Heritage City, Mysuru', streams: 'Science (PCMB, PCMC) & Commerce (SEBA)', url: 'https://mys.rvpucollege.edu.in/' }
];

function buildHarohalliKnowledgeBase(data) {
  const shortName = data.institute.shortName || data.institute.name;
  const fullName = data.institute.name;
  const address = data.institute.address;
  const phones = Array.isArray(data.institute.phone) ? data.institute.phone.join(', ') : data.institute.phone;
  const email = data.institute.email;
  const timings = data.institute.timings;
  const website = data.institute.website;
  const principalName = (data.leadership && data.leadership.principal) ? data.leadership.principal.name : 'Mr. Umesh K.N.';
  const pages = data.pages || {};

  const admissionSteps = (data.admissions && data.admissions.process) ? data.admissions.process.map((p, i) => `${i + 1}. ${p}`).join('\n') : '';
  const docsList = (data.admissions && data.admissions.required_documents) ? data.admissions.required_documents.map(d => `• ${d}`).join('\n') : '';
  const facilitiesList = (data.facilities && data.facilities.items) ? data.facilities.items.map(f => `• ${f}`).join('\n') : '';

  const campusesFormatted = allCampusesData.map((c, i) => 
    `${i + 1}. 🏫 **${c.name}**\n   📍 *${c.location}*\n   📚 Streams: ${c.streams}\n   🔗 [Visit Official Portal](${c.url})`
  ).join('\n\n');

  return [
    {
      id: 'greeting',
      category: 'general',
      title: 'Greetings & Welcome',
      keywords: ['hi', 'hello', 'hey', 'namaste', 'good morning', 'good afternoon', 'good evening', 'start', 'help', 'menu', 'vanakkam'],
      weight: 1.0,
      answer: `Hello and welcome! 👋 I am the official AI Assistant for **${fullName}**.\n\nWhether you are exploring our academic combinations, inquiring about admissions post-SSLC, learning about our Principal, or exploring our 7 RVPU sister campuses, I'm here to guide you!\n\nHow may I assist you today?`,
      quickChips: ['About Us', 'Our Courses', 'Our Campuses', 'Facilities', 'Contact Us', 'Events']
    },
    {
      id: 'principal',
      category: 'about',
      title: 'Principal & Leadership Desk',
      keywords: [
        'princi', 'principal', 'who is principal', 'principal sir', 'principal mam', 'principal name',
        'head of college', 'headmaster', 'head of the institution', 'umesh', 'mr umesh', 'umesh kn', 'umesh k n',
        'who heads', 'who leads', 'leadership team'
      ],
      weight: 4.5,
      answer: `👨‍🏫 **Principal of ${fullName}**:\n\nOur college is headed by **${principalName}**.\n\nUnder his academic leadership, ${shortName} emphasizes disciplined academic rigor, integrated entrance coaching (NEET, JEE, KCET, CA Foundation), personal mentoring, and holistic student growth on our serene 50-acre green campus.\n\nWould you like to read the Principal's message, view our faculty list, or explore our course streams?`,
      quickChips: ['About Us', 'Faculty', 'Our Courses', 'Our Campuses', 'Contact Us'],
      navigation: { label: "View Principal's Profile", url: pages.principal || pages.about || website }
    },
    {
      id: 'about_us',
      category: 'about',
      title: 'About Us & Management Trust',
      keywords: ['about us', 'about', 'about college', 'who are you', 'tell me about college', 'college info', 'overview', 'history', 'management', 'trust', 'rsst', 'rvei', 'shyam', 'murthy', 'nagaraj'],
      weight: 3.5,
      answer: `🏛️ **About ${fullName}**:\n\n${shortName} is a premier Pre-University institution managed by the renowned **Rashtreeya Sikshana Samithi Trust (RSST)**, upholding over 80+ years of educational excellence. Affiliated with the Karnataka Pre-University Education Board (DPUE), the college is recognized for delivering outstanding board results, integrated entrance coaching, and state-of-the-art facilities on our lush green campus.\n\n👨‍🏫 **Key Leadership**:\n• **Principal**: **${principalName}**\n• **RSST President**: Dr. M.P. Shyam\n• **Hon. Secretary (RSST)**: Dr. (h.c.) A.V.S. Murthy\n• **Hon. Joint Secretary**: Mr. D.P. Nagaraj\n• **Director, RV Learning Hub**: Mr. Mayur Goyal`,
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
      answer: `🏛️ **RV Educational Institutions — 7 Pre-University Campuses**:\n\nUnder the prestigious Rashtreeya Sikshana Samithi Trust (RSST), RV operates 7 premier Pre-University campuses across Karnataka. Swipe through the cards below to explore each campus:`,
      cardsType: 'campus_list',
      campusCards: [
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
      ],
      quickChips: ['Our Courses', 'Facilities', 'Hostel', 'Contact Us']
    },
    {
      id: 'courses_all',
      category: 'academics',
      title: 'Our Courses and Combinations Offered',
      keywords: ['our courses', 'courses', 'course', 'combinations', 'combination', 'streams', 'stream', 'subjects', 'academic programs', 'programs offered', 'what courses'],
      weight: 3.5,
      answer: `🎓 **Academic Courses & Combinations at ${shortName}**:\n\n**Duration**: 2 Academic Years (I PUC & II PUC)\n**Medium of Instruction**: English (Board exams can be answered in English or Kannada)\n\n**🔬 Science Stream**:\n• **PCMB**: Physics, Chemistry, Mathematics, Biology\n• **PCMC**: Physics, Chemistry, Mathematics, Computer Science\n\n**📊 Commerce Stream**:\n• **BAMS**: Business Studies, Accountancy, Basic Mathematics, Statistics\n• **BAME**: Business Studies, Accountancy, Basic Mathematics, Economics\n• **SEBA**: Statistics, Economics, Business Studies, Accountancy\n\n**🗣️ Languages**:\n• Compulsory: English\n• Second Language Options: Kannada, Hindi, Sanskrit`,
      quickChips: ['PCMB', 'PCMC', 'BAMS', 'BAME', 'SEBA', 'Our Campuses'],
      navigation: { label: 'Explore Our Courses Page', url: pages.courses || website }
    },
    {
      id: 'course_pcmb',
      category: 'academics',
      title: 'PCMB (Physics, Chemistry, Mathematics, Biology)',
      keywords: [
        'pcmb', 'physics chemistry maths biology', 'biology combination', 'medical stream',
        'neet course', 'neet batch', 'neet coaching', 'doctor course', 'biology'
      ],
      weight: 4.5,
      answer: `🔬 **PCMB Combination (Science Stream) at ${shortName}**:\n\n• **Core Subjects**: Physics, Chemistry, Mathematics, Biology\n• **Compulsory Language**: English | **Second Language**: Kannada / Hindi / Sanskrit\n• **Career Avenues**: Medical (MBBS, BDS, BAMS), Biotechnology, Pure Sciences (Research, B.Sc), Agricultural Sciences, Veterinary Science, and Engineering.\n• **Integrated Competitive Prep**: Comprehensive Karnataka PU Board syllabus paired with integrated **NEET & KCET coaching**, rigorous weekend test series, and dedicated hands-on laboratory practicals.`,
      quickChips: ['PCMC', 'Our Courses', 'Our Campuses', 'Admissions', 'Facilities'],
      navigation: { label: 'Explore Science Combinations', url: pages.courses || website }
    },
    {
      id: 'course_pcmc',
      category: 'academics',
      title: 'PCMC (Physics, Chemistry, Mathematics, Computer Science)',
      keywords: [
        'pcmc', 'physics chemistry maths computer science', 'computer science combination',
        'cs stream', 'coding stream', 'engineering combination', 'jee course', 'computer science'
      ],
      weight: 4.5,
      answer: `💻 **PCMC Combination (Science Stream) at ${shortName}**:\n\n• **Core Subjects**: Physics, Chemistry, Mathematics, Computer Science\n• **Compulsory Language**: English | **Second Language**: Kannada / Hindi / Sanskrit\n• **Career Avenues**: Engineering (Computer Science, AI & ML, Robotics, Electronics, Mechanical), BCA, Data Science, and IT careers.\n• **Integrated Competitive Prep**: Specialized coaching for **JEE Main, JEE Advanced & KCET** alongside advanced computer laboratory training in C++, Python, and algorithm design.`,
      quickChips: ['PCMB', 'Our Courses', 'Our Campuses', 'Admissions', 'Facilities'],
      navigation: { label: 'Explore Science Combinations', url: pages.courses || website }
    },
    {
      id: 'course_bams',
      category: 'academics',
      title: 'BAMS (Business Studies, Accountancy, Basic Maths, Statistics)',
      keywords: ['bams', 'basic maths statistics', 'business accountancy basic maths statistics', 'bams combination'],
      weight: 4.5,
      answer: `📊 **BAMS Combination (Commerce Stream) at ${shortName}**:\n\n• **Core Subjects**: Business Studies, Accountancy, Basic Mathematics, Statistics\n• **Compulsory Language**: English | **Second Language**: Kannada / Hindi / Sanskrit\n• **Career Avenues**: Chartered Accountancy (CA), Company Secretary (CS), Cost Management (CMA), Actuarial Science, Data & Financial Analytics, and B.Com / BBA.\n• **Academic Edge**: Combines foundational commercial principles with strong quantitative mathematical and statistical problem-solving.`,
      quickChips: ['BAME', 'SEBA', 'Our Courses', 'Our Campuses', 'Admissions'],
      navigation: { label: 'Explore Commerce Courses', url: pages.courses || website }
    },
    {
      id: 'course_bame',
      category: 'academics',
      title: 'BAME (Business Studies, Accountancy, Basic Maths, Economics)',
      keywords: ['bame', 'basic maths economics', 'business accountancy basic maths economics', 'bame combination'],
      weight: 4.5,
      answer: `📈 **BAME Combination (Commerce Stream) at ${shortName}**:\n\n• **Core Subjects**: Business Studies, Accountancy, Basic Mathematics, Economics\n• **Compulsory Language**: English | **Second Language**: Kannada / Hindi / Sanskrit\n• **Career Avenues**: Banking & Financial Services, Economic Research, Stock Market Analysis, Corporate Accounting, and BBA / MBA.\n• **Academic Edge**: Balances micro/macro economic theory with practical accounting and mathematics.`,
      quickChips: ['BAMS', 'SEBA', 'Our Courses', 'Our Campuses', 'Admissions'],
      navigation: { label: 'Explore Commerce Courses', url: pages.courses || website }
    },
    {
      id: 'course_seba',
      category: 'academics',
      title: 'SEBA (Statistics, Economics, Business Studies, Accountancy)',
      keywords: ['seba', 'statistics economics business accountancy', 'seba combination', 'commerce without maths'],
      weight: 4.5,
      answer: `📑 **SEBA Combination (Commerce Stream) at ${shortName}**:\n\n• **Core Subjects**: Statistics, Economics, Business Studies, Accountancy\n• **Compulsory Language**: English | **Second Language**: Kannada / Hindi / Sanskrit\n• **Career Avenues**: Professional Chartered Accountancy (CA Foundation), CS, Corporate Law, Business Management, and Civil Services.\n• **Academic Edge**: A popular, well-rounded commerce track giving equal mastery across accounting, economic systems, and statistical tools.`,
      quickChips: ['BAMS', 'BAME', 'Our Courses', 'Our Campuses', 'Admissions'],
      navigation: { label: 'Explore Commerce Courses', url: pages.courses || website }
    },
    {
      id: 'courses_science',
      category: 'academics',
      title: 'Science Stream Overview',
      keywords: ['science', 'science stream', 'physics', 'chemistry', 'maths', 'mathematics', 'neet', 'jee', 'kcet', 'engineering', 'medical'],
      weight: 2.5,
      answer: `🔬 **Science Stream Combinations at ${shortName}**:\n\n• **PCMB**: Physics, Chemistry, Mathematics, Biology\n• **PCMC**: Physics, Chemistry, Mathematics, Computer Science\n\n• **PCMB**: Ideal for Medical (NEET), Biotechnology, Pure Sciences, and Engineering.\n• **PCMC**: Ideal for Engineering (JEE/KCET), Computer Science, and IT careers.\n\nBoth tracks include integrated competitive entrance training and fully equipped laboratories.`,
      quickChips: ['PCMB', 'PCMC', 'Our Courses', 'Our Campuses', 'Facilities'],
      navigation: { label: 'Explore Science Courses', url: pages.courses || website }
    },
    {
      id: 'courses_commerce',
      category: 'academics',
      title: 'Commerce Stream Overview',
      keywords: ['commerce', 'commerce stream', 'business studies', 'accountancy', 'economics', 'statistics', 'ca', 'cs', 'finance', 'cma'],
      weight: 2.5,
      answer: `📊 **Commerce Stream Combinations at ${shortName}**:\n\n• **BAMS**: Business Studies, Accountancy, Basic Mathematics, Statistics\n• **BAME**: Business Studies, Accountancy, Basic Mathematics, Economics\n• **SEBA**: Statistics, Economics, Business Studies, Accountancy\n\nThese combinations build an exceptional foundation for CA Foundation, Company Secretaryship (CS), BBA/MBA, and corporate finance.`,
      quickChips: ['BAMS', 'BAME', 'SEBA', 'Our Courses', 'Our Campuses'],
      navigation: { label: 'Explore Commerce Courses', url: pages.courses || website }
    },
    {
      id: 'languages',
      category: 'academics',
      title: 'Language Options',
      keywords: ['language', 'languages', 'second language', 'kannada', 'hindi', 'sanskrit', 'french', 'english', 'medium'],
      weight: 2.0,
      answer: `🗣️ **Language Options at ${shortName}**:\n\n• **Part I (Compulsory)**: English\n• **Part II (Second Language Choice)**: Kannada, Hindi, Sanskrit\n\nMedium of instruction is English, while students are permitted to answer public examinations in either English or Kannada per DPUE regulations.`,
      quickChips: ['Our Courses', 'Our Campuses', 'Facilities', 'Contact Us']
    },
    {
      id: 'faculty',
      category: 'academics',
      title: 'Faculty & Teaching Staff',
      keywords: ['faculty', 'teachers', 'lecturers', 'staff', 'teaching staff', 'professors', 'who teaches', 'mentors', 'lecturer'],
      weight: 4.0,
      answer: `👨‍🏫 **Distinguished Faculty at ${shortName}**:\n\nOur expert educators bring deep academic and competitive coaching expertise:\n\n• **Physics**: Mr. Shivakumar B.P.\n• **Chemistry**: Dr. S. Murali\n• **Mathematics**: Mr. Dhanush B.P., Mr. Jagadish S., Mr. Mahesh T.C.\n• **Biology**: Mr. Suresha O.\n• **Computer Science**: Ms. Chetankumari N. Naik\n• **Commerce & Accountancy**: Mr. Sateesha C.\n• **Economics**: Ms. Sreelakshmi T.G.\n• **Statistics**: Ms. Indumathi B.S.\n• **Languages**: Mr. Lakshmi Narayana V. (Kannada), Ms. Ashwini Reddy (Hindi), Mr. Bhagavan K. (English)\n• **Physical Education**: Mr. Swaroop M.S.`,
      quickChips: ['Principal', 'Our Courses', 'Our Campuses', 'Contact Us'],
      navigation: { label: 'View Faculty Directory', url: pages.faculty || website }
    },
    {
      id: 'hostel_residential',
      category: 'campus',
      title: 'Hostel & Residential Campus Life',
      keywords: ['hostel', 'boarding', 'residential', 'stay', 'rooms', 'food', 'mess', 'dining', 'accommodation', 'hostel fee', 'dormitory'],
      weight: 4.5,
      answer: `🏡 **Residential Campus & Hostel at ${shortName}**:\n\nRVPU Harohalli is a flagship 50-acre green residential sanctuary on Kanakapura Road:\n\n• **Hostel Rooms**: Separate, secure, and spacious hostel blocks for boys and girls with 24/7 security and residential wardens.\n• **Nutritious Dining**: Wholesome, hygienic vegetarian meals prepared in modern hygienic kitchens.\n• **Evening Mentor Study**: Mandatory evening supervised study halls (6:30 PM – 9:30 PM) with resident faculty doubt clearance.\n• **Sports & Wellness**: Athletic tracks, cricket ground, volleyball/basketball courts, gym, and swimming pool.\n• **Day Scholars**: Also welcome! Extensive college transport connects Harohalli with Kanakapura, Ramanagara, and South Bengaluru.`,
      quickChips: ['Facilities', 'Our Courses', 'Our Campuses', 'Contact Us'],
      navigation: { label: 'Explore Campus Facilities', url: pages.facilities || website }
    },
    {
      id: 'admissions_process',
      category: 'admissions',
      title: 'Admission Procedure & Steps',
      keywords: ['admission', 'admissions', 'apply', 'application', 'how to apply', 'procedure', 'process', 'enroll', 'seat', 'registration', 'form', 'dates'],
      weight: 2.5,
      answer: `📝 **Admission Procedure at ${shortName}**:\n\n${admissionSteps}\n\n💡 **Tips**: Admissions commence immediately following the declaration of Class 10 / SSLC board exam results. We advise applying early as seats are allotted on merit and first-come, first-served basis.`,
      quickChips: ['Required Documents', 'Eligibility Cutoff', 'Our Courses', 'Our Campuses'],
      navigation: { label: 'Open Admission Portal', url: pages.admissions || website }
    },
    {
      id: 'admissions_documents',
      category: 'admissions',
      title: 'Required Documents for Admission',
      keywords: ['documents', 'required documents', 'certificates', 'marksheet', 'marks card', 'tc', 'transfer certificate', 'aadhaar', 'caste certificate', 'income certificate', 'photographs', 'eligibility certificate'],
      weight: 2.5,
      answer: `📄 **Documents Required for Admission at ${shortName}**:\n\n${docsList}\n\n*Note*: Ensure you bring the original certificates along with at least 3 attested photocopies for verification during counseling.`,
      quickChips: ['Admission Process', 'Eligibility Cutoff', 'Our Courses', 'Our Campuses']
    },
    {
      id: 'eligibility_cutoff',
      category: 'admissions',
      title: 'Eligibility & Cutoff Criteria',
      keywords: ['eligibility', 'cutoff', 'cut off', 'cut-off', 'percentage', 'marks', 'minimum marks', 'criteria', 'sslc percentage', 'pass marks'],
      weight: 2.5,
      answer: `🎯 **Eligibility & Cutoff Criteria**:\n\n• **Eligibility**: Candidates who have successfully cleared SSLC / ICSE / CBSE / 10th Standard or equivalent board.\n• **Cutoff Announcement**: Cutoffs are finalized upon declaration of 10th board results and displayed on the college notice board & website.\n• **Promotion Criteria (I PUC to II PUC)**: Minimum 30% marks in each individual subject and 35% overall aggregate in district-level promotional exams.`,
      quickChips: ['Admission Process', 'Our Courses', 'Our Campuses', 'Contact Us']
    },
    {
      id: 'facilities',
      category: 'campus',
      title: 'Campus Facilities & Infrastructure',
      keywords: ['facilities', 'facility', 'infrastructure', 'labs', 'laboratory', 'library', 'sports', 'playground', 'auditorium', 'smart class', 'classrooms', 'gym', 'canteen', 'amenities', 'green campus'],
      weight: 3.5,
      answer: `🏫 **Campus Facilities at ${shortName}**:\n\n${facilitiesList}\n\nOur campus is designed to foster both academic rigour and all-round holistic development with world-class facilities.`,
      quickChips: ['Hostel', 'Our Courses', 'Our Campuses', 'Contact Us', 'Events'],
      navigation: { label: 'Explore Facilities Page', url: pages.facilities || website }
    },
    {
      id: 'contact_location',
      category: 'contact',
      title: 'Contact Us & Campus Location',
      keywords: ['contact us', 'contact', 'contacts', 'address', 'phone', 'telephone', 'mobile', 'call', 'email', 'location', 'where', 'timings', 'hours', 'working hours', 'map', 'directions', 'reach', 'helpline', 'office'],
      weight: 3.5,
      answer: `📍 **Contact Us — ${shortName}**\n\n• **Campus Address**:\n  ${address}\n• **Phone / Helpline**: ${phones}\n• **Email**: ${email}\n• **Office Working Hours**: ${timings}\n• **Official Website**: ${website}`,
      quickChips: ['Our Campuses', 'Our Courses', 'Facilities', 'Events'],
      navigation: { label: 'Open Contact Us Page', url: pages.contact || website }
    },
    {
      id: 'events',
      category: 'campus',
      title: 'College Events & Student Activities',
      keywords: ['events', 'event', 'activities', 'activity', 'cultural', 'cultural fest', 'fest', 'fests', 'annual day', 'sports day', 'functions', 'celebrations', 'seminars', 'workshops', 'calendar', 'competitions', 'youth festival'],
      weight: 3.5,
      answer: `🎉 **College Events & Activities at ${shortName}**:\n\n• **Annual Cultural Fest & Talent Day**: High-energy celebrations featuring music, classical & modern dance, drama, and fine arts competitions.\n• **Annual Athletic Meet & Sports Day**: Inter-house track and field events, cricket, volleyball, basketball, and indoor tournaments.\n• **Science Seminars & Tech Exhibitions**: Hands-on laboratory project displays, model making, and interactive sessions with eminent academicians.\n• **National Celebrations**: Patriotic celebrations of Independence Day, Republic Day, and Kannada Rajyotsava.\n• **Student Enrichment & Leadership Activities**: Career counseling, personality development workshops, and active student club initiatives.`,
      quickChips: ['Our Courses', 'Our Campuses', 'Facilities', 'Contact Us'],
      navigation: { label: 'View College Events Page', url: pages.events || website }
    },
    {
      id: 'website_navigation',
      category: 'navigation',
      title: 'Website Direct Page Navigation',
      keywords: ['website', 'navigation', 'navigate', 'link', 'portal', 'home page', 'open', 'go to', 'take me', 'redirect', 'visit', 'browse'],
      weight: 2.0,
      answer: `🧭 **Direct Navigation Directory for ${shortName}**:\n\nClick any of the destination links below to jump directly to that section of our website:`,
      navigationMenu: [
        { title: '🏠 Home Page', url: pages.home || website },
        { title: '📖 About Us', url: pages.about || website },
        { title: '👨‍🏫 Principal Profile', url: pages.principal || website },
        { title: '🎓 Our Courses', url: pages.courses || website },
        { title: '👨‍🏫 Faculty Directory', url: pages.faculty || website },
        { title: '🏛️ Facilities', url: pages.facilities || website },
        { title: '🎉 Events', url: pages.events || website },
        { title: '📞 Contact Us', url: pages.contact || website }
      ],
      quickChips: ['About Us', 'Our Courses', 'Our Campuses', 'Facilities', 'Contact Us', 'Events']
    }
  ];
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

// 1. Generate Knowledge Base & Keywords
const kb = buildHarohalliKnowledgeBase(rawData);
const kw = buildKeywordsTable(kb);
const engineCode = generateEngineCode('harohalli', rawData.institute.name, rawData.institute.shortName, rawData.colors, kb, kw);

// 2. Write to assets
fs.writeFileSync(path.join(HAROHALLI_DIR, 'assets', 'knowledge-base.json'), JSON.stringify(kb, null, 2), 'utf8');
fs.writeFileSync(path.join(HAROHALLI_DIR, 'assets', 'keywords.json'), JSON.stringify(kw, null, 2), 'utf8');
fs.writeFileSync(path.join(HAROHALLI_DIR, 'assets', 'chatbot-engine.js'), engineCode, 'utf8');

console.log('✅ Harohalli Knowledge Base generated with', kb.length, 'intents!');
console.log('✅ Harohalli Keywords Table generated with', Object.keys(kw).length, 'keywords!');
console.log('✅ Harohalli Chatbot Engine generated successfully!');
