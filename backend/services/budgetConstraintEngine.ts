export type ConstraintType = "floor" | "ceiling" | "mandate" | "preference" | "signal";

export interface BudgetConstraint {
  id: string;
  label: string;
  type: ConstraintType;
  amount?: number;
  program?: string;
  fiscalYear: number;
  source?: string;
}

export interface Commitment {
  id: string;
  label: string;
  amountByYear: Record<number, number>;
  source?: string;
}

export interface CandidateAllocation {
  id: string;
  label: string;
  amount: number;
  programs: string[];
  satisfies: string[];
  riskScore?: number;
}

export interface BudgetModel {
  fiscalYear: number;
  topline: number;
  constraints: BudgetConstraint[];
  commitments: Commitment[];
  operations: number;
}

export interface AllocationAnalysis {
  mandatoryClaims: number;
  commitments: number;
  operations: number;
  residual: number;
  bindingConstraints: BudgetConstraint[];
  overlapScores: Array<{
    candidateId: string;
    candidateLabel: string;
    score: number;
    satisfiedConstraints: string[];
    feasible: boolean;
  }>;
}

const isBinding = (c: BudgetConstraint) => c.type === "floor" || c.type === "mandate";

export function analyzeBudget(model: BudgetModel, candidates: CandidateAllocation[] = []): AllocationAnalysis {
  const bindingConstraints = model.constraints.filter(isBinding);
  const mandatoryClaims = bindingConstraints.reduce((sum, c) => sum + (c.amount ?? 0), 0);
  const commitments = model.commitments.reduce(
    (sum, c) => sum + (c.amountByYear[model.fiscalYear] ?? 0),
    0,
  );
  const residual = model.topline - mandatoryClaims - commitments - model.operations;

  const overlapScores = candidates.map((candidate) => {
    const satisfiedConstraints = model.constraints
      .filter((constraint) =>
        candidate.satisfies.includes(constraint.id) ||
        (!!constraint.program && candidate.programs.includes(constraint.program)),
      )
      .map((constraint) => constraint.id);

    const coverage = satisfiedConstraints.length;
    const riskPenalty = Math.max(0, Math.min(1, candidate.riskScore ?? 0));
    const score = residual >= candidate.amount
      ? (coverage * 100) / Math.max(candidate.amount, 1) * (1 - riskPenalty)
      : 0;

    return {
      candidateId: candidate.id,
      candidateLabel: candidate.label,
      score,
      satisfiedConstraints,
      feasible: residual >= candidate.amount,
    };
  }).sort((a, b) => b.score - a.score);

  return { mandatoryClaims, commitments, operations: model.operations, residual, bindingConstraints, overlapScores };
}

export function classifyDirective(language: string): ConstraintType {
  const value = language.toLowerCase();
  if (value.includes("not less than")) return "floor";
  if (value.includes("up to")) return "ceiling";
  if (value.includes("directed")) return "mandate";
  if (value.includes("encouraged")) return "preference";
  return "signal";
}
