import { NextResponse } from "next/server";
import { v4 as uuid } from "uuid";
import { chunk, embedTexts, readKB, writeKB } from "@/lib/kb";


export const runtime = "nodejs";


export async function POST(req: Request){
const form = await req.formData();
const file = form.get("file") as File | null;
if(!file) return NextResponse.json({ error: "file required" }, { status: 400 });


const raw = await file.text();
const chunks = chunk(raw);
const embeddings = await embedTexts(chunks);


const rows = chunks.map((text, i) => ({ id: uuid(), text, embedding: embeddings[i] }));
const kb = readKB();
writeKB([...kb, ...rows]);
return NextResponse.json({ added: rows.length });
}