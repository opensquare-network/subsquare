// gov2
export const gov2TracksApi = "gov2/tracks";
export const gov2ReferendumsApi = "gov2/referendums";
export const gov2ReferendumsTrackApi = (trackId) =>
  gov2ReferendumsApi + `/track/${trackId}`;
export const gov2ReferendumsDetailApi = (index) =>
  gov2ReferendumsApi + `/${index}`;
export const gov2ReferendumsCommentApi = (id) =>
  gov2ReferendumsApi + `/${id}/comments`;
