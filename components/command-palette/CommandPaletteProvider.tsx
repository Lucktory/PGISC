"use client";

import * as React from "react";

import { CommandPalette } from "./CommandPalette";
import { ShortcutsHelp } from "./ShortcutsHelp";

export function CommandPaletteProvider() {
  const [open, setOpen] = React.useState(false);
  const [shortcutsOpen, setShortcutsOpen] = React.useState(false);

  React.useEffect(() => {
    function handler(e: KeyboardEvent) {
      const isMac = navigator.platform.toUpperCase().includes("MAC");
      const mod = isMac ? e.metaKey : e.ctrlKey;
      if (mod && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen((o) => !o);
      }
      if (e.key === "?" && !mod && !e.altKey) {
        const target = e.target as HTMLElement;
        const tag = target?.tagName?.toLowerCase();
        if (tag !== "input" && tag !== "textarea") {
          e.preventDefault();
          setShortcutsOpen(true);
        }
      }
    }
    function openPalette() {
      setOpen(true);
    }
    window.addEventListener("keydown", handler);
    window.addEventListener("pgisc:open-cmdk", openPalette);
    return () => {
      window.removeEventListener("keydown", handler);
      window.removeEventListener("pgisc:open-cmdk", openPalette);
    };
  }, []);

  return (
    <>
      <CommandPalette
        open={open}
        onOpenChange={setOpen}
        onOpenShortcuts={() => setShortcutsOpen(true)}
      />
      <ShortcutsHelp open={shortcutsOpen} onOpenChange={setShortcutsOpen} />
    </>
  );
}
