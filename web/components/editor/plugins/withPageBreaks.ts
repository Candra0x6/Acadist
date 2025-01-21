import { Editor, Element, Text, Transforms, Path, Range, Node } from "slate";
import { ReactEditor } from "slate-react";
import { CustomEditor, CustomElement } from "../types/editor.types";
import { PAGE_CONFIG } from "../constants/editor.contants";

// Types
export type PageElement = {
  type: "page";
  id: string;
  children: CustomElement[];
};

export type ParagraphElement = {
  type: "paragraph";
  children: { text: string }[];
};

// Utilities
const isValidNode = (node: any): boolean => {
  return (
    node &&
    typeof node === "object" &&
    "type" in node &&
    "children" in node &&
    Array.isArray(node.children)
  );
};

const getValidSplitIndex = (
  children: Node[],
  availableHeight: number,
  domNode: HTMLElement
): number => {
  let currentHeight = 0;
  let splitIndex = -1;

  for (let i = 0; i < children.length; i++) {
    const childNode = domNode.children[i];
    if (!childNode) continue;

    const style = window.getComputedStyle(childNode);
    const height =
      childNode.getBoundingClientRect().height +
      parseFloat(style.marginTop) +
      parseFloat(style.marginBottom);

    if (currentHeight + height > availableHeight) {
      splitIndex = i;
      break;
    }
    currentHeight += height;
  }

  // Ensure we don't return -1 or length of children
  return splitIndex > 0
    ? splitIndex
    : Math.max(1, Math.floor(children.length / 2));
};

export const withPageBreaks = (editor: CustomEditor) => {
  const { normalizeNode: originalNormalizeNode } = editor;

  editor.normalizeNode = (entry) => {
    const [node, path] = entry;

    // Validate node before processing
    if (!isValidNode(node)) {
      return originalNormalizeNode(entry);
    }

    // Only process page elements
    if (!Element.isElement(node) || node.type !== "page") {
      return originalNormalizeNode(entry);
    }

    try {
      // Skip during SSR
      if (typeof window === "undefined") {
        return originalNormalizeNode(entry);
      }

      let shouldNormalize = false;

      const domNode = ReactEditor.toDOMNode(editor, node);
      if (!domNode) return originalNormalizeNode(entry);

      const { selection } = editor;

      // Calculate available space
      const availableHeight = PAGE_CONFIG.minHeight - PAGE_CONFIG.padding * 2;

      // Get current content height
      const contentHeight = Array.from(domNode.children).reduce(
        (total, child) => {
          const style = window.getComputedStyle(child);
          return (
            total +
            child.getBoundingClientRect().height +
            parseFloat(style.marginTop) +
            parseFloat(style.marginBottom)
          );
        },
        0
      );

      // Check if split is needed
      if (contentHeight > availableHeight && node.children.length > 1) {
        const splitIndex = getValidSplitIndex(
          node.children,
          availableHeight,
          domNode
        );

        // Ensure split index is valid
        if (splitIndex > 0 && splitIndex < node.children.length) {
          shouldNormalize = true;

          // Store selection state
          const selectionPath = selection?.anchor.path;
          const selectionOffset = selection?.anchor.offset;

          // Create new page content
          const nextPageChildren = node.children.slice(splitIndex);
          const currentPageChildren = node.children.slice(0, splitIndex);

          // Create new page
          const newPage: PageElement = {
            type: "page",
            id: `page-${Date.now()}`,
            children: nextPageChildren as CustomElement[],
          };

          Editor.withoutNormalizing(editor, () => {
            try {
              // Update current page
              if (Path.isPath(path)) {
                Transforms.removeNodes(editor, {
                  at: [...path, splitIndex],
                  // @ts-expect-error - fix this later
                  span: node.children.length - splitIndex,
                });

                // Insert new page
                const newPagePath = Path.next(path);
                Transforms.insertNodes(editor, newPage, { at: newPagePath });

                // Restore selection if needed
                if (selectionPath && selectionOffset !== null) {
                  // Calculate if selection was in moved content
                  const selectionWasMoved =
                    selectionPath[selectionPath.length - 1] >= splitIndex;

                  if (selectionWasMoved) {
                    // Adjust selection path for new page
                    const newSelectionPath = [
                      ...newPagePath,
                      selectionPath[selectionPath.length - 1] - splitIndex,
                    ];

                    try {
                      const targetNode = Node.get(editor, newSelectionPath);
                      if (targetNode) {
                        Transforms.select(editor, {
                          anchor: {
                            path: newSelectionPath,
                            offset: selectionOffset as unknown as number,
                          },
                          focus: {
                            path: newSelectionPath,
                            offset: selectionOffset as unknown as number,
                          },
                        });

                        // Scroll to new selection
                        const newNode = ReactEditor.toDOMNode(
                          editor,
                          targetNode
                        );
                        newNode.scrollIntoView({
                          behavior: "smooth",
                          block: "center",
                        });
                      }
                    } catch (error) {
                      console.error("Error restoring selection:", error);
                    }
                  }
                }
              }
            } catch (error) {
              console.error("Error during page split:", error);
            }
          });
        }
      }

      // Only call original normalizeNode if we haven't made changes
      if (!shouldNormalize) {
        originalNormalizeNode(entry);
      }
    } catch (error) {
      console.error("Error in page normalization:", error);
      // Safely call original normalize as fallback
      originalNormalizeNode(entry);
    }
  };

  return editor;
};

// Helper function to create an empty page
export const createEmptyPage = (): PageElement => ({
  type: "page",
  id: `page-${Date.now()}`,
  children: [
    {
      type: "paragraph",
      children: [{ text: "" }],
    },
  ],
});

// Helper function to ensure page structure
export const normalizePageStructure = (editor: CustomEditor) => {
  try {
    const [firstNode] = Editor.nodes(editor, {
      at: [],
      match: (n) => Element.isElement(n) && n.type === "page",
    });

    if (!firstNode) {
      Transforms.insertNodes(editor, createEmptyPage(), { at: [0] });
    }
  } catch (error) {
    console.error("Error normalizing page structure:", error);
  }
};
