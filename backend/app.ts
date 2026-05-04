import express from "express";
import bodyParser from "body-parser";
import { v4 as uuid } from "uuid";

const app = express();
app.use(bodyParser.json());

let sources:any[]=[];let strategies:any[]=[];let clones:any[]=[];let runs:any[]=[];

app.post("/api/ingest/conversation",(req,res)=>{const id=uuid();sources.push({id,content:req.body.text});res.json({source_id:id});});

app.post("/api/strategies/extract",(req,res)=>{const strat={id:uuid(),title:"Basic extracted strategy",approved:false};strategies.push(strat);res.json([strat]);});

app.post("/api/strategies/:id/approve",(req,res)=>{const s=strategies.find(x=>x.id===req.params.id);s.approved=true;res.json(s);});

app.post("/api/clones/generate",(req,res)=>{const c={id:uuid(),type:"research_clone"};clones.push(c);res.json(c);});

app.post("/api/clones/:id/run",(req,res)=>{const run={id:uuid(),clone_id:req.params.id,status:"completed",output:"Sample output"};runs.push(run);res.json(run);});

app.get("/api/runs",(req,res)=>res.json(runs));

app.listen(3001,()=>console.log("Backend running"));