import { useEffect, useState } from "react";
import ogTrackerApi from "./../../services/ogTrackerApi";
import { usePageProps } from "next-common/context/page";

export const useReferendaReportDetail = () => {
  const { id: trackId } = usePageProps();
  const [detail, setDetail] = useState(null);
  const [loading, setLoading] = useState(false);

  const getReportDetail = () => {
    if (!trackId) {
      return;
    }
    setLoading(true);
    ogTrackerApi
      .fetch(
        "proposals?",
        { refnum: `eq.${trackId}` },
        {
          headers: {
            apiKey: process.env.NEXT_PUBLIC_OGTRACKER_API_KEY,
          },
        },
      )
      .then(async ({ result }) => {
        const detail = result?.[0];
        const tasks = detail ? await getReportTask(detail.id) : [];
        setDetail({ ...detail, tasks });
      })
      .finally(() => {
        setLoading(false);
      });
  };
  const getReportTask = async (proposalId) => {
    if (!proposalId) {
      return [];
    }
    const { result: task } = await ogTrackerApi.fetch(
      "tasks?",
      { proposal_id: `eq.${proposalId}`, select: "*" },
      {
        headers: {
          apiKey: process.env.NEXT_PUBLIC_OGTRACKER_API_KEY,
        },
      },
    );
    return task || [];
  };

  useEffect(() => {
    getReportDetail();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [trackId]);

  return {
    detail,
    loading,
  };
};
