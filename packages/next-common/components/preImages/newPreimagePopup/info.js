import Copyable from "next-common/components/copyable";

export default function ExtrinsicInfo({ preimageHash, preimageLength }) {
  return (
    <div className="flex flex-col rounded-[8px] bg-neutral200 mt-[24px] gap-[4px] px-[10px] py-[16px] text14Medium">
      <div className="flex justify-between">
        <span className="text-textSecondary whitespace-nowrap">
          Preimage Hash
        </span>
        <div className="max-w-[50%] text-textPrimary text-right break-all">
          <span>{preimageHash}</span>
          <div>
            <Copyable copyText={preimageHash} />
          </div>
        </div>
      </div>
      <div className="flex justify-between">
        <span className="text-textSecondary whitespace-nowrap">
          Preimage Length
        </span>
        <span className="text-textPrimary">{preimageLength}</span>
      </div>
    </div>
  );
}
