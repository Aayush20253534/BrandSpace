/**
 * How BrandSpace works: the five pillars (Why BrandSpace) and the
 * six-stage process (Our Process).
 */

export const pillars = [
  {
    title: "Strategy",
    line: "Every project starts with the business, not the brief.",
    body:
      "We learn how you make money, who your best customers are and what is holding growth back — then decide what to build, and what not to.",
  },
  {
    title: "Creativity",
    line: "Ideas that make people stop, remember and act.",
    body:
      "Distinctive design and content earn attention honestly. We craft work that feels like your brand at its best, never a template with your logo on it.",
  },
  {
    title: "Technology",
    line: "Modern tools, used with purpose.",
    body:
      "Fast frameworks, clean tracking and automation where it saves time. Technology is chosen for what it does for your customers, not for how it sounds.",
  },
  {
    title: "Performance",
    line: "Speed, reach and efficiency — engineered in.",
    body:
      "Pages that load instantly, campaigns that are tested and tuned weekly, and budgets that go where they perform. Good work has to work.",
  },
  {
    title: "Measurable Growth",
    line: "Enquiries, bookings and revenue — not vanity metrics.",
    body:
      "We agree on the numbers that matter before we start and report on them plainly, so you always know what your investment is doing.",
  },
] as const;

export const processSteps = [
  {
    title: "Discover",
    body: "We study your business, customers, competitors and current presence to find the real opportunities.",
    output: "Audit & growth opportunities",
  },
  {
    title: "Strategize",
    body: "We define positioning, channels, messaging and the metrics that will prove success.",
    output: "Growth roadmap & KPIs",
  },
  {
    title: "Create",
    body: "Design, content, code and campaigns are crafted in focused sprints with your feedback built in.",
    output: "Brand, website & content",
  },
  {
    title: "Launch",
    body: "We ship carefully — tracking verified, pages tested, profiles and campaigns live together.",
    output: "Go-live across channels",
  },
  {
    title: "Optimize",
    body: "Real data replaces assumptions. We test, refine and reallocate effort to what performs.",
    output: "Weekly tuning & reports",
  },
  {
    title: "Grow",
    body: "With the foundation working, we scale what wins and open new channels as the business grows.",
    output: "Compounding growth",
  },
] as const;
