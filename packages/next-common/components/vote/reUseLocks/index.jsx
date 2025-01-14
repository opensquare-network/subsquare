import AllLocks from "./allLocks";
import GovLocks from "./govLocks";

const ReUseLocks = ({ reUseGovLocks, reUseAllLocks }) => {
  return (
    <div className="grid grid-cols-2 w-full gap-2 max-sm:grid-cols-1">
      <GovLocks reUseGovLocks={reUseGovLocks} />
      <AllLocks reUseAllLocks={reUseAllLocks} />
    </div>
  );
};

export default ReUseLocks;
