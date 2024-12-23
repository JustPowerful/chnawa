import { FC } from "react";
import DashboardNav from "./components/DashboardNav";
import WelcomeMsg from "./components/WelcomeMsg";
import { auth } from "@/lib/auth";
import Subject from "@/models/Subject";
import SubjectPreview from "./components/SubjectPreview";
import connectDB from "@/lib/connectDB";

interface pageProps {}

const page: FC<pageProps> = async ({}) => {
  const session = await auth();
  await connectDB(); // connect to the database before fetching data
  const subjects = await Subject.find({
    userId: session?.user.id,
  });
  return (
    <div>
      <DashboardNav />

      <div className="p-6 flex flex-col">
        <WelcomeMsg />
        <div className="text-zinc-700 text-xl">Here's your subjects 📚</div>
        <div id="container" className="mt-6 ">
          <div className="grid grid-cols-4 gap-6">
            {subjects.map((subject) => (
              <SubjectPreview
                key={subject.id}
                id={subject.id}
                title={subject?.title}
                description={subject.description}
                teacherEmail={subject.teacherEmail}
                teacherName={subject.teacherName}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default page;
