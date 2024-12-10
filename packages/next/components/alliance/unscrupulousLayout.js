import UnscrupulousSummary from "components/alliance/unscrupulousSummary";
import ListLayout from "next-common/components/layout/ListLayout";

export default function UnscrupulousLayout({ children, accounts, websites }) {
  const category = "Unscrupulous";
  const seoInfo = { title: category, desc: category };

  return (
    <ListLayout
      seoInfo={seoInfo}
      title={category}
      description="The current list of accounts/websites deemed unscrupulous."
      summary={
        <UnscrupulousSummary
          accounts={accounts?.length}
          websites={websites?.length}
        />
      }
      tabs={[
        {
          value: "accounts",
          label: "Accounts",
          url: "/alliance/unscrupulous",
        },
        {
          value: "websites",
          label: "Websites",
          url: "/alliance/unscrupulous/websites",
        },
      ]}
    >
      {children}
    </ListLayout>
  );
}
