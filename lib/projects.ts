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
    slug: "bilevel-rl-circular-manufacturing",
    name: "Bilevel Reinforcement Learning for Circular Manufacturing",
    period: "May 2026 – Present",
    affiliation: "Purdue University · Edwardson School of Industrial Engineering",
    oneLiner:
      "A bilevel reinforcement-learning framework coordinating waste pricing and recovery across an ammonia-urea production network.",
    tags: ["Bilevel RL", "PPO", "GAE", "Surrogate Modeling"],
    summary: [
      "Research with Prof. Vaneet Aggarwal on circularity in a three-factory ammonia-urea production network, formulated as a bilevel reinforcement-learning problem with a price-setting leader and best-responding follower agents.",
      "The system combines first-principles process models, high-accuracy neural surrogates, and statistically validated multi-agent control experiments.",
    ],
    contributions: [
      "Built a reproducible simulation environment from first-principles models of electrolysis, Haber-Bosch, and urea synthesis with exact mass-balance closure.",
      "Generated 414K samples through orthogonal Latin hypercube sampling and trained neural surrogates achieving R² > 0.998 in- and out-of-distribution.",
      "Adapted a penalty-based bilevel hypergradient algorithm using PPO with GAE for multi-stage, high-dimensional continuous control.",
      "Diagnosed market-calibration and reward-design failure modes that obscured the relationship between optimization objectives and physical waste recovery.",
      "Validated results across 10 random seeds using paired t-tests, Wilcoxon signed-rank tests, Bonferroni correction, and pre-registered hypotheses.",
    ],
    outcomes: [
      "+8.5 percentage points waste recovery",
      "p < 0.01 across 10 seeds",
      "Manuscript in preparation",
    ],
  },
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
    name: "Systematic Crude-Oil Walk-Forward Research",
    period: "Sep 2026",
    affiliation: "Independent Quantitative Research",
    oneLiner:
      "Leakage-resistant research comparing momentum, trend, and macro signals through walk-forward validation and volatility-targeted portfolio construction.",
    tags: [
      "Python",
      "Quantitative Research",
      "Walk-Forward Analysis",
      "Backtesting",
      "Time Series",
      "Portfolio Construction",
    ],
    summary: [
      "A systematic research framework for a Brent-linked commodity index combining price momentum, moving-average trend, and point-in-time U.S. dollar signals.",
      "The study tests whether quarterly selection of the strongest recent signal family outperforms fixed diversification. Results show that the recent-winner approach is unstable, while diversified trend exposure is more robust.",
    ],
    contributions: [
      "Built a causal walk-forward backtesting engine in Python with lagged signals, non-overlapping evaluation windows, realistic warm-up periods, and conservative macroeconomic data-release timing.",
      "Demonstrated that fixed-factor diversification outperformed quarterly recent-winner selection; the equal-weight ensemble achieved a 0.60 development-sample Sharpe, 38.94% cumulative return, and 18.99% maximum drawdown.",
      "Implemented 15% volatility-targeted position sizing with a volatility floor, 2x leverage cap, minimum holding periods, and transaction costs based on actual portfolio turnover.",
      "Evaluated 24 walk-forward configurations across multiple lookback and rebalancing periods using common-window sensitivity analysis, without selecting the best-performing configuration after observing the results.",
      "Quantified statistical uncertainty using a moving-block bootstrap and validated the pipeline with automated tests for timing, leakage, warm-up periods, transaction costs, and portfolio switching.",
    ],
    externalLinks: [
      {
        label: "GitHub Repository",
        href: "https://github.com/sakshamar20/systematic-crude-oil-walkforward",
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
];

export function getProjectBySlug(slug: string): Project | undefined {
  return projects.find((p) => p.slug === slug);
}
