import AddressCombo from "next-common/components/addressCombo";
import { useExtensionAccounts } from "next-common/components/popupWithSigner/context";
import { isAddress } from "@polkadot/util-crypto";
import { useCallback, useEffect } from "react";

export default function AddressParam({ title, value, setValue }) {
  const extensionAccounts = useExtensionAccounts();
  const accounts = extensionAccounts.map((acc) => ({
    address: acc.address,
    name: acc.meta.name,
  }));

  useEffect(() => {
    setValue({
      isValid: false,
      data: "",
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const { data } = value || {};
  const _setValue = useCallback(
    (data) => {
      if (!data) {
        setValue({
          isValid: false,
          data: "",
        });
        return;
      }

      const isValid = isAddress(data);
      setValue({
        isValid,
        data,
      });
    },
    [setValue],
  );

  return (
    <>
      {title}
      <AddressCombo
        address={data ?? ""}
        setAddress={_setValue}
        accounts={accounts}
        allowInvalidAddress
      />
    </>
  );
}
