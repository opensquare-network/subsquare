import { useThemeSetting } from "next-common/context/theme";

const thresholdCommon = {
  tension: 0.1,
  borderWidth: 2,
  pointRadius: 0,
  pointHitRadius: 10,
  pointHoverRadius: 5,
};

const valueCommon = {
  borderDash: [5, 3],
  ...thresholdCommon,
};

export function useSupportThresholdDatasetConfig(data = []) {
  const { purple500 } = useThemeSetting();

  return {
    label: "Support",
    data,
    borderColor: purple500,
    ...thresholdCommon,
  };
}

export function useApprovalThresholdDatasetConfig(data) {
  const { green500 } = useThemeSetting();
  return {
    label: "Approval",
    data,
    borderColor: green500,
    ...thresholdCommon,
  };
}

export function useSupportValueDatasetConfig(data = []) {
  const { purple500 } = useThemeSetting();
  return {
    label: "Current Support",
    data: [...(data || [])],
    borderColor: purple500,
    ...valueCommon,
  };
}

export function useApprovalValueDatasetConfig(data = []) {
  const { green500 } = useThemeSetting();
  return {
    label: "Current Approval",
    data: [...(data || [])],
    borderColor: green500,
    ...valueCommon,
  };
}
