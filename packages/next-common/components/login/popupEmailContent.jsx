import { useState } from "react";
import styled from "styled-components";
import { Option } from "next-common/components/addressSelect";
import VerifyEmail from "next-common/components/login/verifyEmail";
import EmailInput from "next-common/components/login/emailInput";
import ConfirmEmail from "next-common/components/login/confirmEmail";
import useIdentity from "next-common/utils/hooks/useIdentity";
import GhostButton from "../buttons/ghostButton";
import { PageTitleContainer } from "../styled/containers/titleContainer";
import { CACHE_KEY } from "../../utils/constants";
import CheckboxIcon from "../icons/checkbox";
import { useCookieValue } from "../../utils/hooks/useCookieValue";
import { useChain } from "next-common/context/chain";
import { useUser } from "next-common/context/user";
import { useLocalStorage } from "usehooks-ts";
import { GreyPanel } from "../styled/containers/greyPanel";
import { useLoginPopup } from "next-common/hooks/useLoginPopup";

const Label = styled.div`
  margin-bottom: 8px;
  font-weight: bold;
  font-size: 12px;
`;

export default function LoginPopupEmailContent() {
  const chain = useChain();
  const loginUser = useUser();
  const address = loginUser?.address;
  const [accountMap] = useLocalStorage(CACHE_KEY.accountMap, {});
  const accountName = accountMap?.[address];
  const [errors, setErrors] = useState();
  const [email, setEmail] = useState("");
  const [pin, setPin] = useState("");
  const [dontRemindEmail, setDontRemindEmail] = useCookieValue(
    CACHE_KEY.dontRemindEmail,
    false,
  );
  const { closeLoginPopup } = useLoginPopup();

  const identity = useIdentity(address, chain);

  return (
    <div className="space-y-6">
      <PageTitleContainer>Login with Web3 address</PageTitleContainer>

      <GreyPanel className="text14Medium px-4 py-2.5 !rounded-lg">
        Set email for receiving notifications
      </GreyPanel>

      <div>
        <Label>Web3 address</Label>
        <div className="[&_div]:rounded-lg">
          <Option item={{ address, name: accountName }} selected />
        </div>
      </div>

      <div className="space-y-2">
        <EmailInput
          identity={identity}
          email={email}
          setEmail={setEmail}
          errors={errors}
          setErrors={setErrors}
        />
      </div>

      {email &&
        (email !== identity?.info?.email || !identity?.isAuthorized) && (
          <div>
            <VerifyEmail
              pin={pin}
              setPin={setPin}
              email={email}
              errors={errors}
              setErrors={setErrors}
            />
          </div>
        )}

      <div className="space-y-2">
        <ConfirmEmail
          pin={pin}
          email={email}
          identity={identity}
          setErrors={setErrors}
        />
        <GhostButton isFill onClick={closeLoginPopup}>
          Skip
        </GhostButton>
        <span
          className="inline-flex items-center select-none space-x-2 text14Medium text-textSecondary"
          onClick={() => {
            setDontRemindEmail(!dontRemindEmail);
          }}
        >
          <CheckboxIcon checked={dontRemindEmail} />
          <span>Don{"'"}t remind me next time</span>
        </span>
      </div>
    </div>
  );
}
