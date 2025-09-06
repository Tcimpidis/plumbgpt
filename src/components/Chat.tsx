"use client";
import { useState } from "react";
import Message from "./Message";
import Spinner from "./Spinner";


export default function Chat(){
const [messages, setMessages] = useState([{ role: "assistant" as const, content: "Hi! I’m PlumbGPT. What’s happening today?" }]);
const [input, setInput] = useState("");
const [busy, setBusy] = useState(false);


async function send(){
const text = input.trim(); if(!text) return;
const next = [...messages, { role: "user" as const, content: text }];
setMessages(next); setInput(""); setBusy(true);
try {
const res = await fetch("/api/chat", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ messages: next }) });
const data = await res.json();
setMessages(m => [...m, { role: "assistant", content: data.reply ?? "Sorry — I had trouble answering." }]);
} finally { setBusy(false); }
}


return (
<div className="flex flex-col h-full">
<div className="flex-1 overflow-y-auto space-y-3 p-4 bg-gray-50 border rounded-2xl">
{messages.map((m,i)=> <Message key={i} role={m.role as any} content={m.content}/>) }
{busy && <Spinner/>}
</div>
<div className="mt-2 flex gap-2">
<input className="flex-1 border rounded-xl px-3 py-2" placeholder="Describe the issue…" value={input} onChange={e=>setInput(e.target.value)} onKeyDown={e=> e.key==='Enter' && send()} disabled={busy}/>
<button className="px-4 py-2 rounded-xl bg-blue-600 text-white disabled:opacity-50" onClick={send} disabled={busy}>Send</button>
</div>
</div>
);
}