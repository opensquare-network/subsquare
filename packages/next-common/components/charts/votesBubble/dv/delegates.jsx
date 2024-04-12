import DVDelegateCard from "./card";

export default function DVDetailDelegates() {
  return (
    <div className="space-y-4 text-textPrimary">
      <div className="text14Bold mt-6 mb-4">
        Delegates
        <span className="text14Medium text-textTertiary ml-1">7</span>
      </div>

      <div className="max-h-[400px] scrollbar-pretty overflow-y-scroll space-y-2">
        <DVDelegateCard
          type="aye"
          address="1ZSPR3zNg5Po3obkhXTPR95DepNBzBZ3CyomHXGHK9Uvx6w"
        />
        <DVDelegateCard
          type="nay"
          address="1ZSPR3zNg5Po3obkhXTPR95DepNBzBZ3CyomHXGHK9Uvx6w"
        />
        <DVDelegateCard
          type="abstain"
          address="1ZSPR3zNg5Po3obkhXTPR95DepNBzBZ3CyomHXGHK9Uvx6w"
        />
        <DVDelegateCard
          type="aye"
          address="1ZSPR3zNg5Po3obkhXTPR95DepNBzBZ3CyomHXGHK9Uvx6w"
        />

        <hr className="!my-4" />

        <DVDelegateCard
          type="unvote"
          address="1ZSPR3zNg5Po3obkhXTPR95DepNBzBZ3CyomHXGHK9Uvx6w"
        />
        <DVDelegateCard
          type="unvote"
          address="1ZSPR3zNg5Po3obkhXTPR95DepNBzBZ3CyomHXGHK9Uvx6w"
        />
      </div>
    </div>
  );
}
