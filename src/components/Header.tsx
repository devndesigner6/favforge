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
