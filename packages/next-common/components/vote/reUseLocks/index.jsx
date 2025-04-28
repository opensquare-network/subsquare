import AllLocks from "./allLocks";
import GovLocks from "./govLocks";

const ReUseLocks = ({ reUseGovLocks, reUseAllLocks }) => {
  return (
    <div className="w-full flex flex-wrap gap-2 md:flex-row">
      <GovLocks reUseGovLocks={reUseGovLocks} />
      <AllLocks reUseAllLocks={reUseAllLocks} />
    </div>
  );
};

export default ReUseLocks;
