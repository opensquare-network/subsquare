import Loading from "./loading";

export default function PageLoading({ isLoading = false }) {
  if (!isLoading) {
    return null;
  }

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/25 z-[9999]">
      <Loading size={40} color="var(--textTertiary)" />
    </div>
  );
}
