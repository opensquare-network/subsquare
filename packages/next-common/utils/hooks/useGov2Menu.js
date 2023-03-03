import { useEffect, useMemo, useState } from "react";
import { useMenuHasGov2 } from "../../context/chain";
import { usePageProps } from "../../context/page";
import nextApi from "../../services/nextApi";
import { fellowshipTracksApi, gov2TracksApi } from "../../services/url";
import { resolveGov2TracksMenu } from "../../utils/consts/menu/gov2";

export function useGov2Menu() {
  const props = usePageProps();
  const hasGov2 = useMenuHasGov2();
  const [tracks, setTracks] = useState(props.tracks ?? []);
  const [fellowshipTracks, setFellowshipTracks] = useState(
    props.fellowshipTracks ?? [],
  );

  useEffect(() => {
    if (hasGov2) {
      if (!tracks.length) {
        nextApi.fetch(gov2TracksApi).then(({ result }) => {
          setTracks(result);
        });
      }
      if (!fellowshipTracks.length) {
        nextApi.fetch(fellowshipTracksApi).then(({ result }) => {
          setFellowshipTracks(result);
        });
      }
    }
  }, [hasGov2, tracks, fellowshipTracks]);

  const menu = useMemo(() => {
    if (hasGov2) {
      return resolveGov2TracksMenu(tracks, fellowshipTracks);
    }
    return [];
  }, [hasGov2, tracks, fellowshipTracks]);

  return menu;
}
