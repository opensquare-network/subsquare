import { isSameAddress } from "next-common/utils/isSameAddress";

export function getUnassignAction({ status, parentStatus, isChild, remove }) {
  if (!["Funded", "Active"].includes(status?.type)) {
    return null;
  }

  const curator = status.value?.curator;
  if (!curator) {
    return null;
  }

  if (remove) {
    const parentCurator =
      isChild && parentStatus?.type === "Active"
        ? parentStatus.value?.curator
        : null;
    if (!parentCurator || isSameAddress(parentCurator, curator)) {
      return null;
    }

    return {
      origin: parentCurator,
      label:
        status.type === "Funded"
          ? "Remove proposed curator"
          : "Remove child curator",
      depositEffect: status.type === "Active" ? "burned" : null,
    };
  }

  return {
    origin: curator,
    label:
      status.type === "Funded"
        ? isChild
          ? "Decline"
          : "Decline curator role"
        : "Resign as curator",
    depositEffect: status.type === "Active" ? "returned" : null,
  };
}

export function getCuratorDeposit(option) {
  if (option.isNone) {
    return "0";
  }
  const value = option.unwrap();
  const amount = (value[0] ?? value).toString();
  if (!/^\d+$/.test(amount)) {
    throw new Error("Unrecognized curator deposit format");
  }
  return amount;
}
