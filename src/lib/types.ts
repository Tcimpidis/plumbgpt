export type Role = "system"|"user"|"assistant"|"tool";
export type Message = { role: Role; content: string; name?: string; tool_call_id?: string };
export type Lead = { id: string; name?: string; phone?: string; email?: string; address?: string; zip?: string; notes?: string; createdAt: string };
export type KBDoc = { id: string; text: string; embedding: number[] };