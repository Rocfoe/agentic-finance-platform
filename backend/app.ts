import express from "express";
import bodyParser from "body-parser";
import { v4 as uuid } from "uuid";
import { analyzeBudget, classifyDirective, BudgetModel, CandidateAllocation } from "./services/budgetConstraintEngine";
import { encodeGlobalWorkflow, encodeRegionalWorkflow, RegionalWorkflowInput } from "./services/quantumWorkflowEngine";
import { buildClientEngagementPlan, ClientEngagementRequest } from "./services/clientEngagementEngine";
import { buildWorkforcePlan, ingestSensorObservation, WorkforceActor, WorkforceTask, SensorObservation } from "./services/workforceEngine";

const app = express();
app.use(bodyParser.json());

const sources: any[] = [];
const strategies: any[] = [];
const clones: any[] = [];
const runs: any[] = [];
const workforceActors: WorkforceActor[] = [];
const workforceTasks: WorkforceTask[] = [];
const sensorObservations: SensorObservation[] = [];

app.get("/health", (_req, res) => res.json({ status: "ok", service: "agentic-finance-platform", workforce: true, sensors: true }));

app.post("/api/ingest/conversation", (req, res) => {
  const id = uuid();
  sources.push({ id, content: req.body.text, created_at: new Date().toISOString() });
  res.json({ source_id: id });
});

app.post("/api/strategies/extract", (_req, res) => {
  const strat = { id: uuid(), title: "Basic extracted strategy", approved: false };
  strategies.push(strat);
  res.json([strat]);
});

app.post("/api/strategies/:id/approve", (req, res) => {
  const s = strategies.find((x) => x.id === req.params.id);
  if (!s) return res.status(404).json({ error: "strategy_not_found" });
  s.approved = true;
  res.json(s);
});

app.post("/api/clones/generate", (_req, res) => {
  const c = { id: uuid(), type: "research_clone" };
  clones.push(c);
  res.json(c);
});

app.post("/api/clones/:id/run", (req, res) => {
  const clone = clones.find((x) => x.id === req.params.id);
  if (!clone) return res.status(404).json({ error: "clone_not_found" });
  const run = { id: uuid(), clone_id: req.params.id, status: "completed", output: req.body?.output ?? "Simulation completed" };
  runs.push(run);
  res.json(run);
});

app.get("/api/runs", (_req, res) => res.json(runs));

app.post("/api/budget/classify-directive", (req, res) => {
  if (typeof req.body?.language !== "string") return res.status(400).json({ error: "language_required" });
  res.json({ language: req.body.language, constraint_type: classifyDirective(req.body.language) });
});

app.post("/api/budget/analyze", (req, res) => {
  const model = req.body?.model as BudgetModel | undefined;
  if (!model || typeof model.topline !== "number" || typeof model.fiscalYear !== "number") {
    return res.status(400).json({ error: "model.topline_and_fiscalYear_required" });
  }
  if (model.topline < 0 || model.operations < 0) return res.status(400).json({ error: "budget_values_must_be_nonnegative" });
  const candidates = (req.body?.candidates ?? []) as CandidateAllocation[];
  res.json(analyzeBudget(model, candidates));
});

app.post("/api/workflow/encode-region", (req, res) => {
  const input = req.body as RegionalWorkflowInput;
  if (!input || typeof input.regionCode !== "string") {
    return res.status(400).json({ error: "regionCode_required" });
  }
  res.json(encodeRegionalWorkflow(input));
});

app.post("/api/workflow/encode-global", (req, res) => {
  const inputs = req.body?.regions as RegionalWorkflowInput[] | undefined;
  if (!Array.isArray(inputs) || inputs.length === 0) {
    return res.status(400).json({ error: "regions_required" });
  }
  res.json(encodeGlobalWorkflow(inputs));
});

app.post("/api/engagement/plan", (req, res) => {
  const request = req.body as ClientEngagementRequest;
  if (!request || typeof request.clientId !== "string" || typeof request.objective !== "string") {
    return res.status(400).json({ error: "clientId_and_objective_required" });
  }
  res.json(buildClientEngagementPlan(request));
});

app.post("/api/workforce/actor", (req, res) => {
  const actor = req.body as WorkforceActor;
  if (!actor || typeof actor.name !== "string" || !Array.isArray(actor.capabilities)) {
    return res.status(400).json({ error: "name_and_capabilities_required" });
  }
  const created = { ...actor, id: actor.id || uuid(), active: actor.active !== false };
  workforceActors.push(created);
  res.json(created);
});

app.post("/api/workforce/task", (req, res) => {
  const task = req.body as WorkforceTask;
  if (!task || typeof task.objective !== "string" || !Array.isArray(task.requiredCapabilities)) {
    return res.status(400).json({ error: "objective_and_requiredCapabilities_required" });
  }
  const created = { ...task, id: task.id || uuid(), status: task.status ?? "queued" };
  workforceTasks.push(created);
  res.json(created);
});

app.post("/api/workforce/engage", (req, res) => {
  const objective = req.body?.objective;
  if (typeof objective !== "string" || !objective.trim()) return res.status(400).json({ error: "objective_required" });
  res.json(buildWorkforcePlan(objective, workforceTasks, workforceActors, sensorObservations));
});

app.post("/api/sensors/observe", (req, res) => {
  const observation = req.body as SensorObservation;
  if (!observation || typeof observation.sensorId !== "string" || typeof observation.confidence !== "number") {
    return res.status(400).json({ error: "sensorId_and_confidence_required" });
  }
  const normalized = ingestSensorObservation(observation);
  sensorObservations.push(normalized);
  res.json(normalized);
});

app.get("/api/workforce/state", (_req, res) => {
  res.json({ actors: workforceActors, tasks: workforceTasks, sensors: sensorObservations });
});

app.listen(3001, () => console.log("Backend running on :3001"));
