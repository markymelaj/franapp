"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import { Change, Entries } from "@/lib/state";
export function useEntries() {
  const [entries,setEntries]=useState<Entries>({});
  const entriesRef=useRef(entries);
  const [status,setStatus]=useState<"loading"|"ready"|"saving"|"error"|"signin">("loading");
  const [message,setMessage]=useState("");
  const pending=useRef<Map<string,Change>>(new Map());
  const busy=useRef(false);const loaded=useRef(false);const mounted=useRef(true);
  const flushRef=useRef<()=>Promise<void>>(async()=>{});
  const commitLocal=useCallback((next:Entries)=>{entriesRef.current=next;setEntries(next);},[]);
  const flush=useCallback(async()=>{
    if(busy.current||!loaded.current||!pending.current.size)return;
    busy.current=true;setStatus("saving");
    const batch=[...pending.current.values()].slice(0,100);
    try{
      const response=await fetch("/api/entries",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({changes:batch})});
      if(!response.ok){const data=await response.json().catch(()=>({})) as {error?:string};throw new Error(data.error||"No se pudo guardar. Reintentá cuando tengas conexión.");}
      batch.forEach(c=>{if(pending.current.get(c.key)===c)pending.current.delete(c.key);});
      if(mounted.current){setStatus("ready");setMessage("");}
    }catch(e){if(mounted.current){setStatus("error");setMessage((e as Error).message);}busy.current=false;return;}
    busy.current=false;if(pending.current.size)void flushRef.current();
  },[]);
  flushRef.current=flush;
  const reload=useCallback(async()=>{
    if(pending.current.size){await flushRef.current();return;}
    setStatus("loading");
    try{
      const response=await fetch("/api/entries",{cache:"no-store"});
      if(response.status===401){setStatus("signin");setMessage("Iniciá sesión para guardar favoritos, semana y compras.");return;}
      if(!response.ok)throw new Error("No pudimos cargar tus elecciones. Las recetas siguen disponibles.");
      const data=await response.json() as {entries?:Entries};if(mounted.current){commitLocal(data.entries??{});loaded.current=true;setStatus("ready");setMessage("");}
    }catch(e){if(mounted.current){setStatus("error");setMessage((e as Error).message);}}
  },[commitLocal]);
  useEffect(()=>{mounted.current=true;void reload();const online=()=>{if(loaded.current)void flushRef.current();else void reload();};window.addEventListener("online",online);
    const leave=(event:BeforeUnloadEvent)=>{if(pending.current.size){event.preventDefault();event.returnValue="";}};window.addEventListener("beforeunload",leave);
    return()=>{mounted.current=false;window.removeEventListener("online",online);window.removeEventListener("beforeunload",leave);};
  },[reload]);
  const change=useCallback((changes:Change[])=>{
    if(!loaded.current){setMessage("Esperá a que se carguen tus elecciones o reintentá la conexión.");return false;}
    const next={...entriesRef.current};changes.forEach(c=>{next[c.key]=c.value;pending.current.set(c.key,c);});commitLocal(next);void flushRef.current();return true;
  },[commitLocal]);
  return {entries,entriesRef,status,message,change,retry:reload,canEdit:loaded.current};
}
