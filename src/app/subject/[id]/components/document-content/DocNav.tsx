"use client";
import { FC, useEffect } from "react";
import { Inter } from "next/font/google";
import { cn, reduceStr } from "@/lib/utils";
import { File, Loader2 } from "lucide-react";
const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

import {
  Menubar,
  MenubarCheckboxItem,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarRadioGroup,
  MenubarRadioItem,
  MenubarSeparator,
  MenubarShortcut,
  MenubarSub,
  MenubarSubContent,
  MenubarSubTrigger,
  MenubarTrigger,
} from "@/components/ui/menubar";
import { useDocumentStore } from "@/stores/document.store";

function MenuBar() {
  return (
    <Menubar>
      <MenubarMenu>
        <MenubarTrigger>File</MenubarTrigger>
        <MenubarContent>
          <MenubarItem>
            New Document <MenubarShortcut>⌘T</MenubarShortcut>
          </MenubarItem>

          <MenubarItem disabled>Delete Document</MenubarItem>
          <MenubarSeparator />
          <MenubarSub>
            <MenubarSubTrigger>Share</MenubarSubTrigger>
            <MenubarSubContent>
              <MenubarItem>Email link</MenubarItem>
              <MenubarItem>Email PDF</MenubarItem>
              <MenubarItem>Share link</MenubarItem>
            </MenubarSubContent>
          </MenubarSub>
          <MenubarSeparator />
          <MenubarItem>
            Print... <MenubarShortcut>⌘P</MenubarShortcut>
          </MenubarItem>
        </MenubarContent>
      </MenubarMenu>
      <MenubarMenu>
        <MenubarTrigger>Edit</MenubarTrigger>
        <MenubarContent>
          <MenubarItem>
            Undo <MenubarShortcut>⌘Z</MenubarShortcut>
          </MenubarItem>
          <MenubarItem>
            Redo <MenubarShortcut>⇧⌘Z</MenubarShortcut>
          </MenubarItem>
          <MenubarSeparator />
          <MenubarSub>
            <MenubarSubTrigger>Find</MenubarSubTrigger>
            <MenubarSubContent>
              <MenubarItem>Search the web</MenubarItem>
              <MenubarSeparator />
              <MenubarItem>Find...</MenubarItem>
              <MenubarItem>Find Next</MenubarItem>
              <MenubarItem>Find Previous</MenubarItem>
            </MenubarSubContent>
          </MenubarSub>
          <MenubarSeparator />
          <MenubarItem>Cut</MenubarItem>
          <MenubarItem>Copy</MenubarItem>
          <MenubarItem>Paste</MenubarItem>
        </MenubarContent>
      </MenubarMenu>
      <MenubarMenu>
        <MenubarTrigger>View</MenubarTrigger>
        <MenubarContent>
          <MenubarCheckboxItem>Always Show Bookmarks Bar</MenubarCheckboxItem>
          <MenubarCheckboxItem checked>
            Always Show Full URLs
          </MenubarCheckboxItem>
          <MenubarSeparator />
          <MenubarItem inset>
            Reload <MenubarShortcut>⌘R</MenubarShortcut>
          </MenubarItem>
          <MenubarItem disabled inset>
            Force Reload <MenubarShortcut>⇧⌘R</MenubarShortcut>
          </MenubarItem>
          <MenubarSeparator />
          <MenubarItem inset>Toggle Fullscreen</MenubarItem>
          <MenubarSeparator />
          <MenubarItem inset>Hide Sidebar</MenubarItem>
        </MenubarContent>
      </MenubarMenu>
    </Menubar>
  );
}

interface DocNavProps {
  document: {
    _id: string;
    title: string;
    fullname: string;
    subjectId: {
      title: string;
    };
    sessionNumber: number;
    classref: string;
    objectives: string[];
  };
  refetch: () => void;
}
const DocNav: FC<DocNavProps> = ({ document, refetch }) => {
  const isSaving = useDocumentStore((state) => state.saving);
  useEffect(() => {
    return () => refetch();
  }, [isSaving]);
  return (
    <div className={cn("sticky top-0 left-0  w-full p-2", inter.className)}>
      <div className="flex gap-3 justify-between items-center pt-3 px-2">
        <MenuBar />
        <div className="flex items-center gap-2">
          {isSaving && (
            <div className="flex items-center gap-1 text-zinc-700">
              <Loader2 size={16} className="animate-spin " /> Saving
            </div>
          )}
          <div className="border-l-2 border-zinc-300 pl-2 font-semibold flex items-center gap-1">
            {" "}
            <File size={16} />
            {reduceStr(document.title, 18)}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DocNav;
