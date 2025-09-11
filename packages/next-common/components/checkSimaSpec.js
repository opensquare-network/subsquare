import {
  ProjectLogoSimaSpecDark,
  ProjectLogoSimaSpecLight,
} from "@osn/icons/subsquare";

export default function CheckSimaSpec() {
  return (
    <div className="flex px-[16px] py-[10px] gap-[16px] bg-neutral200">
      <div>
        <ProjectLogoSimaSpecDark className="hidden dark:inline-block" />
        <ProjectLogoSimaSpecLight className="dark:hidden" />
      </div>
      <div className="flex flex-col">
        <span className="text14Medium text-textSecondary">
          You will submit a system#remark transaction to publish announcements.
        </span>
        <span className="text14Medium text-[#F7574F]">Check Sima Spec</span>
      </div>
    </div>
  );
}
