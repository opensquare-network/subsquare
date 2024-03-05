import Toggle from "next-common/components/toggle";
import { useEffect, useState } from "react";
import FileParam from "./fileParam";
import { u8aToHex } from "@polkadot/util";
import TextParam from "./textParam";
import { useContextApi } from "next-common/context/api";

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

export default function Hash256Param({ title, value, setValue }) {
  const { data } = value || {};
  const api = useContextApi();
  const [isFileHash, setIsFileHash] = useState(false);
  const [file, setFile] = useState();

  useEffect(() => {
    if (!api || !isFileHash || !file) {
      return;
    }
    const data = u8aToHex(api.registry.hash(file.data));
    setValue({
      isValid: true,
      data,
    });
  }, [api, isFileHash, file, setValue]);

  return (
    <>
      <div className="flex items-center justify-between">
        {title}
        <div className="flex justify-end gap-[8px]">
          <FileHashOption
            isFileHash={isFileHash}
            setIsFileHash={setIsFileHash}
          />
        </div>
      </div>

      <div className="flex flex-col gap-[8px]">
        {isFileHash ? (
          <FileParam file={file} setFile={setFile}>
            <span className="text-textSecondary">{data}</span>
          </FileParam>
        ) : (
          <TextParam
            value={value}
            setValue={setValue}
            placeholder="0x prefixed hex, e.g. 0x1234 or ascii data"
          />
        )}
      </div>
    </>
  );
}
