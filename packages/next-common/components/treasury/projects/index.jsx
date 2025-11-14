import dynamic from "next/dynamic";

const Statistics = dynamic(() => import("./statistics"), {
  ssr: false,
});

export default function TreasuryProjects() {
  return <Statistics />;
}
