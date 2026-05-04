import { spawn } from 'child_process';

export function runOrchestrator(cloneId:string){
  return new Promise((resolve)=>{
    const proc = spawn('python',['../agent-runtime/orchestrator.py', cloneId]);

    let data='';
    proc.stdout.on('data',chunk=> data+=chunk.toString());

    proc.on('close',()=>{
      resolve(data);
    });
  });
}
