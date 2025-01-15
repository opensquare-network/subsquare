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

const votesCommon = {
  ...thresholdCommon,
  borderWidth: 0,
  yAxisID: "y1",
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

export function useAyesValueDatasetConfig(data = []) {
  const { green100Solid } = useThemeSetting();
  return {
    label: "Aye",
    data: [...(data || [])],
    fill: true,
    backgroundColor: green100Solid,
    ...votesCommon,
    order: 2,
  };
}

export function useNaysValueDatasetConfig(data = []) {
  const { red100Solid } = useThemeSetting();
  return {
    label: "Nay",
    data: [...(data || [])],
    fill: true,
    backgroundColor: red100Solid,
    ...votesCommon,
    order: 1,
  };
}
