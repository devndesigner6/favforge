import React from "react";

const Header: React.FC = () => {
  return (
    <header className="border-b border-border">
      <div className="flex items-center justify-between px-6 py-4 max-w-7xl mx-auto">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 bg-primary rounded-sm flex items-center justify-center">
            <span className="text-primary-foreground text-xs font-mono font-bold">F</span>
          </div>
          <span className="font-mono text-sm uppercase tracking-widest text-foreground">Favicraft</span>
        </div>
        <nav className="hidden md:flex items-center gap-8">
          <span className="font-mono text-xs uppercase tracking-wider text-muted-foreground hover:text-foreground cursor-pointer transition-colors">Generator</span>
          <span className="font-mono text-xs uppercase tracking-wider text-muted-foreground hover:text-foreground cursor-pointer transition-colors">Icons</span>
          <span className="font-mono text-xs uppercase tracking-wider text-muted-foreground hover:text-foreground cursor-pointer transition-colors">About</span>
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
