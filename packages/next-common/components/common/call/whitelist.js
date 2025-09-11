import Copyable from "next-common/components/copyable";

function WhitelistCallHashList({ callHashs }) {
  return callHashs?.map((callHash, index) => (
    <Copyable key={index}>{callHash}</Copyable>
  ));
}

export default function extractWhitelistCallHash(callHashs = []) {
  if (callHashs?.length === 0) {
    return [];
  }

  return [
    [
      "Whitelist Call Hash",
      <div className="flex flex-col" key="whitelistCallHash">
        <WhitelistCallHashList callHashs={callHashs} />
      </div>,
    ],
  ];
}
