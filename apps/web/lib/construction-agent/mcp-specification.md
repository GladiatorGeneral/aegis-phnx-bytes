# Construction AI Agency MCP Specification
## Three-Tier Hierarchical Knowledge Framework

---

# TABLE OF CONTENTS

1. [Domain Definition](#domain)
2. [TIER 1: Strategic Knowledge](#tier1)
3. [TIER 2: Tactical Operations](#tier2)
4. [TIER 3: Operational Execution](#tier3)
5. [Prompt Library](#prompts)
6. [Response Schemas](#schemas)

---

<a name="domain"></a>
# 1. DOMAIN DEFINITION

## Domain Scope
**Primary Focus**: Construction project management, financial analysis, contract administration, and regulatory compliance
**Adjacent Domains**: Real estate development, civil engineering, architecture, construction law, finance, insurance
**Exclusions**: Licensed engineering calculations (recommend PE), legal advice (recommend attorney), licensed architectural design

## Knowledge Cutoff Considerations

### Stable Knowledge (80%+ Accurate - No Search Needed)
- Earned Value Management (EVM) principles
- Construction contract structures (AIA, ConsensusDocs, FIDIC)
- Project delivery methods (Design-Bid-Build, Design-Build, CM-at-Risk, IPD)
- Construction accounting principles (percentage-of-completion, completed contract)
- Risk management frameworks
- Scheduling methodologies (CPM, PERT)
- Quality management systems (ISO 9001 principles)

### Dynamic Knowledge (Requires Current Data - Search Recommended)
- Material prices (steel, lumber, concrete, copper)
- Labor rates by region
- Current interest rates and financing terms
- Market conditions and bid climate
- Subcontractor availability
- Supply chain status

### Regulatory Knowledge (Verify Currency)
- Building codes (IBC updates every 3 years)
- OSHA regulations
- Environmental regulations (EPA, state DEQ)
- Zoning and land use
- Prevailing wage requirements (Davis-Bacon)
- Licensing requirements by jurisdiction

---

<a name="tier1"></a>
# 2. TIER 1: STRATEGIC KNOWLEDGE (Upper Echelon)

## Purpose
Establish theoretical foundations, governance frameworks, and strategic context for construction decision-making.

---

## 2.1 Theoretical Frameworks

### Framework: Earned Value Management (EVM)
**Origin**: US Department of Defense, 1960s; ANSI/EIA-748 Standard
**Core Principle**: Integrates scope, schedule, and cost to measure project performance objectively using planned value, earned value, and actual cost.
**Application Context**: Project health assessment, forecasting, variance analysis, performance reporting
**Limitations**: Requires accurate baseline; assumes linear work breakdown; does not capture quality or risk

**Key Metrics**:
- **Planned Value (PV)**: Budgeted cost of work scheduled
- **Earned Value (EV)**: Budgeted cost of work performed
- **Actual Cost (AC)**: Actual cost of work performed
- **Cost Performance Index (CPI)**: EV / AC (efficiency of cost)
- **Schedule Performance Index (SPI)**: EV / PV (efficiency of schedule)
- **Estimate at Completion (EAC)**: BAC / CPI (projected total cost)
- **Variance at Completion (VAC)**: BAC - EAC (projected overrun/underrun)

**Prompt Pattern**:
```
Analyze project performance using Earned Value Management:

PROJECT DATA:
- Budget at Completion (BAC): [total budget]
- Planned Value (PV) to date: [amount]
- Earned Value (EV) to date: [amount]
- Actual Cost (AC) to date: [amount]
- Reporting period: [date]
- Percent complete (physical): [percentage]

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
- Executive summary with recommendations
```

---

### Framework: Critical Path Method (CPM)
**Origin**: DuPont Corporation/Remington Rand, 1957
**Core Principle**: Identifies the longest sequence of dependent activities that determines minimum project duration; any delay on critical path delays the project.
**Application Context**: Schedule development, resource optimization, delay analysis, acceleration planning
**Limitations**: Assumes deterministic durations; requires accurate logic; resource constraints not inherently modeled

**Key Concepts**:
- **Critical Path**: Longest path through network; zero total float
- **Total Float**: Time activity can delay without delaying project completion
- **Free Float**: Time activity can delay without delaying successor
- **Near-Critical Path**: Paths with float less than threshold (typically 5-10 days)

**Prompt Pattern**:
```
Analyze schedule using Critical Path Method:

SCHEDULE DATA:
- Activity list with durations: [provide or describe]
- Predecessor/successor relationships: [logic ties]
- Constraints: [milestones, external dates]
- Data date: [current status date]

ANALYSIS REQUIREMENTS:
- Identify critical path and near-critical paths
- Calculate float for all activities
- Assess schedule risk concentration
- Identify logic issues or anomalies
- Evaluate acceleration options
- Determine delay responsibility (if behind schedule)

OUTPUT:
- Critical path narrative
- Float analysis summary
- Schedule risk assessment
- Recovery/acceleration options with cost-time tradeoffs
```

---

### Framework: Risk Management (ISO 31000 / PMI)
**Origin**: ISO 31000:2018; PMI PMBOK Guide
**Core Principle**: Systematic process to identify, assess, respond to, and monitor risks to optimize project outcomes.
**Application Context**: Project planning, contingency allocation, insurance decisions, contract risk allocation
**Limitations**: Subjective probability assessments; unknown unknowns; behavioral biases

**Risk Response Strategies**:
- **Avoid**: Eliminate threat by changing plan
- **Transfer**: Shift risk to third party (insurance, subcontract)
- **Mitigate**: Reduce probability or impact
- **Accept**: Acknowledge and budget contingency
- **Exploit**: Ensure opportunity occurs (for positive risks)
- **Share**: Partner to capture opportunity

**Prompt Pattern**:
```
Conduct risk assessment for construction project:

PROJECT CONTEXT:
- Project type: [building type, size, complexity]
- Location: [geography, jurisdiction]
- Delivery method: [DBB, DB, CMAR, etc.]
- Contract type: [lump sum, GMP, cost-plus]
- Duration: [months]
- Value: [dollar amount]

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
- Risk response plan
```

---

## 2.2 Governance & Standards

### Standard: AIA Contract Documents
**Issuing Body**: American Institute of Architects
**Current Version**: 2017 Edition (with 2022 updates for some documents)
**Scope**: Industry-standard construction contracts for design and construction services
**Key Documents**:
- **A101/A201**: Standard Form of Agreement / General Conditions (Stipulated Sum)
- **A102/A201**: Agreement / General Conditions (Cost Plus with GMP)
- **A133**: Standard Form CM-at-Risk Agreement
- **B101**: Standard Form Owner-Architect Agreement

**Key Provisions to Monitor**:
- Article 3 (A201): Contractor responsibilities
- Article 4 (A201): Architect's role and authority
- Article 7 (A201): Changes in the Work
- Article 8 (A201): Time
- Article 9 (A201): Payments and Completion
- Article 15 (A201): Claims and Disputes

**Prompt Pattern**:
```
Analyze contract provision under AIA framework:

CONTRACT DOCUMENTS:
- Agreement form: [A101, A102, A133, etc.]
- General conditions: [A201 or modified]
- Amendments/modifications: [list any]

ISSUE TO ANALYZE:
- Specific clause or situation: [describe]
- Parties involved: [Owner, Contractor, Architect, Sub]
- Current dispute or question: [state issue]

ANALYSIS REQUIREMENTS:
- Cite applicable contract provisions
- Interpret rights and obligations
- Identify procedural requirements (notice, timing)
- Assess risk allocation
- Compare to standard AIA language (if modified)
- Recommend course of action

OUTPUT:
- Contract interpretation
- Applicable provisions cited
- Procedural compliance checklist
- Risk assessment
- Recommended actions with timeline
```

---

### Standard: ConsensusDocs
**Issuing Body**: ConsensusDocs Coalition (40+ construction associations)
**Current Version**: 2022
**Scope**: Balanced contract documents emphasizing risk sharing
**Distinction from AIA**: More contractor-friendly; joint drafting process; focuses on best practices

**Key Documents**:
- **ConsensusDocs 200**: Standard Agreement and General Conditions
- **ConsensusDocs 300**: Standard Form Tri-Party Agreement for IPD
- **ConsensusDocs 750**: Standard Form Subcontract Agreement

---

### Standard: OSHA Construction Standards (29 CFR 1926)
**Issuing Body**: Occupational Safety and Health Administration
**Scope**: Workplace safety and health requirements for construction
**Key Subparts**:
- Subpart C: General Safety and Health Provisions
- Subpart E: Personal Protective Equipment
- Subpart K: Electrical
- Subpart L: Scaffolds
- Subpart M: Fall Protection (most cited)
- Subpart N: Cranes and Derricks
- Subpart P: Excavations
- Subpart Q: Concrete and Masonry
- Subpart X: Stairways and Ladders

**Prompt Pattern**:
```
Assess OSHA compliance for construction activity:

ACTIVITY DESCRIPTION:
- Work being performed: [describe]
- Location/conditions: [height, excavation depth, environment]
- Equipment used: [list]
- Workers involved: [number, trades]

COMPLIANCE ASSESSMENT:
- Applicable OSHA standards (cite 29 CFR 1926.xxx)
- Current compliance status
- Identified hazards
- Required controls and PPE
- Documentation requirements
- Training requirements

OUTPUT:
- Compliance checklist
- Gap analysis
- Corrective actions required
- Citation risk assessment (serious, willful, repeat)
- Recommended safety improvements
```

---

### Standard: LEED Certification
**Issuing Body**: U.S. Green Building Council (USGBC)
**Current Version**: LEED v4.1
**Scope**: Green building rating system
**Certification Levels**: Certified (40-49), Silver (50-59), Gold (60-79), Platinum (80+)

**Credit Categories**:
- Location and Transportation
- Sustainable Sites
- Water Efficiency
- Energy and Atmosphere
- Materials and Resources
- Indoor Environmental Quality
- Innovation
- Regional Priority

**Prompt Pattern**:
```
Assess LEED certification pathway:

PROJECT DATA:
- Building type: [commercial, residential, etc.]
- Size: [square feet]
- Location: [city, state]
- Target certification level: [Silver, Gold, Platinum]
- Current design stage: [schematic, DD, CD]

CREDIT ANALYSIS:
- Likely achievable credits: [by category]
- Stretch credits: [possible with effort]
- Unlikely credits: [not pursuing]
- Documentation requirements
- Cost implications
- Construction phase requirements

OUTPUT:
- LEED scorecard projection
- Recommended credit strategy
- Cost-benefit analysis
- Implementation checklist by phase
- Risk factors for certification
```

---

### Certification: Project Management Professional (PMP)
**Issuing Body**: Project Management Institute (PMI)
**Relevance**: Industry-recognized project management credential
**Knowledge Areas**: Integration, Scope, Schedule, Cost, Quality, Resource, Communications, Risk, Procurement, Stakeholder

---

### Certification: Certified Construction Manager (CCM)
**Issuing Body**: Construction Management Association of America (CMAA)
**Relevance**: Construction-specific management credential
**Domains**: Project Management, Cost Management, Time Management, Quality Management, Contract Administration, Safety Management, Professional Practice

---

## 2.3 Strategic Models

### Model: Project Delivery Method Selection
**Purpose**: Choose optimal delivery method based on project characteristics and owner priorities
**Options**:
- **Design-Bid-Build (DBB)**: Traditional; sequential; competitive bidding
- **Design-Build (DB)**: Single point of responsibility; faster; less owner control
- **Construction Manager at Risk (CMAR/GMP)**: Early contractor involvement; GMP pricing
- **Integrated Project Delivery (IPD)**: Shared risk/reward; multiparty agreement

**Selection Criteria**:
- Owner experience and capability
- Project complexity and innovation
- Schedule criticality
- Cost certainty requirements
- Risk tolerance
- Market conditions

**Prompt Pattern**:
```
Recommend project delivery method:

OWNER PROFILE:
- Experience level: [sophisticated, moderate, novice]
- In-house capabilities: [PM, legal, technical]
- Risk tolerance: [high, moderate, low]
- Primary priority: [cost, schedule, quality, innovation]

PROJECT CHARACTERISTICS:
- Type: [building type]
- Complexity: [low, moderate, high]
- Size and budget: [amount]
- Schedule urgency: [critical, normal, flexible]
- Design completeness at start: [percentage]
- Innovation/sustainability goals: [describe]

MARKET CONDITIONS:
- Bidding climate: [competitive, balanced, tight]
- Contractor availability: [good, moderate, limited]
- Subcontractor market: [status]

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
- Success factors and pitfalls to avoid
```

---

### Model: Make vs Buy (Self-Perform vs Subcontract)
**Purpose**: Determine whether to self-perform work or subcontract
**Decision Factors**:
- Core competency alignment
- Workforce availability
- Equipment ownership
- Risk management
- Cost comparison
- Quality control
- Schedule control
- Market pricing

**Prompt Pattern**:
```
Analyze self-perform vs subcontract decision:

WORK SCOPE:
- Trade/scope: [describe work]
- Duration: [weeks/months]
- Value: [dollar amount]
- Location: [site specifics]

SELF-PERFORM ASSESSMENT:
- Internal capability: [existing skills, workforce]
- Equipment availability: [owned, rented]
- True cost calculation: [labor + equipment + overhead + risk]
- Quality control: [internal standards]
- Schedule control: [integration with other work]

SUBCONTRACT ASSESSMENT:
- Market pricing: [competitive bids received]
- Subcontractor quality: [prequalification status]
- Risk transfer: [indemnification, insurance]
- Management overhead: [coordination costs]
- Payment terms: [cash flow implications]

OUTPUT:
- Cost comparison analysis
- Risk comparison
- Recommendation with rationale
- Hybrid options if applicable
```

---

<a name="tier2"></a>
# 3. TIER 2: TACTICAL OPERATIONS (Middle Management)

## Purpose
Translate strategic frameworks into actionable methodologies and analytical processes.

---

## 3.1 Analytical Methodologies

### Method: Change Order Evaluation
**Strategic Alignment**: AIA A201 Article 7; Risk management framework
**Process Steps**:
1. Verify entitlement (contract basis for change)
2. Validate scope (what work is actually changed)
3. Analyze pricing (cost reasonableness)
4. Assess schedule impact (time extension justified?)
5. Negotiate terms
6. Document and execute

**Prompt Pattern**:
```
Evaluate change order request:

CHANGE ORDER DATA:
- CO Number: [identifier]
- Submitted by: [Contractor/Owner]
- Date submitted: [date]
- Description of change: [narrative]
- Claimed cost impact: [amount]
- Claimed schedule impact: [days]
- Supporting documentation: [list what's provided]

CONTRACT REFERENCE:
- Original contract sum: [amount]
- Current contract sum: [with approved COs]
- Original contract time: [days]
- Current contract time: [with approved extensions]
- Change order provisions: [cite relevant clauses]

ENTITLEMENT ANALYSIS:
- What caused the change? [owner directive, differing conditions, design error, etc.]
- Is there contractual basis for the claim?
- Were notice requirements met?
- Is this truly changed work vs included scope?

COST ANALYSIS:
- Labor: [hours × rates - verify against schedule of values]
- Materials: [quantities × unit costs - verify quotes]
- Equipment: [verify rates and duration]
- Subcontractor costs: [verify backup]
- Markup: [verify contractual percentages]
- Reasonableness check: [comparable work, historical data]

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
- Documentation requirements
```

**Expected Response Structure**:
```json
{
  "change_order_id": "CO-023",
  "request_summary": {
    "contractor_claimed_cost": 125000,
    "contractor_claimed_time": 14,
    "description": "Additional structural steel due to revised loading requirements"
  },
  "entitlement_analysis": {
    "cause_category": "Design revision",
    "contractual_basis": "AIA A201 Section 7.2 - Changes in the Work",
    "notice_compliance": true,
    "entitlement_determination": "Valid - Owner-directed design change"
  },
  "cost_analysis": {
    "labor": {
      "claimed": 45000,
      "verified": 42000,
      "variance_reason": "Overtime premium not substantiated"
    },
    "materials": {
      "claimed": 55000,
      "verified": 54000,
      "variance_reason": "Minor quantity discrepancy"
    },
    "equipment": {
      "claimed": 8000,
      "verified": 8000
    },
    "subcontractor": {
      "claimed": 0,
      "verified": 0
    },
    "markup": {
      "overhead_profit_percent": 15,
      "applied_to": 104000,
      "markup_amount": 15600
    },
    "total_recommended": 119600,
    "variance_from_claimed": -5400,
    "variance_percent": -4.3
  },
  "schedule_analysis": {
    "on_critical_path": true,
    "actual_duration_impact": 10,
    "concurrent_delay": false,
    "recommended_time_extension": 10,
    "float_consumed": 0
  },
  "recommendation": {
    "approve_cost": 119600,
    "approve_time": 10,
    "conditions": [
      "Contractor to provide certified payroll for labor verification",
      "Material invoices to be submitted within 30 days"
    ],
    "negotiation_notes": "Contractor likely to accept; variance is minor and well-documented"
  },
  "cumulative_impact": {
    "new_contract_sum": 15119600,
    "change_order_percentage": 5.2,
    "new_substantial_completion": "2026-08-15"
  }
}
```

---

### Method: Cost Forecasting (Estimate at Completion)
**Strategic Alignment**: Earned Value Management (Tier 1)
**Process Steps**:
1. Establish baseline budget (BAC)
2. Measure performance to date (CPI, SPI)
3. Identify remaining risks and opportunities
4. Project completion cost using multiple methods
5. Reconcile and select best estimate
6. Report with confidence range

**EAC Calculation Methods**:
- **EAC = BAC / CPI**: Performance-based (most common)
- **EAC = AC + (BAC - EV)**: Original estimate for remaining work
- **EAC = AC + [(BAC - EV) / (CPI × SPI)]**: Schedule-adjusted
- **EAC = AC + Bottom-Up ETC**: Re-estimate remaining work

**Prompt Pattern**:
```
Forecast project completion cost:

CURRENT STATUS:
- Budget at Completion (BAC): [amount]
- Actual Cost to date (AC): [amount]
- Earned Value to date (EV): [amount]
- Percent complete: [percentage]
- Reporting date: [date]

PERFORMANCE HISTORY:
- CPI trend (last 3 periods): [values]
- SPI trend (last 3 periods): [values]
- Variance explanations: [known issues]

KNOWN CHANGES:
- Approved change orders not yet in BAC: [amount]
- Pending change orders (probable): [amount]
- Claims (possible): [amount]

REMAINING RISKS:
- Identified risks: [list with potential cost impact]
- Contingency remaining: [amount]
- Management reserve status: [amount]

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
- Corrective action recommendations
```

---

### Method: Schedule Delay Analysis
**Strategic Alignment**: Critical Path Method (Tier 1); Contract time provisions
**Analysis Techniques**:
- **As-Planned vs As-Built**: Compare original to actual
- **Impacted As-Planned**: Add delays to baseline
- **Collapsed As-Built (But-For)**: Remove delays from as-built
- **Time Impact Analysis (TIA)**: Contemporaneous window analysis
- **Windows Analysis**: Period-by-period assessment

**Prompt Pattern**:
```
Conduct schedule delay analysis:

PROJECT DATA:
- Original contract duration: [days]
- Current contract duration: [with extensions]
- As-planned completion: [date]
- Current projected completion: [date]
- Delay claimed: [days]

SCHEDULE DATA:
- Baseline schedule: [describe or provide]
- Monthly updates: [list available]
- As-built schedule: [if project complete]

DELAY EVENTS:
For each delay event:
- Description: [what happened]
- Start date: [when delay began]
- End date: [when delay ended]
- Responsibility: [Owner, Contractor, Third Party, Force Majeure]
- Supporting documentation: [RFIs, weather logs, correspondence]

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
- Net excusable delay: [days]
- Net compensable delay: [days]
- Supporting narrative for claim/defense
```

---

### Method: Subcontractor Prequalification
**Strategic Alignment**: Risk management framework; Quality management
**Evaluation Categories**:
- Financial stability (bonding capacity, financial statements)
- Technical capability (similar project experience)
- Safety record (EMR, OSHA citations)
- Quality history (warranty claims, rework)
- Management capacity (key personnel, references)
- Legal/compliance (licenses, insurance, litigation history)

**Prompt Pattern**:
```
Evaluate subcontractor prequalification:

SUBCONTRACTOR DATA:
- Company name: [name]
- Trade: [scope of work]
- Years in business: [number]
- Annual revenue: [amount]
- Number of employees: [count]

FINANCIAL ASSESSMENT:
- Bonding capacity: [single/aggregate limits]
- Current backlog: [amount and capacity %]
- Financial statement review: [if available]
- Banking reference: [status]

SAFETY RECORD:
- EMR (Experience Modification Rate): [current and 3-year trend]
- OSHA recordable rate: [TRIR]
- OSHA citations: [last 3 years]
- Fatalities/serious incidents: [any]

EXPERIENCE:
- Similar projects (last 5 years): [list with values]
- References: [owner/GC contacts]
- Key personnel proposed: [names and qualifications]

CAPACITY:
- Current workload: [percentage of capacity]
- Ability to staff this project: [assessment]
- Equipment/resources: [owned vs rented]

OUTPUT:
- Prequalification score (1-100)
- Category ratings
- Risk factors identified
- Recommendation: Approve/Conditional/Reject
- Conditions if conditional approval
```

---

## 3.2 Process Optimization

### Process: Project Cash Flow Management
**Objective**: Optimize cash position while meeting project obligations
**Optimization Levers**:
- Billing timing and accuracy
- Payment terms negotiation (owner and subs)
- Retention management
- Change order processing speed
- Front-loading opportunities (where appropriate)

**Prompt Pattern**:
```
Optimize project cash flow:

PROJECT FINANCIALS:
- Contract value: [amount]
- Duration: [months]
- Billing frequency: [monthly, milestone]
- Payment terms: [Net 30, etc.]
- Retention: [percentage]

CURRENT STATUS:
- Billed to date: [amount]
- Collected to date: [amount]
- Payables outstanding: [amount]
- Work in place unbilled: [amount]

COST PROJECTION:
- Monthly cost forecast: [by month]
- Major material purchases: [timing and amounts]
- Subcontractor payment obligations: [schedule]

CASH FLOW REQUIREMENTS:
- Minimum cash position: [threshold]
- Financing costs: [if borrowing needed]
- Early payment discounts available: [from subs]

OPTIMIZATION ANALYSIS:
- Billing opportunity improvements
- Collection acceleration strategies
- Payables management options
- Retention release timing
- Working capital requirements

OUTPUT:
- Month-by-month cash flow projection
- Peak financing need (amount and timing)
- Optimization recommendations
- Sensitivity to billing delays
- Action items to improve cash position
```

---

### Process: Punch List Management
**Objective**: Efficiently close out project with minimal rework
**Optimization Focus**:
- Early identification (rolling punch)
- Clear documentation
- Efficient completion tracking
- Warranty transition

**Prompt Pattern**:
```
Manage punch list closeout:

PROJECT STATUS:
- Substantial completion date: [date]
- Final completion deadline: [date]
- Punch list issue date: [date]
- Total punch list items: [count]

PUNCH LIST DATA:
For each item:
- Location: [building/room/area]
- Description: [deficiency]
- Responsible party: [Contractor, Sub, Supplier]
- Priority: [life safety, functional, cosmetic]
- Estimated completion: [days]

TRACKING REQUIREMENTS:
- Completion status by trade
- Completion status by area
- Aging report
- Blockers/dependencies

OUTPUT:
- Prioritized completion sequence
- Resource allocation recommendation
- Completion forecast
- Risk items requiring escalation
- Final completion checklist
```

---

## 3.3 Risk Management

### Risk Category: Cost Overrun Risk
**Assessment Methodology**: Historical analysis, Monte Carlo simulation, expert judgment
**Key Risk Factors**:
- Scope growth/creep
- Design changes
- Productivity lower than planned
- Material price escalation
- Labor availability/rates
- Subcontractor default
- Differing site conditions
- Weather impacts
- Regulatory changes

**Prompt Pattern**:
```
Assess cost overrun risk:

PROJECT BASELINE:
- Original estimate: [amount]
- Current budget: [with contingency]
- Contingency amount: [and % of budget]
- Percent complete: [percentage]

RISK FACTORS:
For each potential risk:
- Description: [what could go wrong]
- Probability: [1-5 scale or percentage]
- Impact range: [low/most likely/high dollar amounts]
- Current mitigation: [what's in place]
- Additional mitigation options: [what else could be done]

HISTORICAL BENCHMARKS:
- Similar project cost performance: [database or experience]
- Company historical cost growth: [average percentage]
- Market conditions adjustment: [current vs historical]

ANALYSIS REQUIREMENTS:
- Risk-weighted cost exposure
- Contingency adequacy assessment
- Probability distribution of final cost
- Key risk drivers ranked
- Recommended contingency level

OUTPUT:
- Total risk exposure (expected value)
- P50/P80/P90 cost projections
- Contingency recommendation
- Top risks requiring mitigation
- Cost risk dashboard
```

---

### Risk Category: Schedule Risk
**Assessment Methodology**: Schedule Risk Analysis (SRA), Monte Carlo simulation
**Key Risk Factors**:
- Permit delays
- Design completion delays
- Long-lead equipment delivery
- Labor productivity variations
- Weather impacts
- Subcontractor performance
- Owner decision timing
- Inspection/approval delays
- Site access issues

**Prompt Pattern**:
```
Assess schedule risk:

BASELINE SCHEDULE:
- Contract duration: [days]
- Planned completion: [date]
- Current status date: [date]
- Float on critical path: [days]

RISK FACTORS:
For each schedule risk:
- Activity/area affected: [description]
- Risk description: [what could delay]
- Duration impact range: [min/likely/max days]
- Probability: [percentage]
- On critical path: [yes/no]
- Mitigation possible: [options]

ANALYSIS REQUIREMENTS:
- Schedule risk exposure (expected value in days)
- Probability of meeting contract date
- Key schedule drivers
- Acceleration options and costs
- Risk-adjusted completion date

OUTPUT:
- P50/P80/P90 completion dates
- Critical path risks ranked
- Recommended schedule contingency
- Acceleration alternatives
- Schedule risk mitigation plan
```

---

<a name="tier3"></a>
# 4. TIER 3: OPERATIONAL EXECUTION (Execution Layer)

## Purpose
Execute specific calculations, document processing, and task completion.

---

## 4.1 Computational Tools

### Tool: Earned Value Calculator
**Tactical Context**: Feeds into Cost Forecasting (Tier 2)
**Function**: Calculate all EVM metrics from raw data

**Prompt Pattern**:
```
Calculate Earned Value metrics:

INPUTS:
- Budget at Completion (BAC): [amount]
- Planned Value (PV): [amount]
- Earned Value (EV): [amount]
- Actual Cost (AC): [amount]

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
- Provide benchmark comparisons (CPI < 0.9 = concern, etc.)
```

**Expected Response Structure**:
```json
{
  "calculation_type": "Earned Value Analysis",
  "inputs": {
    "BAC": 1000000,
    "PV": 400000,
    "EV": 350000,
    "AC": 380000
  },
  "metrics": {
    "CV": {
      "value": -30000,
      "interpretation": "Over budget by $30,000"
    },
    "SV": {
      "value": -50000,
      "interpretation": "Behind schedule by $50,000 worth of work"
    },
    "CPI": {
      "value": 0.92,
      "interpretation": "Earning $0.92 for every $1.00 spent - inefficient"
    },
    "SPI": {
      "value": 0.875,
      "interpretation": "Completing 87.5% of planned work - behind schedule"
    },
    "EAC": {
      "value": 1086957,
      "interpretation": "Project expected to cost $1,086,957 at completion"
    },
    "ETC": {
      "value": 706957,
      "interpretation": "$706,957 needed to complete remaining work"
    },
    "VAC": {
      "value": -86957,
      "interpretation": "Expected to be $86,957 over budget"
    },
    "TCPI": {
      "value": 1.05,
      "interpretation": "Must achieve CPI of 1.05 going forward to meet budget"
    },
    "percent_complete": 35.0,
    "percent_spent": 38.0
  },
  "status_assessment": {
    "cost_status": "YELLOW - Overrun trending",
    "schedule_status": "RED - Significantly behind",
    "recovery_feasibility": "Moderate - requires immediate corrective action"
  },
  "benchmarks": {
    "CPI_threshold": "< 0.95 requires corrective action",
    "SPI_threshold": "< 0.90 requires recovery plan",
    "TCPI_feasibility": "> 1.10 rarely achieved"
  }
}
```

---

### Tool: Markup Calculator
**Tactical Context**: Feeds into Change Order Evaluation (Tier 2)
**Function**: Calculate proper markups per contract terms

**Prompt Pattern**:
```
Calculate change order markup:

DIRECT COSTS:
- Labor (own forces): [amount]
- Materials: [amount]
- Equipment: [amount]
- Subcontractor cost: [amount]

CONTRACT MARKUP RATES:
- Overhead on own work: [percentage]
- Profit on own work: [percentage]
- Markup on subcontractor work: [percentage]
- Bond premium: [percentage, if applicable]
- Insurance additional: [percentage, if applicable]

REQUIREMENTS:
- Calculate markup by category
- Show subtotals
- Calculate total change order amount
- Verify against contract limits (if any)
```

---

### Tool: Retention Calculator
**Tactical Context**: Feeds into Cash Flow Management (Tier 2)
**Function**: Calculate retention withheld and release schedule

**Prompt Pattern**:
```
Calculate retention status:

CONTRACT DATA:
- Original contract sum: [amount]
- Approved change orders: [amount]
- Current contract sum: [amount]
- Retention rate: [percentage]
- Retention cap: [percentage or amount, if any]

BILLING DATA:
- Total billed to date: [amount]
- Retention withheld to date: [amount]
- Work complete: [percentage]

RELEASE TRIGGERS:
- Substantial completion: [date achieved or projected]
- Final completion: [date achieved or projected]
- Partial release provision: [terms]

CALCULATE:
- Current retention withheld
- Maximum retention (at cap)
- Retention release at substantial completion: [amount]
- Retention release at final completion: [amount]
- Net retention to be released: [after any backcharges]
```

---

### Tool: Productivity Rate Calculator
**Tactical Context**: Feeds into Cost Forecasting and Labor Planning (Tier 2)
**Function**: Calculate labor productivity metrics

**Prompt Pattern**:
```
Calculate labor productivity:

WORK COMPLETED:
- Quantity installed: [amount and unit]
- Unit of measure: [LF, SF, EA, CY, etc.]

LABOR EXPENDED:
- Total labor hours: [hours]
- Crew size: [workers]
- Days worked: [days]

CALCULATE:
- Unit rate: [hours per unit]
- Daily production: [units per day]
- Crew productivity: [units per crew-hour]

COMPARE TO:
- Budgeted unit rate: [hours per unit]
- Industry benchmark: [if known]
- Historical average: [from similar work]

OUTPUT:
- Productivity factor (actual vs budget)
- Trend if multiple periods
- Root cause analysis prompts
- Forecast impact
```

---

### Tool: Escalation Calculator
**Tactical Context**: Feeds into Cost Forecasting, Contract Negotiation (Tier 2)
**Function**: Calculate price escalation adjustments

**Prompt Pattern**:
```
Calculate price escalation:

BASE PRICING:
- Base amount: [original cost]
- Base date/index: [reference point]
- Material type: [steel, lumber, concrete, etc.]

ESCALATION METHOD:
- Index-based: [specify index - ENR, PPI, etc.]
- Fixed percentage: [annual rate]
- Formula: [if contractual formula]

CURRENT DATA:
- Current date/index: [current reference]
- Elapsed time: [months]

CALCULATE:
- Escalation percentage
- Escalation amount
- Adjusted price
- Annualized rate

VERIFY:
- Contract escalation provisions
- Cap on escalation (if any)
- Documentation requirements
```

---

## 4.2 Document Processing

### Processor: Invoice Extractor
**Tactical Purpose**: Feeds into Payment Application Review (Tier 2)
**Extraction Targets**: Vendor, amounts, dates, line items, project coding

**Prompt Pattern**:
```
Extract invoice data:

DOCUMENT: [Invoice image/PDF]

REQUIRED FIELDS:
- Vendor name
- Vendor address
- Invoice number
- Invoice date
- Due date
- Payment terms
- PO number (if referenced)
- Line items:
  - Description
  - Quantity
  - Unit price
  - Extended amount
- Subtotal
- Tax amount
- Total amount
- Project/job coding

VALIDATION:
- Math verification (quantities × unit prices = line totals)
- Line totals sum to subtotal
- Tax calculation verification
- Total = Subtotal + Tax

OUTPUT FORMAT: Structured JSON with confidence scores
```

---

### Processor: Contract Clause Extractor
**Tactical Purpose**: Feeds into Contract Risk Analysis (Tier 2)
**Extraction Targets**: Key contractual provisions

**Prompt Pattern**:
```
Extract key contract provisions:

DOCUMENT: [Contract document]

EXTRACT:
- Parties (legal names and roles)
- Contract sum and payment terms
- Substantial completion date
- Final completion date
- Liquidated damages (amount per day)
- Retention percentage and release terms
- Change order procedures
- Claims notice requirements
- Dispute resolution method
- Insurance requirements
- Indemnification provisions
- Warranty duration
- Termination provisions

FOR EACH PROVISION:
- Section/article reference
- Exact language (key excerpts)
- Deviation from standard (if comparing to template)
- Risk assessment flag

OUTPUT: Structured JSON organized by category
```

---

### Processor: Daily Report Summarizer
**Tactical Purpose**: Feeds into Progress Tracking, Delay Analysis (Tier 2)
**Extraction Targets**: Workforce, activities, weather, issues

**Prompt Pattern**:
```
Summarize daily construction report:

DOCUMENT: [Daily report text/image]

EXTRACT:
- Date
- Weather conditions
- Workforce:
  - Trade
  - Contractor
  - Headcount
  - Hours worked
- Equipment on site:
  - Type
  - Quantity
  - Idle/operating
- Work performed:
  - Activity description
  - Location
  - Quantity completed
- Deliveries received
- Visitors/inspections
- Issues/delays:
  - Description
  - Cause
  - Impact
  - Resolution
- Safety incidents
- Photos (descriptions if embedded)

OUTPUT: Structured daily log entry
```

---

## 4.3 Task Execution

### Task: Generate Pay Application Review Checklist
**Process Integration**: Part of Payment Processing workflow (Tier 2)

**Prompt Pattern**:
```
Generate pay application review checklist:

PAY APPLICATION DATA:
- Application number: [number]
- Period: [from date to date]
- Contract: [name/number]
- Contractor: [name]
- Amount requested: [amount]

CHECKLIST ITEMS:

ADMINISTRATIVE:
- [ ] Application signed by authorized representative
- [ ] Notarized (if required)
- [ ] Submitted on time per contract
- [ ] Correct application form used

SCHEDULE OF VALUES:
- [ ] Matches approved SOV
- [ ] No front-loading evident
- [ ] Stored materials properly documented
- [ ] Retention correctly calculated
- [ ] Change orders properly incorporated
- [ ] Math verified

SUPPORTING DOCUMENTATION:
- [ ] Subcontractor lien waivers (conditional for current, unconditional for prior)
- [ ] Supplier lien waivers
- [ ] Certified payroll (if required)
- [ ] Stored material invoices
- [ ] Insurance certificates current
- [ ] Permit inspections passed

FIELD VERIFICATION:
- [ ] Work in place consistent with percentage claimed
- [ ] Quality acceptable
- [ ] No outstanding deficiencies affecting payment

OUTPUT:
- Complete checklist with status
- Items requiring attention
- Recommended payment amount
- Withholding justification (if any)
```

---

### Task: Generate RFI Response
**Process Integration**: Part of Design Coordination workflow (Tier 2)

**Prompt Pattern**:
```
Draft RFI response:

RFI DATA:
- RFI number: [number]
- Date received: [date]
- From: [Contractor]
- Subject: [brief description]
- Question: [full text of question]
- Referenced drawings/specs: [list]
- Impact stated by contractor: [cost/schedule if mentioned]

RESPONSE REQUIREMENTS:
- Clarify the design intent
- Provide specific direction
- Reference applicable drawings/specifications
- Note if response constitutes a change
- Include any additional information needed
- Maintain appropriate response time

RESPONSE ELEMENTS:
- Direct answer to question
- Reference documents
- Sketches/markups (describe if needed)
- Impact assessment (change or clarification)
- Distribution list
- Response date

OUTPUT:
- Draft RFI response text
- Change order trigger assessment
- Follow-up items if any
```

---

<a name="prompts"></a>
# 5. PROMPT LIBRARY

## Executive Summary Prompts

### Monthly Executive Dashboard
```
Generate Monthly Executive Dashboard for [month/year]:

REQUIRED SECTIONS:

1. FINANCIAL SUMMARY
- Contract status (original, changes, current)
- Billing and collection status
- Cost performance (CPI, EAC, VAC)
- Cash flow position
- Change order status (pending, approved, rejected)

2. SCHEDULE SUMMARY
- Overall percent complete
- Schedule performance (SPI, projected completion)
- Key milestone status
- Critical path activities
- Look-ahead (next 30/60/90 days)

3. SAFETY SUMMARY
- Incidents this period
- Year-to-date recordable rate
- Safety initiatives
- Near misses reported

4. QUALITY SUMMARY
- Inspections passed/failed
- NCRs open/closed
- Warranty issues

5. RISK SUMMARY
- Top 5 risks this period
- Risk trend (improving/stable/worsening)
- Mitigation actions taken

6. KEY ISSUES & DECISIONS NEEDED
- Items requiring leadership attention
- Decisions needed with deadlines

FORMAT: Executive summary (1-2 pages) with supporting details as appendix
```

---

### Project Health Assessment
```
Assess overall project health:

PROJECT: [name]
AS OF: [date]

EVALUATE ACROSS DIMENSIONS:

1. COST HEALTH (weight: 25%)
- CPI and trend
- EAC vs budget
- Contingency status
- Change order exposure

2. SCHEDULE HEALTH (weight: 25%)
- SPI and trend
- Critical path float
- Milestone achievement
- Resource adequacy

3. QUALITY HEALTH (weight: 20%)
- Inspection pass rate
- Rework percentage
- Customer satisfaction
- Punch list trending

4. SAFETY HEALTH (weight: 15%)
- Incident rate vs target
- Leading indicators
- Compliance status

5. TEAM/STAKEHOLDER HEALTH (weight: 15%)
- Staffing stability
- Owner relationship
- Subcontractor performance
- Communication effectiveness

OUTPUT:
- Overall health score (1-100)
- Individual dimension scores
- Trend arrows (improving/stable/declining)
- Key issues by dimension
- Recommended actions
- Health dashboard visualization
```

---

## Analysis Chain Prompts

### Complete Project Audit
```
Conduct comprehensive project audit:

AUDIT SCOPE:
- Period: [start date to end date]
- Project: [name/number]
- Focus areas: [all or specific areas]

AUDIT CHECKLIST:

1. CONTRACT COMPLIANCE
- Are contract terms being followed?
- Are change procedures correct?
- Are notice requirements met?
- Are insurance/bond requirements current?

2. FINANCIAL CONTROLS
- Are costs properly coded?
- Are invoices verified before payment?
- Are lien waivers obtained?
- Is job costing accurate?
- Are forecasts reasonable?

3. SCHEDULE MANAGEMENT
- Is schedule updated regularly?
- Are delays properly documented?
- Is look-ahead planning occurring?
- Are resources aligned with schedule?

4. QUALITY MANAGEMENT
- Are QC procedures followed?
- Are inspections documented?
- Are NCRs tracked to closure?
- Is testing completed per spec?

5. SAFETY MANAGEMENT
- Are safety plans current?
- Are orientations conducted?
- Are toolbox talks held?
- Are incidents investigated?

6. DOCUMENTATION
- Are daily reports complete?
- Are meeting minutes distributed?
- Is correspondence organized?
- Is photo documentation adequate?

OUTPUT:
- Audit findings by area
- Severity rating (critical/major/minor/observation)
- Root cause analysis
- Corrective actions required
- Deadline for resolution
- Follow-up audit needs
```

---

<a name="schemas"></a>
# 6. RESPONSE SCHEMAS

## Standard Response Wrapper

```json
{
  "response_metadata": {
    "query_type": "string",
    "tier_level": "1|2|3",
    "domain": "construction",
    "timestamp": "ISO 8601",
    "confidence": "percentage",
    "data_currency": "stable|dynamic|regulatory"
  },
  
  "primary_output": {
    // Domain-specific content
  },
  
  "supporting_analysis": {
    "methodology_used": "string",
    "frameworks_applied": ["array"],
    "assumptions": ["array"],
    "data_sources": ["array"],
    "limitations": ["array"]
  },
  
  "quality_indicators": {
    "data_completeness": "percentage",
    "calculation_verified": "boolean",
    "professional_review_recommended": "boolean",
    "regulatory_verification_needed": "boolean"
  },
  
  "recommendations": [
    {
      "priority": "critical|high|medium|low",
      "recommendation": "string",
      "rationale": "string",
      "responsible_party": "string",
      "deadline": "date",
      "cost_impact": "string",
      "schedule_impact": "string"
    }
  ],
  
  "risks_identified": [
    {
      "risk": "string",
      "probability": "high|medium|low",
      "impact": "high|medium|low",
      "mitigation": "string"
    }
  ],
  
  "next_steps": ["array"],
  
  "related_analyses": ["suggested follow-up prompts"]
}
```

---

## Domain-Specific Schemas

### EVM Analysis Schema
```json
{
  "project_id": "string",
  "reporting_period": "date",
  "metrics": {
    "BAC": "number",
    "PV": "number",
    "EV": "number", 
    "AC": "number",
    "CV": "number",
    "SV": "number",
    "CPI": "number",
    "SPI": "number",
    "EAC": "number",
    "ETC": "number",
    "VAC": "number",
    "TCPI": "number"
  },
  "trends": {
    "CPI_3_period": ["array of values"],
    "SPI_3_period": ["array of values"],
    "trend_direction": "improving|stable|declining"
  },
  "forecast": {
    "completion_date_projected": "date",
    "completion_cost_projected": "number",
    "confidence_range": {
      "P10": "number",
      "P50": "number", 
      "P90": "number"
    }
  },
  "corrective_actions": ["array"]
}
```

### Change Order Schema
```json
{
  "co_number": "string",
  "description": "string",
  "entitlement": {
    "basis": "string",
    "determination": "approved|denied|partial",
    "rationale": "string"
  },
  "cost": {
    "claimed": "number",
    "recommended": "number",
    "breakdown": {
      "labor": "number",
      "material": "number",
      "equipment": "number",
      "subcontractor": "number",
      "markup": "number"
    }
  },
  "time": {
    "claimed_days": "number",
    "recommended_days": "number",
    "on_critical_path": "boolean"
  },
  "cumulative_impact": {
    "revised_contract_sum": "number",
    "revised_completion_date": "date",
    "change_percentage": "number"
  }
}
```

### Risk Assessment Schema
```json
{
  "assessment_date": "date",
  "project_id": "string",
  "risk_register": [
    {
      "risk_id": "string",
      "category": "cost|schedule|quality|safety|external",
      "description": "string",
      "probability": "number (1-5)",
      "impact_cost": "number (1-5)",
      "impact_schedule": "number (1-5)",
      "risk_score": "number",
      "current_controls": ["array"],
      "recommended_response": "avoid|transfer|mitigate|accept",
      "mitigation_actions": ["array"],
      "risk_owner": "string",
      "contingency_allocated": "number",
      "status": "open|mitigating|closed|occurred"
    }
  ],
  "summary": {
    "total_risk_count": "number",
    "high_risks": "number",
    "total_exposure": "number",
    "contingency_recommended": "number",
    "contingency_remaining": "number"
  }
}
```

---

# IMPLEMENTATION NOTES

## Using This Specification

1. **For Strategic Decisions**: Reference Tier 1 frameworks and governance standards
2. **For Analysis Work**: Follow Tier 2 methodologies with structured prompts
3. **For Calculations/Tasks**: Use Tier 3 tools with specific input requirements
4. **For Responses**: Structure outputs per the provided JSON schemas

## Integration with AI Systems

This specification can be:
- **Loaded as system context** for construction-focused AI assistants
- **Used as prompt templates** in agentic workflows
- **Referenced for RAG retrieval** to enhance responses
- **Applied for output validation** using the defined schemas

## Continuous Improvement

Update this specification when:
- New regulatory standards are issued
- Industry best practices evolve
- New analytical methods are validated
- Additional tools/calculations are needed
