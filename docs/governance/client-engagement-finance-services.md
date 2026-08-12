# Client Engagement Expansion: Finance, Professional Services, and Monetary Businesses

## Purpose

Expand the runtime from internal financial analysis to client-facing engagement for finance, accounting, legal, insurance, wealth, banking, lending, payments, real estate, professional-services, and other monetarily focused businesses.

The objective is to improve service quality and measurable outcomes through analysis, explanation, scenario modeling, workflow optimization, and outcome review.

## Allowed engagement

The platform may support:

- client discovery and requirements capture;
- analysis of client-provided financial/business information;
- cost, quality, latency, process, and outcome analysis;
- scenario comparison and sensitivity analysis;
- document and workflow explanation;
- budget and constraint analysis;
- operational optimization;
- preparation of client-ready summaries, questions, and review packets;
- post-engagement outcome measurement and feedback loops;
- supervised professional workflows where the client and provider have the required authority.

## Revised boundary

The previous narrow framing of finance work as analysis-only is replaced by a broader **client-engagement capability**. The system may interact with clients and business operators to collect information, explain results, surface options, coordinate workflows, and prepare recommendations for authorized professionals.

Expansion does **not** mean that the runtime may bypass licensing, fiduciary duties, suitability/best-interest obligations, disclosure requirements, privacy rules, recordkeeping requirements, or other applicable law.

For regulated advisory work, the runtime remains a supervised decision-support and client-engagement layer. A licensed/authorized professional remains responsible for regulated advice and material client decisions where required.

## Restricted autonomous actions

The runtime must not autonomously:

- execute securities or derivative trades;
- move, withdraw, or transfer client funds;
- bind a client to a financial contract;
- approve a loan or insurance risk decision where authorization is legally required;
- submit regulatory/tax filings as the final responsible party;
- misrepresent itself as a licensed professional or fiduciary;
- conceal or suppress conflicts, fees, material assumptions, or adverse outcomes.

## Compliance-aware engagement

The engagement layer should classify each request as either:

1. `business_analytics`: operational, financial, or professional-services analysis that does not constitute regulated advice; or
2. `advisory_supervised`: work that may inform regulated advice and therefore requires the applicable professional, authorization, disclosures, and review controls.

The system should preserve an audit trail of the client objective, supplied data, assumptions, model outputs, communications, approvals, and outcome measurements.

## Outcome loop

```text
client / business
      ↓
objective + evidence
      ↓
analysis / explanation
      ↓
scenario + constraint map
      ↓
professional review where required
      ↓
client decision / authorized action
      ↓
measured outcome
      ↓
feedback + quality improvement
```

This creates a client-facing quality loop without turning the agent into an unsupervised fiduciary or transaction executor.

## Regulatory implementation note

For U.S. investment-adviser contexts, the system must account for applicable fiduciary-duty, conflict-of-interest, disclosure, supervision, and recordkeeping requirements. The SEC's June 9, 2026 examination observations specifically emphasize economic conflicts, written compliance procedures, and clear disclosure of fees, expenses, and incentives. The architecture therefore treats compliance as an active workflow boundary rather than a disclaimer.

Source: SEC Division of Examinations, *Examinations Observations of Investment Adviser Obligations Related to Economic Conflicts of Interest*, June 9, 2026.
