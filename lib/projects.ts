export type ProjectLink = {
  label: string;
  href: string;
};

export type Project = {
  slug: string;
  name: string;
  period: string;
  affiliation: string;
  oneLiner: string;
  tags: string[];
  summary: string[];
  contributions: string[];
  outcomes?: string[];
  externalLinks?: ProjectLink[];
};

export const projects: Project[] = [
  {
    slug: "flipkart-homepage-analytics",
    name: "Homepage Personalization & Analytics",
    period: "Jul 2024 – Present",
    affiliation: "Flipkart, Bengaluru",
    oneLiner:
      "End-to-end analytics driving homepage personalization through causal inference, ML modeling, and real-time monitoring.",
    tags: ["Python", "DML", "XGBoost", "Kafka", "A/B testing"],
    summary: [
      "Lead analytics and data science work for Flipkart's homepage personalization, spanning A/B experimentation, causal inference, real-time ML models, and production monitoring infrastructure.",
      "Built frameworks that survived Big Billion Days traffic and delivered measurable business impact through rigorous statistical methods and scalable ML systems.",
    ],
    contributions: [
      "Engineered a custom ReAct (Reasoning + Acting) agentic application powered by Gemini 2.5 Pro, enabling the LLM to autonomously sequence Python-based analytical tools, evaluate intermediate KPI fluctuations, and iteratively deduce root causes analysis without human intervention.",
      "Developing controlled A/B experimentation frameworks for homepage personalization using uplift modeling, identified domains where randomized trials fail and engineered Causal Inference pipelines using Double Machine Learning (DML) to ensure unbiased treatment-effect estimation",
      "Led the launch of the new homepage experience for low-propensity users, driving a 3% increase in Page Views, and optimized journey-continuation widgets, resulting in a 5% uplift in homepage revenue",
      "Developed robust time-series forecasting pipelines using Facebook Prophet, ARIMA, and STL decomposition with automated hyperparameter tuning and cross-validation to reliably predict traffic and engagement trends",
      "Prototyped a real-time feed refresh model using XGBoost with feature engineering on recency, affinity, and scroll-depth signals; optimized latency for high-throughput production environments",
      "Designed and introduced novel engagement and ranking metrics (Homepage Redundancy, NDCG-based scoring) enabling richer diagnostic capabilities and improved evaluation of ranking performance beyond traditional CTR-based metrics",
      "Automated real-time monitoring dashboards using Python (Pandas, Plotly) and BI tools; integrated Kafka-based streaming data pipelines for hourly tracking of traffic, experimentation, and sales metrics during Big Billion Days",
    ],
  },
  {
    slug: "crude-oil-trading-strategy",
    name: "Crude Oil Multi-Factor Trading Strategy",
    period: "Aug 2023 – Nov 2023",
    affiliation: "IIT Kanpur",
    oneLiner:
      "Systematic walkforward strategy combining momentum, MA crossover, and dollar index signals with volatility targeting.",
    tags: ["Python", "Quant Finance", "Backtesting"],
    summary: [
      "A systematic trading strategy for Brent Crude Oil that dynamically selects the best-performing signal each quarter using a walkforward backtesting framework.",
      "Combines momentum, moving-average crossover, and U.S. Dollar Index signals with volatility-scaled position sizing and risk management overlays.",
    ],
    contributions: [
      "Designed and backtested a multi-factor trading strategy achieving 242% total return with 1.11 Sharpe ratio over the test period.",
      "Implemented walkforward optimization framework that rebalances quarterly based on 12-month lookback performance.",
      "Engineered volatility-targeted position sizing (15% annualized) with -3% stop-loss overlay and 10-day minimum holding period.",
      "Built comprehensive analytics pipeline covering signal generation, transaction cost modeling, drawdown analysis, and seasonality patterns.",
    ],
    externalLinks: [
      {
        label: "GitHub Repository",
        href: "https://github.com/sakshamar20/Crude-Multi-Factor-Walkforward",
      },
    ],
  },
  {
    slug: "gen4edu-knowledge-graphs",
    name: "Gen4Edu — Knowledge Graphs for NCERT Learning",
    period: "Jan 2024 – Apr 2024",
    affiliation: "IIT Kanpur",
    oneLiner:
      "Curriculum-aware study aid built on Mistral-7B and ontology triplets, evaluated semantically.",
    tags: ["Mistral-7B", "NetworkX", "LLMs", "Python"],
    summary: [
      "An AI study aid that produces ChatGPT-style outcomes, but constrained to a knowledge base built directly from NCERT curriculum books — so answers stay grounded in the syllabus students are actually being tested on.",
      "Designed end-to-end: PDF ingestion, entity extraction, graph construction, and a semantic evaluation harness for response relevance.",
    ],
    contributions: [
      "Engineered an automated pipeline to extract entities from NCERT texts using PyPDF and a 4-bit quantized Mistral-7B.",
      "Designed zero-shot prompts to extract ontology triplets, used NetworkX for graph structuring and community detection.",
      "Implemented a semantic evaluation framework using all-MiniLM-L6-v2 embeddings and cosine similarity to benchmark response relevance.",
    ],
  },
  {
    slug: "ubc-debris-flow",
    name: "Debris-Flow ML Pipeline",
    period: "May 2023 – Jul 2023",
    affiliation: "University of British Columbia · Mitacs Globalink",
    oneLiner:
      "Predicting post-wildfire debris-flow volumes to site protective barriers, deployed for public use.",
    tags: ["Python", "SVM", "Flask", "React"],
    summary: [
      "Mitacs Globalink research project at the University of British Columbia. After wildfires, slopes lose vegetation and become prone to catastrophic debris flows when rain hits them — predicting the volume of those flows is a hard, data-sparse regression problem.",
      "Built and deployed an ML pipeline that turns hydrograph and rainfall data into volume predictions usable for siting life-saving barriers.",
    ],
    contributions: [
      "Developed a machine-learning pipeline that predicts the volume of debris flow triggered by rains following wildfires.",
      "Built and optimized Support Vector Machine models, improving reliability over baseline statistical methods.",
      "Automated hydrograph and rainfall plot generation via web scraping with Flask for efficient data-driven visualizations.",
      "Deployed the model with Flask and React, making it publicly accessible to teams designing protective barriers.",
    ],
  },
  {
    slug: "cuda-particle-simulator",
    name: "CUDA Particle Simulator",
    period: "Jan 2023 – Apr 2023",
    affiliation: "IIT Kanpur",
    oneLiner:
      "1M+ particles in real time. Collision detection reduced from O(N²) to O(N) via spatial hashing.",
    tags: ["CUDA", "C++", "Thrust"],
    summary: [
      "Massively parallel particle simulator built directly in CUDA. The interesting engineering problem is not the physics — it is making collision detection scale from O(N²) (catastrophic at a million particles) down to O(N) while keeping memory access patterns coalesced on the GPU.",
    ],
    contributions: [
      "Implemented a massively parallel particle simulator capable of simulating 1M+ particles in real time.",
      "Optimized collision detection from O(N²) to O(N) using a uniform spatial grid (spatial hashing) to localize interactions.",
      "Maximized memory throughput by sorting particles by grid index using the Thrust library, ensuring coalesced memory access on the GPU.",
    ],
  },
  {
    slug: "beyond-borders",
    name: "Beyond Borders — Postgraduate Mobility",
    period: "Aug 2023 – Nov 2023",
    affiliation: "IIT Kanpur",
    oneLiner:
      "Data-driven study of where Indian postgrads actually end up — built end-to-end in R.",
    tags: ["R", "Shiny", "ggplot2", "RSelenium"],
    summary: [
      "An empirical study of postgraduate student mobility from India: which majors map to which universities, what admit probabilities really look like, and how academic trajectories sort across countries.",
      "Built end-to-end in R: scraping, preprocessing, statistical analysis, and an interactive Shiny dashboard for exploration.",
    ],
    contributions: [
      "Analyzed postgraduate applications using RStudio, uncovering trends in foreign university admissions.",
      "Implemented robust data scraping pipelines with rvest and RSelenium for precise application-data collection.",
      "Optimized preprocessing workflows in dplyr with techniques to mitigate sample bias.",
      "Developed interactive visualizations with ggplot2, plotly, and Shiny — surfacing major preferences, admit probabilities, and academic trajectories.",
    ],
  },
];

export function getProjectBySlug(slug: string): Project | undefined {
  return projects.find((p) => p.slug === slug);
}
