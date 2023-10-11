import React from "react";
import { cn } from "next-common/utils";

export default function TextInput({
  disabled = false,
  value,
  setValue = () => {},
  placeholder = "Please fill the reason...",
}) {
  return (
    <div
      className={cn(
        "flex",
        "overflow-hidden",
        "border border-neutral400 rounded-lg",
        "text14Medium text-textDisabled leading-none",
      )}
    >
      <textarea
        className={cn(
          "px-4 py-2 resize-none",
          "grow",
          "text-textPrimary text14Medium",
          "bg-transparent",
          "outline-none",
          "disabled:bg-neutral200",
          "placeholder:text-textDisabled",
        )}
        disabled={disabled}
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={(e) => setValue(e.target.value)}
      />
    </div>
  );
}
