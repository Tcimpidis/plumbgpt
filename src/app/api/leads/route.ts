import { NextResponse } from "next/server";
import fs from "fs"; import path from "path"; import { v4 as uuid } from "uuid";

const LEADS_PATH = path.join(process.cwd(), "data", "leads.json");
function ensure(){ fs.mkdirSync(path.dirname(LEADS_PATH), { recursive: true }); if(!fs.existsSync(LEADS_PATH)) fs.writeFileSync(LEADS_PATH, "[]"); }

export async function GET(){ ensure(); const rows = JSON.parse(fs.readFileSync(LEADS_PATH, "utf8")); return NextResponse.json(rows); }
export async function POST(req: Request){ ensure(); const rows = JSON.parse(fs.readFileSync(LEADS_PATH, "utf8")); const body = await req.json(); const row = { id: uuid(), createdAt: new Date().toISOString(), ...body }; rows.push(row); fs.writeFileSync(LEADS_PATH, JSON.stringify(rows, null, 2)); return NextResponse.json(row); }