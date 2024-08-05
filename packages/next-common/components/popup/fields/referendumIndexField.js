import React from "react";
import PopupLabel from "../label";
import Input from "next-common/components/input";
import { isInteger, startCase } from "lodash-es";
import { useAsync } from "react-use";
import nextApi from "next-common/services/nextApi";
import { StatusWrapper } from "../styled";
import Loading from "next-common/components/loading";
import { WarningMessage } from "next-common/components/setting/styled";
import { usePageProps } from "next-common/context/page";

const isValidReferendumIndex = (value) =>
  value !== "" && isInteger(Number(value));

export default function ReferendumIndexField({
  title = "Referendum Index",
  value,
  setValue,
}) {
  const { value: fetchReferendumResult, loading } = useAsync(async () => {
    if (!isValidReferendumIndex(value)) {
      return null;
    }
    return await nextApi.fetch(`gov2/referendums/${value}`);
  }, [value]);

  const referendumDetail = fetchReferendumResult?.result;
  const fetchError = fetchReferendumResult?.error;

  const { tracks } = usePageProps();
  const referendumTrack = tracks.find(
    (track) => track.id === referendumDetail?.track,
  );

  let statusBar = null;
  if (loading) {
    statusBar = (
      <StatusWrapper>
        <div className="flex justify-center grow">
          <Loading />
        </div>
      </StatusWrapper>
    );
  } else if (referendumDetail) {
    statusBar = (
      <StatusWrapper>
        {referendumDetail.title ||
          `[${startCase(referendumTrack?.name)}] Referendum #${
            referendumDetail?.referendumIndex
          }`}
      </StatusWrapper>
    );
  } else if (fetchError) {
    statusBar = (
      <WarningMessage className="flex justify-center">
        <div className="flex justify-center grow">
          {"Warning: can't find the referendum"}
        </div>
      </WarningMessage>
    );
  }

  return (
    <div>
      <PopupLabel text={title} />
      <Input
        type="text"
        placeholder="0"
        value={value}
        onChange={(e) => setValue(e.target.value)}
      />
      <div className="pt-[8px]">{statusBar}</div>
    </div>
  );
}
