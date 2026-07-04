"use client";
import React, { useState } from "react";
import { Sidebar } from "./Sidebar";

export const AppShell = ({ children }: { children: React.ReactNode }) => {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className="flex min-h-screen bg-background text-foreground transition-colors duration-200">
      <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} />

      {/* Primary Page Content Wrapper */}
      <div
        className={`flex flex-col flex-1 min-h-screen transition-all duration-300 ${
          collapsed ? "pl-16" : "pl-60"
        }`}
      >
        <main className="flex-1 p-6 lg:p-8">{children}</main>
      </div>
    </div>
  );
};
