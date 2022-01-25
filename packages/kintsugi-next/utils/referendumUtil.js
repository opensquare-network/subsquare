import BigNumber from "bignumber.js";

export function getThresholdOfSimplyMajority() {
  return "50%";
}

export function getThresholdOfSuperMajorityAgainst(nays, turnout, totalIssuance) {
  const bnNays = new BigNumber(nays);
  const sqrtOfTotalIssuance = new BigNumber(totalIssuance).sqrt();
  const sqrtOfTurnout = new BigNumber(turnout).sqrt();
  if (bnNays.isZero() || sqrtOfTurnout.isZero() || sqrtOfTotalIssuance.isZero()) {
    return "1%";
  }

  const bnAyes = bnNays.times(sqrtOfTurnout).div(sqrtOfTotalIssuance);
  return `${bnAyes.div(bnAyes.plus(bnNays)).times(100).toFixed(0)}%`;
}

export function getThresholdOfSuperMajorityApprove(nays, turnout, totalIssuance) {
  const bnNays = new BigNumber(nays);
  const sqrtOfTotalIssuance = new BigNumber(totalIssuance).sqrt();
  const sqrtOfTurnout = new BigNumber(turnout).sqrt();
  if (bnNays.isZero() || sqrtOfTurnout.isZero() || sqrtOfTotalIssuance.isZero()) {
    return "1%";
  }

  const bnAyes = bnNays.times(sqrtOfTotalIssuance).div(sqrtOfTurnout);
  return `${bnAyes.div(bnAyes.plus(bnNays)).times(100).toFixed(0)}%`;
}

function compareRationals(n1, d1, n2, d2) {
  while (true) {
    const q1 = n1.div(d1);
    const q2 = n2.div(d2);

    if (q1.lt(q2)) {
      return true;
    } else if (q2.lt(q1)) {
      return false;
    }

    const r1 = n1.mod(d1);
    const r2 = n2.mod(d2);

    if (r2.isZero()) {
      return false;
    } else if (r1.isZero()) {
      return true;
    }

    n1 = d2;
    n2 = d1;
    d1 = r2;
    d2 = r1;
  }
}

export function calcPassing(referendumInfo, totalIssuance) {
  if (!referendumInfo) {
    return false;
  }
  const ayes = new BigNumber(referendumInfo.tally.ayes);
  const nays = new BigNumber(referendumInfo.tally.nays);
  const turnout = new BigNumber(referendumInfo.tally.turnout);
  const sqrtTurnout = turnout.sqrt();
  const sqrtElectorate = new BigNumber(totalIssuance).sqrt();

  const threshold = referendumInfo.threshold;
  if (threshold === "SimpleMajority") {
    return ayes.gt(nays);
  }

  if (sqrtTurnout.isZero()) {
    return false;
  }

  if (threshold === "SuperMajorityApprove") {
    return compareRationals(nays, sqrtTurnout, ayes, sqrtElectorate);
  } else { // threshold === "SuperMajorityAgainst"
    return compareRationals(nays, sqrtElectorate, ayes, sqrtTurnout);
  }
}
