"use client";
import React from "react";

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="font-heading font-bold text-3xl tracking-tight text-foreground">
          Dashboard
        </h1>
      </div>
      <p className="text-gray-500 dark:text-gray-400">
        Welcome to your ResumeFlow Career Dashboard.
      </p>
    </div>
  );
}
