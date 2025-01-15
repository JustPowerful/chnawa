import { FC } from "react";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import connectDB from "@/lib/connectDB";
import Subject from "@/models/Subject";
import Sidebar from "./components/Sidebar";
import DocContent from "./components/DocContent";
import Document from "@/models/Document";

interface pageProps {
  params: Promise<{ id: string }>;
}

const page: FC<pageProps> = async ({ params }) => {
  const { id } = await params;
  await connectDB();
  const subject = await Subject.findById(id);
  const documents = await Document.find({
    subjectId: id,
  });
  return (
    <div className="h-screen">
      <ResizablePanelGroup direction="horizontal">
        <ResizablePanel defaultSize={25} maxSize={30} minSize={15}>
          <Sidebar
            id={id}
            title={subject?.title!}
            description={subject?.description}
            teacherEmail={subject?.teacherEmail}
            teacherName={subject?.teacherName}
            documents={JSON.stringify(documents)}
          />
        </ResizablePanel>
        <ResizableHandle withHandle />
        <ResizablePanel defaultSize={85}>
          <DocContent />
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  );
};

export default page;
