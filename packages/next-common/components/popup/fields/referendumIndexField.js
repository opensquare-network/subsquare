import React, { useMemo } from "react";
import PopupLabel from "../label";
import Input from "next-common/lib/input";
import { startCase } from "lodash-es";
import { useAsync } from "react-use";
import nextApi from "next-common/services/nextApi";
import { StatusWrapper } from "../styled";
import Loading from "next-common/components/loading";
import { WarningMessage } from "next-common/components/setting/styled";
import { usePageProps } from "next-common/context/page";
import { SystemWarning } from "@osn/icons/subsquare";
import useOnChainReferendum from "next-common/hooks/referenda/useOnChainReferendum";
import { isValidIntegerIndex } from "next-common/utils/isValidIntegerIndex";

function LoadingStatus() {
  return (
    <StatusWrapper>
      <div className="flex justify-center grow">
        <Loading />
      </div>
    </StatusWrapper>
  );
}

function WarningStatus({ text }) {
  return (
    <WarningMessage className="flex justify-center">
      <div className="flex items-center justify-center gap-[8px] grow">
        <SystemWarning width={20} height={20} />
        {text}
      </div>
    </WarningMessage>
  );
}

function useReferendumTitle(referendumIndex, trackId) {
  const { tracks } = usePageProps();
  const referendumTrack = useMemo(
    () => tracks.find((track) => track.id === trackId),
    [trackId, tracks],
  );

  const { value: fetchReferendumResult, loading } = useAsync(async () => {
    if (!isValidIntegerIndex(referendumIndex)) {
      return;
    }
    return await nextApi.fetch(`gov2/referendums/${referendumIndex}`);
  }, [referendumIndex]);

  const referendumDetail = fetchReferendumResult?.result;
  const referendumTitle =
    referendumDetail?.title ||
    `[${startCase(referendumTrack?.name)}] Referendum #${referendumIndex}`;

  return {
    referendumTitle,
    isLoading: loading,
  };
}

export default function ReferendumIndexField({
  title = "Referendum Index",
  value,
  setValue,
}) {
  const {
    referendumInfo,
    isLoading: isOnChainReferendumLoading,
    isLoaded: isOnchainReferendumLoaded,
  } = useOnChainReferendum(value);
  const isOngoing = referendumInfo?.isOngoing;
  let trackId;
  if (isOngoing) {
    trackId = referendumInfo?.asOngoing?.track?.toNumber();
  }

  const { referendumTitle, isLoading: isReferendumTitleLoading } =
    useReferendumTitle(value, trackId);

  const isLoading = isOnChainReferendumLoading || isReferendumTitleLoading;

  let statusBar = null;
  if (isLoading) {
    statusBar = <LoadingStatus />;
  } else if (isOnchainReferendumLoaded) {
    if (referendumInfo) {
      if (isOngoing) {
        statusBar = (
          <StatusWrapper>
            <a
              className="cursor-pointer hover:underline"
              target="_blank"
              href={`/referenda/${value}`}
              rel="noreferrer"
            >
              {referendumTitle}
            </a>
          </StatusWrapper>
        );
      } else {
        statusBar = <WarningStatus text="Warning: not an ongoing referendum" />;
      }
    } else {
      statusBar = <WarningStatus text="Warning: can't find the referendum" />;
    }
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
