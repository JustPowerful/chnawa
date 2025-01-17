"use client";
import { Button } from "@/components/ui/button";
import { Save } from "lucide-react";
import React from "react";

const DownloadButton = () => {
  return (
    <div className="print:hidden fixed bottom-0 left-0 w-full flex items-center justify-center p-4 z-[9999]">
      <Button
        variant="notion"
        onClick={() => window.print()}
        className="border-2 border-black text-md hover:scale-105 active:scale-95 transition-transform hover:bg-zinc-200"
      >
        <Save size={22} /> Save/Print PDF
      </Button>
    </div>
  );
};

export default DownloadButton;
