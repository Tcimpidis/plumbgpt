"use server"

export async function UploadIngestAction(form: FormData){
  const file = form.get("file") as File | null; if(!file){ alert("Choose a file."); return; }
  const body = new FormData(); body.append("file", file);
  console.log("ingest")
  const res = await fetch("/api/kb/ingest", { method: "POST", body });
  const data = await res.json();
  alert(`Added ${data.added} chunks to KB.`);
}