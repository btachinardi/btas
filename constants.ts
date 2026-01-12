import { Experience, Skill, Award, Language, Education, Internship } from './types';

export const PROFILE = {
  name: "Bruno Tachinardi",
  title: "Software Engineer & Technical Founder",
  email: "brunotachinardi@gmail.com",
  phone: "+55 (11) 99173-0713",
  location: "Sao Paulo, Brazil",
  linkedin: "https://www.linkedin.com/in/btachinardi/",
  github: "https://github.com/btachinardi/",
  youtube: "https://youtu.be/LYUtFdxuQds",
  photo: "/profile.png",
  summary: "I build technology that transforms how people work, heal, and learn. Over 15+ years, I have founded companies, architected complex systems, and led teams through pivots, pandemics, and product launches—always focused on delivering measurable value."
};

export const LANGUAGES: Language[] = [
  { name: "Portuguese", level: "Native" },
  { name: "English", level: "Fluent" },
  { name: "Spanish", level: "Intermediate" }
];

export const SKILLS: Skill[] = [
  // AI & Machine Learning
  { name: "LLM Integration (LangChain, OpenAI API, RAG, MCP)", category: "AI/ML", level: 95 },
  { name: "Deep Learning (TensorFlow, Keras, CNN)", category: "AI/ML", level: 90 },
  { name: "Vector Databases (Pinecone)", category: "AI/ML", level: 85 },
  { name: "Tools (Jupyter Notebook, Google Colab)", category: "AI/ML", level: 85 },
  // Frontend
  { name: "React / Vue (TypeScript)", category: "Frontend", level: 90 },
  { name: "Unity3D (C#) Cross-Platform Apps", category: "Frontend", level: 90 },
  // Backend
  { name: "Node.js (NestJS, Express)", category: "Backend", level: 90 },
  { name: ".NET Core / Entity Framework", category: "Backend", level: 85 },
  { name: "PostgreSQL / MongoDB / SQL Server", category: "Backend", level: 85 },
  // DevOps & Cloud Infrastructure
  { name: "Cloud Platforms (Azure, GCP, AWS)", category: "DevOps", level: 85 },
  { name: "Containerization (Docker, Docker Compose)", category: "DevOps", level: 85 },
  { name: "CI/CD (GitHub Actions, Mobile Deployment)", category: "DevOps", level: 80 },
  { name: "Version Control (Git, Git LFS, Git Flow)", category: "DevOps", level: 90 },
  // Healthcare & Compliance
  { name: "Regulatory (HIPAA, LGPD)", category: "Healthcare", level: 85 },
  { name: "Standards (FHIR, MEDS, OpenAPI)", category: "Healthcare", level: 80 },
  { name: "Data Security & Privacy Architecture", category: "Healthcare", level: 85 },
  // Product & Design
  { name: "UX Design & Research", category: "Product", level: 85 },
  { name: "Gamification", category: "Product", level: 95 },
  { name: "Adobe Creative Suite (Photoshop, Illustrator, After Effects, Premiere)", category: "Product", level: 75 },
  { name: "Agile, MVP Development, A/B Testing", category: "Product", level: 90 },
  // Leadership
  { name: "Strategic Leadership", category: "Leadership", level: 95 },
  { name: "Product Management", category: "Leadership", level: 95 },
];

export const EXPERIENCE: Experience[] = [
  // === CURRENT ===
  {
    company: "BiomedHub",
    role: "Lead Software Developer Consultant",
    period: "Jan 2025 - Present",
    location: "Remote (NIH R35 Grant)",
    description: "Leading technical architecture for an open-source biomedical data discovery and integration hub accelerating sepsis research through data democratization.",
    achievements: [
      "Architected three-layer platform (Discovery, Harmonization, Analysis) unifying clinical and multi-omics datasets through FHIR, MEDS, and Croissant standards.",
      "Designed multi-interface system: web UI for researchers, Python libraries for data scientists, and MCP layer for AI agents.",
      "Built automated data harmonization workflows preserving semantic context from GEO, ArrayExpress, and PhysioNet.",
      "Developed containerized Nextflow analytical pipelines accessible via browser and programmatic interfaces.",
      "Implemented three-tier data access model (public, restricted, federated) with differential privacy."
    ],
    skills: ["TypeScript", "Python", "FHIR", "MEDS", "Croissant", "Nextflow", "Docker", "REST APIs", "MCP"]
  },
  // === 2025 ===
  {
    company: "HerdU",
    role: "Tech Lead & Full-Stack Developer",
    period: "Aug 2025 - Jan 2026",
    location: "Remote",
    description: "Led development of a farm management platform connecting managers and field workers through WhatsApp integration and AI-powered task management.",
    achievements: [
      "Designed scalable multi-tenant architecture supporting multiple farms with isolated data and role-based access control.",
      "Integrated WhatsApp Business API for frictionless audio report submission, eliminating app adoption barriers for rural workers.",
      "Implemented OpenAI Whisper for Portuguese speech-to-text transcription with automatic task extraction.",
      "Built comprehensive manager dashboard with real-time task tracking and worker analytics.",
      "Developed RAG sub-agent architecture maintaining context separation to improve response quality while reducing token costs."
    ],
    skills: ["TypeScript", "Node.js", "NestJS", "React", "WhatsApp Business API", "OpenAI Whisper", "PostgreSQL", "Docker"]
  },
  // === 2024-2025 ===
  {
    company: "EmbryoLabs",
    role: "Tech Lead & Full-Stack Developer",
    period: "May 2024 - Apr 2025",
    location: "Remote",
    description: "Architected and developed an AI-powered embryo classification platform for IVF clinics, helping embryologists assess embryo quality using deep learning models.",
    achievements: [
      "Built complete platform from scratch: admin dashboard, embryologist application, RESTful API, and real-time video processing pipeline.",
      "Achieved 68% reduction in video processing time (13.2s to 4.2s) through algorithm optimization and parallel processing.",
      "Developed novel multi-score frame selection algorithm using Laplacian variance, circularity scoring, texture analysis, and KMeans clustering.",
      "Implemented dual deployment strategy: Azure cloud for demos, on-premise GPU-accelerated servers for clinic production.",
      "Designed feedback collection system enabling embryologists to correct classifications for model retraining."
    ],
    skills: ["TypeScript", "Node.js", "React", "Python", "OpenCV", "Azure", "Docker", "NVIDIA CUDA", "PostgreSQL"]
  },
  // === 2022 (Consulting during Fofuuu) ===
  {
    company: "Nubank",
    role: "Product Innovation & Gamification Consultant",
    period: "Feb 2022 - Jun 2022",
    location: "Sao Paulo",
    description: "Applied entrepreneurial and gamification expertise to an innovative loyalty program project at Brazil's largest digital bank.",
    achievements: [
      "Conducted comprehensive project analysis and realigned MVP strategy with Nubank's business objectives.",
      "Led prototype creation and user validation testing, incorporating real feedback before launch.",
      "Coordinated with product designers and stakeholders to integrate MVP into existing product ecosystem.",
      "Translated business requirements into technical user stories and development specifications."
    ],
    skills: ["Product Strategy", "UX/UI Design", "User Research", "Agile", "Gamification", "Mobile Growth"]
  },
  // === 2019-2024 (Fofuuu CEO era) ===
  {
    company: "Fofuuu",
    role: "Founder & CEO",
    period: "Feb 2019 - May 2024",
    location: "Sao Paulo",
    description: "Led strategic pivot from consumer speech therapy to B2B autism therapy platform, scaling the company through fundraising, clinical validation, and product diversification.",
    achievements: [
      "Scaled Fofuuu Edu from 500 to 2,500+ therapy activities through advanced internal tooling and standardized content production.",
      "Secured R$1.5M+ in funding from Bossa Nova, Samsung, and Finep; led team expansion and product diversification.",
      "Led clinical study with Unimed demonstrating 17% average skill acquisition speed increase (31% peak).",
      "Created Fofuuu for Clinics B2B platform with AI-driven therapy plan customization and progress tracking.",
      "Developed automated activity metrics system capturing 8 new metrics previously unobservable without digital assistance.",
      "Implemented LGPD and HIPAA compliance; integrated OpenAI and LangChain for AI-powered performance insights."
    ],
    skills: ["OpenAI API", "LangChain", "React", "Unity3D", "Azure", "HIPAA/LGPD", "B2B Strategy", "Digital Health"]
  },
  // === 2017-2019 (Fofuuu CTO era) ===
  {
    company: "Fofuuu",
    role: "Co-Founder & CTO",
    period: "Jan 2017 - Feb 2019",
    location: "Sao Paulo",
    description: "Built and scaled the engineering team following initial funding, establishing technical foundations and delivering the core therapy platform.",
    achievements: [
      "Hired and led team of developers, designers, artists, and animators; formed strategic partnership with game development studio.",
      "Delivered 150+ therapy games with multi-platform support (iOS, Android, Web), patient management system, and BI dashboards.",
      "Implemented agile methodologies and CI/CD pipelines, establishing engineering best practices.",
      "Led architecture decisions and code reviews; refined signal processing with MEL spectrogram analysis."
    ],
    skills: ["Unity3D", "C#", "DevOps", "CI/CD", "Team Leadership", "Scrum", "Game Development"]
  },
  // === 2017-2018 (Fofuuu AI Research - concurrent with CTO) ===
  {
    company: "Fofuuu",
    role: "Lead AI Researcher",
    period: "Feb 2016 - Jan 2017",
    location: "Sao Paulo",
    description: "Led ML research initiative developing PhoneNet, a real-time phoneme classification model to enhance speech therapy effectiveness.",
    achievements: [
      "Developed real-time voice-to-phoneme classification system using ResNet and Mel-log spectrograms, achieving 91.54% accuracy.",
      "Optimized model for mobile edge deployment to support speech therapy for autism and Cleft Lip/Palate patients.",
      "Partnered with international ML team from Singapore for expert guidance on Speech-to-Text architectures.",
      "Launched 'Donate Your Voice' campaign, collecting 70,000 voice samples (scaled to 12M total dataset).",
      "Published 'PhoneNet' paper at the 26th Brazilian Congress of Speech Therapy."
    ],
    skills: ["TensorFlow", "Keras", "Python", "Signal Processing", "ResNet", "Mobile Edge AI", "Research"]
  },
  // === 2015-2016 (Fofuuu Solo Founder era) ===
  {
    company: "Fofuuu",
    role: "Co-Founder, CEO and Sole Developer",
    period: "May 2015 - Dec 2016",
    location: "Sao Paulo",
    description: "Founded Fofuuu by adapting an existing product into a speech therapy tool for Cleft Lip and Palate rehabilitation.",
    achievements: [
      "Developed prototype using sound signal analysis to convert airflow into real-time game inputs for therapeutic exercises.",
      "Conducted extensive user research with speech therapy professionals to identify pain points and design MVP.",
      "Initiated clinical testing with early adopters, gathering feedback to refine product-market fit.",
      "Secured first funding round through investor pitches, enabling team expansion and onboarding of third founder as CEO."
    ],
    skills: ["Unity3D", "C#", "Signal Processing", "User Research", "MVP Development", "Fundraising"]
  },
  // === 2013-2016 (Pre-Fofuuu) ===
  {
    company: "Betri Studio",
    role: "Founder & Technology Lead",
    period: "Jan 2013 - Feb 2016",
    location: "Sao Paulo",
    description: "Founded and led a digital solutions agency specializing in gamification for corporate training and engagement.",
    achievements: [
      "McDonald's Institute: Developed gamified experience educating employees on company values and history.",
      "Wella: Built HR management system with gamification mechanics to boost commercial team engagement.",
      "MAC Construction: Created performance-based rewards system with social features and competition mechanics.",
      "Zambon Pharmaceuticals: Delivered interactive Fluimucil educational campaign."
    ],
    skills: ["Game Design", "Unity3D", "C#", "Gamification", "Business Development", "Client Management"]
  },
  // === 2012-2013 (Early Career) ===
  {
    company: "MCS Java",
    role: "Course Engine Developer",
    period: "May 2012 - Mar 2013",
    location: "Sao Paulo",
    description: "Contributed to development of course creation Editor and Runtime for B2C e-learning platform.",
    achievements: [
      "Developed Flash-based course creation engine optimized for performance and accessibility.",
      "Integrated runtime with Learning Management Systems (LMS) following SCORM standards.",
      "Implemented progress bookmarking and learner path management functionality.",
      "Contributed to engine architecture despite junior role, demonstrating early technical leadership."
    ],
    skills: ["Flash/ActionScript", "SCORM", "LMS Integration", "E-Learning Development"]
  },
  {
    company: "E-Guru",
    role: "Game and Course Developer",
    period: "Jan 2012 - Feb 2013",
    location: "Sao Paulo",
    description: "Developed Flash-based e-learning applications and games for corporate HR training.",
    achievements: [
      "Led transition from ActionScript 2 to ActionScript 3, improving code versioning and reusability.",
      "Developed in-house pseudo-engine and internal tools enabling designers to create custom courses efficiently.",
      "Built intuitive course editor with JSON-based project format, streamlining asset management and feature development.",
      "Assigned to full-time engine development, delivering more efficient and competitive product offering."
    ],
    skills: ["Flash/ActionScript 2/3", "JSON", "E-Learning Development", "Tool Development"]
  }
];

export const AWARDS: Award[] = [
  {
    title: "Santander X Tomorrow Challenge",
    organization: "Santander (Global)",
    date: "2021",
    description: "Selected from 2,200+ proposals across 35 countries for gamified remote therapy platform."
  },
  {
    title: "Covid-19 Rapid Innovation Award",
    organization: "City of Sao Paulo",
    date: "2020",
    description: "Recognized for rapid adaptation of therapy platform to support telemedicine during the pandemic."
  },
  {
    title: "Social Impact Games Award",
    organization: "Games for Change / Itamaraty",
    date: "2019",
    description: "Selected to represent Brazil at international events in London, Berlin, Paris, and New York."
  },
  {
    title: "Samsung Creative Startups",
    organization: "Samsung",
    date: "2019",
    description: "Featured in Samsung's inclusive technology campaign; selected for startup acceleration program.",
    link: "https://youtu.be/LYUtFdxuQds"
  },
  {
    title: "Best Children's Game",
    organization: "BIG Festival",
    date: "2018",
    description: "Chosen by children from GRAAC as most enjoyable game, competing against entertainment titles."
  },
  {
    title: "Outstanding Health Startup",
    organization: "Artemisia / Sabin Institute",
    date: "2017",
    description: "Selected from 171 companies for potential to impact Brazil's public health system."
  },
  {
    title: "Health Entrepreneurship Award",
    organization: "Sirio-Libanes Hospital",
    date: "2016",
    description: "Recognized for voice recognition technology advancing speech therapy tools."
  },
  {
    title: "Best Startup",
    organization: "BioStartup Lab",
    date: "2016",
    description: "Top startup in inaugural cohort with peer-voted honorable mention for dedication."
  },
  {
    title: "Best Educational Game",
    organization: "BIG Festival / BNDES",
    date: "2015",
    description: "First major recognition for Fofuuu's digital health game for speech therapy."
  }
];

export const EDUCATION: Education[] = [
  {
    degree: "Bachelor of Game Design",
    institution: "Anhembi Morumbi University",
    location: "Sao Paulo",
    period: "Jan 2008 - Dec 2011",
    achievements: [
      "Developed top-scoring final project: a technically robust, launch-ready gamified product.",
      "Published research paper: 'Definicao e Estrutura do Ambiente Competitivo de um Jogo: um Estudo'.",
      "Focused on advanced programming, rendering algorithms, and network development.",
      "Explored game theory, gamification dynamics, and behavioral design applications for health and habit formation."
    ]
  }
];

export const INTERNSHIPS: Internship[] = [
  {
    company: "E-Guru",
    role: "Course Developer Intern",
    period: "Oct 2010 - May 2011",
    location: "Sao Paulo",
    description: "E-learning course development and localization for corporate training.",
    achievements: [
      "Automated course translation workflow using PowerShell scripts and custom Flash plugin, significantly reducing localization time.",
      "Developed automation system adopted by team, improving overall efficiency.",
      "Progressed to development tasks in main course production pipeline."
    ],
    skills: ["PowerShell", "Flash/ActionScript"]
  }
];
