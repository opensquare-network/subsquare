import { SignerContextProvider } from "./context";

export default function MaybeSignerConnected({ children, extensionAccounts }) {
  return (
    <SignerContextProvider extensionAccounts={extensionAccounts}>
      {children}
    </SignerContextProvider>
  );
}
