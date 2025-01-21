import { Editor, Transforms, Node } from "slate";
import { ReactEditor } from "slate-react";
import { HEADING_TYPES } from "../constants/editor.contants";
import { CustomEditor, CustomElement } from "../types/editor.types";

const WithCustomInsertBreak = (editor: CustomEditor) => {
  const { insertBreak } = editor;

  editor.insertBreak = () => {
    const [match] = Editor.nodes(editor, {
      match: (n): n is CustomElement => HEADING_TYPES.includes((n as CustomElement).type),
    });
    if (!!match) {
      Transforms.setNodes(
        editor,
        { type: "paragraph" },
        { 
          match: (n): n is CustomElement => HEADING_TYPES.includes((n as CustomElement).type),
        }
      );
    }
    insertBreak();
    console.log(match);
  };

  return editor;
};
export default WithCustomInsertBreak;
