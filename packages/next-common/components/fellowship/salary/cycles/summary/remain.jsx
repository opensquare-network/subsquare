import RemainLabel from "./remainLabel";

export default function getCycleRemainSummaryItem(
  registrationPercentage,
  registrationRemain,
  registrationTime,
  payoutPercentage,
  payoutRemain,
  payoutTime,
) {
  return {
    content: (
      <div className="space-y-1">
        <RemainLabel
          percentage={registrationPercentage}
          label={"Registration"}
          remain={registrationRemain}
          time={registrationTime}
        />
        <RemainLabel
          percentage={payoutPercentage}
          label={"Payout"}
          remain={payoutRemain}
          time={payoutTime}
        />
      </div>
    ),
  };
}
