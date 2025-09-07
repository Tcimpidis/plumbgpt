import Chat from "@/components/Chat";
import { EstimateForm } from "@/components/Estimate";
import { KBIngest } from "@/components/kb/Ingest";

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
