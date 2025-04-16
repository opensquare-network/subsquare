import { SystemLoading, SystemTinyCircle } from "@osn/icons/subsquare";

export default function CircleStepper({ steps, currentStep = 0, loading }) {
  return (
    <div className="flex">
      {steps.map((item, index) => {
        return (
          <div key={item.id} className="flex-1">
            <div className="flex  items-center gap-1 py-3">
              <hr
                className={`flex-1 border-[2px] ${
                  index === 0
                    ? "border-transparent"
                    : index <= currentStep
                    ? "border-theme500"
                    : "border-neutral400"
                }`}
              />
              <div className="w-3 h-3">
                {loading && index === currentStep ? (
                  <SystemLoading className="w-3 h-3 text-theme500" />
                ) : (
                  <SystemTinyCircle
                    className={` ${
                      index <= currentStep
                        ? "text-theme500"
                        : "text-textTertiary"
                    }`}
                  />
                )}
              </div>
              <hr
                className={`flex-1 border-[2px] ${
                  steps.length === index + 1
                    ? "border-transparent "
                    : index < currentStep
                    ? "border-theme500"
                    : "border-neutral400"
                }`}
              />
            </div>
            <div className="px-4 text12Medium text-center">{item.label}</div>
          </div>
        );
      })}
    </div>
  );
}
