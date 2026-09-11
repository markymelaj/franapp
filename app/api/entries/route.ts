import { getChatGPTUser } from "@/app/chatgpt-auth";
import { readEntries, writeEntries } from "@/db/recipe-store";
import { validChange, type Change } from "@/lib/state";
export const dynamic="force-dynamic";
const json=(value:unknown,status=200)=>Response.json(value,{status,headers:{"Cache-Control":"private, no-store"}});
export async function GET() {
  const user=await getChatGPTUser(); if(!user)return json({error:"Iniciá sesión para ver tus elecciones."},401);
  try{return json({entries:await readEntries(user.userId)});}catch(e){console.error("Recipe read failed",e);return json({error:"No pudimos cargar tus elecciones. Probá de nuevo."},503);}
}
export async function POST(request:Request) {
  const user=await getChatGPTUser(); if(!user)return json({error:"Iniciá sesión para guardar tus elecciones."},401);
  if(request.headers.get("sec-fetch-site")==="cross-site")return json({error:"Solicitud no permitida."},403);
  if(!request.headers.get("content-type")?.includes("application/json"))return json({error:"Formato no válido."},415);
  try{
    const raw=await request.text();if(raw.length>60000)return json({error:"La solicitud es demasiado grande."},413);
    const body=JSON.parse(raw) as {changes:Change[]};
    if(!Array.isArray(body.changes)||body.changes.length<1||body.changes.length>100||!body.changes.every(validChange))return json({error:"Revisá los datos e intentá otra vez."},400);
    await writeEntries(user.userId,body.changes);return json({ok:true});
  }catch(e){if(e instanceof SyntaxError)return json({error:"Datos no válidos."},400);console.error("Recipe save failed",e);return json({error:"No se pudo guardar. Tus cambios siguen en esta pantalla; reintentá."},503);}
}
