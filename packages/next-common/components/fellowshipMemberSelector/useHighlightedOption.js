import { useCallback, useEffect, useState } from "react";

export default function useHighlightedOption(options, onSelect) {
  const [highlightedIndex, setHighlightedIndex] = useState(-1);

  const handleKeyDown = useCallback(
    (e) => {
      if (e.key === "ArrowDown") {
        setHighlightedIndex((prevIndex) =>
          prevIndex < options.length - 1 ? prevIndex + 1 : prevIndex,
        );
      } else if (e.key === "ArrowUp") {
        setHighlightedIndex((prevIndex) =>
          prevIndex > 0 ? prevIndex - 1 : prevIndex,
        );
      } else if (e.key === "Enter" && highlightedIndex >= 0) {
        onSelect(options[highlightedIndex]);
      }
    },
    [options, highlightedIndex, onSelect],
  );

  useEffect(() => {
    if (highlightedIndex >= 0) {
      const optionElement = document.querySelector(
        `.option-item-${highlightedIndex}`,
      );
      if (optionElement) {
        optionElement.scrollIntoView({
          behavior: "smooth",
          block: "nearest",
        });
      }
    }
  }, [highlightedIndex]);

  return { highlightedIndex, handleKeyDown };
}
