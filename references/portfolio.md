# Bruno Tachinardi - Project Portfolio

Technology leader and entrepreneur with 15+ years building software across healthcare, AI, and enterprise applications. I specialize in transforming complex technical challenges into elegant, user-centered solutions.

---

## Recent Projects

### BiomedHub
**Open-Source Discovery & Integration Hub for Biomedical Data**

*Role: Lead Software Developer Consultant | January 2025 - Present*

Sepsis kills more than 11 million people annually worldwide, yet research progress is hampered by fragmented data scattered across incompatible repositories. BiomedHub is an NIH R35-funded initiative to change that. The platform bridges GEO, ArrayExpress, PhysioNet, and other biomedical repositories, preserving the semantic context that researchers typically lose when moving data between systems.

#### The Challenge

Sepsis research faces a data crisis:
- **Fragmentation**: Critical datasets exist in silos across repositories with incompatible formats
- **Context Loss**: When data is transferred, metadata and provenance disappear, breaking reproducibility
- **Accessibility Gap**: Researchers without computational expertise cannot leverage available tools
- **No End-to-End Solution**: Existing tools address pieces of the workflow but fail to preserve context through the entire study lifecycle

#### My Contribution

I designed and am building a three-layer architecture that guides researchers from hypothesis to publication:

**Discovery Layer** - Finding the Right Data
- AI-powered assistant that suggests relevant datasets based on research questions
- Automated mapping of data fields to standard vocabularies (FHIR, SNOMED-CT)
- Human-in-the-loop review ensuring transparency and researcher control

**Harmonization Layer** - Preserving Context
- Automated data transformation that maintains semantic relationships
- Output in Medical Event Data Standard (MEDS) format for cross-study compatibility
- Complete provenance tracking from source to analysis

**Analysis Layer** - Reproducible Research
- Pre-built, containerized workflows powered by Nextflow
- Automatic metadata generation enabling one-click reproducibility
- Both programmatic and browser-based interfaces

**Three Interfaces for Different Users**
| Interface | Target User | Use Case |
|-----------|-------------|----------|
| Web UI | Clinical researchers | Guided workflows, visual exploration |
| Python SDK | Data scientists | Programmatic access, custom pipelines |
| MCP Layer | AI agents | Automated research workflows |

**Privacy-Preserving Architecture**
| Tier | Access Model | Data Handling |
|------|--------------|---------------|
| Public | Open access | Harmonized, downloadable datasets |
| Restricted | Owner-controlled | Authenticated access with audit trails |
| Federated | Local execution only | Only aggregate results leave the source |

#### Technologies
TypeScript, Python, FHIR, MEDS, Croissant, Nextflow, Docker, REST APIs, Model Context Protocol (MCP)

#### Expected Impact
When complete, BiomedHub will enable researchers to discover, harmonize, and analyze biomedical data in hours rather than months, with full reproducibility and privacy compliance.

---

### EmbryoLabs
**AI-Powered Embryo Classification Platform for IVF Clinics**

*Role: Tech Lead & Full-Stack Developer | May 2024 - April 2025*

In IVF procedures, selecting the right embryo for transfer is one of the most consequential decisions an embryologist makes. EmbryoLabs brings deep learning to this decision, providing consistent, data-driven assessments that augment clinical expertise and improve patient outcomes.

#### The Challenge

IVF clinics faced critical limitations:
- **Time Constraints**: Manual review of time-lapse videos is slow and inconsistent
- **Subjectivity**: Embryo quality assessment varies significantly between embryologists
- **Record Keeping**: Clinical validation requires detailed, auditable assessment records
- **Deployment Complexity**: Clinics need both cloud flexibility and on-premise data security

#### My Contribution

I designed and built the complete platform from scratch, solving both the technical and clinical workflow challenges:

**Full-Stack Platform Architecture**
- **Admin Dashboard** (admin.embryolabs.io) - System configuration and user management
- **Embryologist Application** (app.embryolabs.io) - Video upload, analysis, and classification review
- **RESTful API Backend** - TypeScript/Node.js with real-time processing status
- **Progress Tracking** - WebSocket-based updates for long-running video analysis

**Video Processing Optimization**
The original processing pipeline took 13.2 seconds per video, creating unacceptable clinical workflow delays. Through systematic optimization, I achieved a **68% reduction in processing time**:

| Optimization | Technique | Impact |
|--------------|-----------|--------|
| Algorithm | Refactored frame extraction logic | 3.1s saved |
| Parallelization | Multi-threaded video decoding | 2.8s saved |
| GPU Acceleration | NVIDIA CUDA for image analysis | 3.1s saved |
| **Total** | **13.2s to 4.2s per video** | **68% faster** |

**Novel Frame Selection Algorithm**
Embryo classification accuracy depends on selecting optimal frames from time-lapse videos. I developed a multi-score system combining five distinct metrics:

| Metric | Purpose |
|--------|---------|
| Laplacian Variance | Detects focus and sharpness |
| Circularity Scoring | Identifies embryo contours via shape analysis |
| Occupation Scoring | Ensures optimal embryo positioning in frame |
| Texture Analysis | Evaluates cell structure via Local Binary Pattern entropy |
| KMeans Clustering | Guarantees diversity across selected frames |

**Intelligent Quality Assurance**
- Automated confidence scoring for frame selection quality
- Three-tier classification: Ideal, Medium, and Low confidence
- Automatic prompts for video re-upload when quality is insufficient

**Dual Deployment Architecture**
| Environment | Use Case | Infrastructure |
|-------------|----------|----------------|
| Cloud (Azure) | Demos, remote clinics | Scalable, managed services |
| On-Premise | Production clinics | Local GPU servers, data sovereignty |

Automated installation scripts enable clinic IT teams to deploy in under 30 minutes.

**Continuous Improvement Pipeline**
- Embryologist feedback collection integrated into the UI
- Classification correction logging for model retraining
- Complete audit trail meeting clinical validation requirements

#### Technologies
TypeScript, Node.js, React, Python, OpenCV, Azure Cloud, Docker, NVIDIA CUDA, PostgreSQL

#### Results
- **Deployed** to production IVF laboratories
- **5-second average** processing time per video in clinical use
- **Positive clinical feedback** on classification accuracy and workflow integration

---

### HerdU
**Farm Management Platform with WhatsApp Integration**

*Role: Tech Lead & Full-Stack Developer | August 2025 - January 2026*

Brazilian farms face a fundamental technology gap: managers need digital visibility into operations, but field workers often lack the technical literacy or patience for traditional apps. HerdU solves this by meeting workers where they already are: WhatsApp. Workers send voice messages; AI transforms them into structured tasks.

#### The Challenge

Agricultural technology adoption fails when it ignores user realities:
- **Literacy Barriers**: Field workers have varying comfort levels with technology
- **Adoption Friction**: Custom apps require training and create workflow disruption
- **Real-Time Visibility**: Managers need immediate insight into field activities
- **Communication Preferences**: Rural workers prefer voice over text input

#### My Contribution

**WhatsApp Business API Integration**
- Zero-friction worker onboarding through a platform they already use daily
- Audio message submission for field reports and task updates
- Automatic registration flow requiring no technical setup

**AI-Powered Audio Processing**
| Component | Capability |
|-----------|------------|
| OpenAI Whisper | High-accuracy Portuguese transcription |
| Custom NLP Pipeline | Task extraction and categorization |
| Accent Handling | Support for regional dialects and rural vocabulary |

**Multi-Tenant Architecture**
- Scalable infrastructure supporting multiple independent farms
- Complete data isolation with tenant-specific schemas
- Role-based access control: Farm Owner, Manager, Worker
- Self-service team invitation and onboarding

**Manager Dashboard** (dashboard.herdu.app)
- Real-time task tracking with assignment workflows
- Worker performance analytics and reporting
- Audio report library with synchronized transcriptions
- Visual task boards and timeline views

**Context-Preserving AI Agent Architecture**
I implemented a novel sub-agent architecture for RAG that addresses common LLM context pollution:

| Agent | Responsibility | Benefit |
|-------|----------------|---------|
| Research Agent | Information retrieval and synthesis | Isolated context, focused queries |
| Main Agent | Task extraction and user interaction | Clean context, lower token costs |
| Coordinator | Context handoff and synthesis | Quality improvement, cost reduction |

This architecture improved response quality while reducing token consumption by keeping research context separate from the main conversation.

#### Technologies
TypeScript, Node.js, NestJS, React, WhatsApp Business API, OpenAI Whisper, PostgreSQL, Docker

#### Key Insight
The decision to use WhatsApp as the primary input method was validated unanimously by stakeholders during user research. For rural workers, eliminating app installation and training was the difference between adoption and abandonment.

---

## Featured Past Projects

### Fofuuu
**Digital Health Platform for Autism and Speech Therapy**

*Role: Founder & CEO | 2015 - 2024*

What began as a single speech therapy game grew into Brazil's leading digital therapy platform. Over nine years, I took Fofuuu from prototype to a clinically-validated platform serving thousands of therapists and families with tools that make therapy more engaging and measurable.

#### Platform at Scale

| Metric | Value |
|--------|-------|
| Gamified Activities | 2,500+ |
| Platforms | Android, iOS, Windows, macOS |
| Business Model | B2B SaaS for clinics + B2C for families |

#### PhoneNet: Deep Learning for Speech Therapy

I led the development of a real-time phoneme classification model that enables automated speech assessment:

| Achievement | Details |
|-------------|---------|
| Accuracy | 91.54% phoneme recognition |
| Architecture | ResNet-based, optimized for mobile devices |
| Training Data | 12 million speech samples via "Donate Your Voice" campaign |
| Publication | 26th Brazilian Congress of Speech Therapy |

#### Clinical Validation

A partnership study with Unifesp (Federal University of Sao Paulo) demonstrated measurable therapeutic outcomes:
- **17% average improvement** in skill acquisition across participants
- **31% peak improvement** in highest-responding cohort
- Published at the 16th Congress of Otorhinolaryngology Foundation

#### Technical Innovations

| Innovation | Impact |
|------------|--------|
| Automated Metrics System | 8 new therapy metrics previously unobservable by clinicians |
| Claims-Based Access Control | LGPD/HIPAA-compliant data governance |
| AI Therapy Customization | Personalized activity recommendations based on progress |
| Real-Time Adaptation | Dynamic difficulty adjustment during activities |

#### Awards & Recognition

| Year | Award | Organization |
|------|-------|--------------|
| 2015 | Best Educational Game | BIG Festival / BNDES |
| 2016 | Best Startup | BioStartup Lab |
| 2016 | Health Entrepreneurship Award | Sirio-Libanes / NTT Data |
| 2017 | Outstanding Health Startup | Sabin Institute / Artemisia |
| 2018 | Best Children's Game | BIG Festival |
| 2019 | Samsung Creative Startups | Samsung |
| 2019 | Social Impact Games Award | Itamaraty / Games for Change |
| 2020 | Covid-19 Rapid Innovation | City of Sao Paulo |
| 2021 | Tomorrow Challenge | Santander X |

#### Technologies
Unity3D (C#), .NET Core, Entity Framework, TensorFlow, Keras, Vue.js, React, Python

---

### Betri Studio
**Digital Solutions & Gamification Agency**

*Role: Founder & Technology Lead | January 2013 - February 2016*

Before "gamification" became a buzzword, I built an agency that applied game design principles to solve real business problems. Betri Studio helped enterprise clients transform employee training, sales incentives, and educational campaigns through engaging digital experiences.

#### Selected Client Projects

| Client | Project | Outcome |
|--------|---------|---------|
| **McDonald's Institute** | Employee education platform | Gamified onboarding teaching organizational history, values, and vision |
| **Wella** | HR management system | Gamified features driving adoption across the commercial sales team |
| **MAC Construction** | Sales incentive platform | Rewards system with social features, avatars, and prize mechanics |
| **Zambon Pharmaceuticals** | Fluimucil educational campaign | Interactive learning combining entertainment with product knowledge |

---

### Nubank
**Product Innovation & Gamification Consultant**

*Role: Consultant | February 2022 - June 2022*

Brazil's largest digital bank brought me in to help design an innovative loyalty program. I applied a decade of gamification and product experience to shape their MVP strategy.

#### Contributions

| Area | Deliverable |
|------|-------------|
| Strategy | MVP scope refinement aligned with business objectives |
| Validation | User research and prototype testing with real customers |
| Technical Planning | User story development and implementation roadmap |
| Gamification | Engagement mechanics design based on behavioral psychology |

---

## Technical Expertise

### Current Focus Areas

| Domain | Capabilities |
|--------|--------------|
| **AI/LLM Integration** | LangChain, custom agents, Model Context Protocol (MCP), RAG architectures |
| **Full-Stack Development** | TypeScript/Node.js backends, React frontends, cross-platform mobile |
| **Healthcare Technology** | HIPAA/LGPD compliance, FHIR, MEDS, clinical data pipelines |
| **Video/Audio Processing** | Real-time pipelines, computer vision (OpenCV), speech-to-text |

### Architecture Patterns

| Pattern | Application |
|---------|-------------|
| Multi-Tenant SaaS | Data isolation, tenant-specific configurations, scalable infrastructure |
| Event-Driven Systems | Decoupled services, real-time processing, audit trails |
| AI Agent Orchestration | Sub-agent coordination, context preservation, cost optimization |
| Privacy-Preserving Federated | Local execution, aggregate-only sharing, compliance by design |

### Cloud & DevOps

| Category | Technologies |
|----------|--------------|
| Cloud Platforms | Azure, AWS, Google Cloud |
| Containerization | Docker, multi-stage builds, GPU-enabled containers |
| CI/CD | GitHub Actions, automated testing, deployment pipelines |
| GPU Infrastructure | NVIDIA CUDA, on-premise and cloud GPU deployments |

---

## Publications

| Title | Venue | Year |
|-------|-------|------|
| **PhoneNet: A Neural Network with Deep Learning for Real-Time Phoneme Recognition in Digital Games** | 26th Brazilian Congress of Speech Therapy | 2018 |
| **Definicao e Estrutura do Ambiente Competitivo de um Jogo: um Estudo** | Academic Game Design Research | - |

---

## Contact

| Channel | Details |
|---------|---------|
| Email | brunotachinardi@gmail.com |
| Phone | +55 11 99173-0713 |
| Location | Sao Paulo, Brazil |
| LinkedIn | [linkedin.com/in/btachinardi](https://www.linkedin.com/in/btachinardi/) |
| GitHub | [github.com/btachinardi](https://github.com/btachinardi/) |
