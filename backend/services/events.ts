import { query } from '../db/index';
import { v4 as uuid } from 'uuid';

export async function emitEvent(runId:string,type:string,payload:any){
  await query(
    "INSERT INTO run_events(id, run_id, event_type, payload) VALUES($1,$2,$3,$4)",
    [uuid(), runId, type, payload]
  );
}
