const CORE="franapp-core-v3";
const READER="franapp-reader-v2";
const CORE_FILES=["/offline.html","/offline.js","/offline.css","/recipes-offline.json","/icon-192.png","/fonts/display.otf","/fonts/body.otf","/fonts/accent.otf"];
self.addEventListener("install",event=>event.waitUntil(caches.open(CORE).then(cache=>cache.addAll(CORE_FILES)).then(()=>self.skipWaiting())));
self.addEventListener("activate",event=>event.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>(k.startsWith("franapp-core-")&&k!==CORE)||((k.startsWith("franapp-reader-")||k.startsWith("entre-clases-reader-"))&&k!==READER)).map(k=>caches.delete(k)))).then(()=>self.clients.claim())));
self.addEventListener("fetch",event=>{
  if(event.request.method!=="GET")return;
  const url=new URL(event.request.url);if(url.origin!==location.origin)return;
  if(event.request.mode==="navigate")event.respondWith(fetch(event.request).catch(()=>caches.match("/offline.html")));
  else if(url.pathname.startsWith("/art/")||url.pathname.startsWith("/fonts/")||["/offline.js","/offline.css","/recipes-offline.json","/icon-192.png"].includes(url.pathname))event.respondWith(caches.match(event.request).then(hit=>hit||fetch(event.request).then(response=>{const copy=response.clone();caches.open(READER).then(cache=>cache.put(event.request,copy));return response;})));
});
