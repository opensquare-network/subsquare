import React from "react";
import PopupLabel from "./popup/label";

export default function Labeled({ children, text, tooltip }) {
  return (
    <div>
      <PopupLabel text={text} tooltip={tooltip} />
      {children}
    </div>
  );
}
