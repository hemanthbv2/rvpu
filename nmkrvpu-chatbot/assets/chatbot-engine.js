/**
 * RVPU Intelligent Chatbot Engine — NMKRV Pre-University College, Jayanagar
 * Dual-write compatible, TF-IDF weighted scoring, intent matching, website navigation & telemetry.
 */
(function(window) {
  'use strict';

  const INST_ID = 'nmkrvpu';
  const INST_NAME = "NMKRV Pre-University College, Jayanagar";
  const INST_SHORT = "NMKRV PU";
  const BRAND_COLORS = {"primary":"#EE9B54","primary_alt":"#F09E53","secondary":"#1E1E1E","accent":"#F5C155","accent_light":"#FCD882","background":"#F8F6F0","text_dark":"#222222"};
  const DEFAULT_KB = [{"id":"greeting","category":"general","title":"Greetings & Welcome","keywords":["hi","hello","hey","namaste","good morning","good afternoon","good evening","start","help","menu"],"weight":1,"answer":"👋 Welcome to **NMKRV Pre-University College, Jayanagar** Official AI Assistant!\n\nI can help you with college information, courses, admissions, campus facilities, events, and official contact details.\n\nClick any topic below or type your question:","quickChips":["About Us","Our Courses","Facilities","Contact Us","Events"]},{"id":"about_us","category":"about","title":"About Us & Principal","keywords":["about us","about","about college","who are you","tell me about college","college info","overview","history","principal","who is principal","head","leadership","director","president","management","trust","rsst","rvei","principal message","who runs this college","shyam","murthy","nagaraj"],"weight":3.5,"answer":"🏛️ **About NMKRV Pre-University College, Jayanagar**:\n\nNMKRV PU is a premier Pre-University institution managed by the renowned Rashtreeya Sikshana Samithi Trust (RSST), upholding over 80+ years of educational excellence. Affiliated with the Karnataka Pre-University Education Board (DPUE), the college is recognized for delivering outstanding board exam results, integrated competitive coaching, state-of-the-art laboratory training, and holistic student character development.\n\n👨‍🏫 **Principal & Leadership**:\n• **Principal**: **Mrs. Sheela Prakash S.N.**\n• **Management Trust**: Rashtreeya Sikshana Samithi Trust (RSST) / RV Educational Institutions (RVEI)\n• **RSST Leadership**: Dr. M.P. Shyam (President), Dr. (h.c.) A.V.S. Murthy (Hon. Secretary), Mr. D.P. Nagaraj (Hon. Joint Secretary)\n• **Vision**: Fostering academic distinction, scientific temperament, and ethical leadership in every student.","quickChips":["Our Courses","Facilities","Contact Us","Events"],"navigation":{"label":"Visit Official About Us Page","url":"https://www.nmkrvpu.edu.in/new_nmkrvpu/about_college/"}},{"id":"courses_all","category":"academics","title":"Our Courses and Combinations Offered","keywords":["our courses","courses","course","combinations","combination","streams","stream","subjects","pcmb","pcmc","seba","ceba","bams","bame","meba","peba","science","commerce","arts","programs","study","academic"],"weight":3.5,"answer":"🎓 **Our Courses & Combinations at NMKRV PU**:\n\n**Duration**: 2 Academic Years (I PUC & II PUC)\n**Medium of Instruction**: English (Public exams can be answered in English or Kannada)\n\n**🔬 Science Stream**:\n• **PCMB**: Physics, Chemistry, Mathematics, Biology\n• **PCMC**: Physics, Chemistry, Mathematics, Computer Science\n\n**📊 Commerce Stream**:\n• **BAMS**: Business Studies, Accountancy, Basic Mathematics, Statistics\n• **BAME**: Business Studies, Accountancy, Basic Mathematics, Economics\n• **SEBA**: Statistics, Economics, Business Studies, Accountancy\n\n**🗣️ Languages**:\n• Compulsory: English\n• Second Language Options: Kannada, Hindi, Sanskrit","quickChips":["About Us","Facilities","Contact Us","Events"],"navigation":{"label":"Explore Our Courses Page","url":"https://www.nmkrvpu.edu.in/new_nmkrvpu/our_courses/"}},{"id":"courses_science","category":"academics","title":"Science Stream Combinations","keywords":["science","science stream","pcmb","pcmc","physics","chemistry","maths","mathematics","biology","computer science","neet","jee","kcet","engineering","medical"],"weight":2.5,"answer":"🔬 **Science Stream Combinations at NMKRV PU**:\n\n• **PCMB**: Physics, Chemistry, Mathematics, Biology\n• **PCMC**: Physics, Chemistry, Mathematics, Computer Science\n\n• **PCMB**: Ideal for Medical (NEET), Biotechnology, Pure Sciences, and Engineering.\n• **PCMC**: Ideal for Engineering (JEE/KCET), Computer Science, and IT careers.\n\nAll science programs feature intensive laboratory practicals and competitive exam preparatory orientation.","quickChips":["About Us","Our Courses","Facilities","Contact Us","Events"],"navigation":{"label":"Explore Science Courses","url":"https://www.nmkrvpu.edu.in/new_nmkrvpu/our_courses/"}},{"id":"courses_commerce","category":"academics","title":"Commerce Stream Combinations","keywords":["commerce","commerce stream","bams","bame","seba","ceba","meba","peba","business studies","accountancy","economics","statistics","ca","cs","finance"],"weight":2.5,"answer":"📊 **Commerce Stream Combinations at NMKRV PU**:\n\n• **BAMS**: Business Studies, Accountancy, Basic Mathematics, Statistics\n• **BAME**: Business Studies, Accountancy, Basic Mathematics, Economics\n• **SEBA**: Statistics, Economics, Business Studies, Accountancy\n\nThese combinations build a solid foundation for careers in Chartered Accountancy (CA), Company Secretary (CS), Business Administration (BBA/MBA), Financial Analysis, and Economics.","quickChips":["About Us","Our Courses","Facilities","Contact Us","Events"],"navigation":{"label":"Explore Commerce Courses","url":"https://www.nmkrvpu.edu.in/new_nmkrvpu/our_courses/"}},{"id":"languages","category":"academics","title":"Language Options","keywords":["language","languages","second language","kannada","hindi","sanskrit","french","english","medium"],"weight":2,"answer":"🗣️ **Language Options at NMKRV PU**:\n\n• **Part I (Compulsory)**: English\n• **Part II (Second Language Choice)**: Kannada, Hindi, Sanskrit\n\nMedium of instruction is English, while students are permitted to answer public examinations in either English or Kannada as per DPUE regulations.","quickChips":["About Us","Our Courses","Facilities","Contact Us","Events"]},{"id":"admissions_process","category":"admissions","title":"Admission Procedure & Steps","keywords":["admission","admissions","apply","application","how to apply","procedure","process","enroll","seat","registration","form","dates"],"weight":2.5,"answer":"📝 **Admission Procedure at NMKRV PU**:\n\n1. Application forms available online via admission portal and at campus office post SSLC/10th results.\n2. Submit application with 4 passport photographs & attested copy of Class 10 marksheet.\n3. Cut-off percentages announced based on stream demand and board guidelines.\n4. Admissions finalized on merit and first-come, first-served basis.\n\n💡 **Tips**: Admissions commence immediately following the declaration of Class 10 / SSLC board exam results. We advise applying early as seats are allotted on merit and first-come, first-served basis.","quickChips":["About Us","Our Courses","Facilities","Contact Us","Events"],"navigation":{"label":"Open Admission Portal","url":"https://www.nmkrvpu.edu.in/new_nmkrvpu/admissions/"}},{"id":"admissions_documents","category":"admissions","title":"Required Documents for Admission","keywords":["documents","required documents","certificates","marksheet","marks card","tc","transfer certificate","aadhaar","caste certificate","income certificate","photographs","eligibility certificate"],"weight":2.5,"answer":"📄 **Documents Required for Admission at NMKRV PU**:\n\n• SSLC / 10th Standard Original Marks Card + attested photocopies\n• Aadhaar Card (Original + Photocopy)\n• Transfer Certificate (TC) from previous school/institution\n• Conduct Certificate from previous school/institution\n• Provisional Eligibility Certificate (issued by DPUE Bengaluru for foreign/NRI applicants)\n• Caste Certificate issued by Tahsildar (SC/ST/Category candidates)\n• Income Certificate (if family annual income is below ₹44,500)\n• 4 Recent Passport-size Photographs\n\n*Note*: Ensure you bring the original certificates along with at least 3 attested photocopies for verification during counseling.","quickChips":["About Us","Our Courses","Facilities","Contact Us","Events"]},{"id":"eligibility_cutoff","category":"admissions","title":"Eligibility & Cutoff Criteria","keywords":["eligibility","cutoff","cut off","cut-off","percentage","marks","minimum marks","criteria","sslc percentage","pass marks"],"weight":2.5,"answer":"🎯 **Eligibility & Cutoff Criteria**:\n\n• **Eligibility**: Candidates who have successfully cleared SSLC / ICSE / CBSE / 10th Standard or equivalent board.\n• **Cutoff Announcement**: Cutoffs are finalized upon declaration of 10th board results and displayed on the college notice board & website.\n• **Promotion Criteria (I PUC to II PUC)**: Minimum 30% marks in each individual subject and 35% overall aggregate in district-level promotional exams.","quickChips":["About Us","Our Courses","Facilities","Contact Us","Events"]},{"id":"facilities","category":"campus","title":"Campus Facilities & Infrastructure","keywords":["facilities","facility","infrastructure","labs","laboratory","library","sports","playground","auditorium","smart class","classrooms","gym","canteen","hostel","campus","amenities"],"weight":3.5,"answer":"🏫 **Campus Facilities at NMKRV PU**:\n\n• Modern Classrooms equipped with Digital Learning Aids & Projectors\n• Comprehensive Library with Textbooks, Reference Books, Journals & E-Resources\n• Specialized Physics, Chemistry, and Biology Laboratories\n• High-tech Computer Science Laboratory with high-speed internet\n• Sports Facilities for Indoor and Outdoor Games (Basketball, Football, Volleyball, Badminton)\n• Dedicated Gymnasium and Swimming Pool\n• Spacious Auditorium and Seminar Halls\n\nOur campus is designed to foster both academic rigour and all-round holistic development with world-class facilities.","quickChips":["About Us","Our Courses","Contact Us","Events"],"navigation":{"label":"Explore Facilities Page","url":"https://www.nmkrvpu.edu.in/new_nmkrvpu/facilities/"}},{"id":"contact_location","category":"contact","title":"Contact Us & Campus Location","keywords":["contact us","contact","contacts","address","phone","telephone","mobile","call","email","location","where","timings","hours","working hours","map","directions","reach","helpline","office"],"weight":3.5,"answer":"📍 **Contact Us — NMKRV PU**\n\n• **Campus Address**:\n  Jayanagar, Bengaluru / DPS Bengaluru North Campus, Survey No. 35/1A, Sathnur Village, Bagalur Post, Off Bellary Road, Jalla Hobli, Bengaluru – 562149, Karnataka, India\n• **Phone / Helpline**: 080 69018950\n• **Email**: info.nmkrvpu@rvei.edu.in\n• **Office Working Hours**: Monday – Saturday: 9:00 AM – 5:00 PM\n• **Official Website**: https://www.nmkrvpu.edu.in/new_nmkrvpu/","quickChips":["About Us","Our Courses","Facilities","Events"],"navigation":{"label":"Open Contact Us Page","url":"https://www.nmkrvpu.edu.in/new_nmkrvpu/contact-us/"}},{"id":"events","category":"campus","title":"College Events & Student Activities","keywords":["events","event","activities","activity","cultural","cultural fest","fest","fests","annual day","sports day","functions","celebrations","seminars","workshops","calendar","competitions","youth festival"],"weight":3.5,"answer":"🎉 **College Events & Activities at NMKRV PU**:\n\n• **Annual Cultural Fest & Talent Day**: High-energy celebrations featuring music, classical & modern dance, drama, and fine arts competitions.\n• **Annual Athletic Meet & Sports Day**: Inter-house track and field events, cricket, volleyball, basketball, and indoor tournaments.\n• **Science Seminars & Tech Exhibitions**: Hands-on laboratory project displays, model making, and interactive sessions with eminent academicians.\n• **National Celebrations**: Patriotic celebrations of Independence Day, Republic Day, and Kannada Rajyotsava.\n• **Student Enrichment & Leadership Activities**: Career counseling, personality development workshops, and active student club initiatives.\n\nWe provide a vibrant platform for students to participate in inter-collegiate competitions, sports tournaments, and intellectual seminars.","quickChips":["About Us","Our Courses","Facilities","Contact Us"],"navigation":{"label":"View College Events Page","url":"https://www.nmkrvpu.edu.in/new_nmkrvpu/events/"}},{"id":"website_navigation","category":"navigation","title":"Website Direct Page Navigation","keywords":["website","navigation","navigate","link","portal","home page","open","go to","take me","redirect","visit","browse"],"weight":2,"answer":"🧭 **Direct Navigation Directory for NMKRV PU**:\n\nClick any of the destination links below to jump directly to that section of our website:","navigationMenu":[{"title":"🏠 Home Page","url":"https://www.nmkrvpu.edu.in/new_nmkrvpu/"},{"title":"📖 About Us","url":"https://www.nmkrvpu.edu.in/new_nmkrvpu/about_college/"},{"title":"🎓 Our Courses","url":"https://www.nmkrvpu.edu.in/new_nmkrvpu/our_courses/"},{"title":"🏛️ Facilities","url":"https://www.nmkrvpu.edu.in/new_nmkrvpu/facilities/"},{"title":"🎉 Events","url":"https://www.nmkrvpu.edu.in/new_nmkrvpu/events/"},{"title":"📞 Contact Us","url":"https://www.nmkrvpu.edu.in/new_nmkrvpu/contact-us/"}],"quickChips":["About Us","Our Courses","Facilities","Contact Us","Events"]}];
  const DEFAULT_KW = {"hi":[{"id":"greeting","weight":1}],"hello":[{"id":"greeting","weight":1}],"hey":[{"id":"greeting","weight":1}],"namaste":[{"id":"greeting","weight":1}],"good morning":[{"id":"greeting","weight":1}],"good afternoon":[{"id":"greeting","weight":1}],"good evening":[{"id":"greeting","weight":1}],"start":[{"id":"greeting","weight":1}],"help":[{"id":"greeting","weight":1}],"menu":[{"id":"greeting","weight":1}],"about us":[{"id":"about_us","weight":3.5}],"about":[{"id":"about_us","weight":3.5}],"about college":[{"id":"about_us","weight":3.5}],"who are you":[{"id":"about_us","weight":3.5}],"tell me about college":[{"id":"about_us","weight":3.5}],"college info":[{"id":"about_us","weight":3.5}],"overview":[{"id":"about_us","weight":3.5}],"history":[{"id":"about_us","weight":3.5}],"principal":[{"id":"about_us","weight":3.5}],"who is principal":[{"id":"about_us","weight":3.5}],"head":[{"id":"about_us","weight":3.5}],"leadership":[{"id":"about_us","weight":3.5}],"director":[{"id":"about_us","weight":3.5}],"president":[{"id":"about_us","weight":3.5}],"management":[{"id":"about_us","weight":3.5}],"trust":[{"id":"about_us","weight":3.5}],"rsst":[{"id":"about_us","weight":3.5}],"rvei":[{"id":"about_us","weight":3.5}],"principal message":[{"id":"about_us","weight":3.5}],"who runs this college":[{"id":"about_us","weight":3.5}],"shyam":[{"id":"about_us","weight":3.5}],"murthy":[{"id":"about_us","weight":3.5}],"nagaraj":[{"id":"about_us","weight":3.5}],"our courses":[{"id":"courses_all","weight":3.5}],"courses":[{"id":"courses_all","weight":3.5}],"course":[{"id":"courses_all","weight":3.5}],"combinations":[{"id":"courses_all","weight":3.5}],"combination":[{"id":"courses_all","weight":3.5}],"streams":[{"id":"courses_all","weight":3.5}],"stream":[{"id":"courses_all","weight":3.5}],"subjects":[{"id":"courses_all","weight":3.5}],"pcmb":[{"id":"courses_all","weight":3.5},{"id":"courses_science","weight":2.5}],"pcmc":[{"id":"courses_all","weight":3.5},{"id":"courses_science","weight":2.5}],"seba":[{"id":"courses_all","weight":3.5},{"id":"courses_commerce","weight":2.5}],"ceba":[{"id":"courses_all","weight":3.5},{"id":"courses_commerce","weight":2.5}],"bams":[{"id":"courses_all","weight":3.5},{"id":"courses_commerce","weight":2.5}],"bame":[{"id":"courses_all","weight":3.5},{"id":"courses_commerce","weight":2.5}],"meba":[{"id":"courses_all","weight":3.5},{"id":"courses_commerce","weight":2.5}],"peba":[{"id":"courses_all","weight":3.5},{"id":"courses_commerce","weight":2.5}],"science":[{"id":"courses_all","weight":3.5},{"id":"courses_science","weight":2.5}],"commerce":[{"id":"courses_all","weight":3.5},{"id":"courses_commerce","weight":2.5}],"arts":[{"id":"courses_all","weight":3.5}],"programs":[{"id":"courses_all","weight":3.5}],"study":[{"id":"courses_all","weight":3.5}],"academic":[{"id":"courses_all","weight":3.5}],"science stream":[{"id":"courses_science","weight":2.5}],"physics":[{"id":"courses_science","weight":2.5}],"chemistry":[{"id":"courses_science","weight":2.5}],"maths":[{"id":"courses_science","weight":2.5}],"mathematics":[{"id":"courses_science","weight":2.5}],"biology":[{"id":"courses_science","weight":2.5}],"computer science":[{"id":"courses_science","weight":2.5}],"neet":[{"id":"courses_science","weight":2.5}],"jee":[{"id":"courses_science","weight":2.5}],"kcet":[{"id":"courses_science","weight":2.5}],"engineering":[{"id":"courses_science","weight":2.5}],"medical":[{"id":"courses_science","weight":2.5}],"commerce stream":[{"id":"courses_commerce","weight":2.5}],"business studies":[{"id":"courses_commerce","weight":2.5}],"accountancy":[{"id":"courses_commerce","weight":2.5}],"economics":[{"id":"courses_commerce","weight":2.5}],"statistics":[{"id":"courses_commerce","weight":2.5}],"ca":[{"id":"courses_commerce","weight":2.5}],"cs":[{"id":"courses_commerce","weight":2.5}],"finance":[{"id":"courses_commerce","weight":2.5}],"language":[{"id":"languages","weight":2}],"languages":[{"id":"languages","weight":2}],"second language":[{"id":"languages","weight":2}],"kannada":[{"id":"languages","weight":2}],"hindi":[{"id":"languages","weight":2}],"sanskrit":[{"id":"languages","weight":2}],"french":[{"id":"languages","weight":2}],"english":[{"id":"languages","weight":2}],"medium":[{"id":"languages","weight":2}],"admission":[{"id":"admissions_process","weight":2.5}],"admissions":[{"id":"admissions_process","weight":2.5}],"apply":[{"id":"admissions_process","weight":2.5}],"application":[{"id":"admissions_process","weight":2.5}],"how to apply":[{"id":"admissions_process","weight":2.5}],"procedure":[{"id":"admissions_process","weight":2.5}],"process":[{"id":"admissions_process","weight":2.5}],"enroll":[{"id":"admissions_process","weight":2.5}],"seat":[{"id":"admissions_process","weight":2.5}],"registration":[{"id":"admissions_process","weight":2.5}],"form":[{"id":"admissions_process","weight":2.5}],"dates":[{"id":"admissions_process","weight":2.5}],"documents":[{"id":"admissions_documents","weight":2.5}],"required documents":[{"id":"admissions_documents","weight":2.5}],"certificates":[{"id":"admissions_documents","weight":2.5}],"marksheet":[{"id":"admissions_documents","weight":2.5}],"marks card":[{"id":"admissions_documents","weight":2.5}],"tc":[{"id":"admissions_documents","weight":2.5}],"transfer certificate":[{"id":"admissions_documents","weight":2.5}],"aadhaar":[{"id":"admissions_documents","weight":2.5}],"caste certificate":[{"id":"admissions_documents","weight":2.5}],"income certificate":[{"id":"admissions_documents","weight":2.5}],"photographs":[{"id":"admissions_documents","weight":2.5}],"eligibility certificate":[{"id":"admissions_documents","weight":2.5}],"eligibility":[{"id":"eligibility_cutoff","weight":2.5}],"cutoff":[{"id":"eligibility_cutoff","weight":2.5}],"cut off":[{"id":"eligibility_cutoff","weight":2.5}],"cut-off":[{"id":"eligibility_cutoff","weight":2.5}],"percentage":[{"id":"eligibility_cutoff","weight":2.5}],"marks":[{"id":"eligibility_cutoff","weight":2.5}],"minimum marks":[{"id":"eligibility_cutoff","weight":2.5}],"criteria":[{"id":"eligibility_cutoff","weight":2.5}],"sslc percentage":[{"id":"eligibility_cutoff","weight":2.5}],"pass marks":[{"id":"eligibility_cutoff","weight":2.5}],"facilities":[{"id":"facilities","weight":3.5}],"facility":[{"id":"facilities","weight":3.5}],"infrastructure":[{"id":"facilities","weight":3.5}],"labs":[{"id":"facilities","weight":3.5}],"laboratory":[{"id":"facilities","weight":3.5}],"library":[{"id":"facilities","weight":3.5}],"sports":[{"id":"facilities","weight":3.5}],"playground":[{"id":"facilities","weight":3.5}],"auditorium":[{"id":"facilities","weight":3.5}],"smart class":[{"id":"facilities","weight":3.5}],"classrooms":[{"id":"facilities","weight":3.5}],"gym":[{"id":"facilities","weight":3.5}],"canteen":[{"id":"facilities","weight":3.5}],"hostel":[{"id":"facilities","weight":3.5}],"campus":[{"id":"facilities","weight":3.5}],"amenities":[{"id":"facilities","weight":3.5}],"contact us":[{"id":"contact_location","weight":3.5}],"contact":[{"id":"contact_location","weight":3.5}],"contacts":[{"id":"contact_location","weight":3.5}],"address":[{"id":"contact_location","weight":3.5}],"phone":[{"id":"contact_location","weight":3.5}],"telephone":[{"id":"contact_location","weight":3.5}],"mobile":[{"id":"contact_location","weight":3.5}],"call":[{"id":"contact_location","weight":3.5}],"email":[{"id":"contact_location","weight":3.5}],"location":[{"id":"contact_location","weight":3.5}],"where":[{"id":"contact_location","weight":3.5}],"timings":[{"id":"contact_location","weight":3.5}],"hours":[{"id":"contact_location","weight":3.5}],"working hours":[{"id":"contact_location","weight":3.5}],"map":[{"id":"contact_location","weight":3.5}],"directions":[{"id":"contact_location","weight":3.5}],"reach":[{"id":"contact_location","weight":3.5}],"helpline":[{"id":"contact_location","weight":3.5}],"office":[{"id":"contact_location","weight":3.5}],"events":[{"id":"events","weight":3.5}],"event":[{"id":"events","weight":3.5}],"activities":[{"id":"events","weight":3.5}],"activity":[{"id":"events","weight":3.5}],"cultural":[{"id":"events","weight":3.5}],"cultural fest":[{"id":"events","weight":3.5}],"fest":[{"id":"events","weight":3.5}],"fests":[{"id":"events","weight":3.5}],"annual day":[{"id":"events","weight":3.5}],"sports day":[{"id":"events","weight":3.5}],"functions":[{"id":"events","weight":3.5}],"celebrations":[{"id":"events","weight":3.5}],"seminars":[{"id":"events","weight":3.5}],"workshops":[{"id":"events","weight":3.5}],"calendar":[{"id":"events","weight":3.5}],"competitions":[{"id":"events","weight":3.5}],"youth festival":[{"id":"events","weight":3.5}],"website":[{"id":"website_navigation","weight":2}],"navigation":[{"id":"website_navigation","weight":2}],"navigate":[{"id":"website_navigation","weight":2}],"link":[{"id":"website_navigation","weight":2}],"portal":[{"id":"website_navigation","weight":2}],"home page":[{"id":"website_navigation","weight":2}],"open":[{"id":"website_navigation","weight":2}],"go to":[{"id":"website_navigation","weight":2}],"take me":[{"id":"website_navigation","weight":2}],"redirect":[{"id":"website_navigation","weight":2}],"visit":[{"id":"website_navigation","weight":2}],"browse":[{"id":"website_navigation","weight":2}]};

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
        .replace(/[^a-z0-9\s]/g, ' ')
        .split(/\s+/)
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
          navigationMenu: item.navigationMenu || null
        };
      }

      // Fallback
      return {
        intent: 'fallback',
        category: 'fallback',
        score: 0,
        answer: `I'm sorry, I couldn't find exact details for "${userQuery}".\n\nHere are some popular topics you can explore at **${INST_SHORT}**:`,
        quickChips: ['About Us', 'Our Courses', 'Facilities', 'Contact Us', 'Events']
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
        for (const trigger of triggers) {
          if (raw.includes(trigger)) {
            const item = this.kb.find(i => i.id.includes(key));
            if (item && item.navigation) {
              return {
                intent: 'navigation_redirect',
                category: 'navigation',
                score: 10.0,
                answer: `🧭 Taking you directly to **${item.navigation.label}**:\n\n[${item.navigation.label}](${item.navigation.url})\n\nClick the button below or link above to proceed.`,
                quickChips: ['About Us', 'Our Courses', 'Facilities', 'Contact Us', 'Events'],
                navigation: item.navigation
              };
            }
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
        answer: greeting ? greeting.answer : 'Hello! How can I assist you with admissions or courses?',
        quickChips: greeting ? greeting.quickChips : []
      };
    }
  }

  const defaultEngine = new ChatbotEngine(DEFAULT_KB, DEFAULT_KW);

  // Export to module
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = { ChatbotEngine, defaultEngine, INST_ID, INST_NAME, INST_SHORT, BRAND_COLORS, DEFAULT_KB, DEFAULT_KW };
  }
  // Export to browser window
  if (typeof window !== 'undefined') {
    window.RVPUChatbot = window.RVPUChatbot || {};
    window.RVPUChatbot[INST_ID] = {
      ChatbotEngine,
      engine: defaultEngine,
      INST_ID,
      INST_NAME,
      INST_SHORT,
      BRAND_COLORS,
      kb: DEFAULT_KB,
      kw: DEFAULT_KW
    };
  }
})(typeof window !== 'undefined' ? window : global);
