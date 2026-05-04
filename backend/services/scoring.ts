export function scoreRun(output:string){
  const confidence = Math.min(1, output.length / 100);
  const risk = output.includes("risk") ? "high" : "low";

  return { confidence, risk };
}
