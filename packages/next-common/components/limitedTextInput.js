import { useEffect, useState } from "react";
import PopupLabel from "./popup/label";
import TextAreaInput from "./textAreaInput";
import { cn } from "next-common/utils";
import { noop } from "lodash-es";

export default function LimitedTextInput({
  title,
  value,
  setValue = noop,
  maxLength,
  placeholder,
  textAreaClassName,
}) {
  const [isOverLimit, setIsOverLimit] = useState(false);
  const [content, setContent] = useState(value);

  useEffect(() => {
    setIsOverLimit(content?.length >= maxLength);
  }, [content, maxLength]);

  useEffect(() => {
    setValue?.(content);
  }, [content, setValue]);

  return (
    <div>
      <div className="flex items-center justify-between">
        <PopupLabel text={title} />
        <span
          className={cn(
            "text14Medium",
            isOverLimit ? "text-red500" : "text-textTertiary",
          )}
        >
          {content?.length || 0} / {maxLength}
        </span>
      </div>
      <TextAreaInput
        className={textAreaClassName}
        value={content}
        setValue={setContent}
        maxLength={maxLength}
        placeholder={placeholder}
      />
    </div>
  );
}
