import { NextResponse } from "next/server";
import OpenAI from "openai";
import { z } from "zod";
import { SYSTEM_PROMPT, CONFIG } from "@/lib/config";
import { estimate } from "@/lib/estimator";
import { embedTexts, search } from "@/lib/kb";


const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });


const ToolSchemas = {
estimate_job: {
name: "estimate_job",
description: "Return a non‑binding range for a plumbing job",
parameters: {
type: "object",
properties: {
jobType: { type: "string" },
propertyType: { type: "string", enum: ["residential","commercial"], default: "residential" },
urgency: { type: "string", enum: ["normal","soon","emergency"], default: "normal" },
fixtures: { type: "number", default: 1 },
},
required: ["jobType"],
},
},
kb_search: {
name: "kb_search",
description: "Search the company knowledge base for relevant passages",
parameters: { type: "object", properties: { query: { type: "string" }, topK: { type: "number", default: 5 } }, required: ["query"] },
},
create_lead: {
name: "create_lead",
description: "Capture lead contact and problem summary",
parameters: { type: "object", properties: { name: { type: "string" }, phone: { type: "string" }, email: { type: "string" }, address: { type: "string" }, zip: { type: "string" }, notes: { type: "string" } }, required: [] },
},
} as const;


export async function POST(req: Request){
try{
const { messages } = await req.json();
if(!Array.isArray(messages)) return NextResponse.json({ error: "messages[] required" }, { status: 400 });


let toolResults: Record<string, any> = {};
let convo = [ { role: "system" as const, content: SYSTEM_PROMPT() }, ...messages ];


for(let step=0; step<3; step++){
const resp = await openai.chat.completions.create({
model: "gpt-4o-mini",
temperature: 0.3,
messages: convo as any,
tools: [ToolSchemas.estimate_job as any, ToolSchemas.kb_search as any, ToolSchemas.create_lead as any],
tool_choice: "auto",
});


const msg = resp.choices[0].message as any;
if(msg.tool_calls && msg.tool_calls.length){
// Handle first tool call only per round for simplicity
const call = msg.tool_calls[0];
const name = call.function.name;
const args = JSON.parse(call.function.arguments || "{}");
let result: any = null;


if(name === "estimate_job"){
result = estimate(args);
} else if(name === "kb_search"){
const [emb] = await embedTexts([args.query]);
const hits = search(emb, Math.min(args.topK ?? 5, 8));
result = { hits: hits.map(h => ({ id: h.id, score: h.score, text: h.text.slice(0, 1200) })) };
} else if(name === "create_lead"){
const r = await fetch(new URL("/api/leads", req.url), { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(args) });
result = await r.json();
}


convo = [...convo, { role: "assistant", content: "", tool_calls: [call] } as any, { role: "tool" as const, name, tool_call_id: call.id, content: JSON.stringify(result) }];
continue; // loop to let model use tool outputs
}


return NextResponse.json({ reply: msg.content });
}


return NextResponse.json({ reply: "Sorry — I couldn’t complete the request." });
} catch(e:any){
console.error("/api/chat", e);
return NextResponse.json({ error: "Server error" }, { status: 500 });
}
}