import { useEffect, useState } from "react";
import nextApi from "../services/nextApi";

export default function useReferendumTitle(index) {
  const [title, setTitle] = useState("");
  useEffect(() => {
    nextApi
      .fetch(`democracy/referendums/${index}`)
      .then(({ result }) => {
        if (result) {
          setTitle(result.title);
        }
      });
  }, [index]);

  return title;
}
