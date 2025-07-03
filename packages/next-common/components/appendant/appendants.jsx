import AppendItem from "./item";
import { ArrowTriangleDown } from "@osn/icons/subsquare";
import { useState } from "react";
import { cn } from "next-common/utils";

function CollapsePanel({ children }) {
  const [isCollapsed, setIsCollapsed] = useState(true);

  return (
    <div className="flex flex-col">
      <div className="w-full flex justify-between">
        <span className="text14Bold text-textPrimary">Appendants</span>

        <div role="button" onClick={() => setIsCollapsed((prev) => !prev)}>
          <ArrowTriangleDown
            className={cn(
              "w-5 h-5 text-textTertiary",
              !isCollapsed && "rotate-180",
            )}
          />
        </div>
      </div>

      {!isCollapsed && children}
    </div>
  );
}

export default function Appendants() {
  const appendants = [
    {
      _id: "6864fb42cbc36c545a89c53a",
      bounty: "660ef87b0d8ae85a5a2be95b",
      content: "Appendant content",
      contentType: "markdown",
      author: {
        username:
          "polkadot-key-0x44c72211a9dfab1dc829f223f659ded733326761a6a6723c2882ef5bbf4a7730",
        publicKey:
          "44c72211a9dfab1dc829f223f659ded733326761a6a6723c2882ef5bbf4a7730",
        address: "12ZBQqk7SD9qA7qPwpzAND6ZznXtgZuCMFWZr8xpdsVdbeva",
      },
      createdAt: "2025-07-02T09:26:26.479Z",
      updatedAt: "2025-07-02T09:26:26.479Z",
    },
    {
      _id: "68650f23c57ae15be8c6f963",
      bounty: "660ef87b0d8ae85a5a2be95b",
      content: "testtesttest",
      contentType: "markdown",
      author: {
        username:
          "polkadot-key-0xa89a4c93c8f65965c397b4dfddb8646622007907a49962c4c20d2249a2565f33",
        publicKey:
          "a89a4c93c8f65965c397b4dfddb8646622007907a49962c4c20d2249a2565f33",
        address: "14p4t6qgghkvnJiMVnxcXjQAG6hKUXfphQz2kTTPGxdQNyK2",
      },
      createdAt: "2025-07-02T10:51:15.220Z",
      updatedAt: "2025-07-02T10:51:15.220Z",
    },
    {
      _id: "6865f523c57ae15be8c6f96d",
      bounty: "660ef87b0d8ae85a5a2be95b",
      content: "test add new",
      contentType: "markdown",
      author: {
        username:
          "polkadot-key-0xa89a4c93c8f65965c397b4dfddb8646622007907a49962c4c20d2249a2565f33",
        publicKey:
          "a89a4c93c8f65965c397b4dfddb8646622007907a49962c4c20d2249a2565f33",
        address: "14p4t6qgghkvnJiMVnxcXjQAG6hKUXfphQz2kTTPGxdQNyK2",
      },
      createdAt: "2025-07-03T03:12:35.664Z",
      updatedAt: "2025-07-03T03:12:35.664Z",
    },
    {
      _id: "6865f537c57ae15be8c6f96e",
      bounty: "660ef87b0d8ae85a5a2be95b",
      content: "add new",
      contentType: "markdown",
      author: {
        username:
          "polkadot-key-0xa89a4c93c8f65965c397b4dfddb8646622007907a49962c4c20d2249a2565f33",
        publicKey:
          "a89a4c93c8f65965c397b4dfddb8646622007907a49962c4c20d2249a2565f33",
        address: "14p4t6qgghkvnJiMVnxcXjQAG6hKUXfphQz2kTTPGxdQNyK2",
      },
      createdAt: "2025-07-03T03:12:55.005Z",
      updatedAt: "2025-07-03T03:12:55.005Z",
    },
    {
      _id: "6865f662c57ae15be8c6f96f",
      bounty: "660ef87b0d8ae85a5a2be95b",
      content: "add newwww",
      contentType: "markdown",
      author: {
        username:
          "polkadot-key-0xa89a4c93c8f65965c397b4dfddb8646622007907a49962c4c20d2249a2565f33",
        publicKey:
          "a89a4c93c8f65965c397b4dfddb8646622007907a49962c4c20d2249a2565f33",
        address: "14p4t6qgghkvnJiMVnxcXjQAG6hKUXfphQz2kTTPGxdQNyK2",
      },
      createdAt: "2025-07-03T03:17:54.589Z",
      updatedAt: "2025-07-03T03:17:54.589Z",
    },
    {
      _id: "6865f671c57ae15be8c6f970",
      bounty: "660ef87b0d8ae85a5a2be95b",
      content: "add newwww123",
      contentType: "markdown",
      author: {
        username:
          "polkadot-key-0xa89a4c93c8f65965c397b4dfddb8646622007907a49962c4c20d2249a2565f33",
        publicKey:
          "a89a4c93c8f65965c397b4dfddb8646622007907a49962c4c20d2249a2565f33",
        address: "14p4t6qgghkvnJiMVnxcXjQAG6hKUXfphQz2kTTPGxdQNyK2",
      },
      createdAt: "2025-07-03T03:18:09.719Z",
      updatedAt: "2025-07-03T03:18:09.719Z",
    },
    {
      _id: "6865f7bec57ae15be8c6f974",
      bounty: "660ef87b0d8ae85a5a2be95b",
      content: "add new content, successful toast & refresh page",
      contentType: "markdown",
      author: {
        username:
          "polkadot-key-0xa89a4c93c8f65965c397b4dfddb8646622007907a49962c4c20d2249a2565f33",
        publicKey:
          "a89a4c93c8f65965c397b4dfddb8646622007907a49962c4c20d2249a2565f33",
        address: "14p4t6qgghkvnJiMVnxcXjQAG6hKUXfphQz2kTTPGxdQNyK2",
      },
      createdAt: "2025-07-03T03:23:42.971Z",
      updatedAt: "2025-07-03T03:23:42.971Z",
    },
    {
      _id: "6865fd3bc57ae15be8c6f975",
      bounty: "660ef87b0d8ae85a5a2be95b",
      content: "test code \u003Cbr /\u003E `code`",
      contentType: "markdown",
      author: {
        username:
          "polkadot-key-0xa89a4c93c8f65965c397b4dfddb8646622007907a49962c4c20d2249a2565f33",
        publicKey:
          "a89a4c93c8f65965c397b4dfddb8646622007907a49962c4c20d2249a2565f33",
        address: "14p4t6qgghkvnJiMVnxcXjQAG6hKUXfphQz2kTTPGxdQNyK2",
      },
      createdAt: "2025-07-03T03:47:07.466Z",
      updatedAt: "2025-07-03T03:47:07.466Z",
    },
  ];

  if (!appendants || appendants?.length === 0) {
    return null;
  }

  return (
    <CollapsePanel>
      {appendants?.map((item, index) => (
        <AppendItem key={item?._id} index={index} data={item} />
      ))}
    </CollapsePanel>
  );
}
