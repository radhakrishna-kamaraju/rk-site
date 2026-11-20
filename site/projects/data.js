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
    story: "https://github.com/radhakrishna-kamaraju/industrial-ai-index",
    // Used by the project page (next step).
    problem: "Everyone asks how they can implement industrial AI systems. The question they should ask first is: what is our current industrial AI maturity?",
    built: "A web app that asks 32 questions across four areas of a manufacturing business, scores each area, places the organisation on a five-level maturity scale, and writes a tailored report.",
    areas: ["Product lifecycle", "Factory", "Workforce", "Supply chain"],
    learned: [
      "My first API integration with Claude.",
      "An AI assessment app, built and deployed in one evening.",
      "Real-time assessment results instead of static information."
    ]
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
    cta: { text: "Read The Build Story", href: "https://lnkd.in/p/eXDbPhWd" }
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
