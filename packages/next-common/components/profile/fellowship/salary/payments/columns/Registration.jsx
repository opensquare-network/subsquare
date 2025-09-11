import { SystemVoteAbstain, SystemVoteAye } from "@osn/icons/subsquare";

export function useProfileFellowshipSalaryPaymentRegistrationColumn(props) {
  return {
    name: "Registration",
    width: 160,
    className: "text-right",
    cellRender(data) {
      return data.isRegistered ? (
        <SystemVoteAye className="inline-block w-4 h-4" />
      ) : (
        <SystemVoteAbstain className="inline-block w-4 h-4" />
      );
    },
    ...props,
  };
}
