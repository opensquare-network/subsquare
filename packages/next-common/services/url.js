// gov2
export const gov2TracksApi = "gov2/tracks";
export const gov2ReferendumsTrackApi = (trackId) =>
  gov2TracksApi + `/${trackId}/referendums`;
export const gov2ReferendumsTracksSummaryApi = (trackId) =>
  gov2TracksApi + `/${trackId}` + "/referendums/summary";
export const gov2ReferendumsTracksApi = (trackId) =>
  gov2TracksApi + `/${trackId}`;

export const gov2ReferendumsApi = "gov2/referendums";
export const gov2ReferendumsDetailApi = (index) =>
  gov2ReferendumsApi + `/${index}`;
export const gov2ReferendumsVoteExtrinsicsApi = (index) =>
  gov2ReferendumsApi + `/${index}/vote-extrinsics`;
export const gov2ReferendumsCommentApi = (id) =>
  gov2ReferendumsApi + `/${id}/comments`;
export const gov2ReferendumsSummaryApi = gov2ReferendumsApi + "/summary";

// fellowship
export const fellowshipTracksApi = "fellowship/tracks";
export const fellowshipReferendumsTrackApi = (trackId) =>
  fellowshipTracksApi + `/${trackId}/referenda`;
export const fellowshipReferendumsTracksSummaryApi = (trackId) =>
  fellowshipTracksApi + `/${trackId}/referenda/summary`;
export const fellowshipReferendumsTracksApi = (trackId) =>
  fellowshipTracksApi + `/${trackId}`;

export const fellowshipReferendumsApi = "fellowship/referenda";
export const fellowshipReferendumsDetailApi = (index) =>
  fellowshipReferendumsApi + `/${index}`;
export const fellowshipReferendumsVoteExtrinsicsApi = (index) =>
  fellowshipReferendumsApi + `/${index}/vote-extrinsics`;
export const fellowshipReferendumsCommentApi = (id) =>
  fellowshipReferendumsApi + `/${id}/comments`;
export const fellowshipReferendumsSummaryApi =
  fellowshipReferendumsApi + "/summary";
