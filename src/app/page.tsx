import Chat from "@/components/Chat";


export default function Page(){
return (
<main className="max-w-5xl mx-auto p-6 grid md:grid-cols-[1fr_320px] gap-6">
<section>
<h1 className="text-2xl font-semibold mb-2">PlumbGPT</h1>
<p className="text-sm text-gray-600 mb-4">Grounded answers, quick estimates, and lead capture for plumbing.</p>
<Chat/>
</section>
<aside className="space-y-4">
<div className="border rounded-2xl p-4">
<h2 className="font-semibold mb-2">Quick estimate</h2>
<EstimateForm/>
</div>
<div className="border rounded-2xl p-4">
<h2 className="font-semibold mb-2">Knowledge base</h2>
<KBIngest/>
</div>
</aside>
</main>
);
}

function EstimateForm(){
/*async function submit(formData: FormData){
const res = await fetch("/api/estimate", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(Object.fromEntries(formData as any)) });
const data = await res.json();
alert(`$${data.low}–$${data.high}\n\n${(data.notes||[]).join(" ")}`);
}*/
return (
<form action={() => alert('smell the flowers')} className="grid gap-2 text-sm">
<select name="jobType" className="border rounded px-2 py-1">
{ ["leak repair","drain clog","toilet install","faucet install","water heater replacement","main line clog","repiping"].map(x=> <option key={x}>{x}</option>) }
</select>
<select name="propertyType" className="border rounded px-2 py-1">
<option>residential</option><option>commercial</option>
</select>
<select name="urgency" className="border rounded px-2 py-1">
<option>normal</option><option>soon</option><option>emergency</option>
</select>
<input name="fixtures" type="number" min={1} defaultValue={1} className="border rounded px-2 py-1"/>
<button className="bg-gray-900 text-white rounded px-3 py-1">Get estimate</button>
</form>
);
}

function KBIngest(){
/*async function upload(form: FormData){
const file = form.get("file") as File | null; if(!file){ alert("Choose a file."); return; }
const body = new FormData(); body.append("file", file);
const res = await fetch("/api/kb/ingest", { method: "POST", body });
const data = await res.json();
alert(`Added ${data.added} chunks to KB.`);
}*/
return (
<form action={() => alert("ingest more")} className="grid gap-2 text-sm">
<input type="file" name="file" accept=".txt,.md" className="border rounded px-2 py-1"/>
<p className="text-xs text-gray-500">Start with .txt or .md. (Add PDF support by installing a parser like pdf-parse.)</p>
<button className="bg-gray-900 text-white rounded px-3 py-1">Add to KB</button>
</form>
);
}