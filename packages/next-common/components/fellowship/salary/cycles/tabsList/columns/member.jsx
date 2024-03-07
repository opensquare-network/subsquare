import { AddressUser } from "next-common/components/user";

export function useFellowshipSalaryCycleMemberColumn() {
  return {
    name: "Member",
    width: 240,
    cellRender(data) {
      return <AddressUser add={data.who} />;
    },
  };
}
