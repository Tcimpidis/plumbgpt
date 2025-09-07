"use client"
export function KBIngest(){
async function upload(form: FormData){
  const file = form.get("file") as File | null; if(!file){ alert("Choose a file."); return; }
  const body = new FormData(); body.append("file", file);
  const res = await fetch("/api/kb/ingest", { method: "POST", body });
  const data = await res.json();
  alert(`Added ${data.added} chunks to KB.`);
}
return (
  <form action={upload} className="grid gap-2 text-sm">
    <input type="file" name="file" accept=".txt,.md" className="border rounded px-2 py-1"/>
    <p className="text-xs text-gray-500">Start with .txt or .md. (Add PDF support by installing a parser like pdf-parse.)</p>
    <button className="bg-gray-900 text-white rounded px-3 py-1">Add to KB</button>
  </form>
);
}