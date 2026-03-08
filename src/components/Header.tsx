import React from "react";
import logo from "@/assets/logo.png";

const Header: React.FC = () => {
  return (
    <header className="border-b border-border">
      <div className="flex items-center justify-between px-6 py-4 max-w-7xl mx-auto">
        <div className="flex items-center gap-2">
          <img src={logo} alt="FavForge logo" className="w-7 h-7 rounded-sm" />
          <span className="font-mono text-sm uppercase tracking-widest text-foreground">FavForge</span>
        </div>
        <nav className="hidden md:flex items-center gap-8">
          <span className="font-mono text-xs uppercase tracking-wider text-muted-foreground hover:text-foreground cursor-pointer transition-colors">Generator</span>
          <span className="font-mono text-xs uppercase tracking-wider text-muted-foreground hover:text-foreground cursor-pointer transition-colors">Icons</span>
          <a href="https://github.com/hemanthme/favforge" target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 font-mono text-xs uppercase tracking-wider text-muted-foreground hover:text-foreground cursor-pointer transition-colors">
            <svg viewBox="0 0 16 16" className="w-4 h-4 fill-current" aria-hidden="true"><path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.01 8.01 0 0016 8c0-4.42-3.58-8-8-8z"/></svg>
            <span>GitHub</span>
          </a>
        </nav>
        <div className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
          v1.0 — 2026
        </div>
      </div>
      <div className="bg-card px-6 py-1.5 border-t border-border">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <span className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">Favicon Generation Studio</span>
          <span className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">Custom Icon Builder</span>
        </div>
      </div>
    </header>
  );
};

export default Header;
