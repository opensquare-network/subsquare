import TabsList from "next-common/components/tabs/list";
import TitleSuffix from "next-common/components/titleSuffix";

// maybe used for fellowship and ambassador
export default function FellowshipMemberTabs({
  membersCount,
  candidatesCount,
  section = "fellowship",
}) {
  const tabs = [
    {
      value: "members",
      label({ active }) {
        return (
          <>
            <span
              className={`text16Bold ${
                active ? "text-textPrimary" : "text-textTertiary"
              }`}
            >
              Members
            </span>
            <TitleSuffix suffix={membersCount} />
          </>
        );
      },
      url: `/${section}/members`,
      noMatchUrls: [`/${section}/members?tab=candidates`],
      shallow: true,
    },
    {
      value: "candidates",
      label({ active }) {
        return (
          <>
            <span
              className={`text16Bold ${
                active ? "text-textPrimary" : "text-textTertiary"
              }`}
            >
              Candidates
            </span>
            <TitleSuffix suffix={candidatesCount} />
          </>
        );
      },
      url: `/${section}/members?tab=candidates`,
      matchWithQuery: true,
      shallow: true,
    },
  ];

  return <TabsList tabs={tabs} className="px-6" />;
}
