// The Shipped log. One entry per thing that went live and that someone could use or check.
// Tags: Shipped (new and live), Improved (a meaningful upgrade), Fixed (a real bug, with its cause),
// Wrote (a series, case study or post about the work). Personal projects only.
// To add an entry: copy one at the end of the list, change it, push to main. The page sorts by date;
// entries on the same day show the one lower in this file first, so add new entries at the end.
// Used by /shipped/, the homepage strip, and scripts/build-knowledge.js (the "Ask this site" assistant).
window.SHIPPED = [
  { date: "2026-04-24", tag: "Shipped", title: "Industrial AI Index, first version",
    text: "An AI readiness assessment for manufacturers, built as a demo for an industrial trade fair and hosted on Netlify.",
    link: "https://industrial-ai.radhakrishnakamaraju.com", linkText: "Try today's version" },

  { date: "2026-11-02", tag: "Shipped", title: "Clawdia",
    text: "My personal AI assistant, built on OpenClaw. Self-hosted on my own server, reachable on Telegram, with its own mailbox instead of my personal one. First worked end to end today." },

  { date: "2026-11-02", tag: "Wrote", title: "Building a personal AI assistant in ten days",
    text: "Finished a 10-part LinkedIn series documenting the Clawdia build, one post a day.",
    link: "https://www.linkedin.com/feed/update/urn:li:activity:7519738649542856704/", linkText: "Read the series" },

  { date: "2026-11-12", tag: "Shipped", title: "radhakrishnakamaraju.com",
    text: "My own domain on one VPS: each app in its own container behind Traefik, HTTPS certificates issued automatically, deployed by git push.",
    link: "https://github.com/radhakrishna-kamaraju/rk-site", linkText: "See the code" },

  { date: "2026-11-12", tag: "Improved", title: "Industrial AI Index moved to my own server",
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

  { date: "2026-11-13", tag: "Shipped", title: "AI Upskilling Planner",
    text: "A free 8-week AI plan for busy IT professionals, across six role tracks. It runs entirely in the browser: no sign-up, nothing sent to a server.",
    link: "https://radhakrishnakamaraju.com/upskill/", linkText: "Build your plan" },

  { date: "2026-11-13", tag: "Improved", title: "The assistant learns new pages by itself",
    text: "Every deploy of this site now generates the assistant's knowledge file from the real pages, so a new page reaches it with no manual update.",
    link: "https://github.com/radhakrishna-kamaraju/rk-site/blob/main/scripts/build-knowledge.js", linkText: "See the script" },

  { date: "2026-11-13", tag: "Fixed", title: "The planner could show a blank result",
    text: "When a browser refused to update the address bar, the error stopped the plan from rendering. That update is now optional, so the plan always appears.",
    link: "https://github.com/radhakrishna-kamaraju/rk-site#what-broke-and-whats-next", linkText: "The full story" },

  { date: "2026-11-13", tag: "Wrote", title: "Case studies for all three repos",
    text: "Each repo now explains why it exists, how it is built, the design decisions and trade-offs, and what broke.",
    link: "https://github.com/radhakrishna-kamaraju", linkText: "See them on GitHub" },
];
