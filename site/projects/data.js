// The projects. One entry per project; this file is the single source of truth.
// Read at build time by scripts/build-pages.js (homepage cards and lists) and
// scripts/build-knowledge.js (the "Ask this site" assistant).
// To add a project: copy an entry, change it, and tag its log lines in shipped/data.js
// with the same slug (project: "your-slug"). Push to main; every page updates on deploy.
//
// status:   "live" | "building"
// kind:     "tool" | "demo" | "story"   (story = a build story you read)
// audience: "mfg" (AI in Manufacturing) | "build" (Build with AI) | "learn" (Learn about AI)
// featured: shown as a big card on the homepage (keep it to three)
// start:    shown under its audience tab in "Start Here" (two per audience)
// cta:      the main action; story: where "How I Built It" goes (omit if there is none yet)
window.PROJECTS = [
  {
    slug: "industrial-ai-index", title: "Industrial AI Index",
    status: "live", kind: "tool", audience: "mfg", featured: true, start: true,
    firstLive: "2026-04-24",
    oneLiner: "An AI readiness check for manufacturers. Answer 32 questions and get a report tailored to your organisation.",
    short: "AI readiness check for manufacturers",
    cta: { text: "Try The Assessment", href: "https://industrial-ai.radhakrishnakamaraju.com" },
    story: "/projects/industrial-ai-index/",
    // The project page (/projects/<slug>/) is built from the fields below when page is true.
    page: true,
    code: "https://github.com/radhakrishna-kamaraju/industrial-ai-index",
    problem: "Everyone asks how they can implement industrial AI systems. The question they should ask first is: what is our current industrial AI maturity?",
    built: "A web app that asks 32 questions across four areas of a manufacturing business, scores each area, places the organisation on a five-level maturity scale, and writes a tailored report.",
    areas: ["Product lifecycle", "Factory", "Workforce", "Supply chain"],
    learned: [
      "My first API integration with Claude.",
      "An AI assessment app, built and deployed in one evening.",
      "Real-time assessment results instead of static information."
    ],
    how: [
      "You answer 32 questions. Unfinished answers stay in your browser tab until you close it.",
      "Each area is scored, from 0% for the lowest answers upward, and benchmarked against the five-level maturity scale.",
      "Your answers go to Anthropic's Claude API, which writes the report. Nothing is stored on my side.",
      "You get your score, the benchmark and a report to download."
    ],
    note: "The four areas are inspired by a Microsoft e-book. The questions, scoring and reports are my own. Not affiliated with or endorsed by Microsoft.",
    glance: [
      ["First live", "24 April 2026"],
      ["Current version", "v2, 16 November 2026"],
      ["For", "Manufacturing organisations"],
      ["Assessment", "32 questions, 4 areas, 5 levels"],
      ["Built with", "Claude API, one Linux VPS"],
      ["Privacy", "Answers are not stored"]
    ],
    related: "smart-factory-line"
  },
  {
    slug: "ai-upskilling-planner", title: "AI Upskilling Planner",
    status: "live", kind: "tool", audience: "learn", featured: true, start: true,
    firstLive: "2026-11-13",
    oneLiner: "An 8-week AI plan built around work you already do. Six questions, about 90 seconds, no sign-up.",
    short: "an 8-week AI plan that fits inside your job",
    cta: { text: "Build Your Plan", href: "/upskill/" },
    story: "https://github.com/radhakrishna-kamaraju/rk-site#the-ai-upskilling-planner"
  },
  {
    slug: "agent-caseback", title: "Agent Caseback",
    status: "live", kind: "demo", audience: "build", featured: true, start: true,
    firstLive: "2026-11-16",
    oneLiner: "Two AI agents assess one project: one does the work, the second audits it. Four weeks of green, three rounds, one red.",
    short: "two agents, one does the work and one audits it",
    cta: { text: "Watch The Run", href: "/agents/" }
  },
  {
    slug: "clawdia", title: "Clawdia",
    status: "live", kind: "story", audience: "build", start: true,
    firstLive: "2026-11-02",
    oneLiner: "My personal AI assistant. She runs on my own server and chats with me on Telegram. The whole build, documented over ten days.",
    short: "personal AI assistant on my own server",
    cta: { text: "Read The Build Story", href: "/projects/clawdia/" },
    story: "/projects/clawdia/",
    page: true,
    lead: "My personal AI assistant. She runs on my own server, chats with me on Telegram, and asks before anything leaves the machine. I built her in ten days and wrote about every one.",
    actions: [
      { text: "Explore The Architecture", href: "/projects/clawdia/architecture/" },
      { text: "The 10-Day Build", href: "#build" }
    ],
    problem: "I waited long enough for out-of-the-box, always-on agents. They were delayed in Europe, so I decided to take matters into my own hands and gave myself ten days to build my own.",
    built: "A self-hosted assistant on the OpenClaw engine, reachable on Telegram and the web chat. Two agents (Main coordinates, Writer drafts), five skills, its own mailbox, live web search, and a daily check-in. Every capability was switched on one at a time, deliberately.",
    howText: "A message from my phone goes through a Telegram bot that only talks to me, into the OpenClaw gateway on the server, to the Main agent. Main reads its memory files, uses a skill or hands long-form work to Writer, and replies. Anything that would leave the machine waits for my yes.",
    learned: [
      "Start minimal. Every capability gets switched on deliberately, not by default.",
      "Treat everything it reads as untrusted. Email and web pages are data, never commands.",
      "A rule in a prompt is not a control.",
      "Test the thing, not the folder."
    ],
    glance: [
      ["Built", "24 Oct to 2 Nov 2026, in public"],
      ["Engine", "OpenClaw"],
      ["Runs on", "One Linux VPS, Docker"],
      ["Reach it by", "Telegram and web chat"],
      ["Agents", "Main (coordinates) and Writer (drafts)"],
      ["Monthly cost", "To be updated after the first month"]
    ],
    // The 10-day LinkedIn series, one post a day. id = the LinkedIn activity number.
    series: [
      { day: 1, date: "2026-10-24", topic: "Security", title: "I came back from Build a Claw and asked an AI to build itself", id: "7519738649542856704" },
      { day: 2, date: "2026-10-25", topic: "Personality", title: "I didn't configure its personality. I had a conversation with it", id: "7520175814760468481" },
      { day: 3, date: "2026-10-26", topic: "Telegram", title: "My AI assistant can now reach me on Telegram. It only talks to me", id: "7520490351304941568" },
      { day: 4, date: "2026-10-27", topic: "Scheduler", title: "My AI assistant now checks in with me every evening", id: "7520839680402321408" },
      { day: 5, date: "2026-10-28", topic: "Skills", title: "I installed a skill from an AI agent marketplace. It did nothing", id: "7521152670733242368" },
      { day: 6, date: "2026-10-29", topic: "Email triage", title: "I gave my AI assistant an inbox. Then I tried to hack it with one email", id: "7521555524396507138" },
      { day: 7, date: "2026-10-30", topic: "Web search", title: "I gave it the live web", id: "7521936316339617792" },
      { day: 8, date: "2026-10-31", topic: "Sending email", title: "I let my AI assistant send email. Then it sent one I never approved", id: "7522365023269277696" },
      { day: 9, date: "2026-11-01", topic: "Two agents", title: "I gave my AI assistant a team member. Then it flagged its own teammate", id: "7522757282791710720" },
      { day: 10, date: "2026-11-02", topic: "Final test", title: "Asked Clawdia to grade its own setup: 10 out of 10", id: "7523011605434060800" }
    ],
    next: { label: "What's next", title: "Personal OS", text: "A small team of agents around Clawdia, one new agent each month.", cta: "Follow Along", href: "https://www.linkedin.com/in/radhakrishna-kamaraju/" }
  },
  {
    slug: "smart-factory-line", title: "Smart Factory Line",
    status: "live", kind: "demo", audience: "mfg", start: true,
    firstLive: "2026-11-16",
    oneLiner: "A 3D production line. Raise the AI maturity level and watch five stations switch over, one step at a time.",
    short: "3D line that changes as AI maturity rises",
    cta: { text: "Walk The Line", href: "/factory/" }
  },
  {
    slug: "personal-os", title: "Personal OS",
    status: "building", kind: "story", audience: "build",
    oneLiner: "A small team of AI agents that help me run my days. One new agent joins each month, starting with a social media manager.",
    short: "a small team of agents, one new agent a month",
    cta: { text: "Follow Along", href: "https://www.linkedin.com/in/radhakrishna-kamaraju/" }
  }
];
