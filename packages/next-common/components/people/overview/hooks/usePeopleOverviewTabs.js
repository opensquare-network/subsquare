import { TabTitle } from "next-common/components/profile/tabs";
import PeopleOverviewIdentity from "../identity";
import PeopleOverviewJudgements from "../judgements";

export default function usePeopleOverviewTabs() {
  const tabs = [
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

  return tabs;
}
