import React from "react";
import RowSplitter from "./rowSplitter";
import { StyledTh } from "./styled";

export function Headers({ columns }) {
  return (
    <thead>
      <tr>
        {columns.map((col, index) => (
          <StyledTh key={index} style={col.style} className={col.className}>
            <div className="text12Bold h-[inherit]">{col.name}</div>
          </StyledTh>
        ))}
      </tr>
      <RowSplitter backgroundColor="var(--neutral300)" />
    </thead>
  );
}
