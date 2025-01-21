"use client";
import { BiSolidZap } from "react-icons/bi";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  createEditor,
  Descendant,
  NodeEntry,
  Range as SlateRange,
} from "slate";
import {
  Slate,
  Editable,
  withReact,
  RenderElementProps,
  RenderLeafProps,
  ReactEditor,
} from "slate-react";
import { withHistory } from "slate-history";
import isHotkey from "is-hotkey";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Bold,
  Italic,
  Underline,
  Code,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  List,
  ListOrdered,
  Quote,
  Heading1,
  Heading2,
  Undo,
  Redo,
  Palette,
  MinusCircle,
  PlusCircle,
  Search,
  ArrowBigDown,
  ArrowDown,
} from "lucide-react";
import { Element } from "./Element";
import { Leaf } from "./Leaf";
import {
  COLORS,
  FONT_SIZES,
  HOTKEYS,
  INITIAL_EDITOR_VALUE,
} from "../constants/editor.contants";
import { toggleMark } from "../utils/editor";
import { CustomEditor, CustomElement } from "../types/editor.types";
import { SearchToolbar } from "./search/SearchToolbar";
import { Toolbar } from "./Toolbar";
import { MarkButton } from "./button/mark-button";
import { BlockButton } from "./button/block-button";
import { TableControls } from "./table/TableControls";
import BorderControls from "./border/BorderControls";
import { withTables } from "../plugins/withTables";

import { useTable } from "@/hooks/useTable";
import { useSearch } from "@/hooks/useSearch";
import { ErrorBoundary } from "react-error-boundary";

import { createEmptyPage, withPageBreaks } from "../plugins/withPageBreaks";
import WithCustomDelete from "../plugins/withCustomDeletes";
import WithCustomInsertBreak from "../plugins/withCustomInsertBreak";
import withCustomNormalize from "../plugins/withCustomNormalize";
import defaultSelection, { getTextRanges } from "../utils/page.utils";
import intialState, { highlightColors } from "../constants/page.constants";
import { HeadingButton } from "./button/heading-button";
import { TbDropletDown } from "react-icons/tb";
interface TextEditorState {
  value: Descendant[];
  search: string | undefined;
  lastBlurSelection: SlateRange | null;
}
export const RichTextEditor: React.FC = () => {
  // Initialize editor with plugins
  const editor = useMemo(
    () =>
      WithCustomDelete(
        WithCustomInsertBreak(
          withCustomNormalize(withHistory(withReact(createEditor())))
        )
      ),
    []
  );
  const [state, setState] = useState<TextEditorState>({
    value: [...intialState],
    search: "",
    lastBlurSelection: defaultSelection,
  });
// @ts-expect-error ts-migrate(7006) FIXME: Parameter 'entry' implicitly has an 'any' type.
  const handleDecorate = ([node, path]: NodeEntry<Node>) => {
    const ranges: Range[] = [];
    // @ts-expect-error ts-migrate(7006) FIXME: Parameter 'node' implicitly has an 'any' type.
    if (state.search && Text.isText(node)) {
      // @ts-expect-error ts-migrate(7006) FIXME: Parameter 'node' implicitly has an 'any' type.
      const currentRanges = getTextRanges(node, path, state.search);
      const rangesWithHighlights: Range[] = [];
      // @ts-expect-error ts-migrate(7006) FIXME: Parameter 'text' implicitly has an 'any' type.
      currentRanges.forEach((text: Range) => {
        rangesWithHighlights.push({
          ...text,
          // @ts-expect-error ts-migrate(7006) FIXME: Parameter 'text' implicitly has an 'any' type.
          highlight: true,
          highlightColor: highlightColors.searchHighlightColor,
        });
      });
      ranges.push(...rangesWithHighlights);
    }
    return ranges;
  };

  const handleRenderLeaf: any = useCallback(
    (props: RenderLeafProps) => renderLeaf(props),
    [state.search]
  );

  const decorate = useCallback(
    // @ts-expect-error ts-migrate(7006) FIXME: Parameter 'entry' implicitly has an 'any' type.
    (entry: NodeEntry) => handleDecorate(entry),
    [state.search]
  );

  useEffect(() => {
    ReactEditor.focus(editor);
  }, []);

  const handleOnPaste = (e: React.ClipboardEvent<HTMLDivElement>) => {
    e.preventDefault();
    const text = e.clipboardData?.getData("text");
    console.log(
      text,
      "YES, this text was pasted but i need to insert the page break so i disabled it for now, WORK IN PROGRESS"
    );
    // if(text){
    //   Transforms.insertText(editor,text)
    // }
  };

  // Custom hooks
  const {
    showSearch,
    setShowSearch,
    searchQuery,
    setSearchQuery,
    replaceQuery,
    setReplaceQuery,
    searchResults,
    currentMatch,
    findNext,
    findPrevious,
    replace,
    replaceAll,
  } = useSearch(editor);

  const {
    dimensions,
    setDimensions,
    hoveredCell,
    setHoveredCell,
    handleTableCreate,
  } = useTable(editor);

  // Callbacks for rendering elements and leaves
  const renderElement = useCallback(
    (props: RenderElementProps) => <Element {...props} />,
    []
  );
  const renderLeaf = useCallback(
    (props: RenderLeafProps) => <Leaf {...props} />,
    []
  );

  // History handlers
  const handleUndo = (event: React.MouseEvent) => {
    event.preventDefault();
    editor.undo();
  };

  const handleRedo = (event: React.MouseEvent) => {
    event.preventDefault();
    editor.redo();
  };

  // Font size handlers
  const handleFontSizeChange = (size: string) => {
    editor.addMark("fontSize", size);
  };

  const handleIncreaseFontSize = (event: React.MouseEvent) => {
    event.preventDefault();
    // @ts-expect-error ts-migrate(7006) FIXME: Property 'marks' does not exist on type 'CustomEditor'.
    const marks = editor.marks();
    const currentSize = marks?.fontSize ? parseInt(marks.fontSize) : 12;
    const newSize = Math.min(currentSize + 2, 72).toString();
    editor.addMark("fontSize", newSize);
  };

  const handleDecreaseFontSize = (event: React.MouseEvent) => {
    event.preventDefault();
    // @ts-expect-error ts-migrate(7006) FIXME: Property 'marks' does not exist on type 'CustomEditor'.
    const marks = editor.marks();
    const currentSize = marks?.fontSize ? parseInt(marks.fontSize) : 12;
    const newSize = Math.max(currentSize - 2, 8).toString();
    editor.addMark("fontSize", newSize);
  };

  // Color handler
  const handleColorChange = (color: string) => {
    editor.addMark("color", color);
  };

  const handleOnKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
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
          case "replace":
            setShowSearch(true);
            break;
          case "findNext":
            findNext();
            break;
          case "findPrevious":
            findPrevious();
            break;
          default:
            toggleMark(editor, mark);
        }
      }
    }
  };

  return (
    <ErrorBoundary
      FallbackComponent={({ error }) => (
        <div className="text-red-500">{error.message}</div>
      )}
      onReset={() => {
        // @ts-expect-error ts-migrate(7006) FIXME: Parameter 'state' implicitly has an 'any' type.
        setState(...state, { value: [...intialState] });
      }}
    >
      <div className="mx-auto max-h-screen py-4">
        <Slate
          editor={editor as CustomEditor}
          initialValue={state.value}
          // @ts-expect-error ts-migrate(7006) FIXME: Parameter 'value' implicitly has an 'any' type.
          value={state.value}
          onChange={(value) => setState({ ...state, value })}
        >
          <Card className="rounded-lg shadow-sm border-0 bg-transparant h-screen">
            {/* Search Bar */}
            <div className="max-w-8xl mx-auto">
              <div className="w-full"></div>
              {showSearch && (
                <SearchToolbar
                  searchQuery={searchQuery}
                  setSearchQuery={setSearchQuery}
                  replaceQuery={replaceQuery}
                  setReplaceQuery={setReplaceQuery}
                  searchResults={searchResults}
                  currentMatch={currentMatch}
                  onFindNext={findNext}
                  onFindPrevious={findPrevious}
                  onReplace={replace}
                  onReplaceAll={replaceAll}
                  onClose={() => setShowSearch(false)}
                />
              )}

              {/* Toolbar */}
              <Toolbar>
                {/* Undo/Redo Group */}
                <div className="flex flex-col gap-1 p-5 border-r border-muted-foreground">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="w-8 h-8"
                    onClick={handleUndo}
                  >
                    <Undo className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="w-8 h-8"
                    onClick={handleRedo}
                  >
                    <Redo className="w-4 h-4" />
                  </Button>
                </div>
                {/* FONT GROUP */}
                <div className="border-r border-muted-foreground px-10 space-y-2 flex flex-col justify-between">
                  {/* Font Size Selector */}
                  <div className="flex gap-x-4">
                    <div>
                      <Select onValueChange={handleFontSizeChange}>
                        <SelectTrigger className="h-8 border-muted-foreground">
                          <SelectValue placeholder="Times New Roman" />
                        </SelectTrigger>
                        <SelectContent className="bg-[#EFE5D2] border-muted-foreground">
                          <SelectGroup>
                            {FONT_SIZES.map((size) => (
                              <SelectItem
                                className="hover:bg-muted-foreground"
                                key={size}
                                value={size}
                              >
                                {size}
                              </SelectItem>
                            ))}
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="flex">
                      <div>
                        <Select onValueChange={handleFontSizeChange}>
                          <SelectTrigger className="w-[60px] h-8 border-muted-foreground">
                            <SelectValue placeholder="12" />
                          </SelectTrigger>
                          <SelectContent className="bg-[#EFE5D2] border-muted-foreground">
                            <SelectGroup>
                              {FONT_SIZES.map((size) => (
                                <SelectItem
                                  className="hover:bg-muted-foreground"
                                  key={size}
                                  value={size}
                                >
                                  {size}
                                </SelectItem>
                              ))}
                            </SelectGroup>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>

                  {/* Color Selector */}
                  <div className="flex">
                    {/* Text Formatting Buttons */}
                    <div className="flex gap-1 ">
                      <MarkButton
                        format="bold"
                        icon={<Bold className="w-4 h-4" />}
                      />
                      <MarkButton
                        format="italic"
                        icon={<Italic className="w-4 h-4" />}
                      />
                      <MarkButton
                        format="underline"
                        icon={<Underline className="w-4 h-4" />}
                      />
                      <MarkButton
                        format="code"
                        icon={<Code className="w-4 h-4" />}
                      />
                    </div>
                    <div className="">
                      <Select onValueChange={handleColorChange}>
                        <SelectTrigger className="w-[100px] h-8">
                          <Palette className="w-4 h-4 mr-2" />
                          <SelectValue placeholder="Color" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectGroup>
                            {COLORS.map((color) => (
                              <SelectItem
                                key={color.value}
                                value={color.value}
                                className="flex items-center gap-2"
                              >
                                <div
                                  className="w-4 h-4 rounded-full"
                                  style={{
                                    backgroundColor: color.value,
                                    border:
                                      color.value === "inherit"
                                        ? "1px solid #e2e8f0"
                                        : "none",
                                  }}
                                />
                                {color.name}
                              </SelectItem>
                            ))}
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <h1 className="text-center text-foreground">Font</h1>
                </div>
                {/* Paragraph Group */}
                <div className="flex flex-col items-center justify-between px-10 border-r border-muted-foreground ">
                  {/* List Buttons */}
                  <div className="flex h-fit space-x-5 items-center">
                    <div className="flex flex-col">
                      <div className="flex gap-1">
                        <BlockButton
                          format="numbered-list"
                          icon={<ListOrdered className="w-4 h-4" />}
                        />
                        <BlockButton
                          format="bulleted-list"
                          icon={<List className="w-4 h-4" />}
                        />
                      </div>

                      {/* Alignment Buttons */}
                      <div className="flex gap-1">
                        <BlockButton
                          format="left"
                          icon={<AlignLeft className="w-4 h-4" />}
                        />
                        <BlockButton
                          format="center"
                          icon={<AlignCenter className="w-4 h-4" />}
                        />
                        <BlockButton
                          format="right"
                          icon={<AlignRight className="w-4 h-4" />}
                        />
                        <BlockButton
                          format="justify"
                          icon={<AlignJustify className="w-4 h-4" />}
                        />
                      </div>
                    </div>
                    <BorderControls editor={editor} />
                  </div>
                  <h1 className="text-center">Paragraph</h1>
                </div>
                {/* Styles Group */}
                <div className="flex flex-col items-center justify-center px-10 border-r border-muted-foreground ">
                  {/* Block Formatting Buttons */}
                  <div className="flex flex-col h-[80%] justify-center">
                    <div className="flex border border-muted-foreground rounded-lg">
                      <HeadingButton
                        format="heading-one"
                        icon={<Heading1 className="w-4 h-4" />}
                      />
                      <HeadingButton
                        format="heading-two"
                        icon={<Heading2 className="w-4 h-4" />}
                      />
                      <HeadingButton
                        format="block-quote"
                        icon={<Quote className="w-4 h-4" />}
                      />
                      <div className="w-5 flex items-center justify-center">
                        <ArrowDown className="w-4 h-4" />
                      </div>
                    </div>
                  </div>
                  <h1 className="text-center">Heading Styles</h1>
                </div>
                {/* Editing Group */}
                <div className="flex flex-col items-center justify-center px-10 border-r border-muted-foreground ">
                  <div className="h-[80%] flex flex-col justify-center">
                    {/* Search Button */}
                    <div
                      onClick={() => setShowSearch(true)}
                      className="flex gap-1 items-center cursor-pointer hover:bg-primary/10 rounded-lg"
                    >
                      <Button
                        variant="ghost"
                        size="icon"
                        className="w-8 h-8 hover:bg-transparent"
                      >
                        <Search className="w-4 h-4" />
                      </Button>
                      <span className="text-sm pr-2">Find & Replace</span>
                    </div>

                    {/* Table Controls */}
                    <TableControls
                      dimensions={dimensions}
                      setDimensions={setDimensions}
                      hoveredCell={hoveredCell}
                      setHoveredCell={setHoveredCell}
                      onTableCreate={handleTableCreate}
                    />
                  </div>
                  <h1>Editing Group</h1>
                </div>
                <div className="flex items-center justify-center px-6 ">
                  <BiSolidZap className="text-xl" />
                </div>
              </Toolbar>
            </div>

            {/* Editor Content */}
            <div className=" overflow-auto h-[83%] border-0 mt-2">
              <Editable
                onPaste={handleOnPaste}
                renderElement={renderElement}
                renderLeaf={renderLeaf}
                // @ts-expect-error ts-migrate(7006) FIXME: Property 'decorate' does not exist on type 'CustomEditor'.
                decorate={decorate}
                spellCheck
                onKeyDown={handleOnKeyDown}
                className="min-h-[500px] focus:outline-none"
                onBlur={() =>
                  setState({ ...state, lastBlurSelection: editor.selection })
                }
              />
            </div>
            <div className="flex w-full justify-center items-center p-1 space-x-10">
              <span>20 Words</span>
              <span>Page 1 of 1</span>
              <span>English (US)</span>
            </div>
          </Card>
        </Slate>
      </div>
    </ErrorBoundary>
  );
};

export default RichTextEditor;
