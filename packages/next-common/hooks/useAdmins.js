import { useEffect, useState } from "react";
import nextApi from "../services/nextApi";

export default function useAdmins() {
  const [admins, setAdmins] = useState([]);
  useEffect(() => {
    nextApi.fetch("admins").then(({ result }) => {
      if (result) {
        setAdmins(result);
      }
    });
  }, []);

  return admins;
}
