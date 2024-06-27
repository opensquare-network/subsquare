import FellowshipSalaryCycleLayout from "next-common/components/fellowship/salary/cycles/layout";
import FellowshipSalaryCycleDetailNotFound from "next-common/components/fellowship/salary/cycles/notFound";

export default function AmbassadorSalaryCyclePage({ cycle }) {
  return (
    <FellowshipSalaryCycleLayout>
      {cycle ? (
        <div className="space-y-6">{/* TODO: ambassador salary cycle */}</div>
      ) : (
        <FellowshipSalaryCycleDetailNotFound />
      )}
    </FellowshipSalaryCycleLayout>
  );
}
