import { Editor, Text, Range, Path, Transforms } from "slate";
import { ReactEditor } from "slate-react";
import isHotkey, { isKeyHotkey } from "is-hotkey";
import { toggleMark } from "./editor";
import { CustomEditor, CustomElement } from "../types/editor.types";

const defaultSelection: Range = {
  anchor: {
    path: [0, 0],
    offset: 0,
  },
  focus: {
    path: [0, 0],
    offset: 0,
  },
};

export default defaultSelection;

export const getEditorTextRanges = (editor: ReactEditor, search: string) => {
  const ranges = [];
  for (const [node, path] of Editor.nodes(editor as CustomEditor, {
    at: [],
    match: Text.isText,
  })) {
    if (search && Text.isText(node)) {
      ranges.push(...getTextRanges(node, path, search));
    }
  }
  return ranges;
};

export const getTextRanges = (node: Text, path: Path, search: string) => {
  const ranges: Range[] = [];
  const { text } = node;

  const parts: string[] = text.split(search);

  let offset = 0;
  parts.forEach((part, index) => {
    if (index !== 0) {
      ranges.push({
        anchor: { path, offset: offset - search.length },
        focus: { path, offset },
      });
    }

    offset = offset + part.length + search.length;
  });

  return ranges;
};

const HOTKEYS: { [key: string]: string | string[] } = {
  bold: "mod+b",
  compose: ["down", "left", "right", "up", "backspace", "enter"],
  moveBackward: "left",
  moveForward: "right",
  moveWordBackward: "ctrl+left",
  moveWordForward: "ctrl+right",
  deleteBackward: "shift?+backspace",
  deleteForward: "shift?+delete",
  extendBackward: "shift+left",
  extendForward: "shift+right",
  italic: "mod+i",
  splitBlock: "shift?+enter",
  undo: "mod+z",
  selectAll: "mod+a",
};

const create = (key: string) => {
  const generic = HOTKEYS[key];
  const isGeneric = generic && isKeyHotkey(generic);

  return (event: KeyboardEvent) => {
    if (isGeneric && isGeneric(event)) return true;
    return false;
  };
};

const isHotKey = {
  isBold: create("bold"),
  isSplitBlock: create("splitBlock"),
  isSelectAll: create("selectAll"),
};

//still very much to do here.
export const onKeyDown = (editor: CustomEditor, event: KeyboardEvent) => {
  //TODO use isHotKey here
  if (isHotKey.isSelectAll(event)) {
    event.preventDefault();
    const [match] = Editor.nodes(editor, {
      match: (n) => Text.isText(n),
    });

    if (!!match) {
      const anchor = Editor.start(editor, match[1]);
      const focus = Editor.end(editor, match[1]);
      const currentSelectedRange = { anchor, focus };

      if (editor.selection == null) {
        Transforms.select(editor, currentSelectedRange);
        return;
      }

      if (Range.equals(editor.selection, currentSelectedRange)) {
        const EditorStartAnchor = Editor.start(editor, []);
        const EditorEndAnchor = Editor.end(editor, []);
        const EditorRange = {
          anchor: EditorStartAnchor,
          focus: EditorEndAnchor,
        };

        Transforms.select(editor, EditorRange);

        return;
      } else {
        Transforms.select(editor, currentSelectedRange);
        return;
      }
    }
  }
  switch (event.key) {
    // When "`" is pressed, keep our existing code block logic.
    case "`": {
      event.preventDefault();
      const [match] = Editor.nodes(editor, {
        // @ts-expect-error - fix this later
        match: (n): n is CustomElement => n.type === "h1",
      });
      Transforms.setNodes(
        editor,
        { type: match ? "paragraph" : "h1" },
        { match: (n) => Editor.isBlock(editor, n as CustomElement) }
      );
      break;
    }

    // When "B" is pressed, bold the text in the selection.
    case "b": {
      event.preventDefault();
      return toggleMark(editor, "bold");
      break;
    }
  }
  for (const hotkey in HOTKEYS) {
    if (isHotkey(hotkey, event)) {
      event.preventDefault();
      const mark = HOTKEYS[hotkey as keyof typeof HOTKEYS];

      switch (mark) {
        case "undo":
          editor.undo();
          break;
        case "redo":
          editor.redo();
          break;
        case "find":
        // case "replace":
        //   setShowSearch(true);
        //   break;
        // case "findNext":
        //   findNext();
        //   break;
        // case "findPrevious":
        //   findPrevious();
        //   break;
        default:
          toggleMark(editor, mark as string);
      }
    }
  }
};
