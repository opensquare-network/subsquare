import {
  gov2TrackCategoryMap,
  gov2InitialObj,
  fellowshipTrackCategoryMap,
  fellowshipInitialObj,
} from "../consts";
import { startCase } from "lodash-es";

export function isOnlyOthersCategory(data) {
  if (!data) return false;
  const keys = Object.keys(data);
  if (!data["others"] || data["others"].length === 0) return false;

  return keys.every((key) => {
    if (key === "others") return true;
    return Array.isArray(data[key]) && data[key].length === 0;
  });
}

export function isOthersExceedMax(data, otherCategoryMaxCount) {
  return data?.others && data.others.length > otherCategoryMaxCount;
}

export function combinePathWithId(listPageType, listPageCategory, id) {
  switch (listPageType) {
    case listPageCategory.FELLOWSHIP_REFERENDA:
      return `/fellowship/tracks/${id}`;
    case listPageCategory.AMBASSADOR_REFERENDA:
      return `/ambassador/tracks/${id}`;
    default:
      return `/referenda/tracks/${id}`;
  }
}

export function getTrackCategoryAndInitialObj(listPageType, listPageCategory) {
  const map = {
    [listPageCategory.REFERENDA]: {
      trackCategoryMap: gov2TrackCategoryMap,
      initialObj: gov2InitialObj,
    },
    [listPageCategory.FELLOWSHIP_REFERENDA]: {
      trackCategoryMap: fellowshipTrackCategoryMap,
      initialObj: fellowshipInitialObj,
    },
  };
  const { trackCategoryMap, initialObj: initialObjRaw } =
    map[listPageType] || {};
  const initialObj = JSON.parse(JSON.stringify(initialObjRaw));

  return { trackCategoryMap, initialObj };
}

export function flattenKusamaFellowshipReferenda(
  listPageType,
  listPageCategory,
  tracks,
) {
  return (
    {
      others: [
        ...tracks.map(({ id, name, activeCount }) => ({
          id,
          name: startCase(name),
          activeCount,
          path: combinePathWithId(listPageType, listPageCategory, id),
        })),
      ],
    } ?? {}
  );
}

export function getCategorizedTracks(listPageType, listPageCategory, tracks) {
  const { trackCategoryMap, initialObj } = getTrackCategoryAndInitialObj(
    listPageType,
    listPageCategory,
  );
  return tracks
    .map(({ id, name, activeCount }) => ({
      id,
      name: startCase(name),
      activeCount,
      path: combinePathWithId(listPageType, listPageCategory, id),
    }))
    .reduce((result, item) => {
      const category = Object.keys(trackCategoryMap ?? {}).find((key) =>
        trackCategoryMap[key].includes(item.name),
      );
      if (category) {
        result[category].push(item);
      } else if (result?.["others"]) {
        result["others"].push(item);
      }
      return result;
    }, initialObj);
}
