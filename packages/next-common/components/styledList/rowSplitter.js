import React from "react";

export default function RowSplitter({ backgroundColor, padding }) {
  return (
    <tr>
      <td colSpan="100%" style={{ padding }}>
        <div style={{ height: "1px", backgroundColor }} />
      </td>
    </tr>
  );
}
