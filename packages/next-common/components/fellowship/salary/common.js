import ListLayout from "next-common/components/layout/ListLayout";
import FellowshipSalarySummary from "./summary";
import DisabledTipButton from "next-common/components/extendButton/disabledTipButton";
import useFetchFellowshipSalaryClaimants from "next-common/hooks/fellowship/salary/useFetchFellowshipSalaryClaimants";
import { SystemPlus } from "@osn/icons/subsquare";

export default function FellowshipSalaryCommon({ children, ...props }) {
  const title = "Fellowship Salary";
  const desc =
    "The salary pallet controls the periodic process of salary payments and members registration.";
  const seoInfo = { title, desc };
  useFetchFellowshipSalaryClaimants();

  return (
    <ListLayout
      seoInfo={seoInfo}
      title={title}
      description={seoInfo.desc}
      summary={<FellowshipSalarySummary />}
      button={
        <DisabledTipButton
          typeStyle="secondary"
          tipMsg="Only members can induct"
          size="small"
          iconLeft={<SystemPlus className="w-4 h-4" />}
          disabled={true}
        >
          Induct
        </DisabledTipButton>
      }
      tabs={[
        {
          label: "Cycles",
          url: "/fellowship/salary",
          exactMatch: true,
        },
        {
          label: "Claimants",
          url: "/fellowship/salary/claimants",
          exactMatch: true,
        },
        {
          label: "Feeds",
          url: "/fellowship/salary/feeds",
          exactMatch: true,
        },
      ].filter(Boolean)}
      {...props}
    >
      {children}
    </ListLayout>
  );
}
