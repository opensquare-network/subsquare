export const PAYOUT_DESTINATION = {
  COMPOUND: "compound",
  THIS_ACCOUNT: "this_account",
  ANOTHER_ACCOUNT: "another_account",
  NONE: "none",
};

export const PAYEE_TYPE = {
  NONE: "none",
  STAKED: "staked",
  STASH: "stash",
  ACCOUNT: "account",
};

function createPayoutOptionLabel(title, description) {
  return (
    <div className="flex flex-col overflow-hidden">
      <div className="text14Medium text-textPrimary whitespace-nowrap">
        {title}
      </div>
      <div className="text12Medium text-textTertiary whitespace-nowrap">
        {description}
      </div>
    </div>
  );
}

export const PAYOUT_DESTINATION_OPTIONS = [
  {
    label: createPayoutOptionLabel(
      "Compound",
      "Add payouts to your existing staked balance automatically.",
    ),
    value: PAYOUT_DESTINATION.COMPOUND,
  },
  {
    label: createPayoutOptionLabel(
      "To your account",
      "Payouts are sent to your account as free balance.",
    ),
    value: PAYOUT_DESTINATION.THIS_ACCOUNT,
  },
  {
    label: createPayoutOptionLabel(
      "To another account",
      "Send payouts to another account as free balance.",
    ),
    value: PAYOUT_DESTINATION.ANOTHER_ACCOUNT,
  },
  {
    label: createPayoutOptionLabel("None", "Have no payout destination set."),
    value: PAYOUT_DESTINATION.NONE,
  },
];

export function parsePayeeData(payeeData, currentAddress) {
  if (PAYEE_TYPE.NONE in payeeData) {
    return { destination: PAYOUT_DESTINATION.NONE };
  }

  if (PAYEE_TYPE.STAKED in payeeData) {
    return { destination: PAYOUT_DESTINATION.COMPOUND };
  }

  if (PAYEE_TYPE.STASH in payeeData) {
    return { destination: PAYOUT_DESTINATION.THIS_ACCOUNT };
  }

  if (PAYEE_TYPE.ACCOUNT in payeeData) {
    const accountAddress = payeeData.account;
    const isCurrentAccount = accountAddress === currentAddress;

    return {
      destination: isCurrentAccount
        ? PAYOUT_DESTINATION.THIS_ACCOUNT
        : PAYOUT_DESTINATION.ANOTHER_ACCOUNT,
      customAddress: isCurrentAccount ? null : accountAddress,
    };
  }

  return { destination: PAYOUT_DESTINATION.COMPOUND };
}

export function buildPayeeParam(destination, realAddress, customAddress) {
  const payeeMap = {
    [PAYOUT_DESTINATION.NONE]: "None",
    [PAYOUT_DESTINATION.COMPOUND]: { Staked: null },
    [PAYOUT_DESTINATION.THIS_ACCOUNT]: { Stash: null },
    [PAYOUT_DESTINATION.ANOTHER_ACCOUNT]: { Account: customAddress },
  };

  return payeeMap[destination];
}
