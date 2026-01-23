/**
 * Construction AI Agency - MCP Prompt Library
 * 
 * Three-Tier Hierarchical Knowledge Framework Implementation
 * 
 * TIER 1: Strategic (Upper Echelon) - Frameworks, Governance, Strategy
 * TIER 2: Tactical (Middle Management) - Methodologies, Processes, Analysis
 * TIER 3: Operational (Execution) - Tools, Tasks, Calculations
 */

// ============================================================================
// TIER DEFINITIONS
// ============================================================================

export type TierLevel = 1 | 2 | 3;
export type ResourceType = 'resource' | 'tool' | 'prompt';
export type DataCurrency = 'stable' | 'dynamic' | 'regulatory';

export interface MCPMetadata {
  tier: TierLevel;
  type: ResourceType;
  dataCurrency: DataCurrency;
  frameworks?: string[];
  feedsInto?: string[];
}

// ============================================================================
// TIER 1: STRATEGIC KNOWLEDGE
// ============================================================================

export const TIER1_FRAMEWORKS = {
  EARNED_VALUE_MANAGEMENT: {
    name: 'Earned Value Management (EVM)',
    origin: 'US Department of Defense, 1960s; ANSI/EIA-748',
    corePrinciple: 'Integrates scope, schedule, and cost to measure project performance objectively',
    applicationContext: ['Project health assessment', 'Forecasting', 'Variance analysis', 'Performance reporting'],
    limitations: ['Requires accurate baseline', 'Assumes linear work breakdown', 'Does not capture quality or risk'],
    metrics: ['PV', 'EV', 'AC', 'CV', 'SV', 'CPI', 'SPI', 'EAC', 'ETC', 'VAC', 'TCPI'],
  },
  
  CRITICAL_PATH_METHOD: {
    name: 'Critical Path Method (CPM)',
    origin: 'DuPont Corporation/Remington Rand, 1957',
    corePrinciple: 'Identifies longest sequence of dependent activities determining minimum project duration',
    applicationContext: ['Schedule development', 'Resource optimization', 'Delay analysis', 'Acceleration planning'],
    limitations: ['Assumes deterministic durations', 'Resource constraints not inherently modeled'],
    concepts: ['Critical Path', 'Total Float', 'Free Float', 'Near-Critical Path'],
  },
  
  RISK_MANAGEMENT: {
    name: 'Risk Management Framework',
    origin: 'ISO 31000:2018; PMI PMBOK Guide',
    corePrinciple: 'Systematic process to identify, assess, respond to, and monitor risks',
    applicationContext: ['Project planning', 'Contingency allocation', 'Insurance decisions', 'Contract risk allocation'],
    responseStrategies: ['Avoid', 'Transfer', 'Mitigate', 'Accept', 'Exploit', 'Share'],
  },
} as const;

export const TIER1_GOVERNANCE = {
  AIA_CONTRACTS: {
    name: 'AIA Contract Documents',
    issuingBody: 'American Institute of Architects',
    version: '2017 Edition (with 2022 updates)',
    keyDocuments: ['A101/A201', 'A102/A201', 'A133', 'B101'],
    keyProvisions: [
      'Article 3: Contractor responsibilities',
      'Article 4: Architect role and authority',
      'Article 7: Changes in the Work',
      'Article 8: Time',
      'Article 9: Payments and Completion',
      'Article 15: Claims and Disputes',
    ],
  },
  
  OSHA_CONSTRUCTION: {
    name: 'OSHA Construction Standards',
    reference: '29 CFR 1926',
    issuingBody: 'Occupational Safety and Health Administration',
    keySubparts: {
      'C': 'General Safety and Health Provisions',
      'E': 'Personal Protective Equipment',
      'K': 'Electrical',
      'L': 'Scaffolds',
      'M': 'Fall Protection (most cited)',
      'N': 'Cranes and Derricks',
      'P': 'Excavations',
      'Q': 'Concrete and Masonry',
      'X': 'Stairways and Ladders',
    },
  },
  
  LEED: {
    name: 'LEED Certification',
    issuingBody: 'U.S. Green Building Council (USGBC)',
    version: 'LEED v4.1',
    certificationLevels: {
      certified: '40-49 points',
      silver: '50-59 points',
      gold: '60-79 points',
      platinum: '80+ points',
    },
    creditCategories: [
      'Location and Transportation',
      'Sustainable Sites',
      'Water Efficiency',
      'Energy and Atmosphere',
      'Materials and Resources',
      'Indoor Environmental Quality',
      'Innovation',
      'Regional Priority',
    ],
  },
} as const;

// ============================================================================
// TIER 2: TACTICAL METHODOLOGIES
// ============================================================================

export const TIER2_METHODOLOGIES = {
  CHANGE_ORDER_EVALUATION: {
    name: 'Change Order Evaluation',
    strategicAlignment: ['AIA A201 Article 7', 'Risk Management Framework'],
    processSteps: [
      '1. Verify entitlement (contract basis for change)',
      '2. Validate scope (what work is actually changed)',
      '3. Analyze pricing (cost reasonableness)',
      '4. Assess schedule impact (time extension justified?)',
      '5. Negotiate terms',
      '6. Document and execute',
    ],
  },
  
  COST_FORECASTING: {
    name: 'Cost Forecasting (Estimate at Completion)',
    strategicAlignment: ['Earned Value Management'],
    eacMethods: [
      { formula: 'EAC = BAC / CPI', description: 'Performance-based (most common)' },
      { formula: 'EAC = AC + (BAC - EV)', description: 'Original estimate for remaining work' },
      { formula: 'EAC = AC + [(BAC - EV) / (CPI × SPI)]', description: 'Schedule-adjusted' },
      { formula: 'EAC = AC + Bottom-Up ETC', description: 'Re-estimate remaining work' },
    ],
  },
  
  DELAY_ANALYSIS: {
    name: 'Schedule Delay Analysis',
    strategicAlignment: ['Critical Path Method', 'Contract time provisions'],
    techniques: [
      { name: 'As-Planned vs As-Built', description: 'Compare original to actual' },
      { name: 'Impacted As-Planned', description: 'Add delays to baseline' },
      { name: 'Collapsed As-Built (But-For)', description: 'Remove delays from as-built' },
      { name: 'Time Impact Analysis (TIA)', description: 'Contemporaneous window analysis' },
      { name: 'Windows Analysis', description: 'Period-by-period assessment' },
    ],
  },
  
  SUBCONTRACTOR_PREQUALIFICATION: {
    name: 'Subcontractor Prequalification',
    strategicAlignment: ['Risk Management Framework', 'Quality Management'],
    evaluationCategories: [
      'Financial stability (bonding capacity, financial statements)',
      'Technical capability (similar project experience)',
      'Safety record (EMR, OSHA citations)',
      'Quality history (warranty claims, rework)',
      'Management capacity (key personnel, references)',
      'Legal/compliance (licenses, insurance, litigation history)',
    ],
  },
} as const;

// ============================================================================
// TIER 3: OPERATIONAL TOOLS
// ============================================================================

export const TIER3_TOOLS = {
  EARNED_VALUE_CALCULATOR: {
    name: 'Earned Value Calculator',
    tacticalContext: 'Cost Forecasting',
    inputs: ['BAC', 'PV', 'EV', 'AC'],
    outputs: ['CV', 'SV', 'CPI', 'SPI', 'EAC', 'ETC', 'VAC', 'TCPI'],
  },
  
  MARKUP_CALCULATOR: {
    name: 'Markup Calculator',
    tacticalContext: 'Change Order Evaluation',
    inputs: ['Labor', 'Materials', 'Equipment', 'Subcontractor cost', 'Markup rates'],
    outputs: ['Markup by category', 'Total change order amount'],
  },
  
  RETENTION_CALCULATOR: {
    name: 'Retention Calculator',
    tacticalContext: 'Cash Flow Management',
    inputs: ['Contract sum', 'Retention rate', 'Billing to date', 'Completion status'],
    outputs: ['Current retention', 'Release schedule'],
  },
  
  PRODUCTIVITY_CALCULATOR: {
    name: 'Productivity Rate Calculator',
    tacticalContext: 'Cost Forecasting, Labor Planning',
    inputs: ['Quantity installed', 'Labor hours', 'Crew size', 'Days worked'],
    outputs: ['Unit rate', 'Daily production', 'Productivity factor'],
  },
  
  ESCALATION_CALCULATOR: {
    name: 'Escalation Calculator',
    tacticalContext: 'Cost Forecasting, Contract Negotiation',
    inputs: ['Base amount', 'Base date/index', 'Current date/index', 'Escalation method'],
    outputs: ['Escalation percentage', 'Adjusted price'],
  },
} as const;

// ============================================================================
// PROMPT TEMPLATES
// ============================================================================

export const PROMPTS = {
  // TIER 1 - Strategic Prompts
  TIER1: {
    EVM_ANALYSIS: `Analyze project performance using Earned Value Management:

PROJECT DATA:
- Budget at Completion (BAC): {bac}
- Planned Value (PV) to date: {pv}
- Earned Value (EV) to date: {ev}
- Actual Cost (AC) to date: {ac}
- Reporting period: {reportingDate}
- Percent complete (physical): {percentComplete}

ANALYSIS REQUIREMENTS:
- Calculate all EVM metrics (CPI, SPI, CV, SV, EAC, ETC, VAC, TCPI)
- Interpret performance status
- Identify root causes of variances
- Project completion cost and date
- Recommend corrective actions
- Assess recovery feasibility

OUTPUT:
- EVM dashboard with all metrics
- Trend analysis (is performance improving or declining?)
- Risk-adjusted forecast
- Executive summary with recommendations`,

    RISK_ASSESSMENT: `Conduct risk assessment for construction project:

PROJECT CONTEXT:
- Project type: {projectType}
- Location: {location}
- Delivery method: {deliveryMethod}
- Contract type: {contractType}
- Duration: {duration}
- Value: {value}

RISK CATEGORIES TO ASSESS:
- Technical/Design risks
- Construction/Execution risks
- External/Environmental risks
- Organizational/Resource risks
- Financial/Economic risks
- Contractual/Legal risks

FOR EACH RISK:
- Probability (1-5 scale)
- Impact on cost (1-5 scale)
- Impact on schedule (1-5 scale)
- Current controls
- Recommended response
- Risk owner
- Contingency allocation

OUTPUT:
- Risk register with prioritized risks
- Risk matrix visualization
- Contingency recommendation (% of budget)
- Top 10 risks requiring management attention
- Risk response plan`,

    DELIVERY_METHOD_SELECTION: `Recommend project delivery method:

OWNER PROFILE:
- Experience level: {ownerExperience}
- In-house capabilities: {inHouseCapabilities}
- Risk tolerance: {riskTolerance}
- Primary priority: {primaryPriority}

PROJECT CHARACTERISTICS:
- Type: {buildingType}
- Complexity: {complexity}
- Size and budget: {budget}
- Schedule urgency: {scheduleUrgency}
- Design completeness at start: {designCompleteness}
- Innovation/sustainability goals: {sustainabilityGoals}

MARKET CONDITIONS:
- Bidding climate: {biddingClimate}
- Contractor availability: {contractorAvailability}
- Subcontractor market: {subMarket}

ANALYSIS:
- Evaluate each delivery method against criteria
- Identify pros/cons for this specific project
- Assess risk allocation implications
- Consider hybrid approaches

OUTPUT:
- Recommended delivery method with rationale
- Risk comparison matrix
- Contract structure recommendations
- Owner involvement requirements
- Success factors and pitfalls to avoid`,
  },

  // TIER 2 - Tactical Prompts
  TIER2: {
    CHANGE_ORDER_EVALUATION: `Evaluate change order request:

CHANGE ORDER DATA:
- CO Number: {coNumber}
- Submitted by: {submittedBy}
- Date submitted: {dateSubmitted}
- Description of change: {description}
- Claimed cost impact: {claimedCost}
- Claimed schedule impact: {claimedTime}
- Supporting documentation: {documentation}

CONTRACT REFERENCE:
- Original contract sum: {originalContractSum}
- Current contract sum: {currentContractSum}
- Original contract time: {originalTime}
- Current contract time: {currentTime}
- Change order provisions: {coProvisions}

ENTITLEMENT ANALYSIS:
- What caused the change?
- Is there contractual basis for the claim?
- Were notice requirements met?
- Is this truly changed work vs included scope?

COST ANALYSIS:
- Labor: verify hours × rates against schedule of values
- Materials: verify quantities × unit costs with quotes
- Equipment: verify rates and duration
- Subcontractor costs: verify backup
- Markup: verify contractual percentages
- Reasonableness check against comparable work

SCHEDULE ANALYSIS:
- Is this work on critical path?
- What is actual duration impact?
- Was there concurrent delay?
- Float consumption vs time extension

OUTPUT:
- Entitlement determination (approve/deny/partial)
- Recommended cost (with detailed backup)
- Recommended time (if any)
- Negotiation strategy
- Documentation requirements`,

    COST_FORECAST: `Forecast project completion cost:

CURRENT STATUS:
- Budget at Completion (BAC): {bac}
- Actual Cost to date (AC): {ac}
- Earned Value to date (EV): {ev}
- Percent complete: {percentComplete}
- Reporting date: {reportingDate}

PERFORMANCE HISTORY:
- CPI trend (last 3 periods): {cpiTrend}
- SPI trend (last 3 periods): {spiTrend}
- Variance explanations: {varianceExplanations}

KNOWN CHANGES:
- Approved change orders not yet in BAC: {approvedCOs}
- Pending change orders (probable): {pendingCOs}
- Claims (possible): {claims}

REMAINING RISKS:
- Identified risks: {identifiedRisks}
- Contingency remaining: {contingencyRemaining}
- Management reserve status: {managementReserve}

FORECAST REQUIREMENTS:
- Calculate EAC using multiple methods
- Provide range (optimistic, most likely, pessimistic)
- Identify key drivers of forecast
- Recommend management actions

OUTPUT:
- EAC calculation by method
- Recommended EAC with rationale
- Confidence range (P10/P50/P90)
- Variance from budget (VAC)
- Corrective action recommendations`,

    DELAY_ANALYSIS: `Conduct schedule delay analysis:

PROJECT DATA:
- Original contract duration: {originalDuration}
- Current contract duration: {currentDuration}
- As-planned completion: {plannedCompletion}
- Current projected completion: {projectedCompletion}
- Delay claimed: {delayClaimed}

SCHEDULE DATA:
- Baseline schedule: {baselineSchedule}
- Monthly updates: {monthlyUpdates}
- As-built schedule: {asBuiltSchedule}

DELAY EVENTS:
{delayEvents}

ANALYSIS REQUIREMENTS:
- Determine critical path impact of each delay
- Identify concurrent delays
- Apportion responsibility
- Calculate compensable vs excusable delays
- Net out pacing delays (if any)

OUTPUT:
- Delay analysis summary by event
- Critical path impact assessment
- Responsibility matrix
- Net excusable delay: days
- Net compensable delay: days
- Supporting narrative for claim/defense`,

    SUBCONTRACTOR_PREQUALIFICATION: `Evaluate subcontractor prequalification:

SUBCONTRACTOR DATA:
- Company name: {companyName}
- Trade: {trade}
- Years in business: {yearsInBusiness}
- Annual revenue: {annualRevenue}
- Number of employees: {employeeCount}

FINANCIAL ASSESSMENT:
- Bonding capacity: {bondingCapacity}
- Current backlog: {currentBacklog}
- Financial statement review: {financialReview}
- Banking reference: {bankingReference}

SAFETY RECORD:
- EMR (Experience Modification Rate): {emr}
- OSHA recordable rate: {trir}
- OSHA citations: {oshaCitations}
- Fatalities/serious incidents: {incidents}

EXPERIENCE:
- Similar projects (last 5 years): {similarProjects}
- References: {references}
- Key personnel proposed: {keyPersonnel}

CAPACITY:
- Current workload: {currentWorkload}
- Ability to staff this project: {staffingAbility}
- Equipment/resources: {equipmentResources}

OUTPUT:
- Prequalification score (1-100)
- Category ratings
- Risk factors identified
- Recommendation: Approve/Conditional/Reject
- Conditions if conditional approval`,
  },

  // TIER 3 - Operational Prompts
  TIER3: {
    EVM_CALCULATE: `Calculate Earned Value metrics:

INPUTS:
- Budget at Completion (BAC): {bac}
- Planned Value (PV): {pv}
- Earned Value (EV): {ev}
- Actual Cost (AC): {ac}

CALCULATE:
- Cost Variance (CV) = EV - AC
- Schedule Variance (SV) = EV - PV
- Cost Performance Index (CPI) = EV / AC
- Schedule Performance Index (SPI) = EV / PV
- Estimate at Completion (EAC) = BAC / CPI
- Estimate to Complete (ETC) = EAC - AC
- Variance at Completion (VAC) = BAC - EAC
- To Complete Performance Index (TCPI) = (BAC - EV) / (BAC - AC)
- Percent Complete = EV / BAC
- Percent Spent = AC / BAC

REQUIREMENTS:
- Show formulas used
- Interpret each metric
- Flag any concerning indicators
- Provide benchmark comparisons`,

    MARKUP_CALCULATE: `Calculate change order markup:

DIRECT COSTS:
- Labor (own forces): {labor}
- Materials: {materials}
- Equipment: {equipment}
- Subcontractor cost: {subcontractorCost}

CONTRACT MARKUP RATES:
- Overhead on own work: {overheadRate}%
- Profit on own work: {profitRate}%
- Markup on subcontractor work: {subMarkupRate}%
- Bond premium: {bondRate}%
- Insurance additional: {insuranceRate}%

REQUIREMENTS:
- Calculate markup by category
- Show subtotals
- Calculate total change order amount
- Verify against contract limits`,

    RETENTION_CALCULATE: `Calculate retention status:

CONTRACT DATA:
- Original contract sum: {originalSum}
- Approved change orders: {approvedCOs}
- Current contract sum: {currentSum}
- Retention rate: {retentionRate}%
- Retention cap: {retentionCap}

BILLING DATA:
- Total billed to date: {totalBilled}
- Retention withheld to date: {retentionWithheld}
- Work complete: {workComplete}%

RELEASE TRIGGERS:
- Substantial completion: {substantialCompletion}
- Final completion: {finalCompletion}
- Partial release provision: {partialRelease}

CALCULATE:
- Current retention withheld
- Maximum retention (at cap)
- Retention release at substantial completion
- Retention release at final completion`,

    PRODUCTIVITY_CALCULATE: `Calculate labor productivity:

WORK COMPLETED:
- Quantity installed: {quantity}
- Unit of measure: {unit}

LABOR EXPENDED:
- Total labor hours: {laborHours}
- Crew size: {crewSize}
- Days worked: {daysWorked}

COMPARE TO:
- Budgeted unit rate: {budgetedRate}
- Industry benchmark: {industryBenchmark}
- Historical average: {historicalAverage}

OUTPUT:
- Unit rate (hours per unit)
- Daily production (units per day)
- Productivity factor (actual vs budget)
- Trend analysis
- Forecast impact`,
  },

  // Executive Summary Prompts
  EXECUTIVE: {
    MONTHLY_DASHBOARD: `Generate Monthly Executive Dashboard:

REQUIRED SECTIONS:

1. FINANCIAL SUMMARY
- Contract status (original, changes, current)
- Billing and collection status
- Cost performance (CPI, EAC, VAC)
- Cash flow position
- Change order status

2. SCHEDULE SUMMARY
- Overall percent complete
- Schedule performance (SPI, projected completion)
- Key milestone status
- Critical path activities
- Look-ahead (30/60/90 days)

3. SAFETY SUMMARY
- Incidents this period
- Year-to-date recordable rate
- Safety initiatives

4. QUALITY SUMMARY
- Inspections passed/failed
- NCRs open/closed
- Warranty issues

5. RISK SUMMARY
- Top 5 risks
- Risk trend
- Mitigation actions

6. KEY ISSUES & DECISIONS NEEDED
- Items requiring attention
- Decisions needed with deadlines`,

    PROJECT_HEALTH: `Assess overall project health:

EVALUATE ACROSS DIMENSIONS:

1. COST HEALTH (25%)
- CPI and trend
- EAC vs budget
- Contingency status

2. SCHEDULE HEALTH (25%)
- SPI and trend
- Critical path float
- Milestone achievement

3. QUALITY HEALTH (20%)
- Inspection pass rate
- Rework percentage
- Punch list trending

4. SAFETY HEALTH (15%)
- Incident rate vs target
- Leading indicators

5. TEAM/STAKEHOLDER HEALTH (15%)
- Staffing stability
- Owner relationship
- Communication effectiveness

OUTPUT:
- Overall health score (1-100)
- Individual dimension scores
- Trend arrows
- Key issues by dimension
- Recommended actions`,
  },
} as const;

// ============================================================================
// RESPONSE SCHEMAS
// ============================================================================

export interface ResponseMetadata {
  queryType: string;
  tierLevel: TierLevel;
  domain: 'construction';
  timestamp: string;
  confidence: number;
  dataCurrency: DataCurrency;
}

export interface EVMAnalysisResponse {
  metadata: ResponseMetadata;
  inputs: {
    BAC: number;
    PV: number;
    EV: number;
    AC: number;
  };
  metrics: {
    CV: { value: number; interpretation: string };
    SV: { value: number; interpretation: string };
    CPI: { value: number; interpretation: string };
    SPI: { value: number; interpretation: string };
    EAC: { value: number; interpretation: string };
    ETC: { value: number; interpretation: string };
    VAC: { value: number; interpretation: string };
    TCPI: { value: number; interpretation: string };
    percentComplete: number;
    percentSpent: number;
  };
  statusAssessment: {
    costStatus: 'GREEN' | 'YELLOW' | 'RED';
    scheduleStatus: 'GREEN' | 'YELLOW' | 'RED';
    recoveryFeasibility: string;
  };
  recommendations: string[];
}

export interface ChangeOrderResponse {
  metadata: ResponseMetadata;
  changeOrderId: string;
  requestSummary: {
    contractorClaimedCost: number;
    contractorClaimedTime: number;
    description: string;
  };
  entitlementAnalysis: {
    causeCategory: string;
    contractualBasis: string;
    noticeCompliance: boolean;
    entitlementDetermination: 'Valid' | 'Invalid' | 'Partial';
  };
  costAnalysis: {
    labor: { claimed: number; verified: number; varianceReason?: string };
    materials: { claimed: number; verified: number; varianceReason?: string };
    equipment: { claimed: number; verified: number };
    subcontractor: { claimed: number; verified: number };
    markup: { percentage: number; amount: number };
    totalRecommended: number;
    varianceFromClaimed: number;
  };
  scheduleAnalysis: {
    onCriticalPath: boolean;
    actualDurationImpact: number;
    concurrentDelay: boolean;
    recommendedTimeExtension: number;
  };
  recommendation: {
    approveCost: number;
    approveTime: number;
    conditions: string[];
    negotiationNotes: string;
  };
}

export interface RiskAssessmentResponse {
  metadata: ResponseMetadata;
  projectId: string;
  assessmentDate: string;
  riskRegister: Array<{
    riskId: string;
    category: 'cost' | 'schedule' | 'quality' | 'safety' | 'external';
    description: string;
    probability: number;
    impactCost: number;
    impactSchedule: number;
    riskScore: number;
    currentControls: string[];
    recommendedResponse: 'avoid' | 'transfer' | 'mitigate' | 'accept';
    mitigationActions: string[];
    riskOwner: string;
    contingencyAllocated: number;
    status: 'open' | 'mitigating' | 'closed' | 'occurred';
  }>;
  summary: {
    totalRiskCount: number;
    highRisks: number;
    totalExposure: number;
    contingencyRecommended: number;
  };
}

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

/**
 * Format a prompt template with provided values
 */
export function formatPrompt(template: string, values: Record<string, string | number>): string {
  let result = template;
  for (const [key, value] of Object.entries(values)) {
    result = result.replace(new RegExp(`\\{${key}\\}`, 'g'), String(value));
  }
  return result;
}

/**
 * Get the appropriate tier for a query type
 */
export function getTierForQuery(queryType: string): TierLevel {
  const tier1Keywords = ['framework', 'governance', 'standard', 'strategy', 'theory', 'principle'];
  const tier2Keywords = ['analysis', 'methodology', 'evaluation', 'forecast', 'assessment', 'process'];
  const tier3Keywords = ['calculate', 'extract', 'generate', 'execute', 'compute'];
  
  const lowerQuery = queryType.toLowerCase();
  
  if (tier1Keywords.some(k => lowerQuery.includes(k))) return 1;
  if (tier2Keywords.some(k => lowerQuery.includes(k))) return 2;
  if (tier3Keywords.some(k => lowerQuery.includes(k))) return 3;
  
  return 2; // Default to tactical
}

/**
 * Create response metadata
 */
export function createResponseMetadata(
  queryType: string,
  confidence: number = 0.85,
  dataCurrency: DataCurrency = 'stable'
): ResponseMetadata {
  return {
    queryType,
    tierLevel: getTierForQuery(queryType),
    domain: 'construction',
    timestamp: new Date().toISOString(),
    confidence,
    dataCurrency,
  };
}

/**
 * Calculate EVM metrics from inputs
 */
export function calculateEVM(bac: number, pv: number, ev: number, ac: number) {
  const cv = ev - ac;
  const sv = ev - pv;
  const cpi = ac > 0 ? ev / ac : 0;
  const spi = pv > 0 ? ev / pv : 0;
  const eac = cpi > 0 ? bac / cpi : bac;
  const etc = eac - ac;
  const vac = bac - eac;
  const tcpi = (bac - ac) > 0 ? (bac - ev) / (bac - ac) : 0;
  const percentComplete = bac > 0 ? (ev / bac) * 100 : 0;
  const percentSpent = bac > 0 ? (ac / bac) * 100 : 0;

  return {
    cv,
    sv,
    cpi,
    spi,
    eac,
    etc,
    vac,
    tcpi,
    percentComplete,
    percentSpent,
    interpretations: {
      costStatus: cpi >= 0.95 ? 'GREEN' : cpi >= 0.85 ? 'YELLOW' : 'RED',
      scheduleStatus: spi >= 0.95 ? 'GREEN' : spi >= 0.85 ? 'YELLOW' : 'RED',
      cpiInterpretation: cpi >= 1 
        ? `On/under budget - earning $${cpi.toFixed(2)} for every $1 spent`
        : `Over budget - earning only $${cpi.toFixed(2)} for every $1 spent`,
      spiInterpretation: spi >= 1
        ? `On/ahead of schedule - ${(spi * 100).toFixed(1)}% of planned work complete`
        : `Behind schedule - only ${(spi * 100).toFixed(1)}% of planned work complete`,
    },
  };
}

/**
 * Calculate change order markup
 */
export function calculateMarkup(
  labor: number,
  materials: number,
  equipment: number,
  subcontractorCost: number,
  overheadRate: number,
  profitRate: number,
  subMarkupRate: number
) {
  const ownWorkDirect = labor + materials + equipment;
  const ownWorkMarkup = ownWorkDirect * ((overheadRate + profitRate) / 100);
  const subMarkup = subcontractorCost * (subMarkupRate / 100);
  
  return {
    directCosts: {
      labor,
      materials,
      equipment,
      subcontractor: subcontractorCost,
      totalDirect: ownWorkDirect + subcontractorCost,
    },
    markup: {
      ownWorkMarkup,
      subMarkup,
      totalMarkup: ownWorkMarkup + subMarkup,
    },
    totalChangeOrderAmount: ownWorkDirect + ownWorkMarkup + subcontractorCost + subMarkup,
  };
}
