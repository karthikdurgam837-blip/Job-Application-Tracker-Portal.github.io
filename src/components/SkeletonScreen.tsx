/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";

export function SkeletonDashboard() {
  return (
    <div className="space-y-6 animate-pulse p-1">
      {/* 4 Stats Cards row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="bg-white p-5 h-24 rounded-2xl border border-slate-100 flex flex-col justify-between shadow-sm">
            <div className="h-3 w-16 bg-slate-200 rounded animate-skeleton" />
            <div className="h-6 w-24 bg-slate-200 rounded animate-skeleton mt-1" />
            <div className="h-2 w-20 bg-slate-200 rounded animate-skeleton mt-2" />
          </div>
        ))}
      </div>

      {/* Main Grid Double blocks */}
      <div className="grid md:grid-cols-5 gap-6">
        <div className="md:col-span-3 bg-white p-5 h-80 rounded-2xl border border-slate-100 flex flex-col justify-between shadow-sm">
          <div className="flex justify-between items-center pb-3 border-b border-slate-100">
            <div className="h-4 w-1/3 bg-slate-200 rounded animate-skeleton" />
            <div className="h-3 w-16 bg-slate-200 rounded animate-skeleton" />
          </div>
          <div className="space-y-3.5 flex-1 pt-4">
            {[1, 2, 3, 4, 5].map((item) => (
              <div key={item} className="grid grid-cols-12 gap-3 items-center">
                <div className="col-span-3 h-3 bg-slate-150 rounded animate-skeleton" />
                <div className="col-span-8 h-4 bg-slate-100 rounded animate-skeleton" />
                <div className="col-span-1 h-3 bg-slate-150 rounded animate-skeleton" />
              </div>
            ))}
          </div>
        </div>

        <div className="md:col-span-2 bg-white p-5 h-80 rounded-2xl border border-slate-100 flex flex-col justify-between shadow-sm">
          <div className="h-4 w-1/2 bg-slate-150 rounded animate-skeleton pb-2 border-b border-slate-100" />
          <div className="flex-1 mt-4 rounded-xl bg-slate-50 border border-slate-100 animate-skeleton" />
        </div>
      </div>
    </div>
  );
}

export function SkeletonKanban() {
  return (
    <div className="space-y-6 animate-pulse p-1">
      {/* Header controls skeleton */}
      <div className="bg-white p-4 h-14 rounded-xl border border-slate-100 flex justify-between items-center shadow-sm">
        <div className="flex gap-3">
          <div className="h-7 w-48 bg-slate-150 rounded-lg animate-skeleton" />
          <div className="h-7 w-36 bg-slate-100 rounded-lg animate-skeleton" />
        </div>
        <div className="h-7 w-28 bg-slate-200 rounded-lg animate-skeleton" />
      </div>

      {/* 4 Column Blocks */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((col) => (
          <div key={col} className="bg-slate-50 border border-slate-100 p-4 rounded-2xl h-[420px] space-y-4 shadow-inner">
            <div className="flex justify-between items-center bg-white p-2.5 rounded-xl border border-slate-100">
              <div className="h-3.5 w-20 bg-slate-200 rounded animate-skeleton" />
              <div className="h-5 w-6 bg-slate-150 rounded-md animate-skeleton" />
            </div>

            <div className="space-y-3 pt-1">
              {[1, 2].map((card) => (
                <div key={card} className="bg-white p-4 h-28 rounded-xl border border-slate-150/70 flex flex-col justify-between space-y-3">
                  <div className="space-y-1.5">
                    <div className="h-2.5 w-16 bg-slate-150 rounded animate-skeleton" />
                    <div className="h-3.5 w-3/4 bg-slate-200 rounded animate-skeleton" />
                  </div>
                  <div className="h-2 w-1/2 bg-slate-100 rounded animate-skeleton" />
                  <div className="flex justify-between pt-1 border-t border-slate-100">
                    <div className="h-4.5 w-12 bg-slate-150 rounded animate-skeleton" />
                    <div className="h-4.5 w-6 bg-slate-150 rounded animate-skeleton" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
