export type ClientSector =
  | "finance"
  | "accounting"
  | "legal"
  | "insurance"
  | "wealth"
  | "banking"
  | "lending"
  | "payments"
  | "real_estate"
  | "professional_services"
  | "other_monetary_business";

export type EngagementMode =
  | "discovery"
  | "client_review"
  | "scenario_analysis"
  | "document_explanation"
  | "workflow_optimization"
  | "outcome_review";

export interface ClientEngagementRequest {
  clientId: string;
  sector: ClientSector;
  mode: EngagementMode;
  objective: string;
  metrics?: string[];
  authorizedActivities?: string[];
  regulatedAdviceAuthorized?: boolean;
}

export interface ClientEngagementPlan {
  clientId: string;
  sector: ClientSector;
  mode: EngagementMode;
  objective: string;
  allowedActions: string[];
  reviewRequired: string[];
  outcomeMetrics: string[];
  complianceBoundary: "advisory_supervised" | "business_analytics";
}

const BASE_ALLOWED = [
  "analyze client-provided information",
  "identify quality, cost, latency, process, and outcome improvements",
  "produce auditable scenarios and comparisons",
  "explain documents, workflows, assumptions, and model outputs",
  "prepare client-ready summaries and questions for professional review",
];

const REGULATED_REVIEW = [
  "licensed professional review before personalized regulated advice",
  "human approval before recommendations are communicated as regulated advice",
  "conflict, fee, suitability/best-interest, privacy, and recordkeeping checks where applicable",
  "no autonomous trade, transfer, withdrawal, lending decision, filing, or binding commitment",
];

export function buildClientEngagementPlan(request: ClientEngagementRequest): ClientEngagementPlan {
  const regulated = request.regulatedAdviceAuthorized === true;
  const outcomeMetrics = request.metrics?.length
    ? request.metrics
    : ["quality", "cost", "timeliness", "client understanding", "measurable outcome"];

  const allowedActions = [
    ...BASE_ALLOWED,
    ...(request.authorizedActivities ?? []),
  ];

  return {
    clientId: request.clientId,
    sector: request.sector,
    mode: request.mode,
    objective: request.objective,
    allowedActions: [...new Set(allowedActions)],
    reviewRequired: regulated ? REGULATED_REVIEW : [
      "verify authorization and scope of the engagement",
      "protect confidential and personal information",
      "obtain human approval for material external communications or commitments",
    ],
    outcomeMetrics,
    complianceBoundary: regulated ? "advisory_supervised" : "business_analytics",
  };
}
