export default function EmailAddressRow({ email }) {
  return (
    <div className="flex gap-4 pb-2">
      <div className="flex items-center ">
        <span className="text-textTertiary text14Bold w-32">
          Email Address:
        </span>
        <span className="truncate text-textPrimary">{email}</span>
      </div>
    </div>
  );
}
