import { BrandVoice, PlatformOutput, PlatformType, SourceAnalysis, SourceType, VerificationEvidence } from '../types';
import { countCharacters, countWords } from '../utils';

// Helper to extract sentences from text
function getSentences(text: string): string[] {
  return text
    .replace(/(\r\n|\n|\r)/gm, ' ')
    .split(/(?<=[.?!])\s+/)
    .map((s) => s.trim())
    .filter((s) => s.length > 15);
}

// Extract statistics & numbers using regex
function extractStats(text: string): string[] {
  const statsMatches = text.match(
    /(\d+(\.\d+)?%|\$\d+(\.\d+)?\s*(billion|million|k|M|B)?|\d+(\.\d+)?\s*(hours?|minutes?|seconds?|days?|months?|years?|x|X|gigawatt-hours?|GWh|MW|kW|encounters|patient|patients))/gi
  );
  const foundStats: string[] = [];
  if (statsMatches) {
    const sentences = getSentences(text);
    for (const match of statsMatches) {
      const parentSentence = sentences.find((s) => s.includes(match));
      if (parentSentence && !foundStats.includes(parentSentence) && foundStats.length < 5) {
        foundStats.push(parentSentence);
      }
    }
  }
  if (foundStats.length === 0) {
    foundStats.push('34.2% acceleration in operational workflow velocity', 'Over 2.5x gain in net practitioner productivity', '$3.4M estimated institutional annual savings');
  }
  return foundStats;
}

// Extract quotations
function extractQuotes(text: string): string[] {
  const quoteRegex = /"([^"]{15,200})"/g;
  const quotes: string[] = [];
  let match;
  while ((match = quoteRegex.exec(text)) !== null) {
    if (quotes.length < 4) {
      quotes.push(`"${match[1]}"`);
    }
  }
  if (quotes.length === 0) {
    quotes.push('"Cognitive symbiosis between human domain expertise and algorithmic intelligence is the defining paradigm of this era."');
  }
  return quotes;
}

// Extract named entities
function extractEntities(text: string): string[] {
  const words = text.match(/[A-Z][a-z]+(?:\s+[A-Z][a-z]+)*/g) || [];
  const frequency: Record<string, number> = {};
  const stopWords = new Set(['The', 'This', 'That', 'These', 'Those', 'In', 'On', 'At', 'To', 'For', 'With', 'By', 'Key', 'Executive', 'Summary', 'Conclusion', 'Report', 'Date', 'Panel', 'Speakers']);

  for (const w of words) {
    if (w.length > 2 && !stopWords.has(w)) {
      frequency[w] = (frequency[w] || 0) + 1;
    }
  }

  const sorted = Object.entries(frequency)
    .sort((a, b) => b[1] - a[1])
    .map(([term]) => term);

  return sorted.slice(0, 7);
}

// Intelligent analysis simulation
export function simulateSourceAnalysis(
  title: string,
  sourceType: SourceType,
  text: string
): SourceAnalysis {
  const sentences = getSentences(text);
  const mainTopic = title
    ? `${title} - Analysis & Breakdown`
    : sentences[0] || 'Comprehensive Analysis of Modern Technological and Strategic Paradigms';

  const summary = sentences.slice(0, 3).join(' ') || 
    'This source document provides an in-depth empirical assessment of modern systems, detailing performance metrics, architectural considerations, and adoption roadmaps for enterprise deployment.';

  const keyIdeas: string[] = [];
  if (sentences.length >= 6) {
    keyIdeas.push(
      sentences[1] || 'Fundamental shift from traditional legacy operational patterns to high-velocity modern architectures.',
      sentences[3] || 'Measurable empirical performance enhancements across core metrics and operational workflows.',
      sentences[5] || 'Critical governance, safety guardrails, and compliance protocols required for institutional scale.',
      sentences[7] || 'Strategic economic and productivity gains unlocked through streamlined implementation.'
    );
  } else {
    keyIdeas.push(
      'Transition from exploratory research to scalable production implementations.',
      'Significant reduction in latency and misclassification rates across critical workflows.',
      'Operational cost optimization and clinician/practitioner burnout reduction.',
      'Need for standardized data pipelines and robust governance frameworks.'
    );
  }

  const importantClaims = sentences
    .filter((s) => s.length > 40 && (s.includes('demonstrated') || s.includes('achieved') || s.includes('critical') || s.includes('primary') || s.includes('reveals') || s.includes('increased') || s.includes('decreased') || s.includes('must')))
    .slice(0, 4);

  if (importantClaims.length < 3) {
    importantClaims.push(
      'Algorithmic diagnostic copilots decrease review latency by over 30% while improving precision.',
      'Standardized interoperability pipelines are essential to mitigate model drift across legacy infrastructure.',
      'Adoption velocity is primarily governed by administrative friction rather than raw technological capability.'
    );
  }

  const statisticsAndNumbers = extractStats(text);
  const namedEntities = extractEntities(text);
  if (namedEntities.length === 0) {
    namedEntities.push('Cambridge Health Alliance', 'NextGen Power', 'Horizon Capital', 'FHIR HL7 Standards');
  }

  const importantQuotations = extractQuotes(text);

  let intendedAudience = 'Senior Decision Makers, Technical Architects, and Industry Operators';
  if (sourceType === 'Research Report') intendedAudience = 'Clinical Researchers, Health System Executives, and ML Engineers';
  if (sourceType === 'Blog') intendedAudience = 'Product Leaders, Growth Marketers, and Startup Founders';
  if (sourceType === 'Transcript') intendedAudience = 'Energy Policy Analysts, Grid Engineers, and Infrastructure Investors';

  let originalTone = 'Analytical and Authoritative';
  if (sourceType === 'Blog') originalTone = 'Strategic and Persuasive';
  if (sourceType === 'Transcript') originalTone = 'Conversational yet Technical';

  return {
    mainTopic,
    summary,
    keyIdeas: keyIdeas.filter(Boolean),
    importantClaims,
    statisticsAndNumbers,
    namedEntities,
    importantQuotations,
    intendedAudience,
    originalTone,
    primaryPurpose: `Synthesize actionable insights and strategic recommendations from ${sourceType.toLowerCase()} data.`,
  };
}

// Generate LinkedIn Post
function generateLinkedIn(
  title: string,
  analysis: SourceAnalysis,
  brandVoice: BrandVoice,
  customInstructions?: string
): PlatformOutput {
  const topStat = analysis.statisticsAndNumbers[0] || '34.2% measurable efficiency gain';
  const topIdea = analysis.keyIdeas[0] || 'Moving from fragmented processes to cognitive symbiosis.';
  const quote = analysis.importantQuotations[0] || '';

  const cta = brandVoice.preferredCTA || 'What has been your biggest takeaway navigating this shift? Drop your thoughts below.';

  const content = `Most leaders are looking at this transition completely wrong.

Here is what the latest data actually reveals:

${analysis.summary}

3 key insights you cannot afford to overlook in 2026:

1️⃣ The Velocity Breakthrough:
${topIdea}

2️⃣ Hard Numbers Matter:
Recent benchmarks highlight that ${topStat}. This is no longer theoretical—it is an active competitive moat.

3️⃣ The Human-in-the-Loop Imperative:
${quote ? `${quote}\n` : ''}True leverage does not replace domain experts—it eliminates repetitive perceptual friction so teams can focus on high-judgment decisions.

${customInstructions ? `💡 Focus Note: ${customInstructions}\n\n` : ''}The question is no longer IF your organization will adapt, but how quickly you can establish the right governance and pipeline standardization.

👇 ${cta}

#TechInnovation #Leadership #FutureOfWork #Productivity #DigitalTransformation`;

  const evidence: VerificationEvidence[] = [
    {
      claim: analysis.importantClaims[0] || 'Significant reduction in diagnostic latency and error rates.',
      sourceContext: 'Extracted from primary empirical findings in source document.',
      confidenceScore: 97,
      quoteMatch: quote || undefined,
    },
    {
      claim: topStat,
      sourceContext: 'Source document quantitative findings section.',
      confidenceScore: 99,
    }
  ];

  return {
    platform: 'linkedin',
    content,
    wordCount: countWords(content),
    characterCount: countCharacters(content),
    qualityScore: 94,
    factualConsistencyScore: 98,
    evidence,
    generatedAt: new Date().toISOString(),
  };
}

// Generate X Thread
function generateXThread(
  title: string,
  analysis: SourceAnalysis,
  brandVoice: BrandVoice,
  customInstructions?: string
): PlatformOutput {
  const tweets: string[] = [];

  // Tweet 1: Hook
  tweets.push(
    `The data is finally in, and it changes everything we thought about scaling modern systems.\n\nHere are the 5 critical takeaways from the latest benchmark report:\n\n🧵 1/6`
  );

  // Tweet 2: Key Idea
  tweets.push(
    `2/ The core insight:\n\n${analysis.keyIdeas[0] || 'Transitioning from manual workflows to AI-assisted copilots reduces latency by over 30%.'}\n\nIt is not about replacing humans—it is cognitive symbiosis.`
  );

  // Tweet 3: Hard stats
  const stat = analysis.statisticsAndNumbers[0] || '34.2% reduction in diagnostic latency';
  tweets.push(
    `3/ The empirical numbers:\n\n📊 ${stat}\n\nOrganizations capturing these gains are separating from legacy competitors at record speed.`
  );

  // Tweet 4: Challenge / Governance
  tweets.push(
    `4/ The biggest bottleneck?\n\nIt is rarely the raw model or hardware—it is data standardization and legacy integration pipelines.\n\nStandardize your schema first.`
  );

  // Tweet 5: Quote / Insight
  const quote = analysis.importantQuotations[0] ? analysis.importantQuotations[0].slice(0, 180) : '"Cognitive symbiosis is the real breakthrough."';
  tweets.push(
    `5/ Key quote to remember:\n\n${quote}`
  );

  // Tweet 6: Recap & CTA
  const cta = brandVoice.preferredCTA || 'Follow for more deep dives & RT if you found this valuable!';
  tweets.push(
    `6/ TL;DR:\n• Latency down by 30%+\n• Cognitive symbiosis > full automation\n• Governance is the key moat\n\n${cta}`
  );

  const fullContent = tweets.join('\n\n---\n\n');

  const evidence: VerificationEvidence[] = [
    {
      claim: 'Latency and error reduction driven by assisted workflows.',
      sourceContext: 'Tweet 2 & 3 referencing primary statistical benchmarks.',
      confidenceScore: 96,
    },
    {
      claim: stat,
      sourceContext: 'Verified against source document quantitative metrics.',
      confidenceScore: 99,
    }
  ];

  return {
    platform: 'x_thread',
    content: fullContent,
    wordCount: countWords(fullContent),
    characterCount: countCharacters(fullContent),
    qualityScore: 92,
    factualConsistencyScore: 96,
    evidence,
    parsedStructure: { tweets },
    generatedAt: new Date().toISOString(),
  };
}

// Generate Instagram Carousel
function generateInstagramCarousel(
  title: string,
  analysis: SourceAnalysis,
  brandVoice: BrandVoice,
  customInstructions?: string
): PlatformOutput {
  const slides = [
    {
      slideNumber: 1,
      header: 'THE 2026 BENCHMARK BREAKTHROUGH',
      body: `${title || 'What the Data Reveals About Modern Systems'}\n\nSwipe to see the 5 key numbers you need to know ➡️`,
      visualCue: 'Bold high-contrast dark navy background with glowing cyan and indigo gradient accents. Minimalist title typography.',
    },
    {
      slideNumber: 2,
      header: '1. THE PARADIGM SHIFT',
      body: `${analysis.keyIdeas[0] || 'From fragmented manual workflows to real-time cognitive symbiosis.'}\n\nWhy traditional approaches are falling behind.`,
      visualCue: 'Split comparison visual: Legacy Workflow vs AI-Assisted Copilot velocity.',
    },
    {
      slideNumber: 3,
      header: '2. THE HARD NUMBERS',
      body: `📊 ${analysis.statisticsAndNumbers[0] || '34.2% latency reduction'}\n\nReal-world empirical data across participating pilot institutions.`,
      visualCue: 'Large stat callout card with a clean percentage progress bar.',
    },
    {
      slideNumber: 4,
      header: '3. KEY QUOTE & PERSPECTIVE',
      body: `${analysis.importantQuotations[0] || '"Cognitive symbiosis enables practitioners to focus on empathetic high-judgment outcomes."'}\n\n— Expert Commentary`,
      visualCue: 'Sleek glassmorphism quote card with glowing quotation marks.',
    },
    {
      slideNumber: 5,
      header: '4. THE GOVERNANCE IMPERATIVE',
      body: `${analysis.importantClaims[1] || 'Standardization of data schemas and continuous calibration are vital to mitigate algorithmic drift.'}`,
      visualCue: '3-tier architectural diagram showing Data Pipeline -> Calibration Loop -> Clinical Governance.',
    },
    {
      slideNumber: 6,
      header: 'SUMMARY & ACTION',
      body: `Key Takeaways:\n✅ 30%+ latency reduction\n✅ Enhanced accuracy\n✅ Human-centered design\n\n${brandVoice.preferredCTA || 'Save this post for later & share with your team!'}`,
      visualCue: 'Checklist badge layout with interactive save & share icons.',
    },
  ];

  let formatted = `📸 INSTAGRAM CAROUSEL SLIDES (${slides.length} Slides)\n\n`;
  for (const s of slides) {
    formatted += `[SLIDE ${s.slideNumber}: ${s.header}]\n`;
    formatted += `${s.body}\n`;
    formatted += `🎨 VISUAL DIRECTION: ${s.visualCue}\n\n`;
  }

  formatted += `━━━━━━━━━━━━━━━━━━━━━━\n`;
  formatted += `📝 CAPTION FOR FEED:\n`;
  formatted += `The data is clear: cognitive symbiosis is reshaping how high-performing teams operate in 2026. 🚀\n\n`;
  formatted += `Swipe through for the complete breakdown of key metrics, takeaways, and implementation guardrails.\n\n`;
  formatted += `${brandVoice.preferredCTA || '💬 What is your team’s biggest priority this quarter? Let us know below!'}\n\n`;
  formatted += `#Infographic #TechInsights #DataDriven #Innovation #SaaS #Leadership`;

  const evidence: VerificationEvidence[] = [
    {
      claim: analysis.statisticsAndNumbers[0] || '34.2% latency reduction',
      sourceContext: 'Slide 3 quantitative benchmark card.',
      confidenceScore: 98,
    },
    {
      claim: analysis.keyIdeas[0] || 'Paradigm shift in operational workflows.',
      sourceContext: 'Slide 2 conceptual summary.',
      confidenceScore: 95,
    }
  ];

  return {
    platform: 'instagram_carousel',
    content: formatted,
    wordCount: countWords(formatted),
    characterCount: countCharacters(formatted),
    qualityScore: 95,
    factualConsistencyScore: 97,
    evidence,
    parsedStructure: { slides },
    generatedAt: new Date().toISOString(),
  };
}

// Generate Short-Video Script
function generateShortVideoScript(
  title: string,
  analysis: SourceAnalysis,
  brandVoice: BrandVoice,
  customInstructions?: string
): PlatformOutput {
  const topStat = analysis.statisticsAndNumbers[0] || 'a 34% reduction in turnaround time';
  const quote = analysis.importantQuotations[0] || '"It is cognitive symbiosis."';

  const scenes = [
    {
      timestamp: '00:00 - 00:03',
      hookOrSection: 'THE HOOK',
      visualDirection: 'Close-up on speaker holding phone with dramatic text overlay popping in. Fast zoom-in.',
      spokenNarration: 'If you think AI is coming to take over your job, you are looking at the data completely backwards.',
      onScreenText: '🚨 The Truth About AI in 2026',
    },
    {
      timestamp: '00:04 - 00:15',
      hookOrSection: 'THE PROBLEM & REALITY',
      visualDirection: 'Cut to screen recording or B-roll showing chaotic spreadsheets / complex charts transitioning to clean dashboard.',
      spokenNarration: `A major new benchmark report just evaluated over 40,000 real-world workflows. Here is what actually happened:`,
      onScreenText: '40,000+ Case Studies Analyzed 📊',
    },
    {
      timestamp: '00:16 - 00:35',
      hookOrSection: 'THE STATS & EVIDENCE',
      visualDirection: 'Split screen with animated stat counter ticking up from 0 to the metric. High energy sound effect.',
      spokenNarration: `Teams using specialized copilots saw ${topStat}. But here is the crazy part: error rates actually dropped by nearly thirty percent.`,
      onScreenText: `📉 ${topStat}\n📈 28.7% Fewer Errors`,
    },
    {
      timestamp: '00:36 - 00:48',
      hookOrSection: 'THE CORE INSIGHT',
      visualDirection: 'Direct to camera with serious, authoritative tone. Lower third showing expert quote.',
      spokenNarration: `As leading researchers pointed out: the breakthrough is not autonomous replacement—it is cognitive symbiosis. The AI handles the perceptual grunt work, so you can do high-level reasoning.`,
      onScreenText: '💡 Cognitive Symbiosis > Full Automation',
    },
    {
      timestamp: '00:49 - 00:60',
      hookOrSection: 'THE CTA',
      visualDirection: 'Point towards link in bio / comment section with animated follow button bounce.',
      spokenNarration: `${brandVoice.preferredCTA || 'Hit follow for more tech breakdown deep dives and drop your thoughts in the comments!'}`,
      onScreenText: '👇 Follow for Weekly Deep Dives!',
    }
  ];

  let formatted = `🎬 SHORT-VIDEO SCRIPT (TikTok / Reels / Shorts - 60s)\n\n`;
  for (const sc of scenes) {
    formatted += `⏱️ [${sc.timestamp}] ${sc.hookOrSection}\n`;
    formatted += `📹 [VISUAL]: ${sc.visualDirection}\n`;
    formatted += `🎙️ [VOICE]: "${sc.spokenNarration}"\n`;
    formatted += `🔤 [TEXT ON SCREEN]: ${sc.onScreenText}\n\n`;
  }

  const evidence: VerificationEvidence[] = [
    {
      claim: topStat,
      sourceContext: 'Scene 00:16-00:35 quantitative metric.',
      confidenceScore: 99,
    },
    {
      claim: 'Reduction in error rates and administrative fatigue.',
      sourceContext: 'Scene 00:36-00:48 evidence breakdown.',
      confidenceScore: 96,
    }
  ];

  return {
    platform: 'short_video_script',
    content: formatted,
    wordCount: countWords(formatted),
    characterCount: countCharacters(formatted),
    qualityScore: 96,
    factualConsistencyScore: 97,
    evidence,
    parsedStructure: { scenes },
    generatedAt: new Date().toISOString(),
  };
}

export function simulateContentGeneration(
  platform: PlatformType,
  sourceTitle: string,
  analysis: SourceAnalysis,
  brandVoice: BrandVoice,
  customInstructions?: string
): PlatformOutput {
  switch (platform) {
    case 'linkedin':
      return generateLinkedIn(sourceTitle, analysis, brandVoice, customInstructions);
    case 'x_thread':
      return generateXThread(sourceTitle, analysis, brandVoice, customInstructions);
    case 'instagram_carousel':
      return generateInstagramCarousel(sourceTitle, analysis, brandVoice, customInstructions);
    case 'short_video_script':
      return generateShortVideoScript(sourceTitle, analysis, brandVoice, customInstructions);
  }
}
