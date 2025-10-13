import Copyable from "next-common/components/copyable";
import usePreimage from "next-common/hooks/useWhitelist/usePreimage";
import { useMemo } from "react";
import useColumns from "../styledList/useColumns";
import DataList from "next-common/components/dataList";
import { SecondaryCard } from "next-common/components/styled/containers/secondaryCard";
import { InfoDocs } from "@osn/icons/subsquare";
import { cn } from "next-common/utils";

export default function List({ setShowArgumentsDetail, data }) {
  return (
    <div>
      <div className="hidden md:block">
        <DesktopList
          data={data}
          setShowArgumentsDetail={setShowArgumentsDetail}
        />
      </div>
      <div className="md:hidden space-y-2">
        <MobileList
          data={data}
          setShowArgumentsDetail={setShowArgumentsDetail}
        />
      </div>
    </div>
  );
}

function DesktopList({ data, setShowArgumentsDetail }) {
  const { columns } = useColumns([
    {
      name: "Hash",
      style: { textAlign: "left" },
    },

    {
      name: "Preimage",
      style: { textAlign: "left" },
    },
  ]);

  const rows = (data || []).map((hash) => {
    return [
      <div key="hash">
        <Copyable key="hash" className="flex items-center" copyText={hash}>
          <span className="text14Medium text-textPrimary inline-block w-[200px]  truncate">
            {hash}
          </span>
        </Copyable>
      </div>,
      <PreImage
        key="name"
        hash={hash}
        setShowArgumentsDetail={setShowArgumentsDetail}
      />,
    ];
  });

  return (
    <SecondaryCard>
      <DataList
        columns={columns}
        rows={rows}
        noDataText="No current preimages"
      />
    </SecondaryCard>
  );
}

const PreImage = ({ hash, setShowArgumentsDetail }) => {
  const info = usePreimage(hash);
  if (!info) {
    return null;
  }
  const { proposal } = info;

  return (
    <div className=" text14Medium">
      <p className="text-textTertiary">{info.proposalWarning}</p>
      <PreImageName
        info={info}
        onClick={() => {
          setShowArgumentsDetail(proposal);
        }}
      />
    </div>
  );
};

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
    <div className="flex items-center gap-1">
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

function MobileList({ data, setShowArgumentsDetail }) {
  return data.map((hash) => {
    return (
      <SecondaryCard key={hash}>
        <div key="hash">
          <Copyable key="hash" className="flex items-center" copyText={hash}>
            <span className="text14Medium text-textPrimary inline-block w-[300px]  truncate">
              {hash}
            </span>
          </Copyable>
        </div>
        <PreImage
          key="name"
          hash={hash}
          setShowArgumentsDetail={setShowArgumentsDetail}
        />
      </SecondaryCard>
    );
  });
}
