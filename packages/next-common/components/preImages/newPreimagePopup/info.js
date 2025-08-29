import Copyable from "next-common/components/copyable";

export default function ExtrinsicInfo({
  preimageHash,
  preimageLength,
  callData,
}) {
  return (
    <div className="flex flex-col rounded-[8px] bg-neutral200 mt-[24px] gap-[4px] px-[10px] py-[16px] text14Medium">
      {callData && (
        <div className="flex justify-between">
          <span className="text-textSecondary whitespace-nowrap min-w-[160px]">
            Call Data
          </span>
          <div className="grow text-textPrimary text-right break-all">
            <span>{callData}</span>
            <div>
              <Copyable copyText={callData} />
            </div>
          </div>
        </div>
      )}
      <div className="flex justify-between">
        <span className="text-textSecondary whitespace-nowrap min-w-[160px]">
          Preimage Hash
        </span>
        <div className="grow text-textPrimary text-right break-all">
          <span>{preimageHash}</span>
          <div>
            <Copyable copyText={preimageHash} />
          </div>
        </div>
      </div>
      <div className="flex justify-between">
        <span className="text-textSecondary whitespace-nowrap min-w-[160px]">
          Preimage Length
        </span>
        <span className="text-textPrimary">{preimageLength}</span>
      </div>
    </div>
  );
}
