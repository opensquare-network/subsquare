import { useEffect, useState } from "react";
import { backendApi } from "../services/nextApi";

export default function useCouncilMotionTitle(index) {
  const [title, setTitle] = useState("");
  useEffect(() => {
    backendApi.fetch(`motions/${index}`).then(({ result }) => {
      if (result) {
        setTitle(result.title);
      }
    });
  }, [index]);

  return title;
}
