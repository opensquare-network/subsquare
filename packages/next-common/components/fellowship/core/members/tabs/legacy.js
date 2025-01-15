import TabsList from "next-common/components/tabs/list";
import TitleSuffix from "next-common/components/titleSuffix";

// maybe used for fellowship and ambassador
export default function LegacyFellowshipMemberTabs({
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
      url: `/${section}/core`,
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
      url: `/${section}/core/candidates`,
    },
  ];

  return <TabsList tabs={tabs} className="px-6" />;
}
