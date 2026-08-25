import Loading from "next-common/components/loading";

export default function Spin({ children, spinning = false }) {
  return (
    <div aria-busy={spinning} className="relative">
      {children}
      {spinning && (
        <div
          className="absolute inset-0 z-10 flex items-center justify-center bg-neutral100-80"
          role="status"
        >
          <span aria-hidden="true">
            <Loading size={20} />
          </span>
          <span className="sr-only">Loading</span>
        </div>
      )}
    </div>
  );
}
