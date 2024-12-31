import { Document, Page, Text, View, StyleSheet } from "@react-pdf/renderer";

interface DocumentData {
  _id: string;
  title: string;
  fullname: string;
  subjectId: {
    title: string;
  };
  sessionNumber: number;
  classref: string;
  objectives: string[];
  content: string;
}

const styles = StyleSheet.create({
  page: {
    padding: 50,
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
    textAlign: "center",
  },
  metadata: {
    fontSize: 12,
    marginBottom: 10,
  },
  objectives: {
    marginTop: 10,
    marginBottom: 10,
  },
  objectiveTitle: {
    fontSize: 12,
    marginBottom: 5,
    textDecoration: "underline",
  },
  objectiveItem: {
    fontSize: 12,
    marginLeft: 10,
    marginBottom: 3,
  },
  content: {
    marginTop: 20,
  },
  header: {
    fontSize: 16,
    marginTop: 10,
    marginBottom: 10,
  },
  paragraph: {
    fontSize: 12,
    marginBottom: 10,
  },
  listItem: {
    fontSize: 12,
    marginLeft: 10,
    marginBottom: 3,
  },
});

export function DocumentPDF({ document }: { document: DocumentData }) {
  const content = document.content
    ? JSON.parse(document.content)
    : { blocks: [] };

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <Text style={styles.title}>{document.title}</Text>

        <View style={styles.metadata}>
          <Text>Student Name: {document.fullname}</Text>
          <Text>Subject: {document.subjectId.title}</Text>
          <Text>Class: {document.classref}</Text>
          <Text>Session: {document.sessionNumber}</Text>
        </View>

        {document.objectives?.length > 0 && (
          <View style={styles.objectives}>
            <Text style={styles.objectiveTitle}>Objectives:</Text>
            {document.objectives.map((objective: string, index: number) => (
              <Text key={index} style={styles.objectiveItem}>
                • {objective}
              </Text>
            ))}
          </View>
        )}

        <View style={styles.content}>
          {content.blocks?.map((block: any, index: number) => {
            switch (block.type) {
              case "header":
                return (
                  <Text key={index} style={styles.header}>
                    {block.data.text}
                  </Text>
                );
              case "paragraph":
                return (
                  <Text key={index} style={styles.paragraph}>
                    {block.data.text}
                  </Text>
                );
              case "list":
                return block.data.items.map(
                  (item: string, itemIndex: number) => (
                    <Text key={`${index}-${itemIndex}`} style={styles.listItem}>
                      • {item}
                    </Text>
                  )
                );
              default:
                return null;
            }
          })}
        </View>
      </Page>
    </Document>
  );
}
