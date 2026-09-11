import { env } from "cloudflare:workers";
import type { Change, Entries } from "@/lib/state";
function database() { if(!env.DB)throw new Error("Recipe storage is unavailable"); return env.DB; }
export async function readEntries(userId:string):Promise<Entries> {
  const rows=await database().prepare("SELECT entry_key, value FROM recipe_entries WHERE user_id = ?").bind(userId).all<{entry_key:string;value:string}>();
  return Object.fromEntries(rows.results.map(row=>[row.entry_key,JSON.parse(row.value)]));
}
export async function writeEntries(userId:string,changes:Change[]) {
  const db=database(); const now=new Date().toISOString();
  await db.batch(changes.map(c=>db.prepare("INSERT INTO recipe_entries (user_id, entry_key, value, updated_at) VALUES (?, ?, ?, ?) ON CONFLICT(user_id, entry_key) DO UPDATE SET value = excluded.value, updated_at = excluded.updated_at").bind(userId,c.key,JSON.stringify(c.value),now)));
}
