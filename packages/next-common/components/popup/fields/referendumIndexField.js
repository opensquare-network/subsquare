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
  const { value: referendumDetail, loading } = useAsync(async () => {
    if (!isValidReferendumIndex(value)) {
      return null;
    }
    const { result, error } = await nextApi.fetch(`gov2/referendums/${value}`);
    if (error) {
      return null;
    }
    return result;
  }, [value]);
  const { tracks } = usePageProps();
  const referendumTrack = tracks.find(
    (track) => track.id === referendumDetail?.track,
  );

  return (
    <div>
      <PopupLabel text={title} />
      <Input
        type="text"
        placeholder="0"
        value={value}
        onChange={(e) => setValue(e.target.value)}
      />
      <div className="pt-[8px]">
        {isValidReferendumIndex(value) &&
          (loading ? (
            <StatusWrapper>
              <div className="flex justify-center grow">
                <Loading />
              </div>
            </StatusWrapper>
          ) : referendumDetail ? (
            <StatusWrapper>
              {referendumDetail.title ||
                `[${startCase(referendumTrack?.name)}] Referendum #${
                  referendumDetail?.referendumIndex
                }`}
            </StatusWrapper>
          ) : (
            <WarningMessage className="flex justify-center">
              <div className="flex justify-center grow">
                {"Warning: can't find the referendum"}
              </div>
            </WarningMessage>
          ))}
      </div>
    </div>
  );
}
