import { Editor, Transforms, Node } from "slate";
import { ReactEditor } from "slate-react";
import { LIST_TYPES } from "../constants/editor.contants";
import { toggleBlock } from "../utils/editor";
import { CustomEditor } from "../types/editor.types";

const WithCustomDelete = (editor: CustomEditor) => {
  const { deleteBackward } = editor;

  editor.deleteBackward = () => {
    ReactEditor.focus(editor);
    const { selection } = editor;

    const [match] = Editor.nodes(editor, {
      // @ts-expect-error - fix this later
      match: (n) => LIST_TYPES.includes(n.type as string),
    });

    if (!!match && selection?.anchor.offset == 0) {
      toggleBlock(editor, "paragraph");
    } else {
      deleteBackward("character");
    }
  };

  return editor;
};
export default WithCustomDelete;
