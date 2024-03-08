import isMoonChain from "next-common/utils/isMoonChain";

// gov2
export const gov2TracksApi = "gov2/tracks";
export const gov2TracksSummaryApi = gov2TracksApi + "/summary";
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
export const gov2ReferendumsVoteCallsApi = (index) =>
  gov2ReferendumsApi + `/${index}/vote-calls`;
export const gov2ReferendumsVoteStatsApi = (index) =>
  gov2ReferendumsApi + `/${index}/vote-stats`;
export const gov2ReferendumsCommentApi = (id) =>
  gov2ReferendumsApi + `/${id}/comments`;
export const gov2ReferendumsSummaryApi = "gov2/referendums/summary";

// fellowship
export const fellowshipReferenda = "fellowship/referenda/";

export const getFellowshipReferendumUrl = (id) => `${fellowshipReferenda}${id}`;
export const getFellowshipReferendumCommentsUrl = (id) =>
  `${getFellowshipReferendumUrl(id)}/comments`;
export const getFellowshipReferendumVoteCallsApi = (id) =>
  `${fellowshipReferenda}${id}/vote-calls`;

// fellowship tracks
export const fellowshipTracksApi = "fellowship/tracks";
export const fellowshipTracksSummaryApi = fellowshipTracksApi + "/summary";
export const fellowshipReferendumsTrackApi = (trackId) =>
  fellowshipTracksApi + `/${trackId}/referenda`;
export const fellowshipReferendumsTracksSummaryApi = (trackId) =>
  fellowshipTracksApi + `/${trackId}/referenda/summary`;
export const fellowshipReferendumsTracksApi = (trackId) =>
  fellowshipTracksApi + `/${trackId}`;

export const fellowshipReferendumsApi = "fellowship/referenda";
export const fellowshipReferendumsSummaryApi =
  fellowshipReferendumsApi + "/summary";

export const fellowshipParamsApi = "fellowship/params";
export const fellowshipMembersApiUri = "fellowship/members";
export const fellowshipCoreFeedsApiUri = "fellowship/core/feeds";

// fellowship salary
export const fellowshipSalaryCycleApi = (index) =>
  `fellowship/salary/cycles/${index}`;

export const fellowshipSalaryCycleRegistrationsApi = (index) =>
  `fellowship/salary/cycles/${index}/registrations`;

export const fellowshipSalaryCycleRegisteredPaymentsApi = (index) =>
  `fellowship/salary/cycles/${index}/registered_payments`;

export const fellowshipSalaryCycleUnregisteredPaymentsApi = (index) =>
  `fellowship/salary/cycles/${index}/unregistered_payments`;

export const fellowshipSalaryCycleFeedsApi = (index) =>
  `fellowship/salary/cycles/${index}/feeds`;

// calender events
/**
 * param `begin_time`, `end_time`
 * get events
 */
export const calendarEventsSummaryApi = "events/summary";

export const calendarUserEventsSummaryApi = "events/user-events/summary";

/**
 * `begin_time` `end_time`
 * get event detail
 */
export const calendarEventsApi = "events";

export const calendarUserEventsApi = "events/user-events";

export const adminsApi = "admins";

export const overviewApi = {
  discussions: "overview/discussions",
  polkassemblyDiscussions: "polkassembly-discussions",
  referenda: "overview/referenda",
  fellowship: "overview/fellowship",
  democracyReferenda: "overview/democracy-referenda",
  democracyPublicProposals: "overview/public-proposals",
  democracyExternalProposals: "overview/externals",
  treasuryProposals: "overview/treasury-proposals",
  treasuryBounties: "overview/bounties",
  treasuryChildBounties: "overview/child-bounties",
  treasuryTips: "overview/tips",
  councilMotions: isMoonChain() ? "overview/moon-council" : "overview/motions",
  tcMotions: "overview/tc-motions",
  financialMotions: "overview/financial-motions",
  allianceMotions: "overview/alliance-motions",
  allianceAnnouncements: "overview/alliance-announcements",
  advisoryMotions: "overview/advisory-motions",
  // moon
  treasuryCouncilMotions: "overview/motions",
  openTCMotions: "overview/open-tc-motion",
};
