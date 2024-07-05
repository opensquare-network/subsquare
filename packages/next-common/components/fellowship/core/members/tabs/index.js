import UrlTabs from "next-common/components/urlTabs";

// maybe used for fellowship and ambassador
export default function FellowshipMemberTabs({
  members,
  section = "fellowship",
}) {
  const membersCount = (members || []).filter(
    (member) => member.rank > 0,
  ).length;
  const candidatesCount = (members || []).filter(
    (member) => member.rank <= 0,
  ).length;
  const tabs = [
    {
      label: "Members",
      render({ active }) {
        return (
          <>
            <span
              className={`text16Bold ${
                active ? "text-textPrimary" : "text-textTertiary"
              }`}
            >
              Members
            </span>
            <span className="ml-1 text-textTertiary text14Medium">
              {membersCount}
            </span>
          </>
        );
      },
      url: `/${section}/core`,
    },
    {
      label: "Candidates",
      render({ active }) {
        return (
          <>
            <span
              className={`text16Bold ${
                active ? "text-textPrimary" : "text-textTertiary"
              }`}
            >
              Candidates
            </span>
            <span className="ml-1 text-textTertiary text14Medium">
              {candidatesCount}
            </span>
          </>
        );
      },
      url: `/${section}/core/candidates`,
    },
  ];

  return <UrlTabs tabs={tabs} className="px-6" />;
}
