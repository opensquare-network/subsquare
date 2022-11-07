// gov2
export const gov2TracksApi = "/api/gov2/tracks";
export const gov2ReferendumsTrackApi = (trackId) =>
  "/api/gov2/referendums/track" + `/${trackId}`;
export const gov2ReferendumsTrackDetailApi = (index) =>
  gov2ReferendumsTrackApi + `/${index}`;
export const gov2ReferendumsTrackCommentApi = (id) =>
  gov2ReferendumsTrackApi + `/${id}/comments`;
