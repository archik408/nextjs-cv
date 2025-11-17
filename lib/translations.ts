import { ELanguage } from '@/constants/enums';

export const translations = {
  [ELanguage.en]: {
    skipLinkMain: 'Skip to main content',
    // Accessibility Page
    accessibility: 'Accessibility',
    accessibilityTitle: 'Accessibility Statement',
    accessibilityIntro:
      'I am committed to making this website usable by all people, including those using assistive technologies. I aim to conform to the Web Content Accessibility Guidelines (WCAG) 2.2 Level AA.',
    accessibilityMeasuresTitle: 'Measures taken',
    accessibilityMeasuresList: [
      'Semantic landmarks: header, main, footer, and clear section headings',
      'Keyboard accessibility: visible focus styles and skip link to main content',
      'Text alternatives for meaningful images; decorative images marked accordingly',
      'Color contrast meeting or exceeding Level AA guidelines where applicable',
      'Light and dark theme support for situational switching in low contrast use cases',
      'Responsive design and reflow without loss of content or functionality',
      'Reduce motions (switch off all animations) based on user OS settings',
    ],
    accessibilityFeedbackTitle: 'Feedback and contact',
    accessibilityFeedbackText:
      'If you encounter an accessibility barrier, please contact me at <a href="mailto:artur.basak.devingrodno@gmail.com">artur.basak.devingrodno@gmail.com</a>. I typically respond within 5 business days.',
    accessibilityAssessmentTitle: 'Assessment approach',
    accessibilityAssessmentText:
      'The site is tested using manual keyboard navigation, screen reader spot checks (VoiceOver), and automated tooling for common issues (Axe DevTools, WebAIM WAVE, Google Lighthouse). Accessibility is an ongoing effort.',
    accessibilityLimitationsTitle: 'Known limitations',
    accessibilityLimitationsText: [
      'Some dynamic visualizations may have reduced screen reader verbosity.',
      'Some images may not contain very detailed alt texts.',
      'Some pages of the site are localized for only one language - my native Russian (for example, Digital Garden notes are only in Russian)',
      'This website has not been tested with screen readers other than VoiceOver, so there is no guarantee that it will work with JAWS, NVDA, Narrator, Orca, etc.',
      'After closing the dialog box with the enlarged image, the focus is lost on the original content.',
      'I am working on adding improved labels and descriptions.',
    ],
    // Privacy Policy Page
    privacyTitle: 'Privacy Policy',
    privacyIntro:
      'This page describes my privacy practices and how I handle data on this website. I want to be transparent about what data I collect and how I use it.',
    privacyAnalyticsTitle: 'Analytics',
    privacyAnalyticsText:
      'I use standard Vercel Speed Insights and Vercel Analytics to understand how visitors interact with this website and to improve its performance. These tools help me identify performance bottlenecks, understand user behavior patterns, and make the site better. No personal data is collected through these analytics tools. The data collected is anonymized and aggregated, and I do not have access to any personally identifiable information.',
    privacyDataTitle: 'Data Collection',
    privacyDataText:
      'I do not collect, store, or process any personal data from visitors to this website. The analytics tools I use (Vercel Speed Insights and Vercel Analytics) operate with <a target="_blank" rel="noopener noreferrer" href="https://vercel.com/docs/analytics">default settings</a> that respect user privacy and do not collect personal information. I do not use cookies to track users, and I do not have any forms or user accounts that would require personal information.',
    privacyNoSellingTitle: 'No Data Selling or Sharing',
    privacyNoSellingText:
      'I do not sell, rent, or share any data with third parties. Since I do not collect personal data, there is nothing to sell or share. I personally do not engage in any data monetization practices, and I am committed to maintaining your privacy.',
    privacyOpenSourceTitle: 'Open Source',
    privacyOpenSourceText:
      'This website is open source, so you can review the code yourself to verify what data is being collected and how it is used. The source code is available on <a href="https://github.com/archik408/nextjs-cv" target="_blank" rel="noopener noreferrer">GitHub</a>. If you have any questions or concerns about privacy, please contact me at <a href="mailto:artur.basak.devingrodno@gmail.com">artur.basak.devingrodno@gmail.com</a>.',
    role: 'Web UI/UX Engineer',
    subtitle: 'Building the Web of Tomorrow, Grounded in the Engineering of the Past.',
    about: 'About Me',
    aboutText: `Hello! I'm Artur, a second-generation software programmer. My passion for computers is a family legacy, ignited by my godfather and school Computer Science teacher, and then fueled by over a decade of hands-on experience across the entire spectrum of software development.<br><br>
My journey is <span class="text-double-underline">a bridge<img aria-hidden="true" src="/double-underline.png" alt="" class="double-underline"></span> between computing eras. It began with the structured programming with <em>Pascal</em>, <em>C++</em> and <em>Borland <abbr title="Visual Component Library">VCL</abbr></em>, where I learned the core principles of memory management and algorithms. I then built powerful desktop and early web applications for the enterprise world using <em>Java</em>, <em><abbr title="Java Server Pages/JavaServer Faces">JSP/JSF</abbr></em>, <em>Eclipse <abbr title="Rich Client Platform/Remote Application Platform">RCP/RAP</abbr></em> and <em><abbr title="Standard Widget Toolkit">SWT</abbr></em>, and gained a critical eye for quality and process through test automation with <em>Selenium RC</em> and later <em>WebDriver</em>, <em>Cypress</em> and <em>Playwright</em>.<br/><br/>
I was on the front lines of the web's transformation, crafting dynamic applications with its first-generation tools: <em><abbr title="Asynchronous Javascript and XML ">AJAX</abbr></em>, <em>jQuery UI</em>, <em>ExtJS</em>, <em>Angular.js</em>, and <em>Ember.js</em>. This deep historical context is my greatest asset. It allows me to architect modern <em>React</em>, <em>Web Components</em> and <em>TypeScript</em> applications with a profound understanding of the problems they solve, ensuring they are not just trendy but <span class="text-single-underline">truly well-engineered<img aria-hidden="true" src="/single-underline.png" alt="" class="single-underline"></span>, scalable, and built to last.<br/><br/>
Today, I focus on creating accessible, user-centric, offline and mobile-first <em>Progressive Web Apps (<abbr>PWA</abbr>)</em> and robust frontend architectures based on modern tools like <em>Webpack</em>, <em>Vite</em>, <em>Next.js</em>, <em>MobX</em>, <em>React-Router</em>, <em>Material UI</em>, <em>Tailwind CSS</em>, <em>Rust/WebAssembly</em>, etc.<br/>
I've been trusted to deliver solutions for industry giants like Daimler and SAP, retailers like X5 Group ans Kohl's, tech innovators like Croc, startups like TrueImpact, Lition, Tispr/Indy and chemical leaders like Sibur and Evonik.<br/><br/>
Now, I've come full circle: I'm passing on the logic and joy of creation to the next generation by teaching my children to code in <em>Scratch</em>, <em>MakeCode</em> and <em>Blockly</em>.`,
    cleanCode: 'Clean Code',
    cleanCodeDesc:
      'Writing maintainable and scalable code based on <abbr title="single responsibility, open–closed, Liskov substitution, interface segregation, dependency inversion">SOLID</abbr>, <abbr title="Keep It Simple, Stupid">KISS</abbr>, <abbr title="You Aren\'t Gonna Need It">YAGNI</abbr> and <abbr title="Don\'t Repeat Yourself">DRY</abbr> principles',
    components: 'Components',
    componentsDesc: 'Building reusable, accessible, responsive and user-friendly UI components',
    bestPractices: 'Best Practices',
    bestPracticesDesc: 'Following industry standards with modern frontend frameworks and tools',
    learning: 'Learning',
    learningDesc:
      'Continuous improvement and learning through practice and <abbr title="Massive Open Online Courses">MOOC</abbr> platforms (Frontend Masters, Coursera, edX)',
    skills: 'Core Expertise (USP)',
    skillsDescription:
      'Deep expertise across the full spectrum of modern web development, from architecture to team leadership',
    expertise: [
      {
        title: 'Frontend Architecture & Technical Strategy',
        description:
          'Designing scalable web systems, micro-frontends, and long-term tech vision for enterprise applications',
      },
      {
        title: 'Design Systems & UI Engineering Leadership',
        description:
          'Building and governing component libraries, bridging design-development workflow, ensuring consistency at scale',
      },
      {
        title: 'Web Performance & Platform Excellence',
        description:
          'Optimizing Core Web Vitals, PWA/offline capabilities, web accessibility (WCAG), web security (OWASP) and cross-platform compatibility with RWD/mobile-first approaches',
      },
      {
        title: 'Modern React & Web Standards Evolution',
        description:
          'Architecting with React/Next.js ecosystem while advancing web platform through Lit/Web Components and Rust/WASM',
      },
      {
        title: 'Web Accessibility Consulting & Audits',
        description:
          'Providing accessibility consultations, conducting and performing accessibility audits, deeply immersed in this topic. Also running a small Telegram channel about accessibility: <a href="https://t.me/proa11y" target="_blank" rel="noopener noreferrer">@proa11y</a>',
      },
      {
        title: 'Full-Stack JavaScript & Platform Engineering',
        description:
          'Architecting end-to-end solutions with Node.js/Deno/Bun, Rust/WASM, and cloud-native deployment',
      },
    ],
    mySetup: 'My Setup',
    mySetupDescription: 'Essential development tools I use daily',
    experience: 'Experience',
    experiences: [
      {
        role: 'Senior Software Engineer',
        company: 'IntexSoft',
        period: '2022 - Present',
        listDescription: [
          'Led the development of a hybrid mobile application using React.js, PWA, and Fugu API for one of the largest grocery retail groups globally, operating 20k+ convenience stores with MAU ~20 million',
          'Implemented offline functionality for the app, thereby increasing user retention and reducing attrition based on ServiceWorker API/Workbox, IndexedDB and Dixie.js',
          'Increased NPS by improving UI based on A/B Testing and UX Interviews & Research',
          'Integrated advanced web technologies to deliver a seamless cross-platform experience for both iOS and Android, ensuring high performance and scalability with a lot of modern APIs like View Transition API, Vibration API, Geolocation API, Web Share and Lottie animations',
          'Participated in AI/LLM integration for moderation and fraud detection',
          'Collaborated closely with cross-functional teams to align the application with business goals, resulting in improved user engagement and operational efficiency',
          'Implemented side projects like admin/moderation application based on React-Admin and mock Bun server plus a bunch of landing pages based on SSR/Next.js',
        ],
      },
      {
        role: 'Software Engineering Manager',
        company: 'Godel Technologies',
        period: '2021 - 2022',
        listDescription: [
          "Managed the company's 4th largest division, overseeing operations across Grodno, Belarus, and Vilnius, Lithuania",
          'Acted as the primary point of contact for medium to large UK clients, processing their requests and ensuring alignment with internal workforce capabilities',
          'Optimized resource allocation by matching client needs with the most suitable engineers from the internal talent pool, ensuring high-quality project delivery',
          "As a Talent Manager, provided mentorship and career guidance to the division's top senior engineers, helping them formulate and achieve their professional goals using SWOT analysis and SMART method",
          'Successfully introduced and implemented OKRs (Objectives and Key Results) across the division',
        ],
      },
      {
        role: 'Senior Web Engineer',
        company: 'Indy (ex-Tispr)',
        period: '2019 - 2021',
        listDescription: [
          'Enhanced the existing functionality of the web platform and played a pivotal role in the design and implementation of major new features, including WYSIWYG rich editors, calendars, task boards, and white-labeling solutions',
          "Developed and maintained the company's custom Design System/UI Kit (Tispr Design Library - TDL), ensuring consistency and scalability across all projects",
          'Migrated the UI Kit to a sharable npm package hosted on the Nexus registry, enabling seamless integration and reuse across multiple projects',
          'Adopted approach with Design Tokens based on CSS Custom Properties and later wrote about that in Smashing Magazine and Better Programming articles',
          'Introduced and implemented unit and integration testing for the frontend codebase, transitioning from Enzyme to React Testing Library (RTL). Increased test coverage from zero to over 50%, significantly improving code quality and reliability',
          'Designed and implemented a modern architecture for the website and content blog using headless CMS (Strapi) and server-side rendering (SSR, Next.js), resulting in enhanced SEO, performance, and user engagement',
          'Played a key role in interviewing and forming a strong onsite frontend team, replacing all outstaff personnel with senior software engineers',
        ],
      },
      {
        role: 'Web Software Engineer',
        company: '*instinctools EE Labs',
        period: '2010 - 2019',
        listDescription: [
          'Over 9 years, contributed to 20+ projects across a diverse range of clients, including enterprise-level companies (Daimler, Evonik, SIBUR), mid-sized businesses (Florence Healthcare, NextGate, EquipmentWatch, Westernacher), and startups (TrueImpact, Lition Energy)',
          'Primarily worked through outsourcing and outstaffing models, delivering high-quality Web UI and Frontend solutions tailored to client needs',
          'Joined the company as a QA Engineer/SDET when it had 20+ employees and played a key role in its transformation into a thriving organization with 300+ employees',
          'Advanced to the position of Lead Software Engineer, where I managed one of the engineering groups within the Web Department, overseeing a team of 9 engineers',
          'Provided technical leadership, mentorship, and guidance to the team, ensuring the successful delivery of projects and fostering a culture of collaboration and innovation',
          'Delivered scalable and user-friendly Web UI/Frontend solutions for clients across various industries',
          "Supported the company's growth by contributing to process improvements, team development, and the establishment of best practices in software engineering",
        ],
      },
      {
        role: 'Lead Web Engineer <small>(outstaff from *instinctools)</small>',
        company: 'Lition Energy',
        period: '2018-2019',
        listDescription: [
          'Developed from scratch a web application for the German blockchain startup Lition Energy, creating a green energy purchasing platform based on full-featured JavaScript technologies such as React.js, Redux, Next.js / SSR, Headless CMS, Node.js, Express.js, Knex.js, MySQL, and Ethereum.',
          'Adapted all projects to mobile, tablet, and desktop screens using a RWD approach.',
          'Maintained a high level of frontend accessibility using Lighthouse metrics.',
          'Improved the backend quality by implementing unit and integration tests.',
          'Developed an architecture based on a Headless CMS (Contentful) and SSR (Next.js) to replace the old WordPress platform so the client could conveniently manage landing page content for various consumer groups. Improved SEO and Core Web Vitals to increase search visibility.',
          'Integrated the third-party PowerCloud system for electricity payment and billing.',
          'Led the frontend and backend development team.',
          'As a result, the startup raised $5 million during the ICO round and was mentioned in Forbes, and was later sold.',
        ],
      },
      {
        role: 'Web Fundamentals Trainer',
        company: 'IT Academy',
        period: '2018',
        listDescription: ['Led the course "Website development using HTML, CSS and JavaScript"'],
      },
      {
        role: 'Lead Frontend Engineer <small>(outstaff from *instinctools)</small>',
        company: 'Big Three Management Consulting (NDA, but easy to Google)',
        period: '2016-2018',
        listDescription: [
          'Developing a competitive matching module for an analytics platform for a leading US retailer. Main tech stack was React, Redux (own customization based on Publisher-Subscriber pattern), React-Toolbox UI, Unit tests with Enzyme and End-to-End tests with WebDriver. ',
          'Managing a team of front-end developers who developed the front-end for a strategic web application enabling competitive analysis of product range and pricing in the mass market segment.',
          'Migrating legacy modules from jQuery to modern React, creating a high-performance interface with a sophisticated filter system, interactive catalog, dashboards and modern UX based on user surveys and testing.',
          'The implemented functionality provided the client with a data-driven decision-making tool, enabling real-time comparison of their key product categories with those of major market players (Amazon, Target, TJ Maxx).',
        ],
      },
      {
        role: 'Frontend Software Engineer <small>(outstaff from *instinctools)</small>',
        company: 'TrueImpact',
        period: '2015-2016',
        listDescription: [
          'Developing a user interface using Angular.js 1.5 and Bootstrap for TrueImpact, a startup that provides grant analysis, charitable investment, and volunteerism analytics from scratch in a very fast and flexible timeframe. At the initial stage, it was crucial to act quickly and show investors a demo every day.',
          'Later, the MVP was transformed into a ready-to-use app with a thorough redesign of the communication logic and UX.',
        ],
      },
      {
        role: 'JavaScript Software Engineer <small>(outstaff from *instinctools)</small>',
        company: 'EquipmentWatch',
        period: '2015-2016',
        listDescription: [
          'Starting from this project fully focused on JavaScript stack and got on EquipmentWatch project, developing web-based application on Ember.js and Node.js, MongoDB.',
          'Mostly was focus on UI part and SPA routing with Ember.js and ecosystem around framework.',
          'Later project was sold to Randall-Reilly.',
        ],
      },
      {
        role: 'Java Software Engineer <small>(outstaff from *instinctools)</small>',
        company: 'Westernacher Solutions',
        period: '2014-2015',
        listDescription: [
          'I developed the ZEUS software for the German Chamber of Notaries using the ExtJS framework and Java, Spring, Hibernate, and BPMN/Activiti.',
          'Primarily worked on the user interface and frontend of a single-page application (SPA), using a routing approach with ExtJS 4 and new UI Theme Neptune.',
          'I learned a lot from my German colleagues in the fields of JavaScript and Domain-Driven Design (DDD). Fun fact: I remember when I joined team send me PDF copy of Eric Evans book about DDD and said "Read it before start"',
        ],
      },
      {
        role: 'Java Software Engineer <small>(outstaff from *instinctools)</small>',
        company: 'SIBUR',
        period: '2013-2014',
        listDescription: [
          'I was involved in developing an enterprise content management (ECM) system for Sibur Holding based on Documentum ECM, Oracle, Java/JSP, and ExtJS 3.5. The process was a waterfall, with an expected estimation 10 person-years of development time.',
          'On the team, I specialized in UI development using ExtJS and legacy CSS approaches, such as table layout and floats.',
          'I also was a first line to worked on JavaScript bug fixes.',
        ],
      },
      {
        role: 'Java Software Engineer <small>(outstaff from *instinctools)</small>',
        company: 'Mercedes Benz Daimler AG',
        period: '2012-2013',
        listDescription: [
          'Developed an internal user management system (UMS) for Daimler AG concern. I was chosen for this project due to my combination of backend, frontend, and test automation skills.',
          'I handled all layout and frontend tasks, including mobile adaptation with technologies like jQuery UI and jQuery Mobile, JSF PrimeFaces and XHTML.',
          'Supported the backend with Java Core and IBM DB2.',
          'Increased coverage and configured tests with Selenium and JMeter.',
          'Fun fact: I even drew icons in Photoshop for the various button states of wide range of tables.',
        ],
      },
      {
        role: 'Java Software Engineer <small>(outstaff from *instinctools)</small>',
        company: 'Evonik AG',
        period: '2011-2012',
        listDescription: [
          'I participated in the development of a web-based document management system based on Ditaworks solutions using technologies such as Java, Eclipse RAP/RCP, qooxdoo.js and SWT. My focus was on implementing BIRT (Business Intelligence and Reporting Tools) reporting functionality at the intersection of JavaScript and Java technologies.',
          'Previously as QA engineer I tested the multi-touch presentation table app at the Evonik exhibition.',
        ],
      },
      {
        role: 'QA Engineer <small>(outstaff from *instinctools)</small>',
        company: 'CROC',
        period: '2010-2011',
        listDescription: [
          'Tested a document management system based on EMC Documentum. Supported test scenarios in Excel spreadsheets. Conducted cross-browser testing, including very old versions of Opera and IE7.',
        ],
      },
    ],
    funActivities: 'Fun Activities',
    artTitle: 'Art & Illustration',
    artDesc:
      'Creating digital art and classical illustrations based on mythological creatures, as well as exhibitions in museums and castles, creating printed books with my illustrations',
    kidsTitle: 'Kids Programming',
    kidsDesc:
      'Teaching children programming basics with Scratch, MakeCode and Blockly using Micro:bit and MakeyMakey boards',
    cycleTitle: 'Cycling',
    cycleDesc:
      'Enjoying long-distance cycling and city rides — it helps me reset my mind and find elegant solutions to complex engineering problems.',
    stampsTitle: 'Stamp Collecting',
    stampsDesc:
      'Collecting stamps and postal items featuring bison themes. This hobby is surprisingly close to frontend development — it helps me study various layouts, typography, and design patterns from different eras.',
    batmobileTitle: 'Batmobiles Collection',
    batmobileDesc:
      'As a DC Comics fan, I collect Batmobile models from different eras — from classic TV-series to modern cinematic universes.',
    certificates: 'Education & Certificates',
    viewCertificate: 'View Certificate',
    closeCertificate: 'Close',
    openInNewTab: 'Open in new tab',
    diploma: 'Diploma in Computer Science',
    college: 'Technological College Educational Institution GRSU • 2011',
    contact: 'Get In Touch',
    contactText:
      "I'm always open to new opportunities and interesting projects. <br>Feel free to reach out if you'd like to collaborate!<br> Let's build something remarkable together.",
    contactButton: 'Contact Me',
    followOnLinkedIn: 'Follow on LinkedIn',
    resumeButton: 'Download Resume',
    // Common UI / ARIA
    switchToLight: 'Switch to light theme',
    switchToDark: 'Switch to dark theme',
    light: 'Light',
    dark: 'Dark',
    share: 'Share',
    shareViaDevice: 'Share via device',
    shareTo: 'Share to',
    switchLangToRu: 'Switch language to Russian',
    switchLangToEn: 'Switch language to English',
    closeModal: 'Close modal',
    searchFor: 'Search for',
    onGoogle: 'on Google',
    previous: 'Previous',
    next: 'Next',
    goTo: 'Go to',
    testimonial: 'testimonial',
    activity: 'activity',
    // Hero ARIA labels
    heroAvatarFlipCard: 'Avatar flip card',
    heroGitHubProfile: 'GitHub Profile',
    heroLinkedInProfile: 'LinkedIn Profile',
    heroSendEmail: 'Send Email',
    heroTelegram: 'Telegram',
    testimonialsTitle: 'Testimonials',
    blog: 'Publications',
    readArticle: 'Read article',
    viewAll: 'View all',
    garden: 'Digital Garden',
    backToHome: 'Back to Home',
    allArticles: 'All articles',
    testimonials: [
      {
        name: 'Aleksej Morskoj',
        role: 'Service Delivery Director at instinctools EE Labs',
        content:
          "Artur is a customer-oriented and charismatic tech leader. Always tries to be a perfectionist in each area. Be sure that everything will be completed successfully under Artur's control.",
      },
      {
        name: 'Dmitry Poluyan',
        role: 'Senior Frontend Engineer',
        content:
          'Artur is a highly qualified developer with great leadership skills. He is an ace in his sphere. He has flexible thinking and he never stops to step up his professional skills.',
      },
      {
        name: 'Paul Beck',
        role: 'Senior IT Consultant',
        content:
          'As Lead Developer Artur showed his deep knowledge of the field by suggesting, designing and implementing the architecture of our system. He proved his ability to lead and develop the group of developers by giving constructive feedback directly or through code reviews.',
      },
      {
        name: 'Dr. Kyung-Hun Ha',
        role: 'CEO at enneo.AI, ex-Lition Energy, ex-GASAG, ex-Daimler',
        content:
          'Artur is the ultimate code-head. A developer any tech-company wants to work with. Artur is a highly competent developer with a systematic test-driven and agile mindset always eager to grow.',
      },
      {
        name: 'Peter van de Put',
        role: 'Senior Software Engineer / Architect',
        content:
          'Artur is a great developer with whom I’ve worked for a longer time on multiple projects. Always delivers never complain',
      },
      {
        name: 'Richard Lohwasser',
        role: 'CTO at enneo.AI, ex-Lition Energy, ex-McKinsey',
        content:
          'Artur proved at multiple occasions that he is able to deliver high-quality, robust code quickly and consistently. He further used modern architecture and coding concepts that significanly boosted our project. I can highly recommended Artur.',
      },
      {
        name: 'Dmitry Poluyan',
        role: 'Senior Frontend Engineer',
        content:
          'Artur is hooked on everything that is connected with web technologies and not only. He provides high quality and secure code, always using modern approaches and state-of-art technologies, he is open for working with new tools.',
      },
      {
        name: 'Paul Beck',
        role: 'Senior IT Consultant',
        content:
          'Next to his ability to lead Artur has excellent coding skills, ranging from in-depth knowledge of frontend technology to backend technologies.',
      },
      {
        name: 'Sebastian Egner',
        role: 'Head Of Technology at Saselon, ex-Lition Energy, ex-Philips Research',
        content:
          'It was a pleasure working with Artur and his JavaScript development team. Artur translated complicated requirements into excellent solutions, pointed out alternative designs and implemented features himself or with the team quickly and reliably.',
      },
    ],
    showLess: 'Show less',
    showMore: 'Show more',
    copyright: `© ${new Date().getFullYear()} Artur Basak. All rights reserved.`,
    // OCR Page
    ocrTitle: 'Image Text Recognition',
    ocrSubtitle: 'Upload an image and extract text with support for Russian, English, and digits',
    ocrUploadText: 'Drag and drop an image here or click to select a file',
    ocrSelectImage: 'Select Image',
    ocrRecognizeText: 'Recognize Text',
    ocrClear: 'Clear',
    ocrProcessing: 'Processing',
    ocrProgress: 'Recognition Progress',
    ocrResult: 'Recognized Text:',
    ocrCopyText: 'Copy Text',
    ocrDownloadFile: 'Download as File',
    ocrSupportedFormats: 'Supported formats and languages:',
    ocrFormatsList: [
      'Image formats: JPG, PNG, GIF, BMP, TIFF',
      'Languages: Russian, English, Digits',
      'For best results, use clear images with contrasting text',
      'Avoid too small or blurry text',
    ],
    ocrError: 'Error recognizing text. Please try again.',
    // AI Assistant Page
    aiAssistantTitle: 'AI Assistant',
    aiAssistantDesc:
      'Chat with an AI assistant powered by free AI models. Ask questions, get help, or have a conversation.',
    aiAssistantDescription:
      'Chat with an AI assistant. Ask questions, get help, or just have a conversation.',
    aiAssistantStartMessage: 'Start a conversation by typing a message below',
    aiAssistantPlaceholder: 'Type your message...',
    aiAssistantHint: 'Press Enter to send, Shift+Enter for new line',
    aiAssistantSend: 'Send message',
    aiAssistantClear: 'Clear conversation',
    aiAssistantInfoTitle: 'About this AI Assistant',
    aiAssistantInfoText:
      'This AI assistant uses a free AI model to provide conversational responses. Responses are streamed in real-time for a better user experience.',
    // Tools Page
    toolsAndExperiments: 'Tools & Experiments',
    toolsDescription:
      "A collection of useful tools and experimental features I've built for various purposes. Some are ready to use, others are still in development.",
    tools: 'Tools',
    experiments: 'Experiments',
    home: 'Home',
    backToTools: 'Back to Tools',
    // Algorithms Page
    algorithmsTitle: 'Algorithms & Data Structures',
    algorithmsDescription:
      'Collection of algorithm implementations and data structure solutions from competitive programming practice.',
    algorithmCategories: {
      sorting: 'Sorting Algorithms',
      trees: 'Tree Algorithms',
      graphs: 'Graph Algorithms',
      linkedList: 'Linked List',
      eulerProject: 'Project Euler Solutions',
    },
    viewOnGitHub: 'View on GitHub',
    algorithmsRepository: 'Algorithms Repository',
    // SVG Optimization Page
    svgOptimizer: 'SVG Optimizer',
    svgOptimizerDesc:
      'Optimize your SVG code by removing unnecessary attributes, empty groups, and metadata',
    svgNoOpMode: 'No-op mode (only strip doctype/comments)',
    svgSafeMode: 'Safe mode (preserve filters, defs, transforms)',
    svgUploadLabel: 'Upload SVG File (Optional)',
    svgInputLabel: 'SVG Code Input',
    svgInputPlaceholder: 'Paste your SVG code here...',
    svgOptimizeButton: 'Optimize SVG',
    svgOptimizing: 'Optimizing...',
    svgErrorEnterCode: 'Please enter SVG code to optimize',
    svgErrorInvalidFile: 'Please select a valid SVG file',
    svgResultsTitle: 'Optimization Results',
    svgOriginalSize: 'Original Size:',
    svgOptimizedSize: 'Optimized Size:',
    svgSaved: 'Saved:',
    svgReduction: 'Reduction:',
    svgOutputLabel: 'Optimized SVG Code',
    svgCopy: 'Copy',
    svgCopied: 'Copied!',
    svgDownload: 'Download',
    svgPreview: 'Preview',
    svgInfoTitle: 'What gets optimized?',
    svgInfoItem1: 'Removes unnecessary xmlns attributes',
    svgInfoItem2: 'Eliminates empty <g> groups',
    svgInfoItem3: 'Removes <title>, <metadata>, <sodipodi> tags',
    svgInfoItem4: 'Removes <script> tags for security',
    svgInfoItem5: 'Optimizes path data and coordinates',
    svgInfoItem6: 'Removes redundant attributes',
    svgInfoItem7: 'Compresses whitespace and formatting',
    // SVG to JSX
    svgToJsxTitle: 'Convert SVG to JSX',
    svgToJsxDesc: 'Transforms attributes to camelCase and converts inline styles to JSX objects.',
    svgToJsxButton: 'Convert to JSX',
    svgJsxOutputLabel: 'JSX Output',
    svgJsxPreviewLabel: 'JSX Preview',
    svgToJsxError: 'Failed to convert to JSX',
    svgJsxCopy: 'Copy',
    svgJsxCopied: 'Copied!',
    toTop: 'To the top',
    // OCR / Images - alt texts
    ocrUploadedImage: 'Uploaded image',
    // Image Placeholder Page
    imgPhTitle: 'Image Placeholder',
    imgPhDesc:
      'Generate placeholder image URLs with custom width/height. Return a gray box with size text or a random illustration from public/image-placeholders.',
    imgPhParamsTitle: 'Parameters',
    imgPhPreviewTitle: 'Preview',
    imgPhWidth: 'Width (px)',
    imgPhHeight: 'Height (px)',
    imgPhShowIllustration: 'Show illustration (if available)',
    imgPhUseOriginal: 'Use original image size (ignore width/height)',
    imgPhCollectionLabel: 'Collection (optional)',
    imgPhCollectionAny: '— Any —',
    imgPhCollectionHint: 'Folder inside /public/image-placeholders',
    imgPhLink: 'Link',
    imgPhCopy: 'Copy',
    imgPhCopied: 'Copied',
    imgPhCopiedFullUrlNote: 'Full URL will include your domain (origin).',
    // Tools Page - Image Placeholder
    imgPhToolTitle: 'Image Placeholder',
    imgPhToolDesc: 'Generate placeholder URLs with custom size or random illustration',
    // React Fiber Page
    reactFiberTitle: 'React Fiber & JSX Parser',
    reactFiberDescription:
      'Interactive visualization of JSX parsing and React Fiber reconciliation process with animated data flow',
    reactFiberExplanation:
      'Watch how React transforms JSX code through the Fiber reconciliation algorithm. See the data flow from JSX source to DOM updates with step-by-step animations.',
    reactFiberControls: {
      play: 'Play',
      pause: 'Pause',
      reset: 'Reset',
      speed: 'Speed',
      showDetails: 'Show Node Details',
      hideDetails: 'Hide Node Details',
      nextStep: 'Step',
    },
    reactFiberSteps: {
      jsxParsing: 'JSX → AST → Babel parsing',
      astToElements: 'AST to React Elements → Babel transformation',
      fiberCreation: 'createElement() → React Elements (Virtual DOM)',
      reconciliation: 'Fiber Tree Creation & Reconciliation Phase',
      commit: 'Commit Phase → DOM',
    },
    reactFiberDetails: {
      jsxParsing: 'Babel parser transforms JSX syntax into Abstract Syntax Tree (AST).',
      astToElements:
        'Abstract Syntax Tree (AST) is converted to React elements - objects describing component structure. JSX elements (like <div>, <h1>) become React.createElement() calls. This allows browsers to understand JSX as regular JavaScript.',
      fiberCreation:
        'Each JSX element becomes an object with type, props, and children. React creates Fiber tree - internal data structure for tracking components. Each Fiber node contains information about the component, its state, and relationships with other nodes.',
      reconciliation:
        'Reconciliation phase compares new Fiber tree with previous one and determines what changes need to be made to DOM. React uses diffing algorithm to optimize updates.',
      commit:
        'Commit phase applies all changes to the real DOM. React updates only elements that actually changed, ensuring high performance.',
    },
    reactFiberSections: {
      jsxSource: 'JSX Source Code',
      currentStep: 'Current Step',
      dataFlow: 'Data Flow',
      fiberTree: 'Fiber Tree Structure',
      animationControls: 'Animation Controls',
    },
    reactFiberCodeTitles: {
      originalJSX: 'Original JSX Code',
      astRepresentation: 'AST (Abstract Syntax Tree - simplified version)',
      createElementCalls: 'React.createElement Calls',
      reactElements: 'React Elements & Fiber Nodes',
      finalHTML: 'Final HTML & DOM Updates',
    },
    // Event Loop Page
    eventLoopTitle: 'JavaScript Event Loop',
    eventLoopDescription:
      'Interactive visualization of the JavaScript runtime: Call Stack, Web APIs, Task Queue, and Microtask Queue.',
    eventLoopExplanation:
      'The animation simulates: placing synchronous code on the Call Stack, scheduling timers and network requests in Web APIs, prioritizing Microtasks (Promise.then) over macrotasks (setTimeout) when the Call Stack is empty, and moving callbacks to the Stack.',
    eventLoopControls: {
      enqueueScript: 'Enqueue Script',
      enqueueTimeout: 'Enqueue setTimeout',
      enqueueFetch: 'Enqueue fetch',
      enqueuePromise: 'Enqueue Promise.then',
      enqueueMicrotask: 'queueMicrotask',
      enqueueMutationObserver: 'MutationObserver callback',
      enqueueInterval: 'Enqueue setInterval',
      stopInterval: 'Stop setInterval',
      enqueueIDB: 'IndexedDB request',
      enqueueIdle: 'requestIdleCallback',
      enqueueRaf: 'requestAnimationFrame',
      enqueueIntersectionObserver: 'IntersectionObserver callback',
      enqueueResizeObserver: 'ResizeObserver callback',
      enqueueXHR: 'XMLHttpRequest',
      enqueueMessageChannel: 'MessageChannel',
      clearTimeout: 'clearTimeout',
      clearInterval: 'clearInterval',
      abortFetch: 'AbortController',
      cancelRaf: 'cancelAnimationFrame',
      cancelIdle: 'cancelIdleCallback',
      speed: 'Speed',
      speedSlow: 'Slow',
      speedNormal: 'Normal',
      speedFast: 'Fast',
      nextStep: 'Next Step',
      startLoop: 'Start Loop',
      stopLoop: 'Stop Loop',
      reset: 'Reset',
      executionStats: 'Execution Statistics',
      currentPhase: 'Current Phase',
      priorityFlow: 'Priority Flow',
      callStack: 'Call Stack',
      microtaskQueue: 'Microtask Queue',
      taskQueue: 'Task Queue',
      timers: 'Timers',
      io: 'I/O',
      render: 'Render (rAF)',
      idle: 'Idle',
      phase: {
        idle: 'Waiting for tasks',
        microtasks: 'Processing Microtasks',
        macrotasks: 'Processing Macrotasks',
        render: 'Render Phase',
      },
    },
    // Timeline Page
    timelineTitle: 'Development Timeline',
    timelineSubtitle: 'Career milestones and web technology evolution',
    timelineBackToHome: 'Back to Home',
    timelineLoading: 'Loading timeline...',
    timelineEventsCount: 'events',
    // Image Optimizer Page
    ioTitle: 'Image Optimizer',
    ioDesc: 'Compress and optimize images right in your browser using WebAssembly.',
    ioLoadingWasm: 'Loading WASM module...',
    ioOptimizing: 'Optimizing...',
    ioUploadImage: 'Upload Image',
    ioQuality: 'Quality',
    ioResizeBefore: 'Resize before compress',
    ioAggressivePng: 'Aggressive PNG',
    ioOutputFormat: 'Output format',
    ioKeep: 'Keep',
    ioPng: 'PNG',
    ioWebP: 'WebP',
    ioAvif: 'AVIF',
    ioOptimizeButton: 'Optimize Image',
    ioOriginal: 'Original',
    ioOptimized: 'Optimized',
    ioReduction: 'Reduction',
    ioSaved: 'Saved',
    ioNoImageSelected: 'No image selected',
    ioRunToPreview: 'Run optimization to preview',
    ioDownloadOptimized: 'Download optimized',
    ioErrorLoadWasm: 'Failed to load WASM module',
    ioErrorWorkerFailed: 'Worker failed',
    ioErrorOptimizationFailed: 'Optimization failed',
    // Tools card - Image Optimizer
    ioToolTitle: 'Image Optimizer',
    ioToolDesc: 'Compress and optimize images for web',
  },
  [ELanguage.ru]: {
    skipLinkMain: 'Перейти к основному содержимому',
    // Accessibility Page
    accessibility: 'Доступность',
    accessibilityTitle: 'Заявление о доступности',
    accessibilityIntro:
      'Я стремлюсь сделать этот сайт удобным для всех пользователей, включая людей, использующих вспомогательные технологии. Цель — соответствие стандарту WCAG 2.2 уровня AA.',
    accessibilityMeasuresTitle: 'Принятые меры',
    accessibilityMeasuresList: [
      'Семантическая разметка: header, main, footer и чёткая структура заголовков',
      'Доступность с клавиатуры: заметные стили фокуса и ссылка «к основному контенту»',
      'Текстовые альтернативы для значимых изображений; декоративные помечены соответствующим образом',
      'Цветовой контраст соответствует требованиям уровня AA, где применимо',
      'Поддержка светлой и темной темы для ситуативных переключений при плохом контрасте',
      'Адаптивный дизайн и корректный рефлоу без потери функциональности',
      'Выключение всех анимация в зависимости от настроек пользовательской ОС',
    ],
    accessibilityFeedbackTitle: 'Обратная связь',
    accessibilityFeedbackText:
      'Если вы столкнулись с проблемами в доступности веб-сайта, напишите мне на <a href="mailto:artur.basak.devingrodno@gmail.com">artur.basak.devingrodno@gmail.com</a>. Обычно отвечаю в течение 5 рабочих дней.',
    accessibilityAssessmentTitle: 'Подход к оценке',
    accessibilityAssessmentText:
      'Сайт проверяется вручную при помощи навигации с клавиатуры, точечных проверок экранным диктором (VoiceOver) и автоматизированных инструментов для выявления типичных проблем (Axe DevTools, WebAIM WAVE, Google Lighthouse). Доступность — это непрерывный процесс.',
    accessibilityLimitationsTitle: 'Известные ограничения',
    accessibilityLimitationsText: [
      'Некоторые динамические визуализации могут давать сокращённые описания для экранных дикторов.',
      'Некоторые изображения могут содержать не дотошно подробные alt-тексты',
      'Некоторые страницы сайта имею локализацию только для одного языка - моего нативного русского (к примеру, заметки Digital Garden только на русском)',
      'Веб-сайт не тестировался с другими скринридерами кроме как с VoiceOver, поэтому нет гарантий стабильной работы с JAWS, NVDA, Narrator, Orca и т.д.',
      'После закрытия диалогового окна с увеличенным изображением идет потеря фокуса в оригинальном контенте',
      'Ведётся работа по улучшению меток и описаний.',
    ],
    // Privacy Policy Page
    privacyTitle: 'Политика конфиденциальности',
    privacyIntro:
      'Эта страница описывает мои практики конфиденциальности и то, как я обрабатываю данные на этом веб-сайте. Я хочу быть прозрачным в отношении того, какие данные я собираю и как их использую.',
    privacyAnalyticsTitle: 'Аналитика',
    privacyAnalyticsText:
      'Я использую стандартные настройки Vercel Speed Insights и Vercel Analytics для понимания того, как посетители взаимодействуют с этим веб-сайтом, и для улучшения его производительности. Эти инструменты помогают мне выявлять узкие места производительности, понимать модели поведения пользователей и делать сайт лучше. Через эти инструменты аналитики не собираются персональные данные. Собираемые данные анонимизированы и агрегированы, и у меня нет доступа к какой-либо личной информации, позволяющей установить личность.',
    privacyDataTitle: 'Сбор данных',
    privacyDataText:
      'Я не собираю, не храню и не обрабатываю какие-либо персональные данные посетителей этого веб-сайта. Используемые мной инструменты аналитики (Vercel Speed Insights и Vercel Analytics) работают с <a target="_blank" rel="noopener noreferrer" href="https://vercel.com/docs/analytics">настройками по умолчанию</a>, которые уважают конфиденциальность пользователей и не собирают личную информацию. Я не использую cookies для отслеживания пользователей, и у меня нет форм или пользовательских аккаунтов, которые требовали бы личной информации.',
    privacyNoSellingTitle: 'Не продаю и не передаю данные',
    privacyNoSellingText:
      'Я не продаю, не сдаю в аренду и не передаю какие-либо данные третьим лицам. Поскольку я не собираю персональные данные, мне нечего продавать или передавать. Я лично не занимаюсь монетизацией данных и обязуюсь сохранять вашу конфиденциальность.',
    privacyOpenSourceTitle: 'Открытый исходный код',
    privacyOpenSourceText:
      'Этот веб-сайт имеет открытый исходный код, поэтому вы можете сами просмотреть код, чтобы проверить, какие данные собираются и как они используются. Исходный код доступен на <a href="https://github.com/archik408/nextjs-cv" target="_blank" rel="noopener noreferrer">GitHub</a>. Если у вас есть вопросы или опасения по поводу конфиденциальности, пожалуйста, свяжитесь со мной по адресу <a href="mailto:artur.basak.devingrodno@gmail.com">artur.basak.devingrodno@gmail.com</a>.',
    role: 'Web UI/UX Engineer',
    subtitle: 'Создаю веб будущего, опираясь на инженерное наследие прошлого.',
    about: 'Обо мне',
    aboutText: `Привет! Я Артур, программист во втором поколении. Моя страсть к компьютерам — это семейное наследие, зажженное моим крестным отцом и школьным учителем информатики, а позже подпитанное более чем десятилетним практическим опытом во всем спектре разработки программного обеспечения.<br/><br/>
Мой путь — это <span class="text-double-underline">мост между эпохами<img aria-hidden="true" src="/double-underline.png" alt="" class="double-underline"></span> вычислительной техники. Он начался со структурно-процедурного программирования на <em>Pascal</em>, <em>C++</em> и <em>Borland <abbr title="Visual Component Library">VCL</abbr></em>, где я изучил основные принципы управления памятью и базовые алгоритмы. Затем я создавал мощные десктопные и ранние веб-приложения для корпоративного мира, используя <em>Java</em>, <em><abbr title="Java Server Pages/JavaServer Faces">JSP/JSF</abbr></em>, <em>Eclipse <abbr title="Rich Client Platform/Remote Application Platform">RCP/RAP</abbr></em> и <em><abbr title="Standard Widget Toolkit">SWT</abbr></em>, а также развил критический взгляд на качество и процессы тестирования через автоматизацию тестов с <em>Selenium RC</em>, а позже с <em>WebDriver</em>, <em>Cypress</em> и <em>Playwright</em>.<br/><br/>
Я был на передовой трансформации веб-технологий, создавая динамические приложения с помощью инструментов первого поколения: <em><abbr title="Asynchronous Javascript and XML">AJAX</abbr></em>, <em>jQuery UI</em>, <em>ExtJS</em>, <em>Angular.js</em> и <em>Ember.js</em>. Этот глубокий исторический контекст — мое наибольшее преимущество. Он позволяет мне проектировать современные приложения на <em>React</em>, <em>Web Components</em> и <em>TypeScript</em> с глубоким пониманием проблем, которые они решают, гарантируя, что они не просто модные, а <span class="text-single-underline">действительно хорошо<img aria-hidden="true" src="/single-underline.png" alt="" class="single-underline"></span> спроектированные, масштабируемые и созданные на долгий срок.<br/><br/>
Сегодня я сосредоточен на создании доступных, ориентированных на пользователя, офлайн- и mobile-first <em>Progressive Web Apps (<abbr>PWA</abbr>)</em> и надежных фронтенд-архитектурах на основе современных инструментов: <em>Webpack</em>, <em>Vite</em>, <em>Next.js</em>, <em>MobX</em>, <em>React-Router</em>, <em>Material UI</em>, <em>Tailwind CSS</em>, <em>Rust/WebAssembly</em> и др.
Мне доверяли создание решений для таких отраслевых гигантов, как Daimler и SAP, ритейлеров, таких как X5 Group и Kohl's, технологических новаторов, как КРОК, стартапов, таких как TrueImpact, Lition, Tispr/Indy, и лидеров химической промышленности, таких как СИБУР и Evonik.<br/><br/>
Теперь я замкнул круг: передаю опыт и радость творчества следующему поколению, обучая своих детей программированию на <em>Scratch</em>, <em>MakeCode</em> и <em>Blockly</em>.`,
    cleanCode: 'Чистый код',
    cleanCodeDesc:
      'Написание поддерживаемого и масштабируемого кода на основе принципов <abbr title="single responsibility, open–closed, Liskov substitution, interface segregation, dependency inversion">SOLID</abbr>, <abbr title="Keep It Simple, Stupid">KISS</abbr>, <abbr title="You Aren\'t Gonna Need It">YAGNI</abbr> и <abbr title="Don\'t Repeat Yourself">DRY</abbr>',
    components: 'Компоненты',
    componentsDesc: 'Создание переиспользуемых, доступных и адаптивных UI компонентов',
    bestPractices: 'Лучшие практики',
    bestPracticesDesc:
      'Следование отраслевым стандартам вместе с современными фреймворками и инструментами',
    learning: 'Обучение',
    learningDesc:
      'Непрерывное совершенствование и обучение через практику и <abbr title="Massive Open Online Courses">MOOC</abbr> платформы (Frontend Masters, Coursera, edX)',
    skills: 'Основная Экспертиза (УТП)',
    skillsDescription:
      'Глубокая экспертиза во всем спектре современной веб-разработки, от архитектуры до лидерства команд',
    expertise: [
      {
        title: 'Фронтенд Архитектура и Техническая Стратегия',
        description:
          'Проектирование масштабируемых веб-систем, микрофронтендов и долгосрочного технического видения для корпоративных приложений',
      },
      {
        title: 'Дизайн-системы и Лидерство в UI Инженерии',
        description:
          'Создание и управление библиотеками компонентов, мостик между дизайном и разработкой, обеспечение согласованности в масштабе',
      },
      {
        title: 'Веб-производительность и Превосходство Платформы',
        description:
          'Оптимизация Core Web Vitals, PWA/офлайн-возможности, веб-доступность (WCAG), веб-безопасность (OWASP) и кроссплатформенная совместимость с RWD/mobile-first подходами',
      },
      {
        title: 'Современный React и Эволюция Веб-стандартов',
        description:
          'Архитектура с экосистемой React/Next.js при продвижении веб-платформы через Lit/Web Components и Rust/WASM',
      },
      {
        title: 'Консультации и Аудит по Веб-доступности',
        description:
          'Оказываю консультации по доступности, прохожу и провожу аудиты по доступности, очень погружен в эту тему. Также веду свой небольшой телеграм канал об этом: <a href="https://t.me/proa11y" target="_blank" rel="noopener noreferrer">@proa11y</a>',
      },
      {
        title: 'Full-Stack JavaScript и Платформенная Инженерия',
        description:
          'Архитектура end-to-end решений с Node.js/Deno/Bun, Rust/WASM и cloud-native развертыванием',
      },
    ],
    mySetup: 'Моя Настройка',
    mySetupDescription: 'Основные инструменты разработки, которые я использую ежедневно',
    experience: 'Опыт работы',
    experiences: [
      {
        role: 'Senior Software Engineer',
        company: 'IntexSoft',
        period: '2022 - Настоящее время',
        listDescription: [
          'Руководил разработкой гибридного мобильного приложения с использованием React.js, PWA и Fugu API для одной из крупнейших розничных сетей продуктовых магазинов в мире, включающей более 20 000 магазинов и с ежемесячной аудиторией около 20 миллионов пользователей',
          'Реализовал оффлайн функционал для приложения, тем самым повысив удержание и уменьшив отток пользователей из-за плохого интернета благодаря технологиям ServiceWorker API/Workbox, IndexedDB и Dixie.js',
          'Увеличил показатели NPS благодаря улучшениям UI на основе A/B тестирования и UX интервью',
          'Интегрировал передовые веб-технологии для создания бесшовного кросс-платформенного опыта на iOS и Android, обеспечивая высокую производительность и масштабируемость вместе с современными Web API: View Transition API, Vibration API, Geolocation API, Web Share и Lottie анимациями',
          'Участвовал в интеграции AI/LLM для модерации и обнаружения мошенничества',
          'Тесно сотрудничал с кросс-функциональными командами для согласования разработки приложения с бизнес-целями, что привело к повышению вовлеченности пользователей и операционной эффективности',
          'Разрабатывал сторонние проекты, такие как приложение администратора/модератора на основе React-Admin с сервером Bun и ряд лендингов на основе Next.js',
        ],
      },
      {
        role: 'Software Engineering Manager',
        company: 'Godel Technologies',
        period: '2021 - 2022',
        listDescription: [
          'Принимал участие в управлении 4-м по величине подразделением компании, курируя операции в нескольких локациях',
          'Выступал в качестве основного контактного лица для средних и крупных клиентов, обрабатывая их запросы и обеспечивая соответствие возможностям внутренних ресурсов компании',
          'Оптимизировал распределение ресурсов, сопоставляя потребности клиентов с наиболее подходящими инженерами из внутреннего пула талантов, что обеспечивало высокое качество реализации проектов',
          'В качестве Talent Manager оказывал наставничество и карьерное сопровождение ведущим senior-инженерам подразделения, помогая им формулировать и достигать профессиональных целей при помощи SWOT-анализа и методологии SMART',
          'Успешно внедрил систему OKR (Objectives and Key Results) в подразделении',
        ],
      },
      {
        role: 'Senior Web Engineer',
        company: 'Indy (ex-Tispr)',
        period: '2019 - 2021',
        listDescription: [
          'Улучшил существующую функциональность веб-платформы и сыграл ключевую роль в проектировании и реализации основных новых функций, включая WYSIWYG-редакторы, календарь, доски задач и кастомизацию white-labeling',
          'Участвовал в разработке и поддержке собственной дизайн-системы компании (Tispr Design Library - TDL), обеспечивая согласованность и масштабируемость во всех проектах',
          'Мигрировал UI компоненты в npm-пакет, размещенный в реестре Nexus, что позволило легко интегрировать и повторно использовать его в различных проектах',
          'Адаптировал подход с использованием Design Tokens на основе CSS Custom Properties и позже написал об этом в статьях Smashing Magazine и Better Programming',
          'Внедрил модульное и интеграционное тестирование для кодовой базы фронтенда, попутно перейдя с Enzyme на React Testing Library (RTL). Увеличил покрытие тестами с нуля до более чем 50%, значительно повысив качество и надежность кода',
          'Разработал и внедрил современную архитектуру для веб-сайта и контентного блога с использованием headless CMS (Strapi) и серверного рендеринга (SSR, Next.js), что улучшило SEO, производительность и вовлеченность пользователей',
          'Сыграл ключевую роль в проведении собеседований и формировании сильной локальной фронтенд-команды, заменив всех аутстафф-специалистов на senior-инженеров',
        ],
      },
      {
        role: 'Senior Software Engineer',
        company: 'instinctools EE Labs',
        period: '2010 - 2019',
        listDescription: [
          'За 9 лет внес вклад в более чем 20 проектов для разнообразных клиентов, включая компании уровня enterprise (SIBUR, Daimler, Evonik), средний бизнес (Florence Healthcare, NextGate, Kanda Software, Westernacher) и стартапы (TrueImpact, Lition Energy)',
          'В основном работал по моделям аутсорсинга и аутстаффинга, предоставляя высококачественные решения в области Web UI и фронтенда, адаптированные под потребности клиентов',
          'Присоединился к компании на позиции QA Engineer/SDET, когда в ней работало 20+ сотрудников, и сыграл ключевую роль в ее преобразовании в успешную организацию с более чем 300 сотрудниками',
          'Вырос до позиции Lead Software Engineer, где управлял одной из инженерных групп в рамках веб-департамента, курируя команду из 9 инженеров',
          'Обеспечивал техническое лидерство, наставничество и руководство для команды, гарантируя успешную реализацию проектов и способствуя развитию культуры сотрудничества и инноваций',
          'Разрабатывал масштабируемые и удобные Web UI/фронтенд-решения для клиентов из различных отраслей',
          'Поддерживал рост компании, внося вклад в улучшение процессов, развитие команды и внедрение лучших практик в области разработки программного обеспечения',
        ],
      },
      {
        role: 'Lead Web Engineer <small>(аутстафф из *instinctools)</small>',
        company: 'Lition Energy',
        period: '2018-2019',
        listDescription: [
          'Разработал с нуля веб-приложение для немецкого блокчейн-стартапа Lition Energy, создавая платформу для покупки зеленой энергии на основе полнофункциональных JavaScript технологий, таких как React.js, Redux, Next.js / SSR, Headless CMS, Node.js, Express.js, Knex.js, MySQL и Ethereum.',
          'Адаптировал все проекты для мобильных устройств, планшетов и десктопов используя RWD подход.',
          'Поддерживал высокий уровень frontend доступности используя метрики Lighthouse.',
          'Улучшил качество backend путем внедрения модульных и интеграционных тестов.',
          'Разработал архитектуру на основе Headless CMS (Contentful) и SSR (Next.js) для замены старой платформы WordPress, чтобы клиент мог удобно управлять контентом лендингов для различных групп потребителей. Улучшил SEO и Core Web Vitals для повышения видимости в поиске.',
          'Интегрировал стороннюю систему PowerCloud для оплаты электроэнергии и выставления счетов.',
          'Руководил командой frontend и backend разработки.',
          'В результате стартап привлек $5 миллионов во время раунда ICO, был упомянут в Forbes, а позже был продан.',
        ],
      },
      {
        role: 'Преподаватель основ веб-разработки',
        company: 'IT Academy',
        period: '2018',
        listDescription: [
          'Вел курс "Разработка веб-сайтов с использованием HTML, CSS и JavaScript"',
        ],
      },
      {
        role: 'Lead Frontend Engineer <small>(аутстафф из *instinctools)</small>',
        company: 'Большая тройка консалтинга (NDA, но легко нагуглить)',
        period: '2016-2018',
        listDescription: [
          'Разработка модуля конкурентного сопоставления для аналитической платформы ведущего американского ритейлера. Основной технологический стек: React, Redux (собственная кастомизация на основе паттерна Publisher-Subscriber), React-Toolbox UI, модульные тесты с Enzyme и End-to-End тесты с WebDriver.',
          'Управление командой frontend-разработчиков, которые разрабатывали frontend для стратегического веб-приложения, обеспечивающего конкурентный анализ товарного ассортимента и ценообразования в сегменте массового рынка.',
          'Миграция legacy-модулей с jQuery на современный React, создание высокопроизводительного интерфейса с продвинутой системой фильтров, интерактивным каталогом, дашбордами и современным UX на основе пользовательских опросов и тестирования.',
          'Реализованная функциональность предоставила клиенту инструмент для принятия решений на основе данных, позволяя в реальном времени сравнивать их ключевые категории товаров с категориями крупных игроков рынка (Amazon, Target, TJ Maxx).',
        ],
      },
      {
        role: 'Frontend Software Engineer <small>(аутстафф из *instinctools)</small>',
        company: 'TrueImpact',
        period: '2015-2016',
        listDescription: [
          'Разработка пользовательского интерфейса с использованием Angular.js 1.5 и Bootstrap для TrueImpact, стартапа, предоставляющего аналитику грантов, благотворительных инвестиций и волонтерства с нуля в очень быстром и гибком темпе. На начальном этапе было критически важно действовать быстро и показывать инвесторам демо каждый день.',
          'Позже MVP был преобразован в готовое к использованию приложение с тщательным редизайном логики коммуникации и UX.',
        ],
      },
      {
        role: 'JavaScript Software Engineer <small>(аутстафф из *instinctools)</small>',
        company: 'EquipmentWatch',
        period: '2015-2016',
        listDescription: [
          'С этого проекта полностью сосредоточился на JavaScript стеке и попал на проект EquipmentWatch, разрабатывая веб-приложение на Ember.js и Node.js, MongoDB.',
          'В основном фокусировался на UI части и SPA роутинге с Ember.js и экосистеме вокруг фреймворка.',
          'Позже проект был продан компании Randall-Reilly.',
        ],
      },
      {
        role: 'Java Software Engineer <small>(аутстафф из *instinctools)</small>',
        company: 'Westernacher Solutions',
        period: '2014-2015',
        listDescription: [
          'Разрабатывал программное обеспечение ZEUS для Немецкой нотариальной палаты, используя фреймворк ExtJS и Java, Spring, Hibernate и BPMN/Activiti.',
          'В основном работал над пользовательским интерфейсом и frontend одностраничного приложения (SPA), используя подход с роутингом в ExtJS 4 и новую UI тему Neptune.',
          'Многому научился у немецких коллег в области JavaScript и Domain-Driven Design (DDD). Забавный факт: помню, как при присоединении к команде мне прислали PDF копию книги Эрика Эванса о DDD и сказали "Прочитай перед началом работы"',
        ],
      },
      {
        role: 'Java Software Engineer <small>(аутстафф из *instinctools)</small>',
        company: 'СИБУР',
        period: '2013-2014',
        listDescription: [
          'Участвовал в разработке системы управления корпоративным контентом (ECM) для СИБУР Холдинг на основе Documentum ECM, Oracle, Java/JSP и ExtJS 3.5. Процесс разработки был водопадным с ожидаемой оценкой 10 человеко-лет времени разработки.',
          'В команде специализировался на разработке UI с использованием ExtJS и legacy подходов CSS, таких как табличная верстка и floats.',
          'Также был первой линией для работы над исправлением JavaScript багов.',
        ],
      },
      {
        role: 'Java Software Engineer <small>(аутстафф из *instinctools)</small>',
        company: 'Mercedes Benz Daimler AG',
        period: '2012-2013',
        listDescription: [
          'Разработал внутреннюю систему управления пользователями (UMS) для концерна Daimler AG. Меня выбрали для этого проекта благодаря моей комбинации навыков backend, frontend и автоматизации тестирования.',
          'Выполнял все задачи по верстке и frontend, включая мобильную адаптацию с технологиями jQuery UI и jQuery Mobile, JSF PrimeFaces и XHTML.',
          'Поддерживал backend на Java Core и IBM DB2.',
          'Увеличил покрытие и настроил тесты с Selenium и JMeter.',
          'Забавный факт: даже рисовал иконки в Photoshop для различных состояний кнопок широкого спектра таблиц.',
        ],
      },
      {
        role: 'Java Software Engineer <small>(аутстафф из *instinctools)</small>',
        company: 'Evonik AG',
        period: '2011-2012',
        listDescription: [
          'Участвовал в разработке веб-системы управления документами на основе решений Ditaworks с использованием технологий Java, Eclipse RAP/RCP, qooxdoo.js и SWT. Моя работа была сосредоточена на реализации функциональности отчетности BIRT (Business Intelligence and Reporting Tools) на стыке JavaScript и Java технологий.',
          'Ранее, будучи QA инженером, тестировал приложение для мультитач презентационного стола на выставке Evonik.',
        ],
      },
      {
        role: 'QA Engineer <small>(аутстафф из *instinctools)</small>',
        company: 'КРОК',
        period: '2010-2011',
        listDescription: [
          'Тестировал систему управления документами на основе EMC Documentum. Поддерживал тестовые сценарии в таблицах Excel. Проводил кроссбраузерное тестирование, включая очень старые версии Opera и IE7.',
        ],
      },
    ],
    funActivities: 'Увлечения',
    artTitle: 'Арт и Иллюстрация',
    artDesc:
      'Создание цифрового искусства и классических иллюстраций на основе мифологических существ, а также выставки в музеях и замках, создание печатных книг с моими иллюстрациями',
    kidsTitle: 'Обучение Детей',
    kidsDesc:
      'Обучение детей основам программирования в Scratch, MakeCode и Blockly используя платы Micro:bit и MakeyMakey',
    cycleTitle: 'Велосипед',
    cycleDesc:
      'Дальние и городские велопоездки — это помогает перезагрузиться и находить изящные решения сложных задач',
    stampsTitle: 'Коллекционирование марок',
    stampsDesc:
      'Собираю марки и почтовые предметы с изображением зубров. Это хобби удивительно близко к фронтенд-разработке — помогает изучать различные лейауты, типографику и дизайнерские паттерны разных эпох.',
    batmobileTitle: 'Коллекция Бэтмобилей',
    batmobileDesc:
      'Как поклонник DC Comics, коллекционирую модели Бэтмобилей разных эпох — от классических сериалов до современных кино-вселенных.',
    certificates: 'Образование & Сертификаты',
    viewCertificate: 'Посмотреть сертификат',
    closeCertificate: 'Закрыть',
    openInNewTab: 'Открыть в новой вкладке',
    diploma: 'Диплом в области Информатики',
    college: 'Технологический колледж ГрГУ им. Янки Купалы • 2011',
    contact: 'Связаться',
    contactText:
      'Я всегда открыт для новых возможностей и интересных проектов. <br>Свяжитесь со мной, если хотите сотрудничать! <br/> Давайте создадим что-то выдающееся вместе.',
    contactButton: 'Написать',
    followOnLinkedIn: 'Подписаться в LinkedIn',
    resumeButton: 'Скачать резюме',
    // Common UI / ARIA
    switchToLight: 'Переключить на светлую тему',
    switchToDark: 'Переключить на тёмную тему',
    light: 'Светлая',
    dark: 'Тёмная',
    share: 'Поделиться',
    shareViaDevice: 'Поделиться через устройство',
    shareTo: 'Поделиться в',
    switchLangToRu: 'Переключить язык на русский',
    switchLangToEn: 'Переключить язык на английский',
    closeModal: 'Закрыть окно',
    searchFor: 'Искать',
    onGoogle: 'в Google',
    previous: 'Назад',
    next: 'Вперёд',
    goTo: 'Перейти к',
    testimonial: 'отзыву',
    activity: 'активности',
    // Hero ARIA labels
    heroAvatarFlipCard: 'Переворот карточки аватара',
    heroGitHubProfile: 'Профиль GitHub',
    heroLinkedInProfile: 'Профиль LinkedIn',
    heroSendEmail: 'Отправить письмо',
    heroTelegram: 'Телеграм',
    testimonialsTitle: 'Отзывы',
    blog: 'Публикации',
    readArticle: 'Читать статью',
    viewAll: 'Смотреть все',
    garden: 'Digital Garden',
    backToHome: 'На главную',
    allArticles: 'Все статьи',
    testimonials: [
      {
        name: 'Алексей Морской',
        role: 'Сервис Деливери Директор в instinctools EE Labs',
        content:
          'Артур — клиентоориентированный и харизматичный технический руководитель. Он всегда стремится быть перфекционистом в каждой области. Будьте уверены, что под его контролем всё будет выполнено успешно.',
      },
      {
        name: 'Дмитрий Полуян',
        role: 'Старщий Фронтенд Инженер',
        content:
          'Артур — высококвалифицированный разработчик с отличными лидерскими качествами. Он настоящий мастер своего дела. Он обладает гибким мышлением и постоянно совершенствует свои профессиональные навыки.',
      },
      {
        name: 'Пол Бэк',
        role: 'Старший IT Консультант',
        content:
          'В качестве ведущего разработчика Артур продемонстрировал глубокие познания в этой области, предложив, спроектировав и реализовав архитектуру нашей системы. Он доказал свою способность руководить и развивать группу разработчиков, предоставляя конструктивную обратную связь напрямую или посредством ревью кода.',
      },
      {
        name: 'Доктор Кён-Хун Ха',
        role: 'CEO в enneo.AI, экс-Lition Energy, экс-GASAG, экс-Daimler',
        content:
          'Артур — настоящий программист. Разработчик, с которым мечтает работать любая технологическая компания. Артур — высококомпетентный инженер с системным и гибким подходом к тестированию, всегда готовый к развитию.',
      },
      {
        name: 'Питер ван де Пут',
        role: 'Старший Инженер ПО / Архитектор',
        content:
          'Артур — отличный разработчик, с которым я работал долгое время над несколькими проектами. Всегда выполняет работу, никогда не жалуется.',
      },
      {
        name: 'Ричард Лохвассер',
        role: 'CTO в enneo.AI, экс-Lition Energy, экс-McKinsey',
        content:
          'Артур неоднократно доказал свою способность быстро и стабильно создавать качественный, надёжный код. Он также использовал современные архитектурные и программные концепции, что значительно ускорило наш проект. Я настоятельно рекомендую Артура.',
      },
      {
        name: 'Дмитрий Полуян',
        role: 'Старщий Фронтенд Инженер',
        content:
          'Артур увлечен всем, что связано с веб-технологиями и не только. Он пишет качественный и безопасный код, всегда использует современные подходы и передовые технологии, открыт для работы с новыми инструментами.',
      },
      {
        name: 'Пол Бэк',
        role: 'Старший IT Консультант',
        content:
          'Помимо лидерских качеств, Артур обладает прекрасными навыками программирования, начиная от глубоких знаний frontend-технологий и заканчивая backend-технологиями.',
      },
      {
        name: 'Себастьян Эгнер',
        role: 'Руководитель по технологиям в Saselon, экс-Lition Energy, экс-Philips Research',
        content:
          'Было приятно работать с Артуром и его командой разработчиков JavaScript. Артур быстро и надёжно воплощал сложные требования в превосходные решения, предлагал альтернативные решения и реализовывал функции самостоятельно или вместе с командой.',
      },
    ],
    showLess: 'Свернуть',
    showMore: 'Показать больше',
    copyright: `© ${new Date().getFullYear()} Artur Basak. Все права защищены.`,
    // OCR Page
    ocrTitle: 'Распознавание текста на изображениях',
    ocrSubtitle:
      'Загрузите изображение и получите текст с поддержкой русского, английского языков и цифр',
    ocrUploadText: 'Перетащите изображение сюда или нажмите для выбора файла',
    ocrSelectImage: 'Выбрать изображение',
    ocrRecognizeText: 'Распознать текст',
    ocrClear: 'Очистить',
    ocrProcessing: 'Обработка',
    ocrProgress: 'Прогресс распознавания',
    ocrResult: 'Распознанный текст:',
    ocrCopyText: 'Скопировать текст',
    ocrDownloadFile: 'Скачать как файл',
    ocrSupportedFormats: 'Поддерживаемые форматы и языки:',
    ocrFormatsList: [
      'Форматы изображений: JPG, PNG, GIF, BMP, TIFF',
      'Языки: Русский, Английский, Цифры',
      'Для лучших результатов используйте четкие изображения с контрастным текстом',
      'Избегайте слишком мелкого или размытого текста',
    ],
    ocrError: 'Ошибка при распознавании текста. Попробуйте еще раз.',
    // AI Assistant Page
    aiAssistantTitle: 'ИИ Помощник',
    aiAssistantDesc:
      'Общайтесь с ИИ помощником на основе бесплатных ИИ моделей. Задавайте вопросы, получайте помощь или просто общайтесь.',
    aiAssistantDescription:
      'Общайтесь с ИИ помощником. Задавайте вопросы, получайте помощь или просто ведите беседу.',
    aiAssistantStartMessage: 'Начните разговор, введя сообщение ниже',
    aiAssistantPlaceholder: 'Введите ваше сообщение...',
    aiAssistantHint: 'Нажмите Enter для отправки, Shift+Enter для новой строки',
    aiAssistantSend: 'Отправить сообщение',
    aiAssistantClear: 'Очистить разговор',
    aiAssistantInfoTitle: 'Об этом ИИ помощнике',
    aiAssistantInfoText:
      'Этот ИИ помощник использует бесплатную ИИ модель для предоставления ответов в разговоре. Ответы передаются в реальном времени для лучшего пользовательского опыта.',
    // Tools Page
    toolsAndExperiments: 'Инструменты и Эксперименты',
    toolsDescription:
      'Коллекция полезных инструментов и экспериментальных функций, которые я создал для различных целей. Некоторые готовы к использованию, другие все еще в разработке.',
    tools: 'Инструменты',
    experiments: 'Эксперименты',
    home: 'Главная',
    backToTools: 'Назад к инструментам',
    // Algorithms Page
    algorithmsTitle: 'Алгоритмы и Структуры Данных',
    algorithmsDescription:
      'Коллекция реализаций алгоритмов и решений структур данных из практики соревновательного программирования.',
    algorithmCategories: {
      sorting: 'Алгоритмы Сортировки',
      trees: 'Алгоритмы Деревьев',
      graphs: 'Алгоритмы Графов',
      linkedList: 'Связанные Списки',
      eulerProject: 'Решения Project Euler',
    },
    viewOnGitHub: 'Посмотреть на GitHub',
    algorithmsRepository: 'Репозиторий Алгоритмов',
    // SVG Optimization Page
    svgOptimizer: 'Оптимизатор SVG',
    svgOptimizerDesc:
      'Оптимизируйте ваш SVG код, удаляя ненужные атрибуты, пустые группы и метаданные',
    svgNoOpMode: 'No-op режим (удалить только doctype/комментарии)',
    svgSafeMode: 'Безопасный режим (сохранить filters, defs, transforms)',
    svgUploadLabel: 'Загрузить файл SVG (необязательно)',
    svgInputLabel: 'Ввод SVG кода',
    svgInputPlaceholder: 'Вставьте сюда ваш SVG код...',
    svgOptimizeButton: 'Оптимизировать SVG',
    svgOptimizing: 'Оптимизация...',
    svgErrorEnterCode: 'Пожалуйста, введите SVG код для оптимизации',
    svgErrorInvalidFile: 'Пожалуйста, выберите корректный SVG файл',
    svgResultsTitle: 'Результаты оптимизации',
    svgOriginalSize: 'Исходный размер:',
    svgOptimizedSize: 'Оптимизированный размер:',
    svgSaved: 'Сэкономлено:',
    svgReduction: 'Сокращение:',
    svgOutputLabel: 'Оптимизированный SVG код',
    svgCopy: 'Копировать',
    svgCopied: 'Скопировано!',
    svgDownload: 'Скачать',
    svgPreview: 'Предпросмотр',
    svgInfoTitle: 'Что оптимизируется?',
    svgInfoItem1: 'Удаляет ненужные атрибуты xmlns',
    svgInfoItem2: 'Убирает пустые группы <g>',
    svgInfoItem3: 'Удаляет теги <title>, <metadata>, <sodipodi>',
    svgInfoItem4: 'Удаляет теги <script> для безопасности',
    svgInfoItem5: 'Оптимизирует пути и координаты',
    svgInfoItem6: 'Удаляет избыточные атрибуты',
    svgInfoItem7: 'Сжимает пробелы и форматирование',
    // SVG to JSX
    svgToJsxTitle: 'Конвертация SVG в JSX',
    svgToJsxDesc: 'Преобразует атрибуты в camelCase и переводит inline-стили в объект JSX.',
    svgToJsxButton: 'Конвертировать в JSX',
    svgJsxOutputLabel: 'JSX результат',
    svgJsxPreviewLabel: 'Предпросмотр JSX',
    svgToJsxError: 'Не удалось конвертировать в JSX',
    svgJsxCopy: 'Копировать',
    svgJsxCopied: 'Скопировано!',
    // React Fiber Page
    reactFiberTitle: 'React Fiber & JSX Parser',
    reactFiberDescription:
      'Интерактивная визуализация парсинга JSX и процесса согласования React Fiber с анимированными потоками данных',
    reactFiberExplanation:
      'Посмотрите, как React преобразует JSX код через алгоритм согласования Fiber. Увидьте поток данных от JSX источника до обновлений DOM с пошаговыми анимациями.',
    reactFiberControls: {
      play: 'Воспроизвести',
      pause: 'Пауза',
      reset: 'Сброс',
      speed: 'Скорость',
      showDetails: 'Показать детали узлов',
      hideDetails: 'Скрыть детали узлов',
      nextStep: 'Шаг',
    },
    reactFiberSteps: {
      jsxParsing: 'JSX → AST → Babel парсинг',
      astToElements: 'AST в React элементы → Babel трансформация',
      fiberCreation: 'createElement() → React Elements (Virtual DOM)',
      reconciliation: 'Создание Fiber дерева & Фаза согласования',
      commit: 'Фаза коммита → DOM',
    },
    reactFiberDetails: {
      jsxParsing:
        'Babel парсер преобразует JSX синтаксис в Абстрактное синтаксическое дерево (AST).',
      astToElements:
        'Абстрактное синтаксическое дерево (AST) преобразуется в React элементы - объекты, описывающие структуру компонентов. JSX элементы (как <div>, <h1>) превращаются в вызовы React.createElement(). Это позволяет браузеру понимать JSX как обычный JavaScript.',
      fiberCreation:
        'Каждый JSX элемент становится объектом JSON с типом, пропсами и дочерними элементами. React создает Fiber дерево - внутреннюю структуру данных для отслеживания компонентов. Каждый узел Fiber содержит информацию о компоненте, его состоянии и связях с другими узлами.',
      reconciliation:
        'Фаза согласования (Reconciliation) сравнивает новое Fiber дерево с предыдущим и определяет, какие изменения нужно внести в DOM. React использует алгоритм diffing для оптимизации обновлений.',
      commit:
        'Фаза коммита применяет все изменения к реальному DOM. React обновляет только те элементы, которые действительно изменились, что обеспечивает высокую производительность.',
    },
    reactFiberSections: {
      jsxSource: 'Исходный JSX код',
      currentStep: 'Текущий шаг',
      dataFlow: 'Поток данных',
      fiberTree: 'Структура Fiber дерева',
      animationControls: 'Управление анимацией',
    },
    reactFiberCodeTitles: {
      originalJSX: 'Исходный JSX код',
      astRepresentation: 'AST (Абстрактное синтаксическое дерево - упрощенная версия)',
      createElementCalls: 'Вызовы React.createElement',
      reactElements: 'React элементы и Fiber узлы',
      finalHTML: 'Финальный HTML и обновления DOM',
    },
    toTop: 'Наверх',
    // OCR / Images - alt texts
    ocrUploadedImage: 'Загруженное изображение',
    // Image Placeholder Page
    imgPhTitle: 'Image Placeholder',
    imgPhDesc:
      'Генерируйте URL плейсхолдера нужного размера. Возвращает серый бокс с размерами или случайную иллюстрацию из public/image-placeholders.',
    imgPhParamsTitle: 'Параметры',
    imgPhPreviewTitle: 'Превью',
    imgPhWidth: 'Ширина (px)',
    imgPhHeight: 'Высота (px)',
    imgPhShowIllustration: 'Показывать иллюстрацию (если есть)',
    imgPhUseOriginal: 'Оригинальный размер изображения (игнорировать ширину/высоту)',
    imgPhCollectionLabel: 'Коллекция (необязательно)',
    imgPhCollectionAny: '— Любая —',
    imgPhCollectionHint: 'Папка внутри /public/image-placeholders',
    imgPhLink: 'Ссылка',
    imgPhCopy: 'Копировать',
    imgPhCopied: 'Скопировано',
    imgPhCopiedFullUrlNote: 'В буфер будет скопирован полный URL с доменом.',
    // Tools Page - Image Placeholder
    imgPhToolTitle: 'Image Placeholder',
    imgPhToolDesc: 'Генерирует URL плейсхолдера с нужным размером или случайной иллюстрацией',
    // Event Loop Page
    eventLoopTitle: 'JavaScript Event Loop',
    eventLoopDescription:
      'Интерактивная визуализация JavaScript runtime: Call Stack, Web APIs, Task Queue и Microtask Queue.',
    eventLoopExplanation:
      'Анимация симулирует: размещение синхронного кода в Call Stack, планирование таймеров и сетевых запросов в Web APIs, приоритизацию микрозадач (Promise.then) над макрозадачами (setTimeout) когда Call Stack пуст, и перемещение коллбэков в Stack.',
    eventLoopControls: {
      enqueueScript: 'Добавить Script',
      enqueueTimeout: 'Добавить setTimeout',
      enqueueFetch: 'Добавить fetch',
      enqueuePromise: 'Добавить Promise.then',
      enqueueMicrotask: 'queueMicrotask',
      enqueueMutationObserver: 'Callback MutationObserver',
      enqueueInterval: 'Добавить setInterval',
      stopInterval: 'Остановить setInterval',
      enqueueIDB: 'Запрос IndexedDB',
      enqueueIdle: 'requestIdleCallback',
      enqueueRaf: 'requestAnimationFrame',
      enqueueIntersectionObserver: 'Callback IntersectionObserver',
      enqueueResizeObserver: 'Callback ResizeObserver',
      enqueueXHR: 'XMLHttpRequest',
      enqueueMessageChannel: 'MessageChannel',
      clearTimeout: 'clearTimeout',
      clearInterval: 'clearInterval',
      abortFetch: 'AbortController',
      cancelRaf: 'cancelAnimationFrame',
      cancelIdle: 'cancelIdleCallback',
      speed: 'Скорость',
      speedSlow: 'Медленно',
      speedNormal: 'Нормально',
      speedFast: 'Быстро',
      nextStep: 'Следующий шаг',
      startLoop: 'Запустить цикл',
      stopLoop: 'Остановить цикл',
      reset: 'Сбросить',
      executionStats: 'Статистика выполнения',
      currentPhase: 'Текущая фаза',
      priorityFlow: 'Поток приоритетов',
      callStack: 'Стэк вызовов',
      microtaskQueue: 'Очередь микрозадач',
      taskQueue: 'Очередь задач',
      timers: 'Таймеры',
      io: 'I/O',
      render: 'Рендер (rAF)',
      idle: 'Бездействие',
      phase: {
        idle: 'Ожидание задач',
        microtasks: 'Обработка микрозадач',
        macrotasks: 'Обработка макрозадач',
        render: 'Фаза рендера',
      },
    },
    // Timeline Page
    timelineTitle: 'Хронология Разработки',
    timelineSubtitle: 'Карьерные вехи и эволюция веб-технологий',
    timelineBackToHome: 'На главную',
    timelineLoading: 'Загрузка хронологии...',
    timelineEventsCount: 'событий',
    // Image Optimizer Page
    ioTitle: 'Оптимизатор изображений',
    ioDesc: 'Сжимайте и оптимизируйте изображения прямо в браузере с помощью WebAssembly.',
    ioLoadingWasm: 'Загрузка WASM модуля...',
    ioOptimizing: 'Оптимизация...',
    ioUploadImage: 'Загрузка изображения',
    ioQuality: 'Качество',
    ioResizeBefore: 'Масштабировать перед сжатием',
    ioAggressivePng: 'Агрессивный PNG',
    ioOutputFormat: 'Формат вывода',
    ioKeep: 'Сохранить',
    ioPng: 'PNG',
    ioWebP: 'WebP',
    ioAvif: 'AVIF',
    ioOptimizeButton: 'Оптимизировать изображение',
    ioOriginal: 'Оригинал',
    ioOptimized: 'Оптимизированный',
    ioReduction: 'Сокращение',
    ioSaved: 'Сохранено',
    ioNoImageSelected: 'Изображение не выбрано',
    ioRunToPreview: 'Запустите оптимизацию для предпросмотра',
    ioDownloadOptimized: 'Скачать оптимизированное',
    ioErrorLoadWasm: 'Не удалось загрузить WASM модуль',
    ioErrorWorkerFailed: 'Ошибка воркера',
    ioErrorOptimizationFailed: 'Не удалось выполнить оптимизацию',
    // Tools card - Image Optimizer
    ioToolTitle: 'Оптимизатор изображений',
    ioToolDesc: 'Сжимайте и оптимизируйте изображения для веба',
  },
} as const;

export type Language = keyof typeof translations;
