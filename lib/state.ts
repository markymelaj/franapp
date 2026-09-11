import { byId, foodGroup, Ingredient, normalize } from "./recipes";
export type EntryValue = string | number | boolean;
export type Entries = Record<string, EntryValue>;
export type Change = { key: string; value: EntryValue };
export type ShoppingItem = Ingredient & { key: string; checkKey: string; group: string };
export function shoppingItems(entries:Entries): ShoppingItem[] {
  const map=new Map<string,Ingredient>();
  Object.entries(entries).filter(([k,v])=>k.startsWith("cart:")&&Number(v)>0).forEach(([k,v])=>{
    const r=byId[k.slice(5)]; if(!r)return;
    r.ingredients.forEach(i=>{
      if(i.name==="Agua")return;
      const key=normalize(i.name)+":"+i.unit;
      const current=map.get(key);
      if(current) current.amount+=i.amount*Number(v);
      else map.set(key,{...i,amount:i.amount*Number(v),note:undefined});
    });
  });
  return [...map].map(([key,i])=>({...i,key,checkKey:"bought:"+key+":"+Math.round(i.amount*100),group:foodGroup(i.name)})).sort((a,b)=>a.group.localeCompare(b.group)||a.name.localeCompare(b.name));
}
export function weekDays(offset=0,now=new Date()):string[] {
  const date=new Date(now.getFullYear(),now.getMonth(),now.getDate(),12);
  date.setDate(date.getDate()-((date.getDay()+6)%7)+offset*7);
  return Array.from({length:7},(_,i)=>{ const d=new Date(date);d.setDate(d.getDate()+i);return dateKey(d); });
}
export function dateKey(d:Date) {return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,"0")}-${String(d.getDate()).padStart(2,"0")}`;}
export function planFor(entries:Entries,date:string):string[] {
  return Object.keys(entries).filter(k=>k.startsWith(`plan:${date}:`)&&entries[k]===true).map(k=>k.split(":")[2]).filter(id=>byId[id]);
}
export function validChange(c:Change) {
  if(!c || typeof c.key!=="string"||c.key.length>180)return false;
  const {key,value}=c;
  if(/^(favorite|wish|cart|note):\d{2}$/.test(key)) {
    if(!byId[key.split(":")[1]])return false;
    if(key.startsWith("note:"))return typeof value==="string"&&value.length<=1000;
    if(key.startsWith("cart:"))return typeof value==="number"&&Number.isInteger(value)&&value>=0&&value<=10;
    return typeof value==="boolean";
  }
  if(/^plan:\d{4}-\d{2}-\d{2}:\d{2}$/.test(key))return !!byId[key.split(":")[2]]&&typeof value==="boolean";
  if(/^dance:\d{4}-\d{2}-\d{2}$/.test(key))return typeof value==="boolean";
  if(key.startsWith("bought:"))return typeof value==="boolean";
  return false;
}
