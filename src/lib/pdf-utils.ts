import jsPDF from "jspdf";

interface Document {
  document: {
    title: string;
    objectives: string[];
    subjectId: {
      _id: string;
      title: string;
    };
    userId: {
      _id: string;
      firstname: string;
      lastname: string;
    };
    classref: string;
    sessionNumber: number;
    content: string; // parsed to JSON later
  };
}

type BlockType = "header" | "paragraph" | "list" | "image";
interface Content {
  blocks: {
    id: string;
    type: BlockType;
    data: any;
  }[];
}

export async function exportToPdf(documentId: string) {
  // fetch the document from the API
  try {
    const response = await fetch(`/api/document/${documentId}`);
    const data: Document = await response.json();
    const document = data.document;
    const content: Content = JSON.parse(document.content);
    const blocks = content.blocks;
    const pdf = new jsPDF();
    let yOffset = 10;

    // Add title
    pdf.setFontSize(20);
    pdf.text(document.title, 10, yOffset);
    yOffset += 20;

    // Add class and session info
    pdf.setFontSize(12);
    pdf.text(
      `Class: ${document.classref} - Session ${document.sessionNumber}`,
      10,
      yOffset
    );
    yOffset += 10;
    // Add name info
    pdf.text(
      `Firstname: ${document.userId.firstname} - Lastname: ${document.userId.lastname}`,
      10,
      yOffset
    );
    yOffset += 10;

    // Add subject
    pdf.text(`Subject: ${document.subjectId.title}`, 10, yOffset);
    yOffset += 20;

    // Add objectives
    pdf.setFontSize(14);
    pdf.text("Objectives:", 10, yOffset);
    yOffset += 10;
    pdf.setFontSize(12);
    document.objectives.forEach((objective) => {
      pdf.text(`• ${objective}`, 20, yOffset);
      yOffset += 10;
    });
    yOffset += 10;

    // Process content blocks
    blocks.forEach((block) => {
      switch (block.type) {
        case "header":
          pdf.setFontSize(16);
          pdf.text(block.data.text, 10, yOffset);
          yOffset += 10;
          break;
        case "paragraph":
          pdf.setFontSize(12);
          pdf.text(block.data.text, 10, yOffset);
          yOffset += 10;
          break;
        case "list":
          pdf.setFontSize(12);
          block.data.items.forEach((item: any, index: number) => {
            let bullet;
            switch (block.data.style) {
              case "ordered":
                bullet = `${index + 1}.`;
                break;
              case "checklist":
                if (item.checked) {
                  bullet = "✅";
                } else {
                  bullet = "🔳";
                }
                break;
              default:
                bullet = "•";
            }
            pdf.text(`${bullet} ${item.content}`, 20, yOffset);
            yOffset += 10;
          });
          break;
      }
    });

    pdf.save(`${document.title}.pdf`);
  } catch (error) {
    console.log(error);
  }
}
