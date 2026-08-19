import { backendApi } from "next-common/services/nextApi";
import getChainSettings from "next-common/utils/consts/settings";
import { defaultPageSize, EmptyList } from "next-common/utils/constants";
import { tryConvertToSubstrateAddress } from "next-common/utils/mixedChainUtil";
import {
  ambassadorCoreFeedsApiUri,
  ambassadorMembersApiUri,
  ambassadorParamsApi,
  fellowshipCoreFeedsApiUri,
  fellowshipMemberActiveEvidenceApi,
  fellowshipMemberHeatmapApi,
  fellowshipMemberLastSalaryPaymentApi,
  fellowshipMembersApiUri,
  fellowshipParamsApi,
  fellowshipReferendaMaxIndexApi,
} from "next-common/services/url";

const sectionConfig = {
  fellowship: {
    module: "fellowship",
    membersApi: fellowshipMembersApiUri,
    feedsApi: fellowshipCoreFeedsApiUri,
    paramsApi: fellowshipParamsApi,
    maxIndexApi: fellowshipReferendaMaxIndexApi,
    salaryApi: fellowshipMemberLastSalaryPaymentApi,
    heatmapApi: fellowshipMemberHeatmapApi,
    evidenceApi: fellowshipMemberActiveEvidenceApi,
    membersProp: "fellowshipMembers",
    feedsProp: "fellowshipFeeds",
    paramsProp: "fellowshipParams",
    maxIndexProp: "fellowshipReferendaMaxIndex",
    salaryProp: "lastSalaryPayment",
    heatmapProp: "fellowshipMemberHeatmap",
    evidenceProp: "fellowshipMemberActiveEvidence",
  },
  ambassador: {
    module: "ambassador",
    membersApi: ambassadorMembersApiUri,
    feedsApi: ambassadorCoreFeedsApiUri,
    paramsApi: ambassadorParamsApi,
    membersProp: "ambassadorMembers",
    feedsProp: "ambassadorFeeds",
    paramsProp: "ambassadorParams",
  },
};

/**
 * Fetch the collective (fellowship/ambassador) related props for a user
 * profile page.
 *
 * Members list and feeds are always fetched when the module is enabled,
 * since they are required on every user page render to decide whether to
 * show the fellowship/ambassador tab.
 *
 * Chain-level params / max index and per-user salary / heatmap / evidence
 * are only fetched when the user is currently viewing the section tab
 * (`active`), because they are only used there.
 *
 * @param {string} id raw user id from the url
 * @param {"fellowship"|"ambassador"} section
 * @param {object} [options]
 * @param {boolean} [options.active=false] whether the current tab is this section
 * @param {number} [options.page=1] feeds page
 */
export async function fetchCollectiveUserProfileProps(
  id,
  section,
  { active = false, page = 1 } = {},
) {
  const config = sectionConfig[section];
  if (!config) {
    return {};
  }

  const chainSettings = getChainSettings(process.env.NEXT_PUBLIC_CHAIN);
  if (!chainSettings.modules[config.module]) {
    return {};
  }

  const maybeAddress = tryConvertToSubstrateAddress(id);

  const [{ result: members }, { result: feeds }, activeProps = {}] =
    await Promise.all([
      backendApi.fetch(config.membersApi),
      backendApi.fetch(config.feedsApi, {
        page,
        page_size: defaultPageSize,
        who: id,
      }),
      active ? fetchActiveSectionProps(id, maybeAddress, config) : {},
    ]);

  return {
    [config.membersProp]: members ?? null,
    [config.feedsProp]: feeds ?? EmptyList,
    ...activeProps,
  };
}

async function fetchActiveSectionProps(id, maybeAddress, config) {
  const { result: params } = await backendApi.fetch(config.paramsApi);

  const props = {
    [config.paramsProp]: params ?? {},
  };

  if (config.maxIndexApi) {
    const { result } = await backendApi.fetch(config.maxIndexApi);
    props[config.maxIndexProp] = result?.maxReferendumIndex ?? null;
  }

  if (config.salaryApi) {
    const { result } = await backendApi.fetch(config.salaryApi(id));
    props[config.salaryProp] = result ?? {};
  }

  if (config.heatmapApi) {
    const { result } = await backendApi.fetch(config.heatmapApi(maybeAddress));
    props[config.heatmapProp] = result ?? [];
  }

  if (config.evidenceApi) {
    const { result } = await backendApi.fetch(config.evidenceApi(maybeAddress));
    props[config.evidenceProp] = result ?? null;
  }

  return props;
}
