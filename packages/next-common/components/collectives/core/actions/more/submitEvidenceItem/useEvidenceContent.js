import { useState, useRef, useEffect } from "react";
import useFellowshipEvidenceTemplate from "./useFellowshipEvidenceTemplate";

export default function useEvidenceContent(wish) {
  const template = useFellowshipEvidenceTemplate(wish);

  const [evidenceMap, setEvidenceMap] = useState({
    retention: null,
    promotion: null,
  });

  const [currentContent, setCurrentContent] = useState("");

  const initializedRef = useRef({
    retention: false,
    promotion: false,
  });

  useEffect(() => {
    if (!template) return;

    if (!initializedRef.current[wish]) {
      setEvidenceMap((prev) => ({
        ...prev,
        [wish]: template,
      }));
      setCurrentContent(template);
      initializedRef.current[wish] = true;
    } else {
      setCurrentContent(evidenceMap[wish] || "");
    }
  }, [template, wish, evidenceMap]);

  const handleContentChange = (newContent) => {
    setCurrentContent(newContent);
    setEvidenceMap((prev) => ({
      ...prev,
      [wish]: newContent,
    }));
  };

  return {
    currentContent,
    handleContentChange,
  };
}
