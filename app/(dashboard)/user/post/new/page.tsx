"use client";

import { ScrollArea } from "@/components/ui/scroll-area";

import FacebookComposer from "../_components/facebook-composer/FacebookComposer";

export default function IntegratedApp() {
  return (
    <div className="min-h-screen bg-background mt-10">
      <ScrollArea className="">
        <div className="mx-auto p-6">
          <FacebookComposer />
        </div>
      </ScrollArea>
    </div>
  );
}
