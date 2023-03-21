import { useEffect, useState } from "react";
import nextApi from "../services/nextApi";

export default function useCouncilMotionTitle(index) {
  const [title, setTitle] = useState("");
  useEffect(() => {
    nextApi
      .fetch(`motions/${index}`)
      .then(({ result }) => {
        if (result) {
          setTitle(result.title);
        }
      });
  }, [index]);

  return title;
}
