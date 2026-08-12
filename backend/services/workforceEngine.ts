export type WorkforceRole =
  | "sensor"
  | "observer"
  | "analyst"
  | "optimizer"
  | "operator"
  | "reviewer"
  | "client"
  | "specialist";

export type AutonomyLevel = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7;
export type WorkStatus = "queued" | "active" | "blocked" | "review" | "completed";

export interface WorkforceActor {
  id: string;
  name: string;
  role: WorkforceRole;
  capabilities: string[];
  autonomy: AutonomyLevel;
  active: boolean;
}

export interface SensorObservation {
  sensorId: string;
  kind: string;
  value: number | string | boolean;
  unit?: string;
  region?: string;
  confidence: number;
  timestamp?: string;
  provenance?: string;
}

export interface WorkforceTask {
  id: string;
  objective: string;
  requiredCapabilities: string[];
  autonomyRequired: AutonomyLevel;
  status: WorkStatus;
  actorId?: string;
  inputs: string[];
  outputs: string[];
  reviewRequired: boolean;
}

const scoreActor = (actor: WorkforceActor, task: WorkforceTask) => {
  const capabilityHits = task.requiredCapabilities.filter((capability) => actor.capabilities.includes(capability)).length;
  const autonomyFit = actor.autonomy >= task.autonomyRequired ? 1 : 0;
  return capabilityHits * 10 + autonomyFit * 5 + (actor.active ? 1 : 0);
};

export function routeWorkforceTask(task: WorkforceTask, actors: WorkforceActor[]) {
  const ranked = actors
    .filter((actor) => actor.active)
    .map((actor) => ({ actor, score: scoreActor(actor, task) }))
    .sort((a, b) => b.score - a.score);

  const selected = ranked[0];
  const blockedByAutonomy = !selected || selected.actor.autonomy < task.autonomyRequired;
  const needsReview = task.reviewRequired || task.autonomyRequired >= 7;

  return {
    task,
    selectedActor: blockedByAutonomy ? undefined : selected.actor,
    ranked,
    status: blockedByAutonomy ? "blocked" : needsReview ? "review" : "active",
    reason: blockedByAutonomy
      ? "no_active_actor_meets_capability_and_autonomy_requirements"
      : needsReview
        ? "human_or_authorized_professional_review_required"
        : "autonomous_workflow_eligible",
  } as const;
}

export function buildWorkforcePlan(
  objective: string,
  tasks: WorkforceTask[],
  actors: WorkforceActor[],
  observations: SensorObservation[] = [],
) {
  const routed = tasks.map((task) => routeWorkforceTask(task, actors));
  const active = routed.filter((item) => item.status === "active").length;
  const review = routed.filter((item) => item.status === "review").length;
  const blocked = routed.filter((item) => item.status === "blocked").length;

  return {
    objective,
    observations,
    tasks: routed,
    workforce: {
      totalActors: actors.length,
      activeActors: actors.filter((actor) => actor.active).length,
      activeTasks: active,
      reviewTasks: review,
      blockedTasks: blocked,
    },
    autonomyPolicy: {
      levels: {
        0: "observe",
        1: "interpret",
        2: "recommend",
        3: "simulate",
        4: "prepare_action",
        5: "bounded_reversible_action",
        6: "bounded_autonomous_workflow",
        7: "human_authorization_required",
      },
    },
  };
}

export function ingestSensorObservation(observation: SensorObservation) {
  const confidence = Math.max(0, Math.min(1, observation.confidence));
  return {
    ...observation,
    confidence,
    timestamp: observation.timestamp ?? new Date().toISOString(),
    stateSignal: confidence >= 0.9 ? "strong" : confidence >= 0.6 ? "usable" : "uncertain",
  };
}
