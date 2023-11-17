import Toggle from "next-common/components/toggle";
import TextParam from "./textParam";
import { useEffect, useState } from "react";
import FileParam from "./fileParam";
import useApi from "next-common/utils/hooks/useApi";
import { u8aToHex } from "@polkadot/util";

function FileHashOption({ isFileHash, setIsFileHash }) {
  return (
    <div className="flex gap-[8px] items-center">
      <span className="whitespace-nowrap text-[12px] font-medium text-textSecondary">
        hash a file
      </span>
      <Toggle isOn={isFileHash} onToggle={setIsFileHash} size="small" />
    </div>
  );
}

export default function Hash256Param({ value, setValue }) {
  const api = useApi();
  const [isFileHash, setIsFileHash] = useState(false);

  const [file, setFile] = useState();
  useEffect(() => {
    if (!api || !isFileHash || !file) return;
    setValue(u8aToHex(api.registry.hash(file.data)));
  }, [api, isFileHash, file, setValue]);

  return (
    <div className="flex flex-col gap-[8px]">
      <div className="flex justify-end gap-[8px]">
        <FileHashOption isFileHash={isFileHash} setIsFileHash={setIsFileHash} />
      </div>
      {isFileHash ? (
        <FileParam file={file} setFile={setFile}>
          <span className="text-textSecondary">{value}</span>
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
