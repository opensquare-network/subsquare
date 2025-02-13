import tw from "tailwind-styled-components";
import AddressUser from "next-common/components/user/addressUser";
import { Approving, Call, Signatories, Status, When } from "./fields";
import Loading from "next-common/components/loading";
import MultisigSignField from "./signField";

const Field = tw.div`flex justify-between`;

const FieldName = tw.span`text-textTertiary`;

function Head({ multisig }) {
  return (
    <div className="flex justify-between items-start text-textPrimary">
      <Call
        key="call"
        when={multisig.when}
        call={multisig.call}
        callHash={multisig.callHash}
        callHex={multisig.callHex}
      />
      <MultisigSignField multisig={multisig} />
    </div>
  );
}

function Fields({ multisig }) {
  return (
    <div className="flex flex-col gap-[4px] text-textPrimary">
      <Field className="mb-3">
        <FieldName></FieldName>
        <Status
          key="status"
          name={multisig.state.name}
          args={multisig.state.args}
        />
      </Field>
      <Field>
        <FieldName>When</FieldName>
        <When
          key="when"
          height={multisig.when.height}
          index={multisig.when.index}
        />
      </Field>
      <Field>
        <FieldName>Address</FieldName>
        <AddressUser key="address" add={multisig?.address} />
      </Field>
      <Field>
        <FieldName>Approving</FieldName>
        <Approving
          key="approving"
          approvals={multisig.approvals}
          threshold={multisig.threshold}
        />
      </Field>
      <Field>
        <FieldName>Signatories</FieldName>
        <Signatories key="signatories" signatories={multisig.signatories} />
      </Field>
    </div>
  );
}

function Item({ multisig }) {
  return (
    <div className="flex flex-col py-[16px] gap-[12px]">
      <Head multisig={multisig} />
      <Fields multisig={multisig} />
    </div>
  );
}

export default function MobileList({ multisigs = [], isLoading = false }) {
  if (isLoading) {
    return (
      <div className="text-center py-[10px]">
        <Loading size={20} />
      </div>
    );
  }

  if (multisigs?.length === 0) {
    return (
      <div className="text-textTertiary text-center py-[10px]">
        No current multisigs
      </div>
    );
  }

  return (
    <div className="flex flex-col">
      {(multisigs || []).map((item, index) => (
        <Item key={index} multisig={item} />
      ))}
    </div>
  );
}
