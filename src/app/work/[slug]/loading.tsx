import React from 'react';
import { ChevronLeft } from 'lucide-react';
import { SectionHeader } from '@/components/ui/SectionHeader';

export default function LoadingCaseStudy() {
  return (
    <div className="flex flex-col gap-16 pb-16 animate-pulse">
      {/* Back Button Skeleton */}
      <div className="pt-4">
        <div className="flex items-center text-muted-foreground">
          <ChevronLeft size={16} className="mr-1" />
          <div className="h-4 w-24 bg-muted rounded"></div>
        </div>
      </div>

      {/* HERO SECTION Skeleton */}
      <section className="space-y-6">
        <div className="space-y-4">
          <div className="flex flex-wrap items-center gap-3">
            <div className="h-6 w-20 bg-muted rounded-full"></div>
            <div className="h-6 w-24 bg-muted rounded-full"></div>
            <div className="h-4 w-16 bg-muted rounded ml-auto"></div>
          </div>
          <div className="h-16 md:h-20 w-3/4 bg-muted rounded-xl"></div>
          <div className="h-6 w-full max-w-3xl bg-muted rounded"></div>
          <div className="h-6 w-2/3 max-w-3xl bg-muted rounded"></div>
        </div>
        <div className="aspect-[21/9] w-full rounded-2xl bg-muted overflow-hidden relative"></div>
      </section>

      {/* PROBLEM & SOLUTION Skeleton */}
      <section className="grid md:grid-cols-2 gap-8 lg:gap-16">
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-muted"></div>
            <div className="h-8 w-40 bg-muted rounded"></div>
          </div>
          <div className="space-y-2">
            <div className="h-5 w-full bg-muted rounded"></div>
            <div className="h-5 w-full bg-muted rounded"></div>
            <div className="h-5 w-5/6 bg-muted rounded"></div>
          </div>
        </div>
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-muted"></div>
            <div className="h-8 w-40 bg-muted rounded"></div>
          </div>
          <div className="space-y-2">
            <div className="h-5 w-full bg-muted rounded"></div>
            <div className="h-5 w-full bg-muted rounded"></div>
            <div className="h-5 w-4/6 bg-muted rounded"></div>
          </div>
        </div>
      </section>

      {/* RESULTS METRICS Skeleton */}
      <section>
        <SectionHeader badge="Impact" title="Measurable Results" />
        <div className="grid sm:grid-cols-3 gap-6 mt-8">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-40 rounded-2xl bg-card border border-border p-8 flex flex-col items-center justify-center space-y-4">
              <div className="h-12 w-24 bg-muted rounded"></div>
              <div className="h-4 w-16 bg-muted rounded"></div>
            </div>
          ))}
        </div>
      </section>

      {/* TECH DEEP DIVE Skeleton */}
      <section>
        <div className="bg-card/50 border border-border rounded-3xl p-8 md:p-12 space-y-8">
          <div className="h-10 w-64 bg-muted rounded"></div>
          <div className="space-y-3">
            <div className="h-5 w-full bg-muted rounded"></div>
            <div className="h-5 w-11/12 bg-muted rounded"></div>
            <div className="h-5 w-4/5 bg-muted rounded"></div>
          </div>
          <div className="flex flex-wrap gap-3">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-10 w-24 bg-muted rounded-lg"></div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
