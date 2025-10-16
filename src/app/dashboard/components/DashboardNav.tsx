"use client";
import { buttonVariants } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { FC, useState } from "react";
import logo from "@/assets/logo.png";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import SubjectForm from "./SubjectForm";
import Image from "next/image";

const DashboardNav: FC = () => {
  const [toggleSubjectDialog, setToggleSubjectDialog] = useState(false);

  return (
    <>
      {/* Create Subject Dialog */}
      <SubjectForm
        toggleSubjectDialog={toggleSubjectDialog}
        setToggleSubjectDialog={setToggleSubjectDialog}
      />

      <div className="w-full p-4 sticky top-0 left-0">
        <div className="bg-white bg-opacity-50 backdrop-blur-md border p-4 rounded-full flex items-center justify-between">
          <div className="text-xl font-semibold opacity-80">
            <Image src={logo} width={50} height={50} alt="chnawa logo" />
          </div>
          <div>
            <DropdownMenu>
              <DropdownMenuTrigger
                className={cn(
                  buttonVariants({
                    variant: "notion",
                  }),
                  "w-10 h-10"
                )}
              >
                <Plus />
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem
                  onClick={() => {
                    setToggleSubjectDialog(true);
                  }}
                >
                  Create subject
                </DropdownMenuItem>
                <DropdownMenuItem>Create document</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </>
  );
};

export default DashboardNav;
