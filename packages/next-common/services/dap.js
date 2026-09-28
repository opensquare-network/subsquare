import BigNumber from "bignumber.js";
import { BN_BILLION, BN_HUNDRED, u8aToString } from "@polkadot/util";
import { sortBy } from "lodash-es";
import calcTransferable from "next-common/utils/account/transferable";

const recipientNames = {
  staker_rewards: "Staker rewards",
  validator_incentive: "Validator incentive",
  buffer: "Buffer",
};
const recipientOrder = Object.keys(recipientNames);

function buildDapAllocations(recipients, accounts) {
  const allocations = recipients.map(([key, address, share], index) => {
    const id = u8aToString(key);
    return {
      id,
      name: recipientNames[id] ?? id,
      address: address.toString(),
      // Perbill shares describe the issuance budget, not account balances.
      percentage: new BigNumber(share.toString())
        .dividedBy(BN_BILLION.toString())
        .multipliedBy(BN_HUNDRED.toString())
        .toFixed(),
      balance: accounts[index].data.free.toString(),
    };
  });

  return sortBy(allocations, ({ id }) => {
    const index = recipientOrder.indexOf(id);
    return index < 0 ? recipientOrder.length : index;
  });
}

function calcPendingBalance({ free, frozen, reserved }, existentialDeposit) {
  // Match DAP's on_idle transfer: reducible_balance(Preserve, Polite).
  return new BigNumber(
    calcTransferable(
      {
        free: free.toString(),
        frozen: frozen.toString(),
        reserved: reserved.toString(),
      },
      existentialDeposit.toString(),
    ),
  ).toFixed();
}

export async function fetchDapData(api, total, options) {
  // Read views and balances at the same finalized block as the watched supply.
  const [inactive, recipients, staging, existentialDeposit] = await Promise.all(
    [
      api.query.Balances.InactiveIssuance.getValue(options),
      api.view.Dap.budget_recipients(options),
      api.view.Dap.staging(options),
      api.constants.Balances.ExistentialDeposit(options),
    ],
  );
  const accounts = await api.query.System.Account.getValues(
    [...recipients.map(([, address]) => [address]), [staging]],
    options,
  );

  const allocations = buildDapAllocations(recipients, accounts);
  const buffer = allocations.find(({ id }) => id === "buffer")?.balance;
  const pending = calcPendingBalance(
    accounts[recipients.length].data,
    existentialDeposit,
  );
  const totalSupply = total.toString();
  const inactiveSupply = inactive.toString();
  let funds;
  if (buffer !== undefined) {
    funds = new BigNumber(buffer).plus(pending).toFixed();
  }

  return {
    totalSupply,
    inactiveSupply,
    activeSupply: new BigNumber(totalSupply).minus(inactiveSupply).toFixed(),
    buffer,
    pending,
    funds,
    allocations,
  };
}
