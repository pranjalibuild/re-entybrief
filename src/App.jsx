import { useState, useEffect, useRef, useCallback } from "react";

// ─── Data ────────────────────────────────────────────────────────────────────

const EPISODES_BY_QUARTER = [
  { q: "Q2 2022", count: 8, women: 3 },
  { q: "Q3 2022", count: 20, women: 2 },
  { q: "Q4 2022", count: 20, women: 1 },
  { q: "Q1 2023", count: 22, women: 3 },
  { q: "Q2 2023", count: 19, women: 1 },
  { q: "Q3 2023", count: 20, women: 2 },
  { q: "Q4 2023", count: 24, women: 1 },
  { q: "Q1 2024", count: 19, women: 0 },
  { q: "Q2 2024", count: 21, women: 2 },
  { q: "Q3 2024", count: 16, women: 0 },
  { q: "Q4 2024", count: 17, women: 1 },
  { q: "Q1 2025", count: 15, women: 1 },
  { q: "Q2 2025", count: 18, women: 3 },
  { q: "Q3 2025", count: 18, women: 1 },
  { q: "Q4 2025", count: 17, women: 6 },
  { q: "Q1 2026", count: 15, women: 3 },
];

const QUICK_TAKEAWAYS = [
  {
    date: "Mar 2026",
    guest: "Jenny Wen",
    role: "Design leader",
    takeaway: "Even engineers are asking 'how do we keep up with ourselves?' Designers and PMs are feeling the same pressure. The key is embracing AI as a collaborator, not competing with it.",
    tags: ["ai", "design"],
    isWoman: true,
  },
  {
    date: "Feb 2026",
    guest: "Marc Andreessen",
    role: "Co-founder, a16z",
    takeaway: "The real AI boom hasn't started. We're in the infrastructure phase. The application layer (where PMs live) is about to explode. Being 'behind' now actually means you're arriving just in time.",
    tags: ["ai", "startups"],
  },
  {
    date: "Feb 2026",
    guest: "Dr. Becky Kennedy",
    role: "Child psychologist",
    takeaway: "Managing difficult adults uses the same skills as managing difficult children: validate the feeling, hold the boundary. 'I believe you AND the answer is still no.' Applicable in every stakeholder meeting.",
    tags: ["leadership"],
    isWoman: true,
  },
  {
    date: "Feb 2026",
    guest: "Lazar Jovanovic",
    role: "Professional 'vibe coder'",
    takeaway: "A new AI-era job has emerged: people who can't code in the traditional sense but can direct AI to build entire products. The PM-to-builder pipeline just got radically shorter.",
    tags: ["ai", "career"],
  },
  {
    date: "Jan 2026",
    guest: "Jason Lemkin",
    role: "SaaStr founder",
    takeaway: "'We replaced our sales team with 20 AI agents.' This is actually happening. AI SDRs are handling outbound at scale. Product-led growth just got a new partner: AI-led sales.",
    tags: ["ai", "b2b"],
  },
  {
    date: "Jan 2026",
    guest: "Molly Graham",
    role: "COO, ex-Facebook/Google",
    takeaway: "In high-growth chaos, your job isn't to have all the answers. It's to give people enough context to make good decisions without you. The best leaders make themselves less necessary.",
    tags: ["leadership", "growth"],
    isWoman: true,
  },
  {
    date: "Dec 2025",
    guest: "Tomer Cohen",
    role: "CPO at LinkedIn",
    takeaway: "LinkedIn is turning PMs into AI-powered full-stack builders. The PM role is expanding: you're now expected to prototype with AI, not just write specs and hand off.",
    tags: ["ai", "career"],
  },
  {
    date: "Nov 2025",
    guest: "Melanie Perkins",
    role: "CEO of Canva ($42B)",
    takeaway: "She built Canva from literally nothing. A pitch rejected 100+ times. Her secret: 'crazy big goals' paired with relentless iteration. The gap between vision and execution is just persistence.",
    tags: ["startups", "leadership"],
    isWoman: true,
  },
  {
    date: "Nov 2025",
    guest: "Dr. Fei-Fei Li",
    role: "The 'Godmother of AI'",
    takeaway: "World models are next: AI that understands physical reality, not just text. Jobs won't disappear, but they'll transform. The biggest risk isn't AI replacing you, it's not understanding how it's reshaping your domain.",
    tags: ["ai"],
    isWoman: true,
  },
  {
    date: "Nov 2025",
    guest: "Stewart Butterfield",
    role: "Founder of Slack",
    takeaway: "Great products come from understanding what people actually do, not what they say they do. The best mental model: watch someone struggle, then remove one step.",
    tags: ["product", "design"],
  },
  {
    date: "Oct 2025",
    guest: "Chip Huyen",
    role: "AI Engineer (Nvidia, Stanford)",
    takeaway: "AI Engineering 101: the stack is model selection, prompt engineering, RAG, fine-tuning, and evals. You don't need to code all of it, but you need to understand the trade-offs between each layer.",
    tags: ["ai", "engineering"],
    isWoman: true,
  },
  {
    date: "Sep 2025",
    guest: "Ben Horowitz",
    role: "Co-founder, a16z",
    takeaway: "$46B of hard truths: 'The most important thing about your company culture is that it must be different from the default culture, and you must fight for that difference every single day.'",
    tags: ["leadership", "startups"],
  },
  {
    date: "Sep 2025",
    guest: "Scott Wu",
    role: "CEO of Devin (AI engineer)",
    takeaway: "AI is replacing junior engineering tasks, not junior engineers. The role shifts to supervision, review, and architecture. PMs who understand this boundary will lead more effectively.",
    tags: ["ai", "engineering"],
  },
  {
    date: "Aug 2025",
    guest: "Howie Liu",
    role: "CEO of Airtable",
    takeaway: "Airtable restructured their entire org around AI. Not a feature team. The whole company. This is the pattern: AI isn't a feature, it's a reorganization of how product orgs work.",
    tags: ["ai", "leadership"],
  },
  {
    date: "Jul 2025",
    guest: "Bret Taylor",
    role: "Co-founder Sierra, ex-Salesforce",
    takeaway: "He saved OpenAI's board crisis, invented the Like button, led Salesforce. His through-line: the best product decisions come from spending 80% of your time understanding the problem, 20% on the solution.",
    tags: ["leadership", "product"],
  },
  {
    date: "Jun 2025",
    guest: "Mike Krieger",
    role: "CPO at Anthropic, co-founder Instagram",
    takeaway: "Anthropic's CPO says what comes next for AI is 'agency': AI that acts, not just responds. PMs need to think in terms of workflows and outcomes, not features and screens.",
    tags: ["ai", "product"],
  },
  {
    date: "May 2025",
    guest: "Aparna Chennapragada",
    role: "CPO at Microsoft",
    takeaway: "If you aren't prototyping with AI, you're doing it wrong. Microsoft's CPO says the expectation is shifting. PMs who can build rough prototypes with AI tools have a massive advantage.",
    tags: ["ai", "career"],
    isWoman: true,
  },
  {
    date: "May 2025",
    guest: "Michael Truell",
    role: "CEO of Cursor ($300M ARR)",
    takeaway: "Cursor went from 0 to $300M ARR as an AI code editor. The lesson: AI products that reduce friction in existing workflows beat AI products that create new workflows.",
    tags: ["ai", "startups"],
  },
  {
    date: "Apr 2025",
    guest: "Kevin Weil",
    role: "CPO at OpenAI",
    takeaway: "OpenAI's CPO: the must-have PM skill in the AI era is 'taste': knowing what good looks like when AI can build anything. Technical depth matters less; product judgment matters more.",
    tags: ["ai", "career"],
  },
  {
    date: "Mar 2025",
    guest: "Anton Osika",
    role: "CEO of Lovable",
    takeaway: "$10M ARR in 60 days. The vibe-coding movement is real: non-engineers building production apps with AI. The barrier between 'idea person' and 'builder' has effectively collapsed.",
    tags: ["ai", "startups"],
  },
];

const WOMEN_WISDOM = [
  {
    guest: "Deb Liu",
    role: "VP at Facebook, CEO of Ancestry",
    quote: "And then I had a baby. I was turning 30, I had my son, and I had to leave for six months. I handed my product to my successor. He did such a good job while I was gone, I didn't want to displace him. So I thought, 'Well, I'll go and look for another role.' That turned out to be one of the best things that ever happened to my career.",
    theme: "The pivot after baby",
    episodeUrl: null,
    episodeTitle: "How to own your career growth and become a powerful product leader",
    paths: ["new-job", "internal"],
  },
  {
    guest: "Jiaona Zhang",
    role: "CPO at Webflow",
    quote: "I joined Webflow at the beginning of my third trimester. I had exactly 90 days before my first son was born. I was in my first trimester during layoffs, faced with a choice: take the new role, or put myself on a layoff list for someone I'd brought to the company who was on a visa.",
    theme: "Third trimester, new job",
    episodeUrl: "https://www.youtube.com/watch?v=gLFZNzeylCc&t=2551",
    episodeTitle: "Building minimum lovable products",
    paths: ["new-job"],
  },
  {
    guest: "Julie Zhuo",
    role: "VP of Design at Facebook",
    quote: "The first seven or eight years at Facebook, every single week, I felt like an imposter. The constant refrain: 'Do you really deserve to be here? You've never done this before.' But looking back, being in that uncomfortable position coincided with the fastest periods of growth in my career.",
    theme: "Seven years of imposter syndrome",
    episodeUrl: "https://www.youtube.com/watch?v=YLsxHa1dhSw&t=516",
    episodeTitle: "Accelerating your career and impostor syndrome",
    paths: ["same-role", "internal"],
  },
  {
    guest: "Ami Vora",
    role: "CPO at Faire, ex-WhatsApp",
    quote: "I'm talking to you from my bathroom. Three kids, two parents working remote. When I looked at successful women, they were all super women who responded to every email in 10 seconds and never seemed to sleep. It took me a while to realize: no one's got it fully figured out. Most of us are winging it.",
    theme: "From her bathroom, with three kids",
    episodeUrl: "https://www.youtube.com/watch?v=6UHAop9fhNU&t=180",
    episodeTitle: "Making an impact through authenticity and curiosity",
    paths: ["same-role", "new-job", "internal", "flexible"],
  },
  {
    guest: "Molly Graham",
    role: "COO, ex-Facebook/Google",
    quote: "I like being on learning curves so steep that I'm scared I'm going to fall off. Nothing accelerates your self-knowledge faster than trying to do something you don't know how to do. One of the greatest gifts in a career is knowing yourself.",
    theme: "Fear as a compass",
    episodeUrl: "https://www.youtube.com/watch?v=twzLDx9iers&t=442",
    episodeTitle: "Frameworks for leading through chaos, change, and scale",
    paths: ["new-job", "internal"],
  },
  {
    guest: "Ada Chen Rekhi",
    role: "Founder, Co-founder of Notejoy",
    quote: "The difficulty of this game is that no one tells you the rules. You don't know how to get intros, what impressions people form, or the feedback you're not getting because it's 'unsafe' for a manager to tell a young woman how her physical appearance affects how she's perceived.",
    theme: "The invisible rules",
    episodeUrl: "https://www.youtube.com/watch?v=N64vIY2nJQo&t=3321",
    episodeTitle: "How to make better decisions and build a joyful career",
    paths: ["new-job", "internal"],
  },
  {
    guest: "Claire Butler",
    role: "First GTM hire at Figma",
    quote: "The hardest part was I didn't have anyone to talk to. It was just me. And it takes this immense confidence in yourself, but that's stressful when you don't have the cycles. What I learned is that building trust in yourself is the thing that carries you through everything after.",
    theme: "Building self-trust alone",
    episodeUrl: "https://www.youtube.com/watch?v=UmirRfy-gzA&t=516",
    episodeTitle: "An inside look at Figma's unique GTM motion",
    paths: ["new-job", "internal", "flexible"],
  },
  {
    guest: "Ami Vora",
    role: "CPO at Faire, ex-WhatsApp",
    quote: "I try to just put on the coat of the job. When I wake up in the morning: what would it be like if I were doing this job? What would I think about on my commute? Who would I have lunch with? Do I like them? That gives me an emotional response more telling than any spreadsheet.",
    theme: "Put on the coat of the job",
    episodeUrl: "https://www.youtube.com/watch?v=6UHAop9fhNU&t=543",
    episodeTitle: "Making an impact through authenticity and curiosity",
    paths: ["new-job", "internal"],
  },
  {
    guest: "Anneka Gupta",
    role: "President at LiveRamp",
    quote: "At first I felt so scared by what was ahead of me and how much change I was going to go through in a very short period of time. But I started to reframe: every challenging situation is also an opportunity to show what I'm capable of.",
    theme: "Reframing fear",
    episodeUrl: "https://www.youtube.com/watch?v=E3dUveqt9Bw&t=183",
    episodeTitle: "Becoming more strategic, navigating difficult colleagues",
    paths: ["same-role", "internal", "flexible"],
  },
  {
    guest: "Deb Liu",
    role: "CEO of Ancestry, ex-Facebook VP",
    quote: "I had this pretty real imposter syndrome for a while when I started doing well. A coach was the key, to help me see that if I made a mistake, things wouldn't crumble. It's very normal to make mistakes.",
    theme: "Permission to be imperfect",
    episodeUrl: null,
    episodeTitle: "How to own your career growth and become a powerful product leader",
    paths: ["same-role", "internal"],
  },
  {
    guest: "Julie Zhuo",
    role: "VP of Design at Facebook",
    quote: "I am much better at asking for help now. I used to try and hold it all in. Now I realize I was preventing myself from getting the support, empathy, and advice that would've helped me grow faster, maybe with a little less pain.",
    theme: "Asking for help is strength",
    episodeUrl: "https://www.youtube.com/watch?v=YLsxHa1dhSw&t=516",
    episodeTitle: "Accelerating your career and impostor syndrome",
    paths: ["same-role"],
  },
  {
    guest: "Alisa Cohn",
    role: "Executive Coach, Author",
    quote: "I got onto my hardwood floors and just bawled in the fetal position for an hour. Am I going to be able to make this work? Then I got up from my stress nap and started making calls. Even at your lowest moments, anything you learn can be turned into fuel.",
    theme: "Rock bottom to resilience",
    episodeUrl: "https://www.youtube.com/watch?v=bvF0ZM8DjuI&t=4144",
    episodeTitle: "Scripts for difficult conversations",
    paths: ["same-role", "new-job", "internal", "flexible"],
  },
  {
    guest: "Melanie Perkins",
    role: "CEO of Canva ($42B)",
    quote: "I was rejected by over 100 investors. At one point I literally learned kiteboarding just to get a meeting with a VC who liked kiteboarding. You have to be willing to look ridiculous in pursuit of something you believe in.",
    theme: "100 rejections to $42B",
    episodeUrl: "https://www.youtube.com/watch?v=-LywX3T5Scc",
    episodeTitle: "How she built a $42B company from nothing",
    paths: ["new-job"],
  },
  {
    guest: "Claire Hughes Johnson",
    role: "COO at Stripe",
    quote: "If you're not sure who the decision maker is, it's probably you. And I'd rather you act that way than not, because you're going to slow the whole company down.",
    theme: "Assume you're the decision-maker",
    episodeUrl: "https://www.youtube.com/watch?v=Mv0o9o4MRh0",
    episodeTitle: "Lessons from scaling Stripe",
    paths: ["same-role", "internal"],
  },
  {
    guest: "Aparna Chennapragada",
    role: "CPO at Microsoft",
    quote: "If you aren't prototyping with AI, you're doing it wrong. The expectation has shifted. The PMs who can quickly build and test ideas with AI tools have a massive, compounding advantage.",
    theme: "Prototype with AI",
    episodeUrl: "https://www.youtube.com/watch?v=HbbfXAWcuUo",
    episodeTitle: "If you aren't prototyping with AI, you're doing it wrong",
    paths: ["same-role", "new-job", "internal", "flexible"],
  },
  {
    guest: "Sarah Tavel",
    role: "General Partner, Benchmark",
    quote: "If you're not doing the core action, you're not really a user of the product. Everything else is secondary. Find the one thing that matters most and ruthlessly focus on it.",
    theme: "Ruthless focus",
    episodeUrl: "https://www.youtube.com/watch?v=H9g4pzcz6Tk&t=345",
    episodeTitle: "The hierarchy of engagement",
    paths: ["same-role"],
  },
];

const FRAMEWORKS = [
  {
    name: "The Hill Climb",
    guest: "Ami Vora",
    description: "You're on a local optimum (a good hill). To reach the mountain, you must descend through a valley. Mat leave IS the valley. The summit ahead is higher.",
    useCase: "When doubting whether leaving was worth it",
    paths: ["same-role"],
  },
  {
    name: "Mental Time Travel",
    guest: "Annie Duke",
    description: "Project forward 10 years. Will this decision matter? This deflates the emotional charge and reveals what's actually important.",
    useCase: "When re-entry anxiety feels overwhelming",
    paths: ["same-role", "new-job", "internal", "flexible"],
  },
  {
    name: "Put On the Coat",
    guest: "Ami Vora",
    description: "Don't spreadsheet your job decision. Imagine waking up doing that job. What do you think about on your commute? Who do you eat lunch with? Trust the emotional signal.",
    useCase: "When choosing your next role",
    paths: ["new-job", "internal"],
  },
  {
    name: "The Nevertheless",
    guest: "Annie Duke",
    description: "'I heard you, your input was incorporated. Nevertheless, this is the path.' Builds authority while honoring collaboration.",
    useCase: "When rebuilding your leadership voice",
    paths: ["same-role", "internal"],
  },
  {
    name: "Assume You Decide",
    guest: "Claire Hughes Johnson",
    description: "If you're not sure who the decision-maker is, it's you. Act that way. People will correct you faster than they'll fill a vacuum.",
    useCase: "When uncertain about your authority",
    paths: ["same-role", "internal"],
  },
  {
    name: "Gardener, Not Builder",
    guest: "Alex Komoroske",
    description: "Builders plan and execute. Value is capped by effort. Gardeners identify seeds with compound potential. The best careers are gardened.",
    useCase: "When planning your trajectory post-leave",
    paths: ["new-job", "internal", "flexible"],
  },
];

const RETURN_PATHS = [
  { id: "same-role", label: "Back to my old role", description: "Re-entering where I left off" },
  { id: "new-job", label: "New job, new company", description: "Open to something different" },
  { id: "internal", label: "New role, same company", description: "Moving internally, more flexibility" },
  { id: "flexible", label: "Part-time or flexible", description: "Negotiating a different arrangement" },
];

// ─── Date helpers ────────────────────────────────────────────────────────────

const MONTH_MAP = {
  Jan: 0, Feb: 1, Mar: 2, Apr: 3, May: 4, Jun: 5,
  Jul: 6, Aug: 7, Sep: 8, Oct: 9, Nov: 10, Dec: 11,
};

// "Mar 2025" → quarter index in EPISODES_BY_QUARTER, or -1 if not found
function dateToQuarterIdx(dateStr) {
  const [mon, yearStr] = dateStr.split(" ");
  const month = MONTH_MAP[mon];
  const year = parseInt(yearStr, 10);
  if (month === undefined || isNaN(year)) return -1;
  const qNum = Math.floor(month / 3) + 1; // 1–4
  const qLabel = `Q${qNum} ${year}`;
  return EPISODES_BY_QUARTER.findIndex(q => q.q === qLabel);
}

// ─── Utility ─────────────────────────────────────────────────────────────────

function useInView(threshold = 0.15) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setVisible(true); obs.disconnect(); } },
      { threshold }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);
  return [ref, visible];
}

function FadeIn({ children, delay = 0, style = {} }) {
  const [ref, visible] = useInView();
  return (
    <div
      ref={ref}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(20px)",
        transition: `all 0.55s cubic-bezier(0.25, 0.46, 0.45, 0.94) ${delay}s`,
        ...style,
      }}
    >
      {children}
    </div>
  );
}

// ─── Components ──────────────────────────────────────────────────────────────

function GenderVisualization() {
  const [ref, visible] = useInView(0.3);
  const total = 289;
  const women = 38;
  const dots = [];

  for (let i = 0; i < total; i++) {
    const isWoman = i < women;
    dots.push(
      <div
        key={i}
        style={{
          width: "6px",
          height: "6px",
          borderRadius: "50%",
          background: isWoman ? "#c47a5a" : "rgba(44,36,23,0.12)",
          transition: `all 0.8s ease ${visible ? (isWoman ? i * 0.03 : 0.9 + (i - women) * 0.002) : 0}s`,
          opacity: visible ? 1 : 0,
          transform: visible ? "scale(1)" : "scale(0)",
        }}
      />
    );
  }

  return (
    <div ref={ref} style={{ padding: "48px 0" }}>
      <div style={{
        display: "flex",
        flexWrap: "wrap",
        gap: "4px",
        maxWidth: "440px",
        margin: "0 auto 28px",
        justifyContent: "center",
      }}>
        {dots}
      </div>
      <div style={{
        textAlign: "center",
        opacity: visible ? 1 : 0,
        transition: "opacity 1.2s ease 2s",
      }}>
        <div style={{
          fontFamily: "'Instrument Serif', Georgia, serif",
          fontSize: "28px",
          color: "#2c2417",
          marginBottom: "6px",
        }}>
          38 out of 289
        </div>
        <div style={{
          fontFamily: "'DM Sans', sans-serif",
          fontSize: "14px",
          color: "#8a7b6b",
          lineHeight: 1.6,
          maxWidth: "400px",
          margin: "0 auto",
        }}>
          episodes of Lenny's Podcast feature women guests. That's{" "}
          <span style={{ color: "#c47a5a", fontWeight: 600 }}>13%</span>.
          <br />
          The women most likely to take a career break are the least represented in the conversation about coming back. We're fixing that.
        </div>
      </div>
    </div>
  );
}

function LeaveSelector({ startIdx, endIdx, onChangeStart, onChangeEnd }) {
  const totalEpisodes = EPISODES_BY_QUARTER
    .filter((_, i) => i >= startIdx && i <= endIdx)
    .reduce((sum, q) => sum + q.count, 0);

  const quarters = (endIdx - startIdx) + 1;
  const months = quarters * 3;

  return (
    <div style={{ padding: "16px 0 32px" }}>
      {/* Selectors */}
      <div style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: "12px",
        marginBottom: "20px",
      }}>
        <div style={{ textAlign: "center" }}>
          <div style={{
            fontFamily: "'DM Sans', sans-serif",
            fontSize: "10px",
            letterSpacing: "1.5px",
            textTransform: "uppercase",
            color: "#8a7b6b",
            marginBottom: "6px",
          }}>Leave started</div>
          <select
            value={startIdx}
            onChange={e => {
              const val = Number(e.target.value);
              onChangeStart(val);
              if (val > endIdx) onChangeEnd(val);
            }}
            style={{
              fontFamily: "'DM Sans', sans-serif",
              fontSize: "14px",
              fontWeight: 600,
              color: "#2c2417",
              background: "rgba(255,255,255,0.6)",
              border: "1px solid rgba(180,160,140,0.2)",
              borderRadius: "10px",
              padding: "8px 28px 8px 14px",
              cursor: "pointer",
              appearance: "none",
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='10' height='6' viewBox='0 0 10 6' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M1 1L5 5L9 1' stroke='%238a7b6b' stroke-width='1.5' stroke-linecap='round'/%3E%3C/svg%3E")`,
              backgroundRepeat: "no-repeat",
              backgroundPosition: "right 10px center",
            }}
          >
            {EPISODES_BY_QUARTER.map((q, i) => (
              <option key={q.q} value={i}>{q.q}</option>
            ))}
          </select>
        </div>

        <div style={{
          fontFamily: "'DM Sans', sans-serif",
          fontSize: "13px",
          color: "#b5a898",
          paddingTop: "18px",
        }}>to</div>

        <div style={{ textAlign: "center" }}>
          <div style={{
            fontFamily: "'DM Sans', sans-serif",
            fontSize: "10px",
            letterSpacing: "1.5px",
            textTransform: "uppercase",
            color: "#8a7b6b",
            marginBottom: "6px",
          }}>Returning</div>
          <select
            value={endIdx}
            onChange={e => {
              const val = Number(e.target.value);
              onChangeEnd(val);
              if (val < startIdx) onChangeStart(val);
            }}
            style={{
              fontFamily: "'DM Sans', sans-serif",
              fontSize: "14px",
              fontWeight: 600,
              color: "#2c2417",
              background: "rgba(255,255,255,0.6)",
              border: "1px solid rgba(180,160,140,0.2)",
              borderRadius: "10px",
              padding: "8px 28px 8px 14px",
              cursor: "pointer",
              appearance: "none",
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='10' height='6' viewBox='0 0 10 6' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M1 1L5 5L9 1' stroke='%238a7b6b' stroke-width='1.5' stroke-linecap='round'/%3E%3C/svg%3E")`,
              backgroundRepeat: "no-repeat",
              backgroundPosition: "right 10px center",
            }}
          >
            {EPISODES_BY_QUARTER.map((q, i) => (
              <option key={q.q} value={i}>{q.q}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Bar chart */}
      <div style={{
        display: "flex",
        gap: "6px",
        alignItems: "flex-end",
        justifyContent: "center",
        height: "100px",
        padding: "0 12px",
      }}>
        {EPISODES_BY_QUARTER.map((q, i) => {
          const isInLeave = i >= startIdx && i <= endIdx;
          const h = (q.count / 24) * 70 + 10;
          return (
            <div key={q.q} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "4px" }}>
              <div style={{
                width: "24px",
                height: `${h}px`,
                borderRadius: "4px 4px 0 0",
                background: isInLeave
                  ? "linear-gradient(to top, #c47a5a, #d4a574)"
                  : "rgba(44,36,23,0.08)",
                transition: "all 0.35s ease",
                position: "relative",
              }}>
                {isInLeave && (
                  <div style={{
                    position: "absolute",
                    top: "-16px",
                    left: "50%",
                    transform: "translateX(-50%)",
                    fontFamily: "'DM Sans', sans-serif",
                    fontSize: "9px",
                    fontWeight: 600,
                    color: "#c47a5a",
                  }}>
                    {q.count}
                  </div>
                )}
              </div>
              <div style={{
                fontFamily: "'DM Sans', sans-serif",
                fontSize: "7px",
                color: isInLeave ? "#c47a5a" : "#b5a898",
                transform: "rotate(-45deg)",
                transformOrigin: "center",
                whiteSpace: "nowrap",
                width: "24px",
                textAlign: "center",
              }}>
                {q.q}
              </div>
            </div>
          );
        })}
      </div>

      {/* Dynamic summary */}
      <div style={{
        textAlign: "center",
        fontFamily: "'DM Sans', sans-serif",
        fontSize: "13px",
        color: "#5a4d3e",
        marginTop: "20px",
        padding: "14px 16px",
        background: "rgba(196,122,90,0.06)",
        borderRadius: "10px",
      }}>
        {months} months away. <strong style={{ color: "#c47a5a" }}>{totalEpisodes} episodes</strong> dropped.
        <br />Here's what mattered.
      </div>
    </div>
  );
}

function TakeawayCard({ item, index }) {
  return (
    <FadeIn delay={index * 0.06}>
      <div style={{
        background: "rgba(255,255,255,0.55)",
        backdropFilter: "blur(12px)",
        borderRadius: "14px",
        padding: "24px 28px",
        border: item.isWoman
          ? "1px solid rgba(196,122,90,0.25)"
          : "1px solid rgba(180,160,140,0.12)",
        marginBottom: "12px",
      }}>
        <div style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          marginBottom: "10px",
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: "8px", flexWrap: "wrap" }}>
            <span style={{
              fontFamily: "'DM Sans', sans-serif",
              fontSize: "14px",
              fontWeight: 600,
              color: "#2c2417",
            }}>{item.guest}</span>
            <span style={{
              fontFamily: "'DM Sans', sans-serif",
              fontSize: "12px",
              color: "#8a7b6b",
            }}>{item.role}</span>
            {item.isWoman && (
              <span style={{
                fontFamily: "'DM Sans', sans-serif",
                fontSize: "9px",
                fontWeight: 600,
                letterSpacing: "1px",
                textTransform: "uppercase",
                color: "#c47a5a",
                background: "rgba(196,122,90,0.08)",
                border: "1px solid rgba(196,122,90,0.2)",
                borderRadius: "4px",
                padding: "2px 7px",
              }}>Women's voice</span>
            )}
          </div>
          <span style={{
            fontFamily: "'DM Sans', sans-serif",
            fontSize: "11px",
            color: "#b07d62",
            fontWeight: 500,
            whiteSpace: "nowrap",
            flexShrink: 0,
            marginLeft: "8px",
          }}>{item.date}</span>
        </div>
        <p style={{
          fontFamily: "'DM Sans', sans-serif",
          fontSize: "14.5px",
          lineHeight: 1.6,
          color: "#3d3225",
          margin: 0,
        }}>
          {item.takeaway}
        </p>
        <div style={{ display: "flex", gap: "6px", marginTop: "12px" }}>
          {item.tags.map(tag => (
            <span key={tag} style={{
              fontFamily: "'DM Sans', sans-serif",
              fontSize: "10px",
              fontWeight: 500,
              letterSpacing: "0.5px",
              textTransform: "uppercase",
              color: "#b07d62",
              background: "rgba(176,125,98,0.08)",
              borderRadius: "4px",
              padding: "3px 8px",
            }}>{tag}</span>
          ))}
        </div>
      </div>
    </FadeIn>
  );
}

function WisdomCard({ item, index, returnPath }) {
  const isMatch = returnPath && item.paths?.includes(returnPath);
  const isDimmed = returnPath && !isMatch;
  const hasTimestamp = item.episodeUrl && item.episodeUrl.includes("&t=");
  return (
    <FadeIn delay={index * 0.06}>
      <div style={{
        background: isMatch ? "rgba(255,255,255,0.82)" : "rgba(255,255,255,0.55)",
        backdropFilter: "blur(12px)",
        borderRadius: "14px",
        padding: "28px 28px",
        border: isMatch ? "1px solid rgba(196,122,90,0.35)" : "1px solid rgba(180,160,140,0.12)",
        borderLeft: isMatch ? "3px solid #c47a5a" : undefined,
        marginBottom: "14px",
        transition: "all 0.35s ease",
        opacity: isDimmed ? 0.38 : 1,
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "12px" }}>
          <div style={{
            fontFamily: "'DM Sans', sans-serif",
            fontSize: "10.5px",
            letterSpacing: "1.5px",
            textTransform: "uppercase",
            color: "#c47a5a",
            fontWeight: 500,
          }}>
            {item.theme}
          </div>
          {isMatch && (
            <span style={{
              fontFamily: "'DM Sans', sans-serif",
              fontSize: "9px",
              letterSpacing: "0.8px",
              textTransform: "uppercase",
              color: "#c47a5a",
              background: "rgba(196,122,90,0.1)",
              border: "1px solid rgba(196,122,90,0.2)",
              borderRadius: "4px",
              padding: "2px 6px",
              fontWeight: 600,
            }}>
              Your path
            </span>
          )}
        </div>
        <p style={{
          fontFamily: "'Instrument Serif', Georgia, serif",
          fontSize: "18px",
          lineHeight: 1.55,
          color: "#2c2417",
          margin: "0 0 16px 0",
          fontStyle: "italic",
        }}>
          "{item.quote}"
        </p>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <div style={{
              width: "32px",
              height: "32px",
              borderRadius: "50%",
              background: "linear-gradient(135deg, #c47a5a, #d4a574)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "white",
              fontFamily: "'DM Sans', sans-serif",
              fontSize: "12px",
              fontWeight: 600,
            }}>
              {item.guest.split(" ").map(n => n[0]).join("")}
            </div>
            <div>
              <div style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 600, fontSize: "13px", color: "#2c2417" }}>
                {item.guest}
              </div>
              <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "11px", color: "#8a7b6b" }}>
                {item.role}
              </div>
            </div>
          </div>
          {item.episodeUrl && (
            <a
              href={item.episodeUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={e => e.stopPropagation()}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "5px",
                fontFamily: "'DM Sans', sans-serif",
                fontSize: "11px",
                fontWeight: 500,
                color: "#b07d62",
                textDecoration: "none",
                padding: "6px 12px",
                borderRadius: "8px",
                background: "rgba(176,125,98,0.07)",
                border: "1px solid rgba(176,125,98,0.12)",
                transition: "all 0.2s ease",
                whiteSpace: "nowrap",
                flexShrink: 0,
              }}
              onMouseOver={e => { e.currentTarget.style.background = "rgba(176,125,98,0.14)"; }}
              onMouseOut={e => { e.currentTarget.style.background = "rgba(176,125,98,0.07)"; }}
            >
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polygon points="5 3 19 12 5 21 5 3" fill="currentColor" stroke="none" />
              </svg>
              {hasTimestamp ? "Watch this moment" : "Watch episode"}
            </a>
          )}
        </div>
      </div>
    </FadeIn>
  );
}

function PathSelector({ returnPath, onSelect }) {
  return (
    <div style={{ padding: "0 0 8px" }}>
      <div style={{
        fontFamily: "'DM Sans', sans-serif",
        fontSize: "10px",
        letterSpacing: "2px",
        textTransform: "uppercase",
        color: "#b07d62",
        fontWeight: 500,
        marginBottom: "10px",
        textAlign: "center",
      }}>
        Where are you headed next?
      </div>
      <div style={{
        display: "flex",
        flexWrap: "wrap",
        gap: "8px",
        justifyContent: "center",
      }}>
        {RETURN_PATHS.map(p => {
          const isActive = returnPath === p.id;
          return (
            <button
              key={p.id}
              onClick={() => onSelect(isActive ? null : p.id)}
              style={{
                background: isActive ? "#2c2417" : "rgba(255,255,255,0.6)",
                color: isActive ? "#f5efe8" : "#5a4d3e",
                border: isActive ? "1px solid #2c2417" : "1px solid rgba(180,160,140,0.2)",
                borderRadius: "24px",
                padding: "8px 16px",
                fontFamily: "'DM Sans', sans-serif",
                fontSize: "12px",
                fontWeight: 500,
                cursor: "pointer",
                transition: "all 0.2s ease",
                backdropFilter: "blur(8px)",
              }}
              onMouseOver={e => {
                if (!isActive) {
                  e.currentTarget.style.background = "rgba(255,255,255,0.85)";
                  e.currentTarget.style.borderColor = "rgba(180,160,140,0.4)";
                }
              }}
              onMouseOut={e => {
                if (!isActive) {
                  e.currentTarget.style.background = "rgba(255,255,255,0.6)";
                  e.currentTarget.style.borderColor = "rgba(180,160,140,0.2)";
                }
              }}
            >
              {p.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}

function FrameworkCard({ fw, index, returnPath }) {
  const isMatch = returnPath && fw.paths?.includes(returnPath);
  const isDimmed = returnPath && !isMatch;
  const [open, setOpen] = useState(false);
  return (
    <FadeIn delay={index * 0.06}>
      <div
        onClick={() => setOpen(!open)}
        style={{
          background: open ? "#2c2417" : (isMatch ? "rgba(255,255,255,0.82)" : "rgba(255,255,255,0.55)"),
          backdropFilter: "blur(12px)",
          borderRadius: "14px",
          padding: "22px 28px",
          border: open ? "1px solid #2c2417" : (isMatch ? "1px solid rgba(196,122,90,0.35)" : "1px solid rgba(180,160,140,0.12)"),
          borderLeft: (!open && isMatch) ? "3px solid #c47a5a" : undefined,
          marginBottom: "10px",
          cursor: "pointer",
          color: open ? "#f5efe8" : "#2c2417",
          transition: "all 0.35s ease",
          opacity: isDimmed ? 0.38 : 1,
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "8px", flexWrap: "wrap" }}>
              <span style={{
                fontFamily: "'Instrument Serif', Georgia, serif",
                fontSize: "19px",
              }}>{fw.name}</span>
              {isMatch && !open && (
                <span style={{
                  fontFamily: "'DM Sans', sans-serif",
                  fontSize: "9px",
                  letterSpacing: "0.8px",
                  textTransform: "uppercase",
                  color: "#c47a5a",
                  background: "rgba(196,122,90,0.1)",
                  border: "1px solid rgba(196,122,90,0.2)",
                  borderRadius: "4px",
                  padding: "2px 6px",
                  fontWeight: 600,
                }}>Your path</span>
              )}
            </div>
            <span style={{
              fontFamily: "'DM Sans', sans-serif",
              fontSize: "12px",
              color: open ? "rgba(245,239,232,0.5)" : "#8a7b6b",
              marginLeft: "0px",
              display: "block",
              marginTop: "2px",
            }}>{fw.guest}</span>
          </div>
          <span style={{
            fontSize: "18px",
            color: "#c47a5a",
            transition: "transform 0.3s",
            transform: open ? "rotate(45deg)" : "rotate(0)",
          }}>+</span>
        </div>
        {open && (
          <div style={{ marginTop: "16px", paddingTop: "14px", borderTop: "1px solid rgba(245,239,232,0.1)" }}>
            <p style={{
              fontFamily: "'DM Sans', sans-serif",
              fontSize: "14.5px",
              lineHeight: 1.6,
              color: "rgba(245,239,232,0.85)",
              margin: "0 0 14px 0",
            }}>
              {fw.description}
            </p>
            <div style={{
              background: "rgba(196,122,90,0.12)",
              borderRadius: "8px",
              padding: "10px 14px",
              fontFamily: "'DM Sans', sans-serif",
              fontSize: "12.5px",
              color: "rgba(245,239,232,0.7)",
            }}>
              <span style={{ fontWeight: 600, color: "#d4a574" }}>Use when: </span>
              {fw.useCase}
            </div>
          </div>
        )}
      </div>
    </FadeIn>
  );
}

// ─── Main App ────────────────────────────────────────────────────────────────

export default function ReEntryBrief() {
  const [loaded, setLoaded] = useState(false);
  const [view, setView] = useState(null); // null = home, "missed" | "wisdom"
  const [leaveStartIdx, setLeaveStartIdx] = useState(11); // Q1 2025
  const [leaveEndIdx, setLeaveEndIdx] = useState(15);    // Q1 2026
  const [filterTag, setFilterTag] = useState("all");
  const [returnPath, setReturnPath] = useState(null); // null | "same-role" | "new-job" | "internal" | "flexible"

  useEffect(() => {
    setLoaded(true);
    const f = document.createElement("link");
    f.href = "https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=DM+Sans:ital,wght@0,300;0,400;0,500;0,600;0,700;1,400&display=swap";
    f.rel = "stylesheet";
    document.head.appendChild(f);
  }, []);

  const filteredTakeaways = QUICK_TAKEAWAYS
    .filter(t => {
      const inRange = (() => {
        const idx = dateToQuarterIdx(t.date);
        return idx >= leaveStartIdx && idx <= leaveEndIdx;
      })();
      const inTag = filterTag === "all" ? true : t.tags.includes(filterTag);
      return inRange && inTag;
    })
    .sort((a, b) => {
      // Women guests float to the top within any filtered view
      if (!!a.isWoman === !!b.isWoman) return 0;
      return a.isWoman ? -1 : 1;
    });

  const sortedWisdom = [...WOMEN_WISDOM].sort((a, b) => {
    if (!returnPath) return 0;
    const aMatch = a.paths?.includes(returnPath) ? 0 : 1;
    const bMatch = b.paths?.includes(returnPath) ? 0 : 1;
    return aMatch - bMatch;
  });

  const sortedFrameworks = [...FRAMEWORKS].sort((a, b) => {
    if (!returnPath) return 0;
    const aMatch = a.paths?.includes(returnPath) ? 0 : 1;
    const bMatch = b.paths?.includes(returnPath) ? 0 : 1;
    return aMatch - bMatch;
  });

  // ─── Home ────────────────────────
  if (!view) {
    return (
      <div style={{
        minHeight: "100vh",
        background: "#f5efe8",
        fontFamily: "'DM Sans', sans-serif",
      }}>
        {/* Grain texture */}
        <div style={{
          position: "fixed", inset: 0, pointerEvents: "none", zIndex: 0,
          opacity: 0.035,
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
          backgroundSize: "180px",
        }} />

        <div style={{ position: "relative", zIndex: 1 }}>
          {/* Hero */}
          <div style={{
            minHeight: "65vh",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            padding: "60px 24px 20px",
            textAlign: "center",
          }}>
            <div style={{
              opacity: loaded ? 1 : 0,
              transform: loaded ? "translateY(0)" : "translateY(30px)",
              transition: "all 1s cubic-bezier(0.25, 0.46, 0.45, 0.94) 0.2s",
              maxWidth: "640px",
            }}>
              <div style={{
                fontSize: "10px",
                letterSpacing: "3px",
                textTransform: "uppercase",
                color: "#b07d62",
                marginBottom: "24px",
                fontWeight: 500,
              }}>
                Built from 289 episodes of Lenny's Podcast
              </div>
              <h1 style={{
                fontFamily: "'Instrument Serif', Georgia, serif",
                fontSize: "clamp(38px, 7vw, 64px)",
                fontWeight: 400,
                color: "#2c2417",
                lineHeight: 1.08,
                margin: "0 0 20px 0",
              }}>
                The Re-Entry Brief
              </h1>
              <p style={{
                fontFamily: "'Instrument Serif', Georgia, serif",
                fontSize: "clamp(17px, 2.5vw, 22px)",
                color: "#5a4d3e",
                lineHeight: 1.5,
                margin: "0 0 8px 0",
                fontStyle: "italic",
              }}>
                For the product leader who stepped away.
              </p>
              <p style={{
                fontSize: "14px",
                color: "#8a7b6b",
                lineHeight: 1.65,
                margin: "0",
                maxWidth: "460px",
                marginLeft: "auto",
                marginRight: "auto",
              }}>
                Parental leave. Caregiving. Sabbatical. Whatever took you away, this brings you back up to speed. Not another un-listened episode. Distilled wisdom.
              </p>
            </div>
          </div>

          {/* Bridge + Gender visualization */}
          <div style={{
            textAlign: "center",
            maxWidth: "520px",
            margin: "0 auto",
            padding: "0 24px",
          }}>
            <p style={{
              fontFamily: "'DM Sans', sans-serif",
              fontSize: "14px",
              color: "#8a7b6b",
              lineHeight: 1.7,
              margin: 0,
            }}>
              Career breaks happen for many reasons. But the data is clear: women are far more likely to be the ones who step away, for maternity leave, for caregiving, for family. That's why we're putting a spotlight on their voices specifically.
            </p>
          </div>
          <GenderVisualization />

          {/* Two doors */}
          <div style={{
            maxWidth: "640px",
            margin: "0 auto 0",
            padding: "0 24px 48px",
            display: "flex",
            flexDirection: "column",
            gap: "16px",
          }}>
            <FadeIn>
              <div style={{
                fontFamily: "'DM Sans', sans-serif",
                fontSize: "11px",
                letterSpacing: "2px",
                textTransform: "uppercase",
                color: "#b07d62",
                fontWeight: 500,
                textAlign: "center",
                marginBottom: "8px",
              }}>
                What do you need right now?
              </div>
            </FadeIn>

            <FadeIn delay={0.1}>
              <button
                onClick={() => setView("missed")}
                style={{
                  width: "100%",
                  background: "#2c2417",
                  border: "none",
                  borderRadius: "16px",
                  padding: "32px 28px",
                  cursor: "pointer",
                  textAlign: "left",
                  transition: "transform 0.2s ease, box-shadow 0.2s ease",
                }}
                onMouseOver={e => { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = "0 8px 30px rgba(44,36,23,0.15)"; }}
                onMouseOut={e => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "none"; }}
              >
                <div style={{
                  fontFamily: "'Instrument Serif', Georgia, serif",
                  fontSize: "26px",
                  color: "#f5efe8",
                  marginBottom: "8px",
                }}>
                  What did I miss?
                </div>
                <p style={{
                  fontFamily: "'DM Sans', sans-serif",
                  fontSize: "14px",
                  color: "rgba(245,239,232,0.6)",
                  lineHeight: 1.5,
                  margin: 0,
                }}>
                  Quick takeaways from every episode during your time away. One paragraph each. Read one in two minutes.
                </p>
                <div style={{
                  marginTop: "16px",
                  fontFamily: "'DM Sans', sans-serif",
                  fontSize: "12px",
                  color: "#d4a574",
                  fontWeight: 500,
                }}>
                  Select your time away · see what dropped →
                </div>
              </button>
            </FadeIn>

            <FadeIn delay={0.2}>
              <button
                onClick={() => setView("wisdom")}
                style={{
                  width: "100%",
                  background: "rgba(255,255,255,0.55)",
                  backdropFilter: "blur(12px)",
                  border: "1px solid rgba(180,160,140,0.15)",
                  borderRadius: "16px",
                  padding: "32px 28px",
                  cursor: "pointer",
                  textAlign: "left",
                  transition: "transform 0.2s ease, box-shadow 0.2s ease",
                }}
                onMouseOver={e => { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = "0 8px 30px rgba(44,36,23,0.08)"; }}
                onMouseOut={e => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "none"; }}
              >
                <div style={{
                  fontFamily: "'Instrument Serif', Georgia, serif",
                  fontSize: "26px",
                  color: "#2c2417",
                  marginBottom: "8px",
                }}>
                  What nobody tells you about coming back.
                </div>
                <p style={{
                  fontFamily: "'DM Sans', sans-serif",
                  fontSize: "14px",
                  color: "#5a4d3e",
                  lineHeight: 1.5,
                  margin: 0,
                }}>
                  Quotes, stories, and frameworks from product leaders who navigated re-entry: imposter syndrome, career pivots, invisible rules. Women's voices front and center.
                </p>
                <div style={{
                  marginTop: "16px",
                  fontFamily: "'DM Sans', sans-serif",
                  fontSize: "12px",
                  color: "#c47a5a",
                  fontWeight: 500,
                }}>
                  16 women · 6 frameworks · real stories →
                </div>
              </button>
            </FadeIn>
          </div>

          {/* Frameworks teaser */}
          <div style={{ maxWidth: "640px", margin: "0 auto", padding: "0 24px 56px" }}>
            <PathSelector returnPath={returnPath} onSelect={setReturnPath} />
            <div style={{ height: "20px" }} />
            <FadeIn>
              <div style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                marginBottom: "14px",
              }}>
                <div style={{
                  fontFamily: "'DM Sans', sans-serif",
                  fontSize: "10px",
                  letterSpacing: "2px",
                  textTransform: "uppercase",
                  color: "#b07d62",
                  fontWeight: 500,
                }}>
                  {returnPath
                    ? `Frameworks for your path`
                    : "Frameworks for your return"}
                </div>
                <button
                  onClick={() => { setView("wisdom"); window.scrollTo(0, 0); }}
                  style={{
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    fontFamily: "'DM Sans', sans-serif",
                    fontSize: "11px",
                    color: "#c47a5a",
                    fontWeight: 500,
                    padding: 0,
                  }}
                >
                  See all →
                </button>
              </div>
            </FadeIn>
            {sortedFrameworks.slice(0, 3).map((fw, i) => (
              <FrameworkCard key={fw.name} fw={fw} index={i} returnPath={returnPath} />
            ))}
            <FadeIn delay={0.2}>
              <button
                onClick={() => { setView("wisdom"); window.scrollTo(0, 0); }}
                style={{
                  width: "100%",
                  background: "none",
                  border: "1px dashed rgba(180,160,140,0.3)",
                  borderRadius: "12px",
                  padding: "14px",
                  cursor: "pointer",
                  fontFamily: "'DM Sans', sans-serif",
                  fontSize: "12px",
                  color: "#b07d62",
                  marginTop: "8px",
                  transition: "all 0.2s ease",
                }}
                onMouseOver={e => { e.currentTarget.style.background = "rgba(255,255,255,0.4)"; }}
                onMouseOut={e => { e.currentTarget.style.background = "none"; }}
              >
                + 3 more frameworks · real stories from women leaders
              </button>
            </FadeIn>
          </div>

          {/* Footer quote */}
          <div style={{
            textAlign: "center",
            padding: "0 24px 60px",
            maxWidth: "520px",
            margin: "0 auto",
          }}>
            <FadeIn>
              <p style={{
                fontFamily: "'Instrument Serif', Georgia, serif",
                fontSize: "18px",
                color: "#5a4d3e",
                fontStyle: "italic",
                lineHeight: 1.5,
                margin: "0 0 8px 0",
              }}>
                "Your next chapter has better material."
              </p>
              <p style={{
                fontFamily: "'DM Sans', sans-serif",
                fontSize: "11px",
                color: "#b5a898",
              }}>
                Built for the product leader no one thought to build for.
              </p>
            </FadeIn>
          </div>
        </div>
      </div>
    );
  }

  // ─── What Did I Miss ─────────────
  if (view === "missed") {
    const allTags = [...new Set(QUICK_TAKEAWAYS.flatMap(t => t.tags))].sort();
    return (
      <div style={{
        minHeight: "100vh",
        background: "#f5efe8",
        fontFamily: "'DM Sans', sans-serif",
      }}>
        <div style={{
          position: "fixed", inset: 0, pointerEvents: "none", zIndex: 0,
          opacity: 0.035,
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
          backgroundSize: "180px",
        }} />

        <div style={{ position: "relative", zIndex: 1 }}>
          {/* Header */}
          <div style={{
            position: "sticky",
            top: 0,
            background: "rgba(245,239,232,0.9)",
            backdropFilter: "blur(16px)",
            zIndex: 10,
            padding: "16px 24px",
            borderBottom: "1px solid rgba(180,160,140,0.1)",
          }}>
            <div style={{ maxWidth: "640px", margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <button
                onClick={() => setView(null)}
                style={{
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  fontFamily: "'DM Sans', sans-serif",
                  fontSize: "13px",
                  color: "#b07d62",
                  padding: "4px 0",
                }}
              >
                ← Back
              </button>
              <span style={{
                fontFamily: "'Instrument Serif', Georgia, serif",
                fontSize: "16px",
                color: "#2c2417",
              }}>
                What Did I Miss?
              </span>
              <div style={{ width: "40px" }} />
            </div>
          </div>

          <div style={{ maxWidth: "640px", margin: "0 auto", padding: "32px 24px 100px" }}>
            {/* Intro */}
            <div style={{ marginBottom: "24px" }}>
              <h2 style={{
                fontFamily: "'Instrument Serif', Georgia, serif",
                fontSize: "32px",
                fontWeight: 400,
                color: "#2c2417",
                margin: "0 0 10px 0",
              }}>
                What dropped while you were away.
              </h2>
              <p style={{
                fontSize: "14px",
                color: "#8a7b6b",
                lineHeight: 1.6,
                margin: 0,
              }}>
                One takeaway per episode. No fluff. Read one during a feed, or skim them all in 15 minutes.
              </p>
            </div>

            {/* Interactive leave selector + timeline */}
            <LeaveSelector
              startIdx={leaveStartIdx}
              endIdx={leaveEndIdx}
              onChangeStart={setLeaveStartIdx}
              onChangeEnd={setLeaveEndIdx}
            />

            {/* Tag filters */}
            <div style={{
              display: "flex",
              gap: "6px",
              flexWrap: "wrap",
              marginBottom: "24px",
            }}>
              {["all", ...allTags].map(tag => {
                const isActive = filterTag === tag;
                return (
                  <button
                    key={tag}
                    onClick={() => setFilterTag(tag)}
                    style={{
                      background: isActive ? "#2c2417" : "rgba(255,255,255,0.5)",
                      color: isActive ? "#f5efe8" : "#5a4d3e",
                      border: isActive ? "1px solid #2c2417" : "1px solid rgba(180,160,140,0.12)",
                      borderRadius: "20px",
                      padding: "6px 14px",
                      fontFamily: "'DM Sans', sans-serif",
                      fontSize: "12px",
                      fontWeight: 500,
                      cursor: "pointer",
                      transition: "all 0.2s ease",
                    }}
                  >
                    {tag === "all" ? "All" : tag}
                  </button>
                );
              })}
            </div>

            {/* Takeaway cards */}
            {filteredTakeaways.length === 0 ? (
              <div style={{
                textAlign: "center",
                padding: "48px 24px",
                fontFamily: "'DM Sans', sans-serif",
                fontSize: "14px",
                color: "#8a7b6b",
                lineHeight: 1.6,
              }}>
                No takeaways yet for that window.
                <br />Coverage currently runs from <strong style={{ color: "#c47a5a" }}>Q1 2025 onward</strong> — slide your dates forward to see content.
              </div>
            ) : (
              filteredTakeaways.map((item, i) => (
                <TakeawayCard key={i} item={item} index={i} />
              ))
            )}

            {/* CTA */}
            <FadeIn>
              <div style={{
                marginTop: "40px",
                background: "#2c2417",
                borderRadius: "16px",
                padding: "32px 28px",
                textAlign: "center",
              }}>
                <div style={{
                  fontFamily: "'Instrument Serif', Georgia, serif",
                  fontSize: "22px",
                  color: "#f5efe8",
                  marginBottom: "10px",
                }}>
                  You're caught up.
                </div>
                <p style={{
                  fontFamily: "'DM Sans', sans-serif",
                  fontSize: "14px",
                  color: "rgba(245,239,232,0.6)",
                  lineHeight: 1.6,
                  margin: "0 0 20px 0",
                }}>
                  That's months of episodes in minutes. Whatever you were doing instead, it mattered too.
                </p>
                <button
                  onClick={() => { setView("wisdom"); window.scrollTo(0, 0); }}
                  style={{
                    background: "rgba(196,122,90,0.15)",
                    border: "1px solid rgba(196,122,90,0.3)",
                    borderRadius: "10px",
                    padding: "12px 24px",
                    cursor: "pointer",
                    fontFamily: "'DM Sans', sans-serif",
                    fontSize: "13px",
                    fontWeight: 500,
                    color: "#d4a574",
                  }}
                >
                  Next: What nobody tells you about coming back →
                </button>
              </div>
            </FadeIn>
          </div>
        </div>
      </div>
    );
  }

  // ─── Am I Ready ──────────────────
  if (view === "wisdom") {
    return (
      <div style={{
        minHeight: "100vh",
        background: "#f5efe8",
        fontFamily: "'DM Sans', sans-serif",
      }}>
        <div style={{
          position: "fixed", inset: 0, pointerEvents: "none", zIndex: 0,
          opacity: 0.035,
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
          backgroundSize: "180px",
        }} />

        <div style={{ position: "relative", zIndex: 1 }}>
          {/* Header */}
          <div style={{
            position: "sticky",
            top: 0,
            background: "rgba(245,239,232,0.9)",
            backdropFilter: "blur(16px)",
            zIndex: 10,
            padding: "16px 24px",
            borderBottom: "1px solid rgba(180,160,140,0.1)",
          }}>
            <div style={{ maxWidth: "640px", margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <button
                onClick={() => setView(null)}
                style={{
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  fontFamily: "'DM Sans', sans-serif",
                  fontSize: "13px",
                  color: "#b07d62",
                  padding: "4px 0",
                }}
              >
                ← Back
              </button>
              <span style={{
                fontFamily: "'Instrument Serif', Georgia, serif",
                fontSize: "16px",
                color: "#2c2417",
              }}>
                They've Been Where You Are
              </span>
              <div style={{ width: "40px" }} />
            </div>
          </div>

          <div style={{ maxWidth: "640px", margin: "0 auto", padding: "32px 24px 100px" }}>
            {/* Intro */}
            <div style={{ marginBottom: "32px" }}>
              <h2 style={{
                fontFamily: "'Instrument Serif', Georgia, serif",
                fontSize: "32px",
                fontWeight: 400,
                color: "#2c2417",
                margin: "0 0 10px 0",
              }}>
                The advice nobody prepares you for.
              </h2>
              <p style={{
                fontSize: "14px",
                color: "#8a7b6b",
                lineHeight: 1.6,
                margin: "0 0 24px 0",
              }}>
                They interviewed in their third trimester. They worked from bathrooms with three kids. They started over after caregiving breaks. In 289 episodes, only 13% feature women. Their signal gets buried. Not here.
              </p>
              {/* Path selector inline */}
              <PathSelector returnPath={returnPath} onSelect={setReturnPath} />
            </div>

            {/* Path context banner */}
            {returnPath && (() => {
              const p = RETURN_PATHS.find(r => r.id === returnPath);
              const matchCount = WOMEN_WISDOM.filter(w => w.paths?.includes(returnPath)).length;
              return (
                <div style={{
                  background: "rgba(196,122,90,0.08)",
                  border: "1px solid rgba(196,122,90,0.18)",
                  borderRadius: "12px",
                  padding: "14px 18px",
                  marginBottom: "28px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  gap: "12px",
                }}>
                  <div>
                    <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "12px", fontWeight: 600, color: "#c47a5a", marginBottom: "2px" }}>
                      Path: {p?.label}
                    </div>
                    <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "12px", color: "#8a7b6b" }}>
                      {matchCount} stories and frameworks tagged for this path, sorted to the top.
                    </div>
                    {returnPath === "new-job" && (
                      <div style={{
                        fontFamily: "'DM Sans', sans-serif",
                        fontSize: "11px",
                        color: "#8a7b6b",
                        marginTop: "8px",
                        paddingTop: "8px",
                        borderTop: "1px solid rgba(196,122,90,0.12)",
                        lineHeight: 1.5,
                      }}>
                        <span style={{ fontWeight: 600, color: "#b07d62" }}>One gap worth naming:</span> entrepreneurship as a re-entry path (starting your own thing after a break) is almost absent from 289 episodes. The frameworks here still apply, but the "I left and built something" stories aren't in the data yet.
                      </div>
                    )}
                  </div>
                  <button
                    onClick={() => setReturnPath(null)}
                    style={{ background: "none", border: "none", cursor: "pointer", fontSize: "16px", color: "#b07d62", flexShrink: 0, padding: "4px" }}
                  >×</button>
                </div>
              );
            })()}

            {/* Section: Frameworks, first so path selection has immediate visible effect */}
            <div style={{
              fontSize: "10px",
              letterSpacing: "2px",
              textTransform: "uppercase",
              color: "#b07d62",
              fontWeight: 500,
              marginBottom: "14px",
            }}>
              Frameworks for your return
            </div>

            {sortedFrameworks.map((fw, i) => {
              const isFirstUnmatched = returnPath &&
                i > 0 &&
                !fw.paths?.includes(returnPath) &&
                sortedFrameworks[i - 1].paths?.includes(returnPath);
              return (
                <div key={fw.name}>
                  {isFirstUnmatched && (
                    <div style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "12px",
                      margin: "20px 0 14px",
                    }}>
                      <div style={{ flex: 1, height: "1px", background: "rgba(180,160,140,0.2)" }} />
                      <span style={{
                        fontFamily: "'DM Sans', sans-serif",
                        fontSize: "10px",
                        letterSpacing: "1.5px",
                        textTransform: "uppercase",
                        color: "#b07d62",
                        fontWeight: 500,
                        whiteSpace: "nowrap",
                      }}>All frameworks</span>
                      <div style={{ flex: 1, height: "1px", background: "rgba(180,160,140,0.2)" }} />
                    </div>
                  )}
                  <FrameworkCard fw={fw} index={i} returnPath={returnPath} />
                </div>
              );
            })}

            {/* Section: Stories */}
            <div style={{
              fontSize: "10px",
              letterSpacing: "2px",
              textTransform: "uppercase",
              color: "#b07d62",
              fontWeight: 500,
              marginTop: "48px",
              marginBottom: "16px",
            }}>
              Real stories
            </div>

            {sortedWisdom.map((item, i) => {
              const isFirstUnmatched = returnPath &&
                i > 0 &&
                !item.paths?.includes(returnPath) &&
                sortedWisdom[i - 1].paths?.includes(returnPath);
              return (
                <div key={item.guest + item.theme}>
                  {isFirstUnmatched && (
                    <div style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "12px",
                      margin: "28px 0 18px",
                    }}>
                      <div style={{ flex: 1, height: "1px", background: "rgba(180,160,140,0.2)" }} />
                      <span style={{
                        fontFamily: "'DM Sans', sans-serif",
                        fontSize: "10px",
                        letterSpacing: "1.5px",
                        textTransform: "uppercase",
                        color: "#b07d62",
                        fontWeight: 500,
                        whiteSpace: "nowrap",
                      }}>All stories</span>
                      <div style={{ flex: 1, height: "1px", background: "rgba(180,160,140,0.2)" }} />
                    </div>
                  )}
                  <WisdomCard item={item} index={i} returnPath={returnPath} />
                </div>
              );
            })}

            {/* Closing */}
            <FadeIn>
              <div style={{
                marginTop: "48px",
                textAlign: "center",
                padding: "40px 24px",
              }}>
                <div style={{
                  fontFamily: "'Instrument Serif', Georgia, serif",
                  fontSize: "24px",
                  color: "#2c2417",
                  fontStyle: "italic",
                  lineHeight: 1.45,
                  marginBottom: "12px",
                }}>
                  "Most of us are winging it and learning as we go,<br />
                  and it's all normal. It's all fine.<br />
                  I can do it and you can do it."
                </div>
                <div style={{
                  fontFamily: "'DM Sans', sans-serif",
                  fontSize: "12px",
                  color: "#8a7b6b",
                  marginBottom: "32px",
                }}>
                  Ami Vora, CPO at Faire, from her bathroom with three kids
                </div>

                <button
                  onClick={() => { setView("missed"); window.scrollTo(0, 0); }}
                  style={{
                    background: "#2c2417",
                    border: "none",
                    borderRadius: "10px",
                    padding: "12px 24px",
                    cursor: "pointer",
                    fontFamily: "'DM Sans', sans-serif",
                    fontSize: "13px",
                    fontWeight: 500,
                    color: "#d4a574",
                  }}
                >
                  ← What did I miss?
                </button>
              </div>
            </FadeIn>

            {/* Footer */}
            <div style={{
              marginTop: "40px",
              paddingTop: "24px",
              borderTop: "1px solid rgba(180,160,140,0.12)",
              textAlign: "center",
            }}>
              <p style={{
                fontFamily: "'DM Sans', sans-serif",
                fontSize: "12px",
                color: "#b5a898",
                lineHeight: 1.6,
              }}>
                Built from 289 episodes of Lenny's Podcast
                <br />
                Built for the product leader no one thought to build for.
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return null;
}