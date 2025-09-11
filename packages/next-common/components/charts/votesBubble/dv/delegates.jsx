import DVDetailSection from "./section";

export default function DVDetailDelegates({ votes = [] }) {
  return <DVDetailSection title="Delegates" votes={votes} />;
}
