import tw from "tailwind-styled-components";
import AddressUser from "next-common/components/user/addressUser";
import {
  multisigsIsLoadingSelector,
  myMultisigsSelector,
} from "next-common/store/reducers/multisigSlice";
import { useSelector } from "react-redux";
import { Approving, Call, Signatories, Status, When } from "./fields";
import Loading from "next-common/components/loading";

const Field = tw.div`flex justify-between`;

const FieldName = tw.span`text-textTertiary`;

function Head(props) {
  return (
    <div className="flex flex-col">
      <div className="flex justify-between">
        <Call key="call" {...props} />
        <Status key="status" {...props?.state} />
      </div>
    </div>
  );
}

function Fields(props) {
  return (
    <div className="flex flex-col gap-[4px]">
      <Field>
        <FieldName>When</FieldName>
        <When key="when" {...props?.when} />
      </Field>
      <Field>
        <FieldName>Address</FieldName>
        <AddressUser key="address" add={props?.address} />
      </Field>
      <Field>
        <FieldName>Approving</FieldName>
        <Approving key="approving" {...props} />
      </Field>
      <Field>
        <FieldName>Signatories</FieldName>
        <Signatories key="signatories" {...props} />
      </Field>
    </div>
  );
}

function Item(props) {
  return (
    <div className="flex flex-col py-[16px] gap-[12px]">
      <Head {...props} />
      <Fields {...props} />
    </div>
  );
}

export default function MobileList() {
  const myMultisigs = useSelector(myMultisigsSelector);
  const isLoading = useSelector(multisigsIsLoadingSelector);

  if (isLoading) {
    return (
      <div className="text-center py-[10px]">
        <Loading size={20} />
      </div>
    );
  }

  if (myMultisigs?.items?.length === 0) {
    return (
      <div className="text-textTertiary text-center py-[10px]">
        No current multisigs
      </div>
    );
  }

  return (
    <div className="flex flex-col">
      {(myMultisigs?.items || []).map((item, index) => (
        <Item key={index} {...item} />
      ))}
    </div>
  );
}
