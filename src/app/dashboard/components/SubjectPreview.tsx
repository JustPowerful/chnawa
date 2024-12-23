"use client";
import { FC, useState } from "react";
import { BookCopy, EllipsisVertical } from "lucide-react";
import { reduceStr } from "@/lib/utils";

import { useRouter } from "next/navigation";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { deleteSubjectAction } from "@/app/actions/subject/delete-subject-action";
import toast from "react-hot-toast";
import { Button } from "@/components/ui/button";
import { InputWithLabel } from "@/components/ui/input-with-label";
import { editSubjectAction } from "@/app/actions/subject/edit-subject-action";

interface SubjectPreviewProps {
  id: string;
  title: string;
  description?: string;
  teacherEmail?: string;
  teacherName?: string;
}

const SubjectPreview: FC<SubjectPreviewProps> = ({
  id,
  title,
  description,
  teacherEmail,
  teacherName,
}) => {
  const router = useRouter();
  const [toggleDelete, setToggleDelete] = useState(false);
  const [toggleEdit, setToggleEdit] = useState(false);

  async function deleteSubject() {
    try {
      const response = await deleteSubjectAction({
        id,
      });
      if (response?.data!.success) {
        toast.success("Subject deleted successfully.");
      } else {
        toast.error("Failed to delete subject, please try again later.");
      }
    } catch (error) {
      toast.error("Failed to delete subject, please try again later.");
    }
  }

  async function editSubject(formData: FormData) {
    try {
      const response = await editSubjectAction({
        id,
        title: formData.get("title") as string,
        description: formData.get("description") as string,
        teacherEmail: formData.get("teacherEmail") as string,
        teacherName: formData.get("teacherName") as string,
      });
      if (response?.data!.success) {
        toast.success("Subject edited.");
      } else {
        toast.error("Failed to update subject, please try again later.");
      }
    } catch (error) {
      toast.error("Failed to update subject, please try again later.");
    } finally {
      setToggleEdit(false);
    }
  }

  return (
    <div
      className="relative bg-zinc-200 p-3 rounded-xl cursor-pointer"
      onClick={() => {
        router.push(`/subject/${id}`);
      }}
    >
      {/* Delete dialog */}
      <Dialog open={toggleDelete} onOpenChange={setToggleDelete}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Are you sure you want to delete {title}</DialogTitle>
            <DialogDescription>
              This action cannot be undone. This will permanently delete your
              subject and remove all the data related to it.
            </DialogDescription>
          </DialogHeader>
          <form action={deleteSubject} className="flex justify-end gap-2">
            <Button
              type="button"
              className="btn btn-danger"
              onClick={deleteSubject}
            >
              Delete
            </Button>
            <Button
              variant="secondary"
              type="button"
              className="btn btn-secondary"
              onClick={() => setToggleDelete(false)}
            >
              Cancel
            </Button>
          </form>
        </DialogContent>
      </Dialog>

      {/* Edit dialog */}
      <Dialog open={toggleEdit} onOpenChange={setToggleEdit}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Editing {title}</DialogTitle>
            <DialogDescription>
              You are currently editing the subject details. Make sure you don't
              add wrong information.
            </DialogDescription>
          </DialogHeader>
          <form action={editSubject} className="flex flex-col gap-2">
            <InputWithLabel
              type="text"
              label="title"
              name="title"
              placeholder="title"
              defaultValue={title}
            />
            <InputWithLabel
              type="text"
              label="description (optional)"
              name="description"
              placeholder="description"
              defaultValue={description}
            />
            <InputWithLabel
              type="text"
              label="teacher name (optional)"
              name="teacherName"
              placeholder="teacher name"
              defaultValue={teacherName}
            />
            <InputWithLabel
              type="text"
              label="teacher email (optional)"
              name="teacherEmail"
              placeholder="teacher email"
              defaultValue={teacherEmail}
            />
            <div className="flex items-center gap-1 justify-end">
              <Button type="submit" className="btn btn-danger">
                Save
              </Button>
              <Button
                variant="secondary"
                type="button"
                className="btn btn-secondary"
                onClick={() => setToggleEdit(false)}
              >
                Cancel
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
      <DropdownMenu>
        <DropdownMenuTrigger className="absolute top-0 right-0 p-2">
          <EllipsisVertical className="w-5 h-5" />
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem
            onClick={() => {
              setToggleDelete(true);
            }}
          >
            Delete
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => {
              setToggleEdit(true);
            }}
          >
            Edit
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <div>
        <BookCopy className="w-5 h-5" />
        <span className="text-zinc-600">Subject</span> |{" "}
        <span className="font-semibold">{title}</span>
      </div>
      {description && (
        <div>
          <span className="font-normal text-zinc-500 text-sm">
            {reduceStr(description, 100)}
          </span>
        </div>
      )}
      {teacherName && (
        <div className="text-xs">
          <span className="text-zinc-600">Teacher</span> |{" "}
          <span className="font-semibold">{teacherName}</span>
        </div>
      )}
      {teacherEmail && (
        <div className="text-xs">
          <span className="text-zinc-600">Email</span> |{" "}
          <span className="font-semibold">{teacherEmail}</span>
        </div>
      )}
    </div>
  );
};

export default SubjectPreview;
