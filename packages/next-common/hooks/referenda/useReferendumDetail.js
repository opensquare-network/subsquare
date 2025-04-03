import { useCallback, useEffect, useState } from "react";
import { usePageProps } from "next-common/context/page";
import Api from "next-common/services/api";

const APIKEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InV6dHh2aGpieHRscGxzcGpmZW90Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzAxMzEwOTIsImV4cCI6MjA0NTcwNzA5Mn0.dBovj6wnDvWbuK-D0GCtsdJA8Fuik3JjGZrTPB1a6No";
const ogTrackerApi = new Api(
  new URL("/rest/v1/", "https://api.ogtracker.io/rest/v1/").href,
);

const fetchReferendumDetail = async (referendumIndex) => {
  if (!referendumIndex) {
    return;
  }
  return await ogTrackerApi
    .fetch(
      "proposals?",
      { refnum: `eq.${referendumIndex}` },
      {
        headers: {
          apiKey: APIKEY,
        },
      },
    )
    .then(async ({ result }) => {
      const detail = result?.[0];
      if (!detail?.id) {
        return null;
      }
      const tasks = await fetchReferendumTasks(detail.id);
      return { ...detail, tasks };
    });
};
const fetchReferendumTasks = async (proposalId) => {
  const { result: tasks } = await ogTrackerApi.fetch(
    "tasks?",
    { proposal_id: `eq.${proposalId}`, select: "*" },
    {
      headers: {
        apiKey: APIKEY,
      },
    },
  );
  return tasks || [];
};

const useReferendumDetail = () => {
  const { id: referendumIndex } = usePageProps();
  const [detail, setDetail] = useState(null);
  const [loading, setLoading] = useState(false);

  const getReferendumDetail = useCallback(async (referendumIndex) => {
    setLoading(true);
    const detail = await fetchReferendumDetail(referendumIndex).finally(() => {
      setLoading(false);
    });
    setDetail(detail);
  }, []);

  useEffect(() => {
    getReferendumDetail(referendumIndex);
  }, [getReferendumDetail, referendumIndex]);

  return {
    detail,
    loading,
  };
};

export default useReferendumDetail;
