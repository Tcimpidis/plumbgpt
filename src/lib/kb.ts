import fs from "fs";
import path from "path";
import OpenAI from "openai";
import type { KBDoc } from "./types";


const KB_PATH = path.join(process.cwd(), "data", "kb.json");


function ensure(){
fs.mkdirSync(path.dirname(KB_PATH), { recursive: true });
if (!fs.existsSync(KB_PATH)) fs.writeFileSync(KB_PATH, "[]");
}


export function readKB(): KBDoc[]{ ensure(); return JSON.parse(fs.readFileSync(KB_PATH, "utf8")); }
export function writeKB(rows: KBDoc[]){ ensure(); fs.writeFileSync(KB_PATH, JSON.stringify(rows, null, 2)); }


export async function embedTexts(texts: string[], openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })){
const input = texts.map(t => t.slice(0, 8000));
const { data } = await openai.embeddings.create({ model: "text-embedding-3-large", input });
return data.map(v => v.embedding as number[]);
}


export function chunk(text: string, size = 900, overlap = 120){
const words = text.split(/\s+/);
const chunks: string[] = [];
for (let i=0; i<words.length; i += (size - overlap)){
chunks.push(words.slice(i, i + size).join(" "));
if (i + size >= words.length) break;
}
return chunks;
}


export function cosine(a: number[], b: number[]){
let dot=0, na=0, nb=0; for(let i=0;i<a.length;i++){ dot+=a[i]*b[i]; na+=a[i]*a[i]; nb+=b[i]*b[i]; }
return dot / (Math.sqrt(na)*Math.sqrt(nb) + 1e-8);
}


export function search(queryEmbedding: number[], topK = 6){
const kb = readKB();
return kb
.map(row => ({ ...row, score: cosine(row.embedding, queryEmbedding) }))
.sort((a,b)=> b.score - a.score)
.slice(0, topK);
}