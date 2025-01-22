import { ReactEditor } from 'slate-react';
import { Document, Packer, Paragraph, TextRun } from 'docx';

const toText = (doc: any, text: any) => {
  return new TextRun({
    text: text.text || text,
    size: text.fontSize ? text.fontSize * 2 : 24, // Convert to half-points
    font: text.fontFamily || 'Arial', // Default font
    color: text.color || '#000000', //   Default color
    bold: text.bold || false,
    italics: text.italic || false,
    underline: text.underline ? {} : undefined, // Enable underline if true
    shading: {
      fill: text.backgroundColor || '#FFFFFF', // Background color
    },
  });
};

const toParagraph = (doc: any, para: any) => {
  return new Paragraph({
    children: para.children.map((text: any) => toText(doc, text)),
    alignment: para.align || 'left', // Gunakan `align` bukan `textAlign`
  });
};

const toPage = (doc: any, page: any) => {
  doc.addSection({
    properties: {}, // Section properties (optional)
    children: page.children.map((paragraph: any) =>
      toParagraph(doc, paragraph),
    ),
  });
};

const convertToDoc = async (editor: ReactEditor) => {
  const children = editor.children;
  const doc = new Document({
    styles: {
      default: {
        document: {
          run: {
            size: 24, // 12pt in half-points
            font: 'Arial', // Default font
            color: '#000000', // Default color
          },
        },
      },
    },
    sections: [],
  });

  children.forEach((child) => {
    toPage(doc, child);
  });

  const docBuffer = await Packer.toBlob(doc);
  return docBuffer;
};

export default convertToDoc;
