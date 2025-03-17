import React from "react";

export default function Loading() {
  return (
    <div className="animate-pulse space-y-8 m-8">
      <div className="space-y-4">
        <div className="bg-border/40 h-10 max-w-xl" />
        <div className="bg-border/40 h-6 w-48" />
      </div>
      <div className="grid grid-cols-4 rounded-lg border">
        {Array(4)
          .fill(0)
          .map((d, i) => (
            <div
              key={i}
              className="bg-border/40 h-96 border-r last:border-none"
            />
          ))}
      </div>
      <div className="grid grid-cols-5 gap-4">
        <div className="bg-border/40 col-span-3 h-96 rounded-lg border" />
        <div className="bg-border/40 col-span-2 h-96 rounded-lg border" />
      </div>
    </div>
  );
}
