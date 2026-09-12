"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { Change, Entries } from "@/lib/state";

const STORAGE_KEY = "franapp:entries:v1";

export function useEntries() {
  const [entries, setEntries] = useState<Entries>({});
  const entriesRef = useRef<Entries>({});
  const loaded = useRef(false);
  const [status, setStatus] = useState<"loading" | "ready" | "saving" | "error" | "signin">("loading");
  const [message, setMessage] = useState("");

  const commitLocal = useCallback((next: Entries) => {
    entriesRef.current = next;
    setEntries(next);
  }, []);

  const reload = useCallback(() => {
    setStatus("loading");
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      const parsed: unknown = raw ? JSON.parse(raw) : {};
      if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) throw new Error();
      commitLocal(parsed as Entries);
      loaded.current = true;
      setStatus("ready");
      setMessage("");
    } catch {
      loaded.current = true;
      commitLocal({});
      setStatus("error");
      setMessage("No pudimos leer tus elecciones guardadas. Podés seguir usando el recetario.");
    }
  }, [commitLocal]);

  useEffect(() => {
    reload();
  }, [reload]);

  const change = useCallback((changes: Change[]) => {
    if (!loaded.current) return false;
    const next = { ...entriesRef.current };
    changes.forEach(({ key, value }) => { next[key] = value; });
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      commitLocal(next);
      setStatus("ready");
      setMessage("");
      return true;
    } catch {
      setStatus("error");
      setMessage("No se pudo guardar en este dispositivo. Revisá el espacio disponible del navegador.");
      return false;
    }
  }, [commitLocal]);

  return { entries, entriesRef, status, message, change, retry: reload, canEdit: loaded.current };
}
