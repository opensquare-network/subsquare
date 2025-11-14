import Copyable from "next-common/components/copyable";
import usePreimage from "next-common/hooks/useWhitelist/usePreimage";
import { memo, useMemo } from "react";
import { SecondaryCard } from "next-common/components/styled/containers/secondaryCard";
import { InfoDocs } from "@osn/icons/subsquare";
import { cn } from "next-common/utils";

import DataList from "next-common/components/dataList";
import useColumns from "next-common/components/styledList/useColumns";

export default function List({ data, setShowArgumentsDetail, loading }) {
  const { columns } = useColumns([
    {
      name: "Hash",
      style: { textAlign: "left" },
    },
    {
      name: "Preimage",
      style: { textAlign: "right" },
    },
  ]);

  const rows = (data || []).map((hash) => {
    return [
      <div key={hash} className="text14Medium flex-1 w-full">
        <Copyable className="flex items-center" copyText={hash}>
          <span
            title={hash}
            className="text14Medium text-textPrimary inline-block w-[300px] sm:w-[200px] truncate"
          >
            {hash}
          </span>
        </Copyable>
      </div>,
      <div
        key="preimage"
        className="text14Medium flex-1 w-full flex md:justify-end"
      >
        <PreImage hash={hash} setShowArgumentsDetail={setShowArgumentsDetail} />
      </div>,
    ];
  });

  return (
    <SecondaryCard>
      <DataList
        columns={columns}
        rows={rows}
        noDataText="No current whitelist"
        loading={loading}
      />
    </SecondaryCard>
  );
}

const PreImage = memo(function PreImage({ hash, setShowArgumentsDetail }) {
  const info = usePreimage(hash);
  if (!info) {
    return null;
  }
  const { proposal } = info;

  return (
    <>
      <p className="text-textTertiary">{info.proposalWarning}</p>
      <PreImageName
        info={info}
        onClick={() => {
          setShowArgumentsDetail(proposal);
        }}
      />
    </>
  );
});

const PreImageName = ({ info, onClick }) => {
  const { proposal } = info;
  const call = useMemo(
    () =>
      proposal?.callIndex
        ? proposal.registry.findMetaCall(proposal.callIndex)
        : null,
    [proposal],
  );
  if (!call) {
    return null;
  }

  const doc = proposal?.meta?.docs[0]?.toJSON();

  const { method = "", section = "" } = call;
  const callName = `${section}.${method}`;

  return (
    <div className="flex items-center justify-end gap-1">
      <div className="flex flex-col gap-1 ">
        <div className="flex gap-1 items-center group">
          <InfoDocs
            role="button"
            className={cn(
              "w-4 h-4 relative top-[0.5px]",
              "[&_path]:stroke-textTertiary group-hover:[&_path]:stroke-textSecondary",
              "[&_path]:fill-textTertiary group-hover:[&_path]:hover:fill-textSecondary",
            )}
            onClick={onClick}
          />
          <span
            className="text-textPrimary  hover:underline cursor-pointer "
            onClick={onClick}
          >
            {callName}
          </span>
        </div>
        {doc ? (
          <span
            className="text-textSecondary text-[12px] leading-[16px] 
          "
          >
            {doc}
          </span>
        ) : null}
      </div>
    </div>
  );
};
