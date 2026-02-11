import { useEffect, useState } from "react";
import DataList from "next-common/components/dataList";
import { backendApi } from "next-common/services/nextApi";
import {
  PostTitle,
  Referenda,
  useModuleTab,
  VoteItem,
} from "next-common/components/profile/votingHistory/common";

export default function ReferendaDelegateeDetailPopupRecentVotes({ delegate }) {
  const [data, setData] = useState();
  const [isLoading, setIsLoading] = useState(false);
  const tab = useModuleTab();
  const moduleName = tab === Referenda ? "referenda" : "democracy";

  useEffect(() => {
    setIsLoading(true);
    backendApi
      .fetch(`users/${delegate.address}/${moduleName}/votes`, {
        page: 0,
        pageSize: 10,
        includesTitle: 1,
      })
      .then(({ result }) => {
        if (result) {
          setData(result);
        }
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [delegate.address, moduleName]);

  const columns = [
    {
      name: "Proposal",
      style: {
        textAlign: "left",
        minWidth: "230px",
        paddingRight: 16,
      },
    },
    {
      name: "Vote for",
      style: { textAlign: "left", width: "264px", minWidth: "264px" },
    },
  ];

  const rows = (data?.items || []).map((item) => [
    <PostTitle
      key="proposal"
      referendumIndex={item.referendumIndex}
      title={item.proposal?.title}
    />,
    <VoteItem key="vote" vote={item} />,
  ]);

  return (
    <div>
      <DataList
        loading={isLoading}
        columns={columns}
        rows={rows}
        noDataText="No recent votes"
      />
      <div className="flex grow justify-end mt-[24px]">
        <a
          className="text14Medium text-theme500"
          href={`/user/${delegate.address}/votes${
            tab === Referenda ? "?type=Referenda" : "?type=Democracy"
          }`}
          target="_blank"
          rel="noreferrer"
        >
          View All
        </a>
      </div>
    </div>
  );
}
