import useFetchFellowshipCoreMembers from "next-common/hooks/fellowship/core/useFetchFellowshipCoreMembers";

export default function AmbassadorCoreCommon() {
  // const title = "Ambassador Core";
  // const desc =
  //   "The core pallet controls the overall process of induction, promotion and demotion according to the ambassador rules and timelines, and handles the retention of evidence which members and candidates submit for these processes.";
  // const seoInfo = { title, desc };
  useFetchFellowshipCoreMembers();
}
