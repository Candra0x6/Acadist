import { Editor, Element } from "slate";
import { TABLE_TYPES } from "../constants/editor.contants";
import { CustomEditor } from "../types/editor.types";

export const withTables = (editor: CustomEditor) => {
  const { deleteBackward, deleteForward, insertBreak } = editor;

  const isInsideTable = () => {
    const [cell] = Editor.nodes(editor, {
      match: (n) =>
        !Editor.isEditor(n) &&
        Element.isElement(n) &&
        TABLE_TYPES.includes(n.type as (typeof TABLE_TYPES)[number]),
    });
    return !!cell;
  };

  editor.deleteBackward = (unit) => {
    if (isInsideTable()) return;
    deleteBackward(unit);
  };

  editor.deleteForward = (unit) => {
    if (isInsideTable()) return;
    deleteForward(unit);
  };

  editor.insertBreak = () => {
    if (isInsideTable()) return;
    insertBreak();
  };

  return editor;
};
