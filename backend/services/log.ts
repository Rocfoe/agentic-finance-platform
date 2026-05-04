export function logEvent(runId:string,type:string,payload:any){
  console.log(JSON.stringify({runId,type,payload,timestamp:new Date().toISOString()}));
}
