import { useEffect, useState } from "react";
import { backendApi } from "../services/nextApi";

export default function useReferendumTitle(index) {
  const [title, setTitle] = useState("");
  useEffect(() => {
    backendApi.fetch(`democracy/referendums/${index}`).then(({ result }) => {
      if (result) {
        setTitle(result.title);
      }
    });
  }, [index]);

  return title;
}
