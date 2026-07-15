import React from "react";
import { FILTERS } from "../constants";
import FilterSection from "./FilterSection";
import type { FilterChangeHandler, FilterState } from "../types";

export interface FilterListProps {
  filterState: FilterState;
  onChange: FilterChangeHandler;
}

export default function FilterList({ filterState, onChange }: FilterListProps) {
  return (
    <div className="px-1">
      {FILTERS.map((section) => (
        <FilterSection
          key={section.id}
          section={section}
          value={filterState[section.id]}
          onChange={onChange}
        />
      ))}
    </div>
  );
}
