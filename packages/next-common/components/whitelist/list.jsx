import Copyable from "next-common/components/copyable";
import usePreimage from "next-common/hooks/useWhitelist/usePreimage";
import { memo, useMemo } from "react";
import { SecondaryCard } from "next-common/components/styled/containers/secondaryCard";
import { InfoDocs } from "@osn/icons/subsquare";
import { cn } from "next-common/utils";

export default function List({ data, setShowArgumentsDetail }) {
  return (
    <SecondaryCard>
      <div className="datalist-head flex items-center pb-3 border-b border-neutral300 max-md:hidden">
        <div className="text-textTertiary text14Medium flex-1 w-full">Hash</div>
        <div className="text-textTertiary text14Medium flex-1 w-full text-end">
          Preimage
        </div>
      </div>
      <div className="w-full scrollbar-hidden overflow-auto text-textPrimary bg-neutral100">
        {data.map((hash) => (
          <div
            key={hash}
            className="datalist-item border-b border-neutral300 group/datalist-item w-full flex items-center py-4 max-md:block relative"
          >
            <div className="relative datalist-desktop-item w-full flex flex-col sm:flex-row gap-2 sm:gap-0 items-center">
              <div className="text14Medium flex-1 w-full">
                <Copyable
                  className="flex items-center"
                  copyText={hash}
                  title={hash}
                >
                  <span className="text14Medium text-textPrimary inline-block w-[300px] sm:w-[200px] truncate">
                    {hash}
                  </span>
                </Copyable>
              </div>
              <div className="text14Medium flex-1 w-full flex md:justify-end">
                <PreImage
                  hash={hash}
                  setShowArgumentsDetail={setShowArgumentsDetail}
                />
              </div>
            </div>
          </div>
        ))}
      </div>
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
