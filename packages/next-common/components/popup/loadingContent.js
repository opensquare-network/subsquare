import Loading from "../loading";

export function LoadingContent({ isLoading, children }) {
  if (isLoading) {
    return (
      <div className="flex justify-center">
        <Loading size={20} />
      </div>
    );
  }
  return children;
}
