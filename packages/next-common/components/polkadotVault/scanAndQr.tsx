import React, { useCallback, useState } from 'react';

import { QrDisplayPayload, QrScanSignature, } from '@polkadot/react-qr';
import { isHex } from '@polkadot/util';

interface SigData {
  signature: string
}

interface Props {
  address: string;
  className?: string;
  genesisHash: Uint8Array;
  isHashed: boolean;
  onSignature: (data: SigData) => void;
  payload: Uint8Array;
}

const CMD_HASH = 1;
const CMD_MORTAL = 2;

function Qr({ address, className, genesisHash, isHashed, onSignature, payload }: Props): React.ReactElement<Props> {
  const [sigError, setSigError] = useState<string | null>(null);


  const _onSignature = useCallback(
    (data: SigData): void => {
      if (isHex(data.signature)) {
        onSignature(data);
      } else {
        // const signature = data.signature;
        setSigError('Non-signature, non-hex data received from QR. Data contains "{{sample}}" instead of a hex-only signature. Please present the correct signature generated from the QR presented for submission.');
      }
    },
    [onSignature]
  );



  return (
    <>
      <div className={className}>
        <div>
          <div className='qrDisplay'>
            <QrDisplayPayload
              address={address}
              cmd={
                isHashed
                  ? CMD_HASH
                  : CMD_MORTAL
              }
              genesisHash={genesisHash}
              payload={payload}
            />
          </div>
        </div>
        <div>
          <div className='qrDisplay'>
            <QrScanSignature onScan={_onSignature} />
          </div>
        </div>
      </div>
      {sigError}
    </>
  );
}


export default React.memo(Qr);
