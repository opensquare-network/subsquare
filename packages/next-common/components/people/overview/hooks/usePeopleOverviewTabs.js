import { TabTitle } from "next-common/components/profile/tabs";
import PeopleOverviewIdentity from "../identity";
import PeopleOverviewJudgements from "../judgements";
import PeopleOverviewTimeline from "../timeline";
import { useChainSettings } from "next-common/context/chain";

export default function usePeopleOverviewTabs() {
  const { integrations } = useChainSettings();

  let tabs = [
    {
      label({ active }) {
        return <TabTitle active={active}>Identity</TabTitle>;
      },
      value: "identity",
      content: <PeopleOverviewIdentity />,
      exactMatch: false,
    },
    {
      label({ active }) {
        return <TabTitle active={active}>Judgements</TabTitle>;
      },
      value: "judgements",
      content: <PeopleOverviewJudgements />,
      exactMatch: false,
    },
  ];

  // Hide Timeline tab if statescan is not enabled
  if (integrations?.statescan) {
    tabs.push({
      label({ active }) {
        return <TabTitle active={active}>Timeline</TabTitle>;
      },
      value: "timeline",
      content: <PeopleOverviewTimeline />,
      exactMatch: false,
    });
  }

  return tabs;
}
