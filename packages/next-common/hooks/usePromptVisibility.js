import { useState, useEffect } from "react";

export default function usePromptVisibility(storageKey, shouldShow = false) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!shouldShow) {
      return;
    }

    const isClosed = sessionStorage.getItem(storageKey) === "true";
    if (!isClosed) {
      setVisible(true);
    }
  }, [storageKey, shouldShow]);

  const handleClose = () => {
    setVisible(false);
    sessionStorage.setItem(storageKey, "true");
  };

  return {
    visible,
    setVisible,
    handleClose,
  };
}
