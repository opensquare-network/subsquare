import { useCallback } from "react";

function getUpdatedItems(newItems, itemIndex, valueOrFunction) {
  const oldValue = newItems[itemIndex];
  let newValue = valueOrFunction;
  if (typeof valueOrFunction === "function") {
    newValue = valueOrFunction(oldValue);
  }
  newItems[itemIndex] = newValue;
  return newItems;
}

export function useArrayItemState({ items, itemIndex, setItems }) {
  const setValue = useCallback(
    (valueOrFunction) => {
      setItems((items) => {
        const newItems = items ? [...items] : [];
        return getUpdatedItems(newItems, itemIndex, valueOrFunction);
      });
    },
    [itemIndex, setItems],
  );

  return [items?.[itemIndex], setValue];
}

export function useObjectItemState({ items, itemIndex, setItems }) {
  const setValue = useCallback(
    (valueOrFunction) => {
      setItems((items) => {
        const newItems = items ? { ...items } : {};
        return getUpdatedItems(newItems, itemIndex, valueOrFunction);
      });
    },
    [itemIndex, setItems],
  );

  return [items?.[itemIndex], setValue];
}
