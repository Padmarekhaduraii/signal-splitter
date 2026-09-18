import { SourceType } from './types';

export interface SampleDocument {
  id: string;
  title: string;
  sourceType: SourceType;
  description: string;
  badge: string;
  text: string;
}

export const SAMPLE_DOCUMENTS: SampleDocument[] = [
  {
    id: 'ai-healthcare-2026',
    title: 'The AI Diagnostic Revolution in Clinical Healthcare (2026 Report)',
    sourceType: 'Research Report',
    badge: 'Medical AI & Data',
    description: 'A comprehensive clinical report examining algorithmic diagnosis accuracy, hospital cost reductions, and physician adoption.',
    text: `THE 2026 CLINICAL AI BENCHMARK REPORT: TRANSFORMING DIAGNOSTIC ACCURACY AND HOSPITAL OUTCOMES

Executive Summary:
Over the past 24 months, generative multimodal diagnostic systems have transitioned from exploratory research into mainstream clinical practice across 140 premier medical centers in North America and Europe. The implementation of specialized foundation models in radiology, pathology, and emergency triage has demonstrated a 34.2% reduction in diagnostic latency and a 28.7% decrease in clinical misclassification rates.

Key Empirical Findings:
1. Diagnostic Precision: In a multi-center randomized cohort of 42,000 patient encounters, AI-assisted radiological screening achieved an Area Under the Curve (AUC) of 0.964 for early-stage pulmonary nodule detection, compared to 0.891 for unassisted radiologist panels.
2. Workflow Velocity: Radiologists leveraging context-aware diagnostic copilots reviewed complex oncology MRI sequences in an average of 4.2 minutes per patient scan, compared to 8.6 minutes using traditional manual reporting workstations.
3. Economic Impact: Health systems reported an average annual operational savings of $3.4 million per 500-bed facility, primarily driven by reduced exploratory imaging redundancy and earlier ambulatory interventions.
4. Clinician Burnout Alleviation: 78% of participating clinicians reported a marked decrease in administrative documentation fatigue, noting that automated clinical transcript synthesis saved an estimated 1.8 hours per clinical shift.

Expert Commentary:
Dr. Elena Rostova, Chief of Medical Informatics at Cambridge Health Alliance, emphasized: "The pivotal breakthrough in 2026 is not autonomous diagnosis; it is cognitive symbiosis. When AI handles perceptual triage and cross-references 12 million comparative case studies in seconds, our physicians can redirect their focus to empathetic patient communication and complex differential reasoning."

Implementation Hurdles & Safety Guardrails:
Despite exponential clinical adoption, the report identifies significant challenges. Model drift caused by disparate electronic health record (EHR) schemas remains an operational bottleneck. Approximately 16% of legacy hospital integrations required secondary calibration protocols. Moreover, ethical oversight boards mandate that every automated recommendation retain an unbroken cryptographic chain of custody linking algorithmic inferences back to peer-reviewed source literature and raw sensor telemetry.

Strategic Roadmap for Health Systems:
To successfully operationalize clinical AI, institutional leadership must prioritize three pillars:
First, establish centralized data standardization pipelines adhering to FHIR HL7 standards.
Second, implement real-time continuous calibration loops to detect demographic algorithmic drift.
Third, foster interdisciplinary clinical governance teams comprising clinicians, bioethicists, and machine learning infrastructure engineers.`
  },
  {
    id: 'plg-growth-playbook',
    title: 'The Modern Product-Led Growth & B2B SaaS Playbook',
    sourceType: 'Blog',
    badge: 'SaaS Growth & GTM',
    description: 'Actionable playbook detailing self-serve conversion funnels, net revenue retention (NRR), and viral product loops.',
    text: `THE 2026 PRODUCT-LED GROWTH PLAYBOOK: HOW MODERN B2B ENTERPRISES SCALE EFFORTLESSLY

The traditional top-down enterprise software sales motion is undergoing its greatest structural transformation in two decades. In 2026, the world's fastest-growing B2B software companies are not winning through 50-slide SDR pitch decks and cold outbound calling. They are winning by placing frictionless product experiences directly in the hands of end users on day one.

Core Metrics Defining PLG Excellence:
- Time-to-Value (TTV): High-velocity SaaS products achieve median TTV under 4.5 minutes. If a user cannot experience the "aha moment" within their first session, churn probability spikes by 62%.
- Net Revenue Retention (NRR): Top-quartile PLG companies maintain an average NRR of 138%, driven primarily by organic seat expansion and automated tiered feature upgrades.
- CAC Payback Period: Self-serve inbound funnels combined with product-qualified leads (PQLs) achieve a CAC payback period of 7.2 months, compared to 18.4 months for legacy enterprise outbound motions.

The Three Laws of Modern Viral Loops:
1. Radical Friction Elimination: Remove mandatory credit card gates, phone number verifications, and cumbersome multi-step corporate onboarding flows. Offer instant browser-based value.
2. Built-in Collaborative Utility: A standalone utility provides single-player value, but collaborative features (such as real-time canvas sharing, automated teammate invites, and multi-tenant workspaces) generate organic viral expansion with a viral coefficient (K-factor) greater than 1.25.
3. Transparent Value-Based Pricing: Monetize along the exact metric that correlates with customer success—whether that is compute hours, monthly active tracked contacts, or generated pipeline revenue.

Quote from Industry Leadership:
"Sales reps should not be gatekeepers of product value; they should be navigators who guide power users into enterprise-wide governance and security contracts once organic adoption has already taken root." — Marcus Vance, Venture Partner at Horizon Capital.

Conclusion:
In an era where software buyers conduct 80% of their evaluation before ever talking to a human vendor, your product is your best marketing channel, your primary sales engineer, and your strongest retention moat.`
  },
  {
    id: 'clean-energy-grid',
    title: 'Grid 2.0: Clean Energy Transition & Battery Storage Infrastructure',
    sourceType: 'Transcript',
    badge: 'CleanTech & Energy',
    description: 'Executive panel transcript discussing utility-scale battery storage, smart grids, and renewable grid integration.',
    text: `EXECUTIVE SUMMIT TRANSCRIPT: THE FUTURE OF GRID-SCALE RENEWABLES & STORAGE

Date: October 14, 2025
Panel: Clean Energy Infrastructure & Grid Resilience
Speakers:
- Sarah Jenkins (VP of Grid Modernization, NextGen Power)
- David Chen (Director of Energy Storage Systems, Apex Renewables)
- Dr. Aris Thorne (Senior Fellow, Global Energy Institute)

[00:02:15] Sarah Jenkins:
"Welcome everyone. Today we are addressing the single biggest misconception in modern power infrastructure: that renewable intermittency is an insurmountable barrier to 100% clean baseload power. Between 2022 and 2025, global utility-scale lithium iron phosphate (LFP) and sodium-ion battery deployment expanded by 310%, reaching over 240 gigawatt-hours of installed buffer capacity."

[00:07:42] David Chen:
"To build on Sarah's point, the cost curve has collapsed faster than solar did a decade ago. We have witnessed pack-level energy storage prices decline by 41% over the past 18 months, dipping below $78 per kilowatt-hour for standardized modular containerized units. This fundamentally transforms grid economics. Peaker gas plants running at 12% capacity factors are no longer economically viable when 4-hour battery systems can discharge during peak evening surges with zero ramp-up delay."

[00:15:30] Dr. Aris Thorne:
"Let's ground this with empirical grid reliability numbers. In regions with over 45% solar and wind penetration—such as South Australia, California, and parts of Spain—advanced grid-forming inverters and sub-second frequency response systems have reduced blackout risk by 54% compared to legacy synchronous fossil generator fleets."

[00:22:10] Sarah Jenkins:
"The next frontier is AI-orchestrated virtual power plants (VPPs). By dynamically aggregating 50,000 residential solar-plus-battery systems and commercial EV fleets, utilities can dispatch 500 megawatts of decentralized capacity within 200 milliseconds during extreme heatwave events."

[00:31:05] David Chen:
"Our key takeaway for institutional investors and policymakers is simple: The hardware and economics are solved. The primary bottleneck today is permitting timelines and transmission interconnection queues, which still average 4.8 years across major grid operators."`
  }
];
