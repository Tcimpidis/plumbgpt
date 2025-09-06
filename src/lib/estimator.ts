export type EstimateInput = {
jobType: string;
propertyType?: "residential"|"commercial";
urgency?: "normal"|"soon"|"emergency";
fixtures?: number;
};


const BASE: Record<string, [number, number]> = {
"leak repair": [150, 450],
"drain clog": [125, 350],
"toilet install": [180, 420],
"faucet install": [150, 350],
"water heater replacement": [900, 2400],
"garbage disposal": [180, 380],
"main line clog": [250, 600],
"repiping": [3500, 12000],
};


export function estimate(inp: EstimateInput){
const key = inp.jobType.toLowerCase();
let [lo, hi] = BASE[key] ?? [200, 700];
const prop = inp.propertyType ?? "residential";
const urg = inp.urgency ?? "normal";
const fixtures = inp.fixtures ?? 1;


if (prop === "commercial") { lo *= 1.2; hi *= 1.25; }
if (urg === "soon") { lo *= 1.1; hi *= 1.15; }
if (urg === "emergency") { lo *= 1.35; hi *= 1.5; }


if (["toilet install","faucet install","repiping"].includes(key)){
const factor = Math.min(1 + (fixtures - 1) * 0.5, 3);
lo *= factor; hi *= factor;
}


return { low: Math.round(lo), high: Math.round(hi),
notes: [
"Final pricing requires onsite diagnosis.",
"Cost drivers: access, code upgrades, permits, brand/size, age/condition.",
] };
}