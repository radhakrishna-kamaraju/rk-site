// The Shipped log. One entry per thing that went live and that someone could use or check.
// Tags: Shipped (new and live), Improved (a meaningful upgrade), Fixed (a real bug, with its cause),
// Wrote (a series, case study or post about the work). Personal projects only.
// To add an entry: copy one at the end of the list, change it, push to main. The page sorts by date;
// entries on the same day show the one lower in this file first, so add new entries at the end.
// project: the slug from projects/data.js, when the entry belongs to a project.
// Used by /shipped/, the homepage strip, and scripts/build-knowledge.js (the "Ask this site" assistant).
window.SHIPPED = [
  { date: "2026-04-24", tag: "Shipped", title: "Industrial AI Index, first version", project: "industrial-ai-index",
    text: "An AI readiness assessment for manufacturers, built as a demo for an industrial trade fair and hosted on Netlify.",
    link: "https://industrial-ai.radhakrishnakamaraju.com", linkText: "Try today's version" },

  { date: "2026-11-02", tag: "Shipped", title: "Clawdia", project: "clawdia",
    text: "My personal AI assistant, built on OpenClaw. Self-hosted on my own server, reachable on Telegram, with its own mailbox instead of my personal one. First worked end to end today." },

  { date: "2026-11-02", tag: "Wrote", title: "Building a personal AI assistant in ten days", project: "clawdia",
    text: "Finished a 10-part LinkedIn series documenting the Clawdia build, one post a day.",
    link: "https://www.linkedin.com/feed/update/urn:li:activity:7519738649542856704/", linkText: "Read the series" },

  { date: "2026-11-12", tag: "Shipped", title: "radhakrishnakamaraju.com",
    text: "My own domain on one VPS: each app in its own container behind Traefik, HTTPS certificates issued automatically, deployed by git push.",
    link: "https://github.com/radhakrishna-kamaraju/rk-site", linkText: "See the code" },

  { date: "2026-11-12", tag: "Improved", title: "Industrial AI Index moved to my own server", project: "industrial-ai-index",
    text: "Rebranded, with the prompt built on the server so the API key can only produce this one report, and capped at 3 reports per visitor per hour and 10 per day.",
    link: "https://github.com/radhakrishna-kamaraju/industrial-ai-index", linkText: "Read the case study" },

  { date: "2026-11-12", tag: "Shipped", title: "Ask this site",
    text: "An AI assistant that answers only from this site's public content, removes any link it does not recognise, and declines jailbreak attempts.",
    link: "https://github.com/radhakrishna-kamaraju/rk-assistant", linkText: "Read the case study" },

  { date: "2026-11-12", tag: "Fixed", title: "The assistant's rate limit ran out too early",
    text: "Count-only logs showed the limiter was right but the page sometimes sent a question twice. The page now ignores a second submit while one is in flight.",
    link: "https://github.com/radhakrishna-kamaraju/rk-assistant#what-broke-and-whats-next", linkText: "The full story" },

  { date: "2026-11-12", tag: "Shipped", title: "Résumé as code",
    text: "A one-page résumé written in HTML, rendered to PDF by Playwright, and versioned in git like everything else.",
    link: "https://radhakrishnakamaraju.com/Radhakrishna-Kamaraju-Resume.pdf", linkText: "Open the PDF" },

  { date: "2026-11-13", tag: "Shipped", title: "AI Upskilling Planner", project: "ai-upskilling-planner",
    text: "A free 8-week AI plan for busy IT professionals, across six role tracks. It runs entirely in the browser: no sign-up, nothing sent to a server.",
    link: "https://radhakrishnakamaraju.com/upskill/", linkText: "Build your plan" },


  { date: "2026-11-13", tag: "Fixed", title: "The planner could show a blank result", project: "ai-upskilling-planner",
    text: "When a browser refused to update the address bar, the error stopped the plan from rendering. That update is now optional, so the plan always appears.",
    link: "https://github.com/radhakrishna-kamaraju/rk-site#what-broke-and-whats-next", linkText: "The full story" },

  { date: "2026-11-13", tag: "Wrote", title: "Case studies for all three repos",
    text: "Each repo now explains why it exists, how it is built, the design decisions and trade-offs, and what broke.",
    link: "https://github.com/radhakrishna-kamaraju", linkText: "See them on GitHub" },

  { date: "2026-11-14", tag: "Fixed", title: "The assistant broke links with an anchor",
    text: "Stripping markdown also removed the '#' inside links, so a link to a section of a page pointed nowhere. Allowed links are now set aside first, then put back. Found while building this log.",
    link: "https://github.com/radhakrishna-kamaraju/rk-assistant#what-broke-and-whats-next", linkText: "The full story" },
  { date: "2026-11-14", tag: "Fixed", title: "Site deploys had silently stopped",
    text: "A new build step wrote to a folder that did not exist, so every site build failed and the server kept serving the last good version. Found when the assistant did not know about this log. The step now creates its folder.",
    link: "https://github.com/radhakrishna-kamaraju/rk-site#what-broke-and-whats-next", linkText: "The full story" },

  { date: "2026-11-14", tag: "Improved", title: "The assistant learns new pages by itself",
    text: "Every deploy of this site now generates the assistant's knowledge file from the real pages, so a new page reaches it with no manual update.",
    link: "https://github.com/radhakrishna-kamaraju/rk-site/blob/main/scripts/build-knowledge.js", linkText: "See the script" },

  { date: "2026-11-16", tag: "Shipped", title: "Smart Factory Line", project: "smart-factory-line",
    text: "An interactive 3D production line with five stations. Raise the AI maturity level and each station switches over, with what it needs, a typical result and where it fails. It runs entirely in the browser.",
    link: "https://radhakrishnakamaraju.com/factory/", linkText: "Walk the line" },

  { date: "2026-11-16", tag: "Shipped", title: "Agent Caseback", project: "agent-caseback",
    text: "A recorded run of two AI agents assessing one project's health, replayed step by step. One agent does the work, a second audits it, and the status moves from a reported green to a signed-off red in three rounds. The reports are invented and the agent outputs are real.",
    link: "https://radhakrishnakamaraju.com/agents/", linkText: "Watch the run" },

  { date: "2026-11-10", tag: "Wrote", title: "Physical AI: what I studied, tested and still don't understand",
    text: "A learning log written in public: what I studied about Physical AI, what I tried for myself, and the questions I still can't answer.",
    link: "https://lnkd.in/p/erqigS6D", linkText: "Read the log" },

  { date: "2026-11-16", tag: "Improved", title: "Industrial AI Index v2", project: "industrial-ai-index",
    text: "The report is now benchmarked against the five-level maturity scale only, and the scoring changed so the lowest answers give 0%.",
    link: "https://industrial-ai.radhakrishnakamaraju.com", linkText: "Try it" },

  { date: "2026-11-16", tag: "Wrote", title: "buildwithRKAI, edition 1: Why I stopped collecting AI courses and started building",
    text: "The first edition of my fortnightly newsletter: why I stopped collecting courses and started building in public.",
    link: "https://www.linkedin.com/pulse/edition-1-why-i-stopped-collecting-ai-courses-started-kamaraju-msjpc", linkText: "Read edition 1" },

  { date: "2026-11-20", tag: "Improved", title: "This site, redesigned",
    text: "A Start Here path for each kind of visitor, three featured projects, an About page, and one header and footer on every page. Project cards and pages are built from a single data file, so adding a project updates every page.",
    link: "https://radhakrishnakamaraju.com/", linkText: "See the homepage" },

  { date: "2026-11-20", tag: "Shipped", title: "Clawdia's architecture, interactive", project: "clawdia",
    text: "Follow one message from Telegram to two agents and back. Select any part to see what it does, why it is set up that way, and what broke, with a link to that day's post.",
    link: "https://radhakrishnakamaraju.com/projects/clawdia/architecture/", linkText: "Explore it" },

  { date: "2026-11-20", tag: "Shipped", title: "Projects index",
    text: "Every project in one place, newest first, filterable by who it is for, what kind it is and whether it is live.",
    link: "https://radhakrishnakamaraju.com/projects/", linkText: "See all projects" },

  { date: "2026-11-22", tag: "Shipped", title: "Evals for the Ask this site assistant", project: "assistant-evals",
    text: "43 checks, each run three times, covering facts, unknowns, private details and prompt injection. All 129 graded answers passed. The tests also found a real bug: about one answer in ten came back empty.",
    link: "https://radhakrishnakamaraju.com/evals/", linkText: "See the results" },
];
