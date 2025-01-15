"use client";
import { Save } from "lucide-react";
import React from "react";

const DownloadButton = () => {
  return (
    <div className="print:hidden fixed bottom-0 left-0 w-full flex items-center justify-center p-4 z-[9999]">
      <button
        onClick={() => window.print()}
        className="bg-blue-500 text-white p-2 rounded-lg flex items-center gap-1 cursor-pointer"
      >
        <Save size={22} /> Save/Print PDF
      </button>
    </div>
  );
};

export default DownloadButton;
