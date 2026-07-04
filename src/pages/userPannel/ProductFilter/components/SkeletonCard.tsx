import React from "react";
import { C } from "../constants";

export default function SkeletonCard() {
  return (
    <div className="flex flex-col gap-3">
      <div
        className="rounded-2xl animate-pulse"
        style={{ aspectRatio: "4/5", background: C.card }}
      />
      <div
        className="h-2.5 w-1/3 rounded animate-pulse"
        style={{ background: C.card }}
      />
      <div
        className="h-3 w-2/3 rounded animate-pulse"
        style={{ background: C.card }}
      />
      <div
        className="h-3 w-1/2 rounded animate-pulse"
        style={{ background: C.card }}
      />
    </div>
  );
}
