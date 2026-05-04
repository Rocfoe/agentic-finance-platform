import fetch from 'node-fetch';

export async function extractStrategy(text:string){
  const res = await fetch('https://api.openai.com/v1/chat/completions',{
    method:'POST',
    headers:{
      'Authorization':`Bearer ${process.env.OPENAI_API_KEY}`,
      'Content-Type':'application/json'
    },
    body:JSON.stringify({
      model:'gpt-4o-mini',
      messages:[
        {role:'system',content:'Extract a financial strategy from text. Return JSON with title and summary.'},
        {role:'user',content:text}
      ]
    })
  });

  const data = await res.json();
  const content = data.choices?.[0]?.message?.content || '{}';

  try { return JSON.parse(content); } catch { return {title:'parse_failed',summary:content}; }
}
