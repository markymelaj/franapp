"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { ArrowDownToLine, ArrowLeft, ArrowRight, Bookmark, CalendarDays, Check, ChevronLeft, ChevronRight, Clock3, Heart, Home, Info, Minus, Plus, Search, Share2, ShoppingBag, Snowflake, Sparkles, Sun, Utensils, X } from "lucide-react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Sheet, SheetContent, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { Dialog, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Empty, EmptyTitle, EmptyDescription } from "@/components/ui/empty";
import { Toaster } from "@/components/ui/sonner";
import { toast } from "sonner";
import { recipes, byId, normalize, timeText, ingredientText, amountText, type Recipe, type Moment } from "@/lib/recipes";
import { dateKey, planFor, shoppingItems, weekDays, type Change } from "@/lib/state";
import { useEntries } from "./use-entries";

const moments: {id:Moment;label:string;short:string;icon:typeof Home}[]=[
  {id:"cole",label:"Para el cole",short:"Cole",icon:ShoppingBag},
  {id:"antes",label:"Antes de danza",short:"Antes",icon:Sun},
  {id:"despues",label:"Después de danza",short:"Después",icon:Sparkles},
  {id:"casa",label:"En casa",short:"Casa",icon:Home},
];
type View="hoy"|"recetas"|"semana"|"compras";
const views=[{id:"hoy",label:"Hoy",icon:Sun},{id:"recetas",label:"Recetas",icon:Utensils},{id:"semana",label:"Mi semana",icon:CalendarDays},{id:"compras",label:"Compras",icon:ShoppingBag}];
const READER_CACHE="franapp-reader-v2";
const dayLabel=(key:string,format:Intl.DateTimeFormatOptions={weekday:"long",day:"numeric",month:"long"})=>new Date(key+"T12:00:00").toLocaleDateString("es-AR",format);

function Art({recipe,className=""}:{recipe:Recipe;className?:string}) {
  const tones=["tomato","cobalt","green","berry"];
  const tone=tones[(Number(recipe.id)-1)%tones.length];
  return <img src={`/art/${recipe.id}.png`} alt={`Ilustración de ${recipe.title.toLowerCase()}`} className={`recipe-art art-tone-${tone} ${className}`} loading="lazy" width="320" height="320" />;
}
function Choose({label,value,options,onChange}:{label:string;value:string;options:{value:string;label:string}[];onChange:(v:string)=>void}) {
  return <Select value={value} onValueChange={onChange}><SelectTrigger className="select-control" aria-label={label}><SelectValue /></SelectTrigger><SelectContent position="popper">{options.map(o=><SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>)}</SelectContent></Select>;
}

export default function RecipeApp() {
  const {entries,entriesRef,status,message,change,retry,canEdit}=useEntries();
  const [view,setView]=useState<View>("hoy");
  const [moment,setMoment]=useState<Moment>("cole");
  const [selected,setSelected]=useState<string|null>(null);
  const [query,setQuery]=useState("");const [taste,setTaste]=useState("all");const [speed,setSpeed]=useState("all");const [cold,setCold]=useState("all");const [collection,setCollection]=useState("all");const [oven,setOven]=useState(false);
  const [pantry,setPantry]=useState("");const [showPantry,setShowPantry]=useState(false);
  const [weekOffset,setWeekOffset]=useState(0);const [today,setToday]=useState<string>("");
  const [planPicker,setPlanPicker]=useState<string|null>(null);const [pickerQuery,setPickerQuery]=useState("");
  const [info,setInfo]=useState(false);const [shareFallback,setShareFallback]=useState("");
  const [offline,setOffline]=useState<"idle"|"saving"|"saved"|"error">("idle");
  const mainRef=useRef<HTMLElement>(null);const openRef=useRef<(id:string)=>void>(()=>{});
  const week=useMemo(()=>weekDays(weekOffset,today?new Date(today+"T12:00:00"):new Date(2026,8,10)),[weekOffset,today]);
  const recipe=selected?byId[selected]:null;
  const cart=Object.entries(entries).filter(([k,v])=>k.startsWith("cart:")&&Number(v)>0).map(([k,v])=>({recipe:byId[k.slice(5)],batches:Number(v)})).filter(c=>c.recipe);
  const items=useMemo(()=>shoppingItems(entries),[entries]);
  const checkedCount=items.filter(i=>entries[i.checkKey]===true).length;
  const favorites=recipes.filter(r=>entries[`favorite:${r.id}`]===true);

  useEffect(()=>{
    setToday(dateKey(new Date()));
    const sync=()=>{const p=new URLSearchParams(location.search);const id=p.get("receta");setSelected(id&&byId[id]?id:null);const v=p.get("vista") as View; if(views.some(x=>x.id===v))setView(v);};sync();window.addEventListener("popstate",sync);
    if("serviceWorker" in navigator)navigator.serviceWorker.register("/sw.js").catch(()=>{});
    if("caches" in window)caches.open(READER_CACHE).then(c=>c.match("/offline.html")).then(r=>{if(r)setOffline("saved");}).catch(()=>{});
    return()=>window.removeEventListener("popstate",sync);
  },[]);
  const navigate=useCallback((next:View)=>{setView(next);const url=new URL(location.href);url.searchParams.set("vista",next);url.searchParams.delete("receta");history.replaceState({},"",url);window.scrollTo({top:0,behavior:"instant"});},[]);
  const open=useCallback((id:string)=>{if(!byId[id])return;setSelected(id);const u=new URL(location.href);u.searchParams.set("receta",id);history.pushState({recipe:true},"",u);},[]);
  openRef.current=open;
  const closeRecipe=()=>{setSelected(null);const u=new URL(location.href);u.searchParams.delete("receta");history.replaceState({},"",u);};
  const toggle=(key:string)=>change([{key,value:entries[key]!==true}]);
  const saveChanges=(c:Change[],success?:string)=>{if(change(c)&&success)toast(success);};
  const addCart=(id:string,batches=1)=>saveChanges([{key:`cart:${id}`,value:Math.min(10,Number(entries[`cart:${id}`]||0)+batches)}],"Agregada a compras");
  const share=async(text:string,title="FranAPP")=>{
    if(navigator.share){try{await navigator.share({title,text});return;}catch(e){if((e as Error).name==="AbortError")return;}}
    try{await navigator.clipboard.writeText(text);toast("Copiado. Podés pegarlo en WhatsApp.");}catch{setShareFallback(text);}
  };
  const clearFilters=()=>{setQuery("");setTaste("all");setSpeed("all");setCold("all");setCollection("all");setOven(false);setPantry("");};
  const filtered=useMemo(()=>{
    const terms=normalize(query).split(/\s+/).filter(Boolean);
    const have=pantry.split(",").map(normalize).filter(Boolean);
    return recipes.filter(r=>{
      const hay=normalize([r.title,...r.ingredients.map(i=>i.name)].join(" "));
      return terms.every(t=>hay.includes(t))&&(taste==="all"||(taste==="sweet")===r.sweet)&&(speed==="all"||r.prep+r.cook+r.wait<=Number(speed))&&(cold==="all"||(cold==="cold")===r.cold)&&(!oven||!r.equipment.toLowerCase().includes("horno"))&&(collection==="all"||entries[`${collection}:${r.id}`]===true)&&(!have.length||have.some(t=>hay.includes(t)));
    }).sort((a,b)=>{
      if(!have.length)return 0;
      const score=(r:Recipe)=>r.ingredients.filter(i=>have.some(t=>normalize(i.name).includes(t))).length;
      return score(b)-score(a);
    });
  },[query,taste,speed,cold,oven,collection,pantry,entries]);
  const suggestions=recipes.filter(r=>r.moments.includes(moment));
  const featured=byId[moment==="cole"?"01":moment==="antes"?"26":moment==="despues"?"30":"22"];
  const todaysRecipes=today?planFor(entries,today):[];

  const downloadReader=async()=>{
    setOffline("saving");
    try{
      if(!("serviceWorker"in navigator)||!("caches"in window))throw new Error("Este navegador no permite guardar el recetario. Probá desde Safari.");
      const registration=await navigator.serviceWorker.register("/sw.js");
      const ready=await Promise.race([navigator.serviceWorker.ready,new Promise<never>((_,reject)=>setTimeout(()=>reject(new Error("No se pudo activar la lectura sin conexión. Reintentá.")),15000))]);
      if(!ready.active&&!registration.active)throw new Error("Reabrí la app para activar la lectura sin conexión.");
      const cache=await caches.open(READER_CACHE);
      const files=["/offline.html","/offline.js","/offline.css","/recipes-offline.json","/fonts/display.otf","/fonts/body.otf","/fonts/accent.otf",...recipes.map(r=>`/art/${r.id}.png`)];
      for(const file of files){const response=await fetch(file,{cache:"reload"});if(!response.ok||response.redirected)throw new Error("No se pudo descargar todo. Revisá la conexión y reintentá.");await cache.put(file,response);}
      setOffline("saved");toast("Las 30 recetas ya están disponibles sin conexión");
    }catch(e){setOffline("error");toast.error((e as Error).message);}
  };

  useEffect(()=>{
    type Tool={name:string;description:string;inputSchema:object;annotations:{readOnlyHint:boolean;untrustedContentHint:boolean};execute:(input:unknown)=>unknown};
    const ctx=(document as Document&{modelContext?:{registerTool:(tool:Tool,options:{signal:AbortSignal})=>void|Promise<void>}}).modelContext;
    if(!ctx?.registerTool)return;const lifecycle=new AbortController();
    const tools:Tool[]=[
      {name:"search_recipes",description:"Buscar recetas del recetario por nombre o ingrediente. No cambia favoritos ni la semana.",inputSchema:{type:"object",properties:{query:{type:"string"}},required:["query"],additionalProperties:false},annotations:{readOnlyHint:true,untrustedContentHint:false},execute(input){if(!input||typeof(input as {query?:unknown}).query!=="string")throw new Error("query debe ser texto");const q=normalize((input as {query:string}).query);return recipes.filter(r=>normalize(r.title+" "+r.ingredients.map(i=>i.name).join(" ")).includes(q)).map(r=>({id:r.id,title:r.title,time:timeText(r),needsRefrigeration:r.cold}));}},
      {name:"open_recipe",description:"Abrir la ficha de una receta en la interfaz. No modifica datos guardados.",inputSchema:{type:"object",properties:{recipeId:{type:"string"}},required:["recipeId"],additionalProperties:false},annotations:{readOnlyHint:false,untrustedContentHint:false},async execute(input){const id=(input as {recipeId?:string})?.recipeId;if(!id||!byId[id])throw new Error("Receta desconocida");openRef.current(id);await new Promise<void>(resolve=>requestAnimationFrame(()=>resolve()));return {opened:id,title:byId[id].title};}},
      {name:"read_shopping_list",description:"Leer los ingredientes y cantidades de la lista de compras actual, con su estado marcado.",inputSchema:{type:"object",properties:{},additionalProperties:false},annotations:{readOnlyHint:true,untrustedContentHint:false},execute(input){if(!input||typeof input!=="object"||Object.keys(input).length)throw new Error("No se aceptan parámetros");return shoppingItems(entriesRef.current).map(i=>({name:i.name,amount:i.amount,unit:i.unit,checked:entriesRef.current[i.checkKey]===true}));}},
    ];
    tools.forEach(tool=>{try{void Promise.resolve(ctx.registerTool(tool,{signal:lifecycle.signal})).catch(()=>{});}catch{}});return()=>lifecycle.abort();
  },[entriesRef]);

  const card=(r:Recipe,compact=false)=><article className={`recipe-card ${compact?"compact":""}`} key={r.id}>
    <button className="card-open" onClick={()=>open(r.id)} aria-label={`Ver receta: ${r.title}`}><div className="card-art"><span className="recipe-no">Nº {r.id}</span><Art recipe={r}/></div><div className="card-content"><p className="eyebrow">{r.sweet?"Algo dulce":"Algo salado"}</p><h3>{r.title}</h3><span className="meta"><Clock3 size={15}/>{timeText(r)}{r.cold&&<Snowflake size={15} aria-label="Necesita frío"/>}</span></div></button>
    <button className={`heart-btn ${entries[`favorite:${r.id}`]?"is-favorite":""}`} onClick={()=>toggle(`favorite:${r.id}`)} disabled={!canEdit} aria-label={`${entries[`favorite:${r.id}`]?"Quitar de":"Guardar en"} favoritas: ${r.title}`} aria-pressed={entries[`favorite:${r.id}`]===true}><Heart size={19}/></button>
  </article>;

  return <><a href="#main" className="skip-link">Ir al contenido</a><Tabs value={view} onValueChange={v=>navigate(v as View)} className="app-shell">
    <header className="app-header"><button className="brand" onClick={()=>navigate("hoy")} aria-label="FranAPP, inicio"><span className="brand-fran">Fran</span><span className="brand-app">APP</span><span className="brand-dot">✳</span></button><span className="header-note">COLE · DANZA · CASA</span><div className="header-actions"><button className="icon-button" aria-label="Ver mis favoritas" onClick={()=>{setCollection("favorite");navigate("recetas");}}><Heart size={21}/><span className="desktop-label">Mis favoritas</span></button><button className="icon-button" onClick={()=>setInfo(true)} aria-label="Ayuda y guardar en iPhone"><Info size={21}/></button></div></header>
    <main id="main" className="main-content" ref={mainRef}>
      {(status==="error"||status==="signin")&&<div className="save-banner" role="status"><p>{message}</p>{status==="signin"?<a href="/signin-with-chatgpt?return_to=%2F" target="_top">Iniciar sesión</a>:<button onClick={()=>void retry()}>Reintentar</button>}</div>}
      <TabsContent value="hoy" className="screen">
        <section className="home-masthead" aria-labelledby="home-title"><div className="home-title"><p className="eyebrow">HECHO A TU RITMO</p><h1 id="home-title"><span>¿Qué</span> <em>merendamos?</em></h1><p className="home-note">Ideas simples para el cole, antes o después de danza y las tardes en casa.</p></div><div className="fran-portrait-card"><span className="poster-label">HOLA, FRAN</span><img src="/fran-identity.png" alt="Retrato ilustrado de Fran con frutas y zapatillas de danza" width="1122" height="1402" loading="eager"/><span className="identity-caption">COLE · DANZA · CASA</span></div><p className="date-label">{today?dayLabel(today,{weekday:"long",day:"numeric",month:"short"}):"Hoy"}</p></section>
        <div className="moment-buttons" role="group" aria-label="¿Para qué momento buscás una merienda?">{moments.map(m=><button key={m.id} className={moment===m.id?"active":""} aria-pressed={moment===m.id} onClick={()=>setMoment(m.id)}><m.icon size={20}/><span>{m.label}</span></button>)}</div>
        <div className="today-layout"><section className="featured-recipe"><div className="featured-copy"><p className="eyebrow">UNA IDEA PARA {moment==="cole"?"LA MOCHILA":moment==="antes"?"ANTES DE SALIR":moment==="despues"?"LA VUELTA":"ESTA TARDE"}</p><h2>{featured.title}</h2><p>{featured.intro}</p><div className="feature-meta"><span><Clock3 size={17}/>{timeText(featured)}</span><span>{featured.cold?<Snowflake size={17}/>:<ShoppingBag size={17}/>} {featured.cold?"Llevar con frío":"Práctica para llevar"}</span></div><button className="primary-button" onClick={()=>open(featured.id)}>Vamos a prepararla <ArrowRight size={20}/></button></div><button className="featured-art" aria-label={`Abrir ${featured.title}`} onClick={()=>open(featured.id)}><span className="ingredient-note top">{featured.ingredients[0].name.toLowerCase()} ↘</span><Art recipe={featured}/><span className="ingredient-note bottom">↖ {featured.ingredients[1].name.toLowerCase()}</span></button></section>
          <aside className="today-note"><p className="eyebrow">EN TU SEMANA</p><h2>{todaysRecipes.length?"Ya tenés una idea":"Un ratito para vos"}</h2>{todaysRecipes.length?<div className="today-planned">{todaysRecipes.map(id=><button key={id} onClick={()=>open(id)}><Art recipe={byId[id]}/><span>{byId[id].title}</span><ArrowRight size={18}/></button>)}</div>:<><p>Elegí algo rico para hoy o dejá una merienda lista para mañana.</p><span className="small-stamp">HECHO<br/>EN CASA</span></>}<button className="text-button" onClick={()=>navigate("semana")}>Organizar mi semana <ArrowRight size={17}/></button></aside></div>
        <div className="section-heading"><h2>Más ideas para tu pausa</h2><button className="text-button" onClick={()=>{clearFilters();navigate("recetas");}}>Ver las 30 <ArrowRight size={17}/></button></div>
        <div className="recipe-grid home-grid">{suggestions.filter(r=>r.id!==featured.id).slice(0,4).map(r=>card(r))}</div>
        {(moment==="antes"||moment==="despues")&&<p className="gentle-note">Tus horarios, tu hambre y cómo te sentís también cuentan. Elegí la cantidad y el momento que te resulten cómodos.</p>}
        <button className="pantry-callout" onClick={()=>{setShowPantry(true);navigate("recetas");}}><span><p className="eyebrow">CON LO QUE HAY</p><strong>¿Tenés banana, avena o yogur?</strong><span>Buscá ideas con tus ingredientes.</span></span><ArrowRight size={26}/></button>
      </TabsContent>

      <TabsContent value="recetas" className="screen"><div className="page-top"><div><p className="eyebrow">DULCES, SALADAS, HECHAS POR VOS</p><h1>Tu recetario</h1></div><span className="count-stamp">30 <small>RECETAS</small></span></div>
        <div className="search-field"><Search size={21}/><input value={query} onChange={e=>setQuery(e.target.value)} placeholder="Buscá una receta o un ingrediente" aria-label="Buscar recetas"/>{query&&<button aria-label="Borrar búsqueda" onClick={()=>setQuery("")}><X size={18}/></button>}</div>
        <div className="collection-tabs" role="group" aria-label="Colección">{[{id:"all",label:"Todas"},{id:"favorite",label:`Favoritas${favorites.length?` · ${favorites.length}`:""}`},{id:"wish",label:"Quiero probar"}].map(x=><button key={x.id} aria-pressed={collection===x.id} className={collection===x.id?"active":""} onClick={()=>setCollection(x.id)}>{x.id==="favorite"&&<Heart size={16}/>} {x.label}</button>)}</div>
        <div className="filter-row"><Choose label="Sabor" value={taste} onChange={setTaste} options={[{value:"all",label:"Dulces y saladas"},{value:"sweet",label:"Dulces"},{value:"savory",label:"Saladas"}]}/><Choose label="Tiempo total" value={speed} onChange={setSpeed} options={[{value:"all",label:"Cualquier tiempo"},{value:"10",label:"Listas en 10 min"},{value:"20",label:"Listas en 20 min"}]}/><Choose label="Conservación" value={cold} onChange={setCold} options={[{value:"all",label:"Con o sin frío"},{value:"no",label:"Para llevar sin frío"},{value:"cold",label:"Necesitan frío"}]}/><label className="filter-checkbox"><Checkbox checked={oven} onCheckedChange={v=>setOven(v===true)}/> Sin horno</label><button className={`text-button ${showPantry?"selected-text":""}`} onClick={()=>setShowPantry(!showPantry)}>Tengo ingredientes <Plus size={16}/></button></div>
        {showPantry&&<div className="pantry-input"><label htmlFor="pantry">¿Qué hay en casa?</label><input id="pantry" value={pantry} onChange={e=>setPantry(e.target.value)} placeholder="Ej.: banana, avena, yogur"/><p>Separá con comas. Primero verás las recetas con más coincidencias; revisá también qué te falta.</p></div>}
        <div className="result-line"><span aria-live="polite">{filtered.length} {filtered.length===1?"receta":"recetas"}</span><button className="text-button" onClick={clearFilters}>Limpiar filtros</button></div>
        {filtered.length?<div className="recipe-grid">{filtered.map(r=>card(r))}</div>:<Empty className="empty-state"><Search size={32}/><EmptyTitle>No encontramos una receta con esos filtros</EmptyTitle><EmptyDescription>Probá con otro ingrediente o ampliá la búsqueda.</EmptyDescription><button className="primary-button" onClick={clearFilters}>Ver todas las recetas</button></Empty>}
      </TabsContent>

      <TabsContent value="semana" className="screen"><div className="page-top"><div><p className="eyebrow">UN POCO DE ORGANIZACIÓN</p><h1>Tu semana, resuelta</h1><p className="page-subtitle">Elegí tus meriendas. Podés cambiarlas cuando quieras.</p></div></div>
        <div className="week-toolbar"><div className="week-controls"><button className="icon-button" onClick={()=>setWeekOffset(x=>x-1)} aria-label="Semana anterior"><ChevronLeft/></button><strong>{dayLabel(week[0],{day:"numeric",month:"short"})} — {dayLabel(week[6],{day:"numeric",month:"short"})}</strong><button className="icon-button" onClick={()=>setWeekOffset(x=>x+1)} aria-label="Semana siguiente"><ChevronRight/></button></div>{weekOffset!==0&&<button className="text-button" onClick={()=>setWeekOffset(0)}>Esta semana</button>}<button className="secondary-button" disabled={!canEdit||!week.some(d=>planFor(entries,d).length)} onClick={()=>{
          const ids=[...new Set(week.flatMap(d=>planFor(entries,d)))];const changes=ids.filter(id=>!entries[`cart:${id}`]).map(id=>({key:`cart:${id}`,value:1}));if(changes.length)saveChanges(changes,"Recetas de la semana agregadas a compras");else toast("Estas recetas ya están en compras");navigate("compras");
        }}><ShoppingBag size={18}/> Agregar semana a compras</button></div>
        <div className="week-list">{week.map(date=>{const planned=planFor(entries,date);return <section className={`day-row ${date===today?"is-today":""}`} key={date}><div className="day-name"><p>{dayLabel(date,{weekday:"long"})}{date===today&&<span>HOY</span>}</p><strong>{dayLabel(date,{day:"numeric"})}</strong><label className="dance-check"><Checkbox disabled={!canEdit} checked={entries[`dance:${date}`]===true} onCheckedChange={()=>toggle(`dance:${date}`)}/>Tengo danza</label></div><div className="day-recipes">{planned.map(id=><div className="planned-recipe" key={id}><button onClick={()=>open(id)}><Art recipe={byId[id]}/><span>{byId[id].title}<small>{byId[id].cold?"Llevar con frío":"Revisá cómo llevarla"}</small></span></button><button className="icon-button" disabled={!canEdit} onClick={()=>toggle(`plan:${date}:${id}`)} aria-label={`Quitar ${byId[id].title} del ${dayLabel(date)}`}><X size={17}/></button></div>)}<button className="add-recipe" disabled={!canEdit} onClick={()=>{setPickerQuery("");setPlanPicker(date);}}><Plus size={19}/>{planned.length?"Sumar otra":"Elegir merienda"}</button></div></section>;})}</div>
        <p className="gentle-note">Una misma tanda puede alcanzar para varios días. En Compras elegís cuántas tandas preparar.</p>
      </TabsContent>

      <TabsContent value="compras" className="screen"><div className="page-top"><div><p className="eyebrow">DEL RECETARIO A LA COCINA</p><h1>Lo que hace falta</h1><p className="page-subtitle">Tachá lo que ya tenés y llevate el resto de la lista.</p></div>{items.length>0&&<button className="secondary-button" onClick={()=>void share("Mi lista de compras · FranAPP\n\n"+items.filter(i=>entries[i.checkKey]!==true).map(i=>`□ ${ingredientText(i)}`).join("\n"))}><Share2 size={18}/> Compartir</button>}</div>
        {!cart.length?<Empty className="empty-state"><ShoppingBag size={38}/><EmptyTitle>Tu próxima merienda empieza acá</EmptyTitle><EmptyDescription>Agregá una receta a compras o traé las que elegiste para tu semana.</EmptyDescription><button className="primary-button" onClick={()=>navigate("recetas")}>Elegir recetas <ArrowRight size={18}/></button></Empty>:<div className="shopping-layout"><aside className="cart-summary"><h2>Voy a preparar</h2><p>Las cantidades corresponden a recetas completas.</p>{cart.map(({recipe:r,batches})=><div className="cart-recipe" key={r.id}><button className="cart-title" onClick={()=>open(r.id)}><Art recipe={r}/><span>{r.title}<small>Rinde {r.yield*batches} {r.yieldUnit}</small></span></button><div className="cart-controls"><div className="stepper"><button aria-label={`Reducir tandas de ${r.title}`} disabled={!canEdit||batches<=1} onClick={()=>change([{key:`cart:${r.id}`,value:batches-1}])}><Minus size={16}/></button><span>{batches} {batches===1?"tanda":"tandas"}</span><button aria-label={`Aumentar tandas de ${r.title}`} disabled={!canEdit||batches>=10} onClick={()=>change([{key:`cart:${r.id}`,value:batches+1}])}><Plus size={16}/></button></div><button className="text-button" disabled={!canEdit} onClick={()=>saveChanges([{key:`cart:${r.id}`,value:0}],"Receta quitada de compras")}>Quitar</button></div></div>)}</aside><div className="shopping-list"><div className="shopping-progress"><span>{checkedCount} de {items.length} ingredientes marcados</span>{checkedCount>0&&<button className="text-button" onClick={()=>change(items.filter(i=>entries[i.checkKey]===true).map(i=>({key:i.checkKey,value:false})))}>Desmarcar</button>}</div>{["Verdulería","Heladera","Almacén"].map(group=>{const groupItems=items.filter(i=>i.group===group);return groupItems.length?<section className="shopping-group" key={group}><h2>{group}</h2>{groupItems.map(i=><label className={`shopping-item ${entries[i.checkKey]?"checked":""}`} key={i.key}><Checkbox disabled={!canEdit} checked={entries[i.checkKey]===true} onCheckedChange={()=>toggle(i.checkKey)}/><span>{i.name}</span><strong>{i.amount?`${amountText(i.amount)} ${i.unit}`:"a gusto"}</strong></label>)}</section>:null;})}<p className="gentle-note">Las cantidades son para preparar las recetas. Las frutas varían de tamaño; las medidas caseras son aproximadas.</p></div></div>}
      </TabsContent>
    </main>
    <footer className="app-footer"><span>Hecho para Fran, a su ritmo.</span><span>{status==="saving"?"Guardando…":status==="loading"?"Cargando tus elecciones…":status==="ready"?"Tus elecciones están guardadas":""}</span></footer>
    <nav className="bottom-nav" aria-label="Navegación principal"><TabsList>{views.map(v=><TabsTrigger value={v.id} key={v.id}><v.icon size={22}/><span>{v.label}</span>{v.id==="compras"&&cart.length>0&&<span className="nav-badge">{cart.length}</span>}</TabsTrigger>)}</TabsList></nav>
  </Tabs>

  <Sheet open={!!recipe} onOpenChange={o=>{if(!o)closeRecipe();}}><SheetContent className="recipe-sheet" side="right" showCloseButton={false}>{recipe&&<RecipeDetail key={recipe.id} recipe={recipe} favorite={entries[`favorite:${recipe.id}`]===true} wish={entries[`wish:${recipe.id}`]===true} note={String(entries[`note:${recipe.id}`]??"")} onNote={value=>change([{key:`note:${recipe.id}`,value}])} canEdit={canEdit} onFavorite={()=>toggle(`favorite:${recipe.id}`)} onWish={()=>toggle(`wish:${recipe.id}`)} onClose={closeRecipe} onAddCart={b=>addCart(recipe.id,b)} onPlan={()=>{const id=recipe.id;closeRecipe();navigate("semana");setPickerQuery(byId[id].title);setPlanPicker(today||week[0]);}}/>}</SheetContent></Sheet>
  <Dialog open={!!planPicker} onOpenChange={o=>{if(!o)setPlanPicker(null);}}><DialogContent className="picker-dialog" showCloseButton={false}><div className="modal-title-row"><div><DialogTitle>Elegí una merienda</DialogTitle><DialogDescription>{planPicker?dayLabel(planPicker):""}</DialogDescription></div><button className="icon-button" onClick={()=>setPlanPicker(null)} aria-label="Cerrar selección"><X/></button></div><div className="search-field"><Search size={18}/><input autoFocus value={pickerQuery} onChange={e=>setPickerQuery(e.target.value)} placeholder="Buscar receta" aria-label="Buscar receta para este día"/></div><div className="picker-results">{recipes.filter(r=>normalize(r.title).includes(normalize(pickerQuery))).map(r=><button key={r.id} disabled={!canEdit} onClick={()=>{if(planPicker)saveChanges([{key:`plan:${planPicker}:${r.id}`,value:true}],"Merienda agregada a tu semana");setPlanPicker(null);}}><Art recipe={r}/><span><strong>{r.title}</strong><small>{timeText(r)}</small></span>{planPicker&&entries[`plan:${planPicker}:${r.id}`]?<Check size={20}/>:<Plus size={20}/>}</button>)}{!recipes.some(r=>normalize(r.title).includes(normalize(pickerQuery)))&&<p>No hay coincidencias. Probá con otra palabra.</p>}</div></DialogContent></Dialog>
  <Dialog open={info} onOpenChange={setInfo}><DialogContent className="help-dialog" showCloseButton={false}><div className="modal-title-row"><DialogTitle>Siempre a mano</DialogTitle><button className="icon-button" onClick={()=>setInfo(false)} aria-label="Cerrar ayuda"><X/></button></div><DialogDescription>Tu recetario, también en la pantalla de inicio.</DialogDescription><h3>En tu iPhone</h3><ol><li>Abrí este enlace en Safari.</li><li>Tocá Compartir y “Agregar a inicio”.</li><li>Si aparece “Abrir como app web”, activalo y tocá Agregar.</li></ol><h3>Cuando no hay conexión</h3><p>Guardá las 30 recetas para leer ingredientes y pasos sin internet. Para guardar cambios en favoritos, semana y compras necesitás conexión.</p><button className="primary-button" onClick={()=>void downloadReader()} disabled={offline==="saving"}><ArrowDownToLine size={18}/>{offline==="saving"?"Guardando recetas…":offline==="saved"?"Actualizar recetas guardadas":"Guardar recetario sin conexión"}</button>{offline==="saved"&&<a className="text-button" href="/offline.html">Abrir recetas descargadas <ArrowRight size={17}/></a>}<h3>Tus elecciones</h3><p>Favoritas, notas, semana y compras se guardan en tu cuenta. Compartir una lista envía una copia del texto; cada persona conserva sus propias elecciones.</p></DialogContent></Dialog>
  <Dialog open={!!shareFallback} onOpenChange={o=>{if(!o)setShareFallback("");}}><DialogContent><DialogTitle>Copiá tu lista</DialogTitle><DialogDescription>Mantené presionado el texto para copiarlo y compartirlo.</DialogDescription><textarea className="share-text" value={shareFallback} readOnly onFocus={e=>e.target.select()}/></DialogContent></Dialog>
  <Toaster theme="light" position="top-center" richColors closeButton/>
  </>;
}

function RecipeDetail({recipe:r,favorite,wish,note,onNote,canEdit,onFavorite,onWish,onClose,onAddCart,onPlan}:{recipe:Recipe;favorite:boolean;wish:boolean;note:string;onNote:(value:string)=>void;canEdit:boolean;onFavorite:()=>void;onWish:()=>void;onClose:()=>void;onAddCart:(b:number)=>void;onPlan:()=>void}) {
  const [batches,setBatches]=useState(1);const [checked,setChecked]=useState<string[]>([]);const [cookStep,setCookStep]=useState<number|null>(null);const [draft,setDraft]=useState(note);const [noteChanged,setNoteChanged]=useState(false);
  useEffect(()=>{if(!noteChanged)setDraft(note);},[note,noteChanged]);
  return <><div className="recipe-topbar"><button className="icon-button" onClick={()=>cookStep===null?onClose():setCookStep(null)} aria-label={cookStep===null?"Cerrar receta":"Salir del modo cocina"}><ArrowLeft size={21}/></button><span>{cookStep===null?`RECETA Nº ${r.id}`:"MODO COCINA"}</span><button className={`icon-button ${favorite?"is-favorite":""}`} onClick={onFavorite} disabled={!canEdit} aria-label={favorite?"Quitar de favoritas":"Guardar en favoritas"} aria-pressed={favorite}><Heart size={21}/></button></div>
    <div className="detail-scroll"><div className="detail-heading"><p className="eyebrow">{r.sweet?"UNA PAUSA DULCE":"UNA PAUSA SALADA"}</p><SheetTitle>{r.title}</SheetTitle><SheetDescription>{r.intro}</SheetDescription></div>
      {cookStep!==null?<div className="cook-mode"><p className="eyebrow">PASO {cookStep+1} DE {r.steps.length}</p><div className="step-progress" aria-label={`Paso ${cookStep+1} de ${r.steps.length}`}>{r.steps.map((_,i)=><span key={i} className={i<=cookStep?"active":""}/>)}</div><p className="cook-text" aria-live="polite">{r.steps[cookStep]}</p><div className="cook-actions"><button className="secondary-button" disabled={cookStep===0} onClick={()=>setCookStep(s=>(s??1)-1)}><ChevronLeft/>Anterior</button><button className="primary-button" onClick={()=>cookStep===r.steps.length-1?setCookStep(null):setCookStep(cookStep+1)}>{cookStep===r.steps.length-1?"¡Listo!":"Siguiente"}<ChevronRight/></button></div><details><summary>Ver ingredientes</summary><ul className="plain-ingredients">{r.ingredients.map(i=><li key={i.name}>{ingredientText(i,batches)}</li>)}</ul></details></div>:<>
      <div className="detail-illustration"><span className="ingredient-note top">{r.ingredients[0].name.toLowerCase()} ↘</span><Art recipe={r}/><span className="ingredient-note bottom">↖ {r.ingredients[1].name.toLowerCase()}</span></div>
      <div className="detail-facts"><div><Clock3 size={19}/><strong>{r.prep} min</strong><span>Preparación</span></div><div>{r.cook?<Utensils size={19}/>:<Snowflake size={19}/>}<strong>{r.cook?`${r.cook} min`:r.wait?`${r.wait>=60?amountText(r.wait/60)+" h":r.wait+" min"}`:"Sin cocción"}</strong><span>{r.cook?"Cocción":r.wait?"En frío":"Lista al armar"}</span></div><div><ShoppingBag size={19}/><strong>{r.yield*batches}</strong><span>{r.yieldUnit}</span></div></div>
      {r.cook>0&&r.wait>0&&<p className="small-note">Además: {r.wait} minutos de reposo.</p>}
      <div className="detail-actions"><button className="primary-button" onClick={()=>setCookStep(0)}>Empezar a cocinar <ArrowRight size={19}/></button><button className="icon-button" disabled={!canEdit} aria-pressed={wish} aria-label={wish?"Quitar de quiero probar":"Guardar en quiero probar"} onClick={onWish}><Bookmark size={22} fill={wish?"currentColor":"none"}/></button></div>
      <section className="ingredients-section"><div className="section-heading"><h2>Lo que necesitás</h2><div className="stepper"><button aria-label="Reducir tandas" disabled={batches===1} onClick={()=>setBatches(batches-1)}><Minus size={16}/></button><span>{batches} {batches===1?"tanda":"tandas"}</span><button aria-label="Aumentar tandas" disabled={batches===4} onClick={()=>setBatches(batches+1)}><Plus size={16}/></button></div></div><p className="small-note">Rinde {r.yield*batches} {r.yieldUnit}. Elegí cuánto comer según tu hambre.</p><div>{r.ingredients.map(i=><label key={i.name} className={`ingredient-row ${checked.includes(i.name)?"checked":""}`}><Checkbox checked={checked.includes(i.name)} onCheckedChange={v=>setChecked(c=>v?[...c,i.name]:c.filter(x=>x!==i.name))}/><span>{i.name}<small>{i.note?(batches>1&&/taza|cda|cdita/.test(i.note)?"Las cantidades aumentan con las tandas.":i.note):""}</small></span><strong>{i.amount?`${amountText(i.amount*batches)} ${i.unit}`:"a gusto"}</strong></label>)}</div><button className="secondary-button full-width" disabled={!canEdit} onClick={()=>onAddCart(batches)}><ShoppingBag size={18}/> Agregar ingredientes a compras</button></section>
      <section className="steps-section"><h2>Manos a la cocina</h2><p className="small-note">Vas a usar: {r.equipment.toLowerCase()}.</p><ol>{r.steps.map((s,i)=><li key={i}><span className="step-number">{String(i+1).padStart(2,"0")}</span><p>{s}</p></li>)}</ol></section>
      <section className="care-box"><div className="care-heading"><Snowflake size={20}/><h3>{r.cold?"Conservá con frío":"Cómo guardarla"}</h3></div><p>{r.storage}</p>{r.cold&&<p className="small-note">Heladera a 4 °C o menos. Para llevar, bolsa térmica con refrigerante. Evitá más de 2 horas sin frío, o 1 hora si hace más de 32 °C.</p>}</section>
      <section className="swap-section"><h3>Podés cambiarlo</h3><p>{r.swap}</p></section>
      <details className="allergens"><summary>Ingredientes a tener en cuenta</summary><p>{r.allergens.length?r.allergens.join(" · "):"Revisá los rótulos y posibles trazas de los ingredientes que uses."}</p>{r.allergens.length>0&&<p className="small-note">Los reemplazos pueden cambiar los alérgenos. Revisá los envases.</p>}</details>
      <section className="note-section"><label htmlFor={`note-${r.id}`}>Una nota para la próxima</label><textarea id={`note-${r.id}`} value={draft} maxLength={1000} disabled={!canEdit} onChange={e=>{setDraft(e.target.value);setNoteChanged(true);}} placeholder="Ej.: me gusta más con pera…"/><button className="text-button" disabled={!canEdit||!noteChanged} onClick={()=>{onNote(draft);setNoteChanged(false);toast("Guardando tu nota");}}>Guardar nota <Check size={16}/></button></section>
      <button className="primary-button full-width" disabled={!canEdit} onClick={onPlan}><CalendarDays size={18}/> Elegir un día para prepararla</button>
    </>}</div></>;
}
