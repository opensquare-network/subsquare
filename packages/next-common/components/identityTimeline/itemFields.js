import tw from "tailwind-styled-components";
import { stringUpperFirst } from "@polkadot/util";
import TimelineItemFields from "./timeline/itemFields";
import { omit } from "lodash-es";
import { useChainSettings } from "next-common/context/chain";
import AddressUser from "next-common/components/user/addressUser";
import ValueDisplay from "next-common/components/valueDisplay";
import { toPrecision } from "next-common/utils";
import Copyable from "next-common/components/copyable";

const Text = tw.span``;

function CopyableAddress({ address }) {
  return <Copyable>{address}</Copyable>;
}

function getFields(timelineItem, chainSetting) {
  switch (timelineItem.name) {
    case "IdentitySet": {
      const args = {
        ...omit(timelineItem.args, ["additional"]),
        ...timelineItem.args.additional,
      };
      return Object.fromEntries(
        Object.entries(args).map(([key, value]) => [
          stringUpperFirst(key),
          <Text key={key}>{value.toString()}</Text>,
        ]),
      );
    }
    case "JudgementRequested":
    case "JudgementUnrequested": {
      return {
        RegistrarIndex: <Text>{timelineItem.args.registrar?.index}</Text>,
        RegistrarAddress: (
          <AddressUser
            ellipsis={false}
            add={timelineItem.args.registrar?.account}
          />
        ),
      };
    }
    case "JudgementGiven": {
      return {
        RegistrarIndex: <Text>{timelineItem.args.registrarIndex}</Text>,
        RegistrarAddress: (
          <AddressUser
            ellipsis={false}
            add={timelineItem.args.registrarAddress}
          />
        ),
        Judgement: <Text>{timelineItem.args.judgement}</Text>,
        Fee: (
          <Text>
            <ValueDisplay
              value={toPrecision(timelineItem.args.fee, chainSetting.decimals)}
              symbol={chainSetting.symbol}
            />
          </Text>
        ),
      };
    }
    case "setSubs": {
      if (timelineItem.args.subs) {
        return {
          Subs: (
            <div className="flex flex-col gap-[24px]">
              {timelineItem.args.subs?.map(({ account, data }) => (
                <div key={account} className="flex flex-col gap-[4px]">
                  <CopyableAddress ellipsis={false} address={account} />
                  <Text>{data}</Text>
                </div>
              ))}
            </div>
          ),
        };
      }

      if (timelineItem.args.parent) {
        return {
          Parent: (
            <CopyableAddress
              ellipsis={false}
              address={timelineItem.args.parent}
            />
          ),
          Name: <Text>{timelineItem.args.data}</Text>,
        };
      }

      return {};
    }
    case "renameSub": {
      if (timelineItem.args.sub) {
        return {
          Sub: <AddressUser ellipsis={false} add={timelineItem.args.sub} />,
          Name: <Text>{timelineItem.args.data}</Text>,
        };
      }

      if (timelineItem.args.parent) {
        return {
          Parent: (
            <AddressUser ellipsis={false} add={timelineItem.args.parent} />
          ),
          Name: <Text>{timelineItem.args.data}</Text>,
        };
      }

      return {};
    }
    case "IdentityKilled": {
      return {
        Slashed: (
          <Text>
            <ValueDisplay
              value={toPrecision(
                timelineItem.args.slashed,
                chainSetting.decimals,
              )}
              symbol={chainSetting.symbol}
            />
          </Text>
        ),
      };
    }
    case "SubIdentityAdded":
    case "SubIdentityRemoved":
    case "SubIdentityRevoked": {
      const args = {
        Deposit: (
          <Text>
            <ValueDisplay
              value={toPrecision(
                timelineItem.args.deposit,
                chainSetting.decimals,
              )}
              symbol={chainSetting.symbol}
            />
          </Text>
        ),
      };

      if (timelineItem.args.sub) {
        return {
          Sub: <AddressUser ellipsis={false} add={timelineItem.args.sub} />,
          ...args,
        };
      }

      if (timelineItem.args.parent) {
        return {
          Parent: (
            <AddressUser ellipsis={false} add={timelineItem.args.parent} />
          ),
          ...args,
        };
      }

      return args;
    }
    default: {
      return Object.fromEntries(
        Object.entries(timelineItem.args).map(([key, value]) => [
          stringUpperFirst(key),
          <Text key={key}>{value.toString()}</Text>,
        ]),
      );
    }
  }
}

export default function IdentityTimelineItemFields({ item }) {
  const chainSetting = useChainSettings();
  const fields = Object.entries(getFields(item, chainSetting));
  return <TimelineItemFields fields={fields} />;
}
