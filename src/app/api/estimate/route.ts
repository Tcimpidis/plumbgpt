import { NextResponse } from "next/server";
import { z } from "zod";
import { estimate } from "@/lib/estimator";


const Schema = z.object({ jobType: z.string(), propertyType: z.enum(["residential","commercial"]).default("residential"), urgency: z.enum(["normal","soon","emergency"]).default("normal"), fixtures: z.number().int().min(1).max(50).default(1) });


export async function POST(req: Request){
try{ const body = await req.json(); const v = Schema.parse(body); return NextResponse.json(estimate(v)); }
catch(e:any){ return NextResponse.json({ error: e?.message ?? "Bad request"}, { status: 400 }); }
}