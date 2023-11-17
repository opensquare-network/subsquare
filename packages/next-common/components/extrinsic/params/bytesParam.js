import Toggle from "next-common/components/toggle";
import TextParam from "./textParam";
import { useCallback, useEffect, useState } from "react";
import FileParam from "./fileParam";
import { formatNumber } from "@polkadot/util";

function UploadOption({ isUpload, setIsUpload }) {
  return (
    <div className="flex gap-[8px] items-center">
      <span className="whitespace-nowrap text-[12px] font-medium text-textSecondary">
        upload file
      </span>
      <Toggle isOn={isUpload} onToggle={setIsUpload} size="small" />
    </div>
  );
}

export default function BytesParam({ value, setValue }) {
  const [isUpload, setIsUpload] = useState(false);

  const _setIsUpload = useCallback(() => {
    setIsUpload((prev) => {
      setValue("");
      return !prev;
    });
  }, [setValue]);

  const [file, setFile] = useState();
  useEffect(() => {
    if (!isUpload || !file) return;
    setValue("0x" + Buffer.from(file.data).toString("hex"));
  }, [isUpload, file, setValue]);

  return (
    <div className="flex flex-col gap-[8px]">
      <div className="flex justify-end gap-[8px]">
        <UploadOption isUpload={isUpload} setIsUpload={_setIsUpload} />
      </div>
      {isUpload ? (
        <FileParam file={file} setFile={setFile}>
          {(file) => (
            <span className="px-[16px] py-[8px] text14Medium text-textSecondary italic">
              {file.name} {formatNumber(file.data.length)} bytes
            </span>
          )}
        </FileParam>
      ) : (
        <TextParam
          value={value ?? ""}
          setValue={(v) => setValue(v ? v : undefined)}
          placeholder="0x prefixed hex, e.g. 0x1234 or ascii data"
        />
      )}
    </div>
  );
}
