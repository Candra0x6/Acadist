import { useState, useCallback } from "react";
import { Editor, Range, Text, Transforms } from "slate";

export const useSearch = (editor: Editor) => {
  const [showSearch, setShowSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [replaceQuery, setReplaceQuery] = useState("");
  const [searchResults, setSearchResults] = useState<Range[]>([]);
  const [currentMatch, setCurrentMatch] = useState(0);

  const findMatches = useCallback(() => {
    const matches: Range[] = [];
    const { selection } = editor;

    if (!searchQuery) {
      setSearchResults([]);
      return;
    }

    for (const [node, path] of Editor.nodes(editor, {
      at: [],
      match: (n) => Text.isText(n),
    })) {
      const text = (node as Text).text;
      let position = 0;

      while (position < text.length) {
        const index = text
          .toLowerCase()
          .indexOf(searchQuery.toLowerCase(), position);
        if (index === -1) break;

        matches.push({
          anchor: { path, offset: index },
          focus: { path, offset: index + searchQuery.length },
        });
        position = index + 1;
      }
    }

    setSearchResults(matches);
    setCurrentMatch(matches.length > 0 ? 0 : -1);
    if (matches.length > 0) {
      Transforms.select(editor, matches[0]);
    }
  }, [searchQuery, editor]);

  const findNext = () => {
    if (searchResults.length === 0) return;
    const nextMatch = (currentMatch + 1) % searchResults.length;
    setCurrentMatch(nextMatch);
    Transforms.select(editor, searchResults[nextMatch]);
  };

  const findPrevious = () => {
    if (searchResults.length === 0) return;
    const prevMatch =
      currentMatch === 0 ? searchResults.length - 1 : currentMatch - 1;
    setCurrentMatch(prevMatch);
    Transforms.select(editor, searchResults[prevMatch]);
  };

  const replace = () => {
    if (searchResults.length === 0 || currentMatch === -1) return;
    Transforms.select(editor, searchResults[currentMatch]);
    Transforms.delete(editor);
    Transforms.insertText(editor, replaceQuery);
    findMatches(); // Refresh matches
  };

  const replaceAll = () => {
    if (searchResults.length === 0) return;
    searchResults.forEach((range) => {
      Transforms.select(editor, range);
      Transforms.delete(editor);
      Transforms.insertText(editor, replaceQuery);
    });
    findMatches(); // Refresh matches
  };

  return {
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
  };
};
