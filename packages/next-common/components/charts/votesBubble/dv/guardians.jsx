import DVDetailSection from "./section";

export default function DVDetailGuardians({ votes = [] }) {
  if (votes?.length === 0) {
    return null;
  }

  return <DVDetailSection title="Guardians" votes={votes} />;
}
