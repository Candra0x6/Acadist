"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search, ArrowUpRight, ArrowDownRight, X } from "lucide-react";

interface SearchToolbarProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  replaceQuery: string;
  setReplaceQuery: (query: string) => void;
  searchResults: any[];
  currentMatch: number;
  onFindNext: () => void;
  onFindPrevious: () => void;
  onReplace: () => void;
  onReplaceAll: () => void;
  onClose: () => void;
}

export const SearchToolbar: React.FC<SearchToolbarProps> = ({
  searchQuery,
  setSearchQuery,
  replaceQuery,
  setReplaceQuery,
  searchResults,
  currentMatch,
  onFindNext,
  onFindPrevious,
  onReplace,
  onReplaceAll,
  onClose,
}) => (
  <div className="mb-2 rounded-xl p-2 flex items-center gap-2 bg-secondary ">
    <div className="flex items-center gap-2">
      <Search className="w-4 h-4 text-gray-500" />
      <Input
        type="text"
        placeholder="Find..."
        className="h-8 w-48 border-muted-foreground"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />
      <Input
        type="text"
        placeholder="Replace with..."
        className="h-8 w-48  border-muted-foreground"
        value={replaceQuery}
        onChange={(e) => setReplaceQuery(e.target.value)}
      />
    </div>
    <div className="flex items-center gap-2">
      <Button
        variant="outline"
        size="sm"
        onClick={onFindPrevious}
        disabled={searchResults.length === 0}
      >
        <ArrowUpRight className="w-4 h-4" />
      </Button>
      <Button
        variant="outline"
        size="sm"
        onClick={onFindNext}
        disabled={searchResults.length === 0}
      >
        <ArrowDownRight className="w-4 h-4" />
      </Button>
      <Button
        variant="outline"
        size="sm"
        onClick={onReplace}
        disabled={searchResults.length === 0}
      >
        Replace
      </Button>
      <Button
        variant="outline"
        size="sm"
        onClick={onReplaceAll}
        disabled={searchResults.length === 0}
      >
        Replace All
      </Button>
      {searchResults.length > 0 && (
        <Badge variant="secondary">
          {currentMatch + 1} of {searchResults.length}
        </Badge>
      )}
      <Button variant="ghost" size="sm" onClick={onClose}>
        <X className="w-4 h-4" />
      </Button>
    </div>
  </div>
);
