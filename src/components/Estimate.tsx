"use client"
export function EstimateForm(){
 async function submit(formData: FormData){
  const initialData = Object.fromEntries(formData as any);
  const fixtureNumber = parseInt(initialData.fixtures);
  initialData.fixtures = fixtureNumber 
  const res = await fetch("/api/estimate", { 
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(initialData) });
  const data = await res.json();
  alert(`$${data.low}–$${data.high}\n\n${(data.notes||[]).join(" ")}`);
}
return (
<form action={submit} className="grid gap-2 text-sm">
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