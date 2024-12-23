import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { InputWithLabel } from "@/components/ui/input-with-label";
import { createSubjectAction } from "@/app/actions/subject/create-subject-action";
import { FC } from "react";
import toast from "react-hot-toast";

interface SubjectFormProps {
  toggleSubjectDialog: boolean;
  setToggleSubjectDialog: (value: boolean) => void;
}

const SubjectForm: FC<SubjectFormProps> = ({
  toggleSubjectDialog,
  setToggleSubjectDialog,
}) => {
  async function handleSubmit(formData: FormData) {
    const result: any = await createSubjectAction({
      title: formData.get("title") as string,
      description: formData.get("description") as string,
      teacherName: formData.get("teacherName") as string,
      teacherEmail: formData.get("teacherEmail") as string,
    });

    if (result.data.success) {
      toast.success(result.data.message);
      setToggleSubjectDialog(false);
    } else {
      toast.error(result.data.message);
    }
  }

  return (
    <Dialog
      open={toggleSubjectDialog}
      onOpenChange={(value) => setToggleSubjectDialog(value)}
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create a new subject</DialogTitle>
          <DialogDescription>
            Fill in the form below to create a new subject
          </DialogDescription>
        </DialogHeader>
        <form action={handleSubmit} className="flex flex-col space-y-4">
          <InputWithLabel
            label="title"
            placeholder="Enter subject title e.g. Mathematics"
            name="title"
            type="text"
          />
          <InputWithLabel
            label="description (optional)"
            placeholder="Enter a short description of the subject"
            name="description"
            type="text"
          />
          <InputWithLabel
            label="teacher name (optional)"
            placeholder="teacher name"
            name="teacherName"
            type="text"
          />
          <InputWithLabel
            label="teacher email (optional)"
            placeholder="teacher email"
            name="teacherEmail"
            type="text"
          />
          <div className="flex items-center gap-1 justify-end">
            <Button>Create</Button>
            <Button
              variant="secondary"
              onClick={(event) => {
                event.preventDefault();
                setToggleSubjectDialog(false);
              }}
            >
              Cancel
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default SubjectForm;
