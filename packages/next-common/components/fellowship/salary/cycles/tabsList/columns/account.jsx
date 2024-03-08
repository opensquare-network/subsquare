import { AddressUser } from "next-common/components/user";

export function useFellowshipSalaryCycleAccountColumn() {
  return {
    name: "Account",
    width: 240,
    cellRender(data) {
      return <AddressUser add={data.who} />;
    },
  };
}
