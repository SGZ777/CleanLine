"use client";

import { useState } from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";

const SearchBar = ({ value, onChange }) => {
  const [internalValue, setInternalValue] = useState("");
  const currentValue = value ?? internalValue;

  const handleChange = (e) => {
    const nextValue = e.target.value;
    setInternalValue(nextValue);

    if (typeof onChange === "function") {
      onChange(nextValue);
    }
  };

  return (
    <div className="w-max max-w-sm space-y-2">
      <div className="relative">
        <Search className="-translate-y-1/2 absolute top-1/2 left-3 h-4 w-4 text-muted-foreground" />
        <Input
          className="bg-background pl-9"
          placeholder="Pesquise..."
          type="search"
          value={currentValue}
          onChange={handleChange}
        />
      </div>
    </div>
  );
};

export default SearchBar;
