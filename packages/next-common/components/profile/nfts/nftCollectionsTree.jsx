import { useEffect, useRef, useState } from "react";
import { cn } from "next-common/utils";
import Link from "next-common/components/link";
import Caret from "next-common/components/icons/caret";
import FieldLoading from "next-common/components/icons/fieldLoading";
import { useChainSettings } from "next-common/context/chain";
import { useAssetHubPapi } from "next-common/hooks/chain/useAssetHubApi";
import { fetchCollectionItemNames } from "./useAccountNftCollections";
import { useNftItemActions } from "./nftItemActions";

function getSubscanCollectionLink(domain, collectionId) {
  return domain
    ? `https://${domain}.subscan.io/nft_collection/${collectionId}?tab=tokens`
    : null;
}

function getSubscanItemLink(domain, collectionId, itemId) {
  return domain
    ? `https://${domain}.subscan.io/nft_item/${collectionId}-${itemId}`
    : null;
}

function NftLink({ link, title, className, children }) {
  if (!link) {
    return (
      <span title={title} className={className}>
        {children}
      </span>
    );
  }

  return (
    <Link
      href={link}
      target="_blank"
      title={title}
      className={cn("hover:text-theme500 hover:underline", className)}
      onClick={(e) => e.stopPropagation()}
    >
      {children}
    </Link>
  );
}

function NftName({ name, link }) {
  if (name === undefined) {
    return <FieldLoading size={16} />;
  }

  if (!name) {
    return "-";
  }

  return (
    <NftLink link={link} title={name}>
      {name}
    </NftLink>
  );
}

function NftItemRow({ collectionId, itemId, name, link }) {
  const ItemActions = useNftItemActions();

  return (
    <div className="flex items-center w-full py-2 pl-9">
      <NftLink link={link} className="text14Medium text-textTertiary shrink-0">
        Item #{itemId}
      </NftLink>
      <span className="flex-1 min-w-0 mx-3 truncate text14Medium text-textPrimary">
        <NftName name={name} link={link} />
      </span>
      {ItemActions ? (
        <>
          {/* eslint-disable-next-line react-hooks/static-components */}
          <ItemActions collectionId={collectionId} itemId={itemId} />
        </>
      ) : (
        <span className="text14Medium text-textPrimary shrink-0">1</span>
      )}
    </div>
  );
}

function NftItems({ collection }) {
  const api = useAssetHubPapi();
  const { assethubMigration } = useChainSettings();
  const [names, setNames] = useState({});

  // Item ids are already known from the account query, so rows render at once
  // and only their names are loaded (cached per collection).
  useEffect(() => {
    if (!api) {
      return;
    }

    let cancelled = false;
    const applyName = (itemId, name) => {
      if (!cancelled) {
        setNames((prev) => ({ ...prev, [itemId]: name }));
      }
    };

    fetchCollectionItemNames(api, collection, applyName).then((namesMap) => {
      if (!cancelled) {
        setNames(Object.fromEntries(namesMap));
      }
    });

    return () => {
      cancelled = true;
    };
  }, [api, collection]);

  return collection.itemIds.map((itemId) => (
    <NftItemRow
      key={itemId}
      collectionId={collection.collectionId}
      itemId={itemId}
      name={names[itemId]}
      link={getSubscanItemLink(
        assethubMigration?.subscanAssethubDomain,
        collection.collectionId,
        itemId,
      )}
    />
  ));
}

function NftCollection({ collection, expanded, onToggle }) {
  const { assethubMigration } = useChainSettings();
  const { collectionId, name, itemIds } = collection;
  const collectionLink = getSubscanCollectionLink(
    assethubMigration?.subscanAssethubDomain,
    collectionId,
  );

  return (
    <div className="border-b border-neutral200 last:border-b-0">
      <div
        role="button"
        aria-expanded={expanded}
        className="flex items-center w-full py-3 cursor-pointer select-none"
        onClick={onToggle}
      >
        <span
          className={cn(
            "inline-flex w-4 mr-1 shrink-0 transition-transform",
            !expanded && "-rotate-90",
          )}
        >
          <Caret isGrey />
        </span>
        <NftLink
          link={collectionLink}
          className="text14Medium text-textTertiary shrink-0"
        >
          Collection #{collectionId}
        </NftLink>
        <span className="flex-1 min-w-0 mx-3 truncate text14Medium text-textPrimary">
          <NftName name={name} link={collectionLink} />
        </span>
        <span className="text14Medium text-textTertiary shrink-0">
          {itemIds.length}
        </span>
      </div>

      {expanded && <NftItems collection={collection} />}
    </div>
  );
}

const COLLAPSED_MAX_HEIGHT = 320;

export default function NftCollectionsTree({ collections }) {
  const [expandedKeys, setExpandedKeys] = useState(() => new Set());
  const [showAll, setShowAll] = useState(false);
  const [overflow, setOverflow] = useState(false);
  const contentRef = useRef(null);

  useEffect(() => {
    const el = contentRef.current;
    if (el) {
      setOverflow(el.scrollHeight > COLLAPSED_MAX_HEIGHT);
    }
  }, [collections, expandedKeys]);

  const collapsed = overflow && !showAll;

  const toggle = (key) => {
    setExpandedKeys((prev) => {
      const next = new Set(prev);
      if (next.has(key)) {
        next.delete(key);
      } else {
        next.add(key);
      }
      return next;
    });
  };

  return (
    <div className="flex flex-col">
      <div
        ref={contentRef}
        className={cn("flex flex-col", collapsed && "overflow-hidden")}
        style={collapsed ? { maxHeight: COLLAPSED_MAX_HEIGHT } : undefined}
      >
        {collections.map((collection) => (
          <NftCollection
            key={collection.collectionId}
            collection={collection}
            expanded={expandedKeys.has(collection.collectionId)}
            onToggle={() => toggle(collection.collectionId)}
          />
        ))}
      </div>
      {overflow && (
        <button
          type="button"
          className="self-center mt-3 text14Medium text-theme500 cursor-pointer"
          onClick={() => setShowAll((prev) => !prev)}
        >
          {showAll ? "Show less" : "Show all"}
        </button>
      )}
    </div>
  );
}
