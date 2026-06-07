export const siteConfig = {
  brandName: "HADITECH",
  tagline: "We build premium SaaS platforms, dashboards, automation systems and web apps.",
  siteDescription:
    "HADITECH is a specialist SaaS development studio. We ship premium Next.js platforms, AI automation agents, custom dashboards, and high-performance web applications for startups and enterprises.",
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL ?? "https://haditech.com",
  email: "haditech313@gmail.com",
  whatsappNumber: "+92 301 2475707",
  whatsappLink:
    "https://wa.me/923012475707?text=Hello%20HADITECH%2C%20I%20want%20a%20SaaS%20website%20development%20service.",
  author: {
    name: "HADITECH Studio",
    jobTitle: "Full-Stack SaaS Developer",
  },
  socials: {
    linkedin: "#",
    github: "#",
    twitter: "#",
    facebook: "#",
  },
  availability: {
    open: true,
    message: "Currently accepting new projects."
  }
};

export const heroContent = {
  headline: "HADITECH — SaaS Development Studio",
  subheadline: "We build premium SaaS platforms, intelligent automation systems, and high-performance web applications that scale.",
  primaryCTA: "View Projects",
  secondaryCTA: "Start a Project",
  whatsappCTA: "WhatsApp"
};

export const stats = [
  { label: "Projects Delivered", value: "40", suffix: "+" },
  { label: "Client Satisfaction", value: "100", suffix: "%" },
  { label: "Lines of Code", value: "100", suffix: "k+" },
  { label: "Support Uptime", value: "99.9", suffix: "%" },
];

export const services = [
  {
    title: "SaaS MVP Build",
    shortDescription: "From concept to a fully functional Minimum Viable Product ready for early users and investors.",
    features: ["Next.js App Router Setup", "Authentication (Auth.js)", "Stripe Integration", "Premium Dashboard UI"],
    iconName: "Rocket",
    category: "SaaS",
    pricingHint: "$5k - $10k",
    deliveryTime: "4-6 Weeks",
    popular: true,
    tier: "starter" as const
  },
  {
    title: "Custom Web App",
    shortDescription: "High-performance bespoke web applications tailored exactly to your business logic.",
    features: ["Complex State Management", "Third-party APIs", "Admin Panels", "Performance Optimization"],
    iconName: "Layout",
    category: "Web App",
    pricingHint: "$10k+",
    deliveryTime: "6-8 Weeks",
    popular: false,
    tier: "professional" as const
  },
  {
    title: "AI & Automation Agent",
    shortDescription: "Integrate LLMs, custom chatbots, and automated workflows into your existing ecosystem.",
    features: ["OpenAI / Anthropic", "RAG Document Retrieval", "WhatsApp/Telegram Bots", "Custom LangChain"],
    iconName: "Server",
    category: "AI",
    pricingHint: "Custom",
    deliveryTime: "3-5 Weeks",
    popular: false,
    tier: "enterprise" as const
  },
  {
    title: "Frontend Revamp",
    shortDescription: "Upgrade your existing application to a state-of-the-art React/Next.js interface.",
    features: ["Design System Creation", "Tailwind Migration", "Responsive Mobile", "Framer Motion"],
    iconName: "Code",
    category: "Frontend",
    pricingHint: "$3k+",
    deliveryTime: "2-4 Weeks",
    popular: false,
    tier: "starter" as const
  },

  {
    title: "Web Designing",
    shortDescription: "Ai web Designing",
    features: ["BEAUTIFUL", "GORGEOUS", "BRILLIANT", "CHARMING"],
    iconName: "Rocket",
    category: "Saas",
    pricingHint: "5k-10k",
    deliveryTime: "4-6",
    popular: true,
    tier: "enterprise" as const
  },
];

export const projects = [
  {
    title: "Smart Source CRM",
    slug: "smart-source-crm",
    description: "A multi-tenant SaaS application for lead management.",
    category: "SaaS",
    stack: ["Next.js", "Tailwind", "Prisma"],
    tags: ["B2B", "Lead Generation"],
    difficulty: "Advanced",
    featured: true,
    thumbnailType: "video-placeholder",
    liveUrl: "#",
    githubUrl: "#",
    duration: "2:15",
    result: "↑ 60% faster load",
    challenge: "The client needed a scalable way to handle millions of leads across different tenants without data bleeding or performance bottlenecks.",
    solution: "We implemented a custom Next.js 14 App Router dashboard with a Prisma/PostgreSQL backend utilizing row-level security and intelligent caching.",
    results: [
      { metric: "Data Processing Speed", value: "300% Faster" },
      { metric: "Active Users", value: "10,000+" },
      { metric: "Server Costs", value: "Reduced 40%" }
    ],
    techDeepDive: "By leveraging React Server Components, we drastically reduced the JavaScript bundle size shipped to the client. Real-time data synchronization was handled via WebSockets, ensuring seamless multi-user collaboration.",
    clientTestimonial: {
      quote: "HADITECH transformed our lead management process. The dashboard is incredibly fast and intuitive.",
      name: "Sarah Jenkins",
      role: "CEO, Smart Source"
    },
    screenshots: ["/images/projects/crm-1.jpg", "/images/projects/crm-2.jpg"]
  },
  {
    title: "WhatsApp AI Bot Agent",
    slug: "whatsapp-ai-bot-agent",
    description: "An intelligent conversational agent deployed on WhatsApp.",
    category: "AI Agents",
    stack: ["Node.js", "OpenAI", "Meta API"],
    tags: ["Automation", "LLM"],
    difficulty: "Intermediate",
    featured: true,
    thumbnailType: "gradient",
    liveUrl: "#",
    githubUrl: "#",
    duration: "1:40",
    result: "↑ 78% resolution rate",
    challenge: "Customer support was overwhelmed with repetitive inquiries, leading to slow response times and frustrated users.",
    solution: "We engineered an AI-powered WhatsApp bot utilizing OpenAI's LLM and custom RAG architecture to handle tier-1 support queries instantly.",
    results: [
      { metric: "Response Time", value: "< 2s" },
      { metric: "Resolution Rate", value: "78%" },
      { metric: "Human Hand-off", value: "Decreased 65%" }
    ],
    techDeepDive: "We built a robust Node.js orchestrator that interfaces with the Meta Cloud API. Incoming messages trigger a custom LangChain retrieval process, pulling context from the company's knowledge base before generating a localized response.",
    clientTestimonial: {
      quote: "Our customer satisfaction scores went through the roof within the first week of deployment.",
      name: "Ahmed Raza",
      role: "Operations Director"
    },
    screenshots: ["/images/projects/bot-1.jpg", "/images/projects/bot-2.jpg"]
  },
  {
    title: "Helium10 Clone Dashboard",
    slug: "helium10-clone-dashboard",
    description: "Analytics dashboard providing deep insights for Amazon sellers.",
    category: "Dashboards",
    stack: ["React", "Recharts", "Express"],
    tags: ["Analytics", "E-commerce"],
    difficulty: "Advanced",
    featured: true,
    thumbnailType: "video-placeholder",
    liveUrl: "#",
    githubUrl: "#",
    duration: "3:20",
    result: "↑ 25% retention",
    challenge: "Processing and visualizing massive datasets of e-commerce metrics in real-time without freezing the browser.",
    solution: "Developed a high-performance React dashboard using Recharts for rendering and a custom Express microservice for data aggregation.",
    results: [
      { metric: "Data Points Handled", value: "50M+" },
      { metric: "Render Time", value: "< 100ms" },
      { metric: "User Retention", value: "Increased 25%" }
    ],
    techDeepDive: "We implemented sophisticated data virtualization techniques on the frontend to only render visible chart elements. The backend utilizes Redis caching and materialized views in PostgreSQL to serve complex analytical queries instantly.",
    clientTestimonial: {
      quote: "The level of detail and performance in this dashboard rivals industry leaders. Outstanding engineering.",
      name: "Marcus Thorne",
      role: "E-commerce Strategist"
    },
    screenshots: ["/images/projects/dash-1.jpg", "/images/projects/dash-2.jpg"]
  },

  {
    title: "AL_QALAM",
    slug: "al-qalam",
    description: "AI Learning program",
    category: "SaaS",
    stack: [],
    tags: [],
    difficulty: "Advanced",
    featured: true,
    thumbnailType: "video-placeholder",
    liveUrl: "#",
    githubUrl: "#",
    duration: "2:00",
    result: "",
    challenge: "",
    solution: "",
    results: [
    ],
    techDeepDive: "",
    screenshots: ["/images/projects/placeholder.jpg"]
  },

  {
    title: "AL_QALAM",
    slug: "al-qalam",
    description: "AI LEARNING PROJECT",
    category: "SaaS",
    stack: ["Next.js", "React", "Node.js", "TypeScript", "Tailwind", "Express", "OpenAI", "MongoDB", "PostgreSQL", "Prisma", "Recharts", "Framer Motion", "Auth.js", "Stripe", "AWS", "Meta API", "LangChain", "Redis", "Vercel"],
    tags: ["B2B", "B2C"],
    difficulty: "Advanced",
    featured: true,
    thumbnailType: "video-placeholder",
    liveUrl: "#",
    githubUrl: "#",
    duration: "2:00",
    result: "",
    challenge: "",
    solution: "",
    results: [
    ],
    techDeepDive: "Nod.js  React",
    screenshots: ["/images/projects/placeholder.jpg"]
  },
];

export const caseStudies = [
  {
    title: "Scaling Video Processing for 10M Users",
    slug: "scaling-video-processing",
    problem: "The legacy monolithic server crashed repeatedly during peak upload times causing a 40% failure rate.",
    solution: "We migrated the processing pipeline to an event-driven microservices architecture using AWS SQS and Lambda.",
    result: "99.99% Uptime & 0% Failures",
    stack: ["Next.js", "AWS", "FFmpeg", "Node.js"],
    featured: true,
    industry: "Media SaaS",
    challenge: "The client ran a video-sharing SaaS platform that grew from 10k users to 10M users in under six months. Their monolithic upload handler was CPU-bound and crashed under peak loads, causing user churn and server exhaustion.",
    techDeepDive: "We decomposed the upload flow. Large files are now split and uploaded directly to secure S3 buckets using presigned URLs. S3 triggers an event that posts messages to AWS SQS. Auto-scaling ECS containers running FFmpeg workers pick tasks from SQS, process them, and store optimized video feeds in CloudFront.",
    results: [
      { metric: "Monolithic Failures", value: "0% (Down from 40%)" },
      { metric: "Server Cost Savings", value: "35% reduction" },
      { metric: "Processing Speed", value: "4.5x faster" }
    ],
    clientTestimonial: {
      quote: "The microservices migration was executed seamlessly. Zero downtime, zero user interruption, and massive cost savings.",
      name: "Marcus Thorne",
      role: "VP Engineering"
    }
  },
  {
    title: "Automating CRM Data via WhatsApp",
    slug: "automating-crm-data-whatsapp",
    problem: "Sales reps were wasting 15+ hours a week manually entering data from WhatsApp chats into their CRM.",
    solution: "Built a custom WhatsApp Cloud API integration powered by an LLM agent that syncs data automatically.",
    result: "15hrs/week saved per rep",
    stack: ["React", "Express", "Meta API", "OpenAI"],
    featured: true,
    industry: "Sales Tech",
    challenge: "A fast-moving B2B sales firm closed 80% of their deals via WhatsApp conversations. However, logging client preferences, budget levels, and scheduling next steps back into HubSpot CRM was entirely manual, leading to data loss and lost deals.",
    techDeepDive: "We integrated Meta's WhatsApp Business Cloud API. Messages from client conversations are processed by an OpenAI GPT-4 function-calling orchestrator. It extracts critical entity facts (budgets, action items, dates) and calls HubSpot GraphQL APIs to instantly populate CRM records.",
    results: [
      { metric: "CRM Data Completeness", value: "99.8% (Up from 60%)" },
      { metric: "Time Saved per Rep", value: "15 Hours / Week" },
      { metric: "Sales Pipeline Velocity", value: "Increased 22%" }
    ],
    clientTestimonial: {
      quote: "Our sales velocity has never been this high. Reps focus on selling rather than copy-pasting chat history.",
      name: "Elena Rodriguez",
      role: "Operations Director"
    }
  }
];

export const testimonials = [
  {
    id: "t1",
    name: "Sarah Jenkins",
    role: "CEO",
    company: "Smart Source",
    companyUrl: "#",
    quote: "HADITECH transformed our lead management process. The dashboard is incredibly fast and intuitive. Outstanding engineering!",
    rating: 5,
    projectId: "smart-source-crm",
    avatarUrl: "",
    featured: true
  },
  {
      id: "t2",
    name: "Ahmed Raza",
    role: "Operations Director",
    company: "Global Sales Corp",
    companyUrl: "#",
    quote: "Their AI WhatsApp Agent revolutionized our lead capture process. Our customer satisfaction scores went through the roof within the first week of deployment. Highly recommend working with them.",
    rating: 5,
    projectId: "whatsapp-ai-bot-agent",
    avatarUrl: "",
    featured: true
  },
  {
    id: "t3",
    name: "Marcus Thorne",
    role: "E-commerce Strategist",
    company: "Helium Insights",
    companyUrl: "#",
    quote: "The level of detail and performance in this dashboard rivals industry leaders. Outstanding engineering and excellent communication throughout the build.",
    rating: 5,
    projectId: "helium10-clone-dashboard",
    avatarUrl: "",
    featured: false
  },
  {
    id: "t4",
    name: "Elena Rodriguez",
    role: "Founder",
    company: "NextGen SaaS",
    companyUrl: "#",
    quote: "Working with HADITECH was a game-changer. They delivered our MVP in record time without compromising on code quality or design aesthetics.",
    rating: 5,
    projectId: null,
    avatarUrl: "",
    featured: true
  }
];

export const videos = [
  {
    title: "How to Build a Next.js SaaS Dashboard",
    platform: "YouTube",
    url: "#",
    featured: true,
    duration: "15:20",
    imageSrc: ""
  },
  {
    title: "Integrating Stripe Subscription in React",
    platform: "YouTube",
    url: "#",
    featured: true,
    duration: "10:45",
    imageSrc: ""
  },
  {
    title: "Building an AI WhatsApp Bot",
    platform: "YouTube",
    url: "#",
    featured: false,
    duration: "25:00",
    imageSrc: ""
  }
];

export const faq = [
  { question: "What is your typical turnaround time?", answer: "Most SaaS MVPs are delivered within 4 to 6 weeks, depending on complexity and features." },
  { question: "Do you offer post-launch support?", answer: "Yes, all projects come with a 30-day bug-fixing guarantee, and long-term retainer options are available." },
  { question: "What tech stack do you specialize in?", answer: "I build primarily with Next.js App Router, React, Tailwind CSS, Prisma, and PostgreSQL." },
  { question: "How do you handle payments?", answer: "Typically, projects require a 50% upfront deposit, 25% at a major milestone, and 25% upon final delivery." }
];
