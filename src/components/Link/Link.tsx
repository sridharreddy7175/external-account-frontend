import React, { useCallback, useEffect, useState, FC } from 'react';
import { usePlaidLink } from 'react-plaid-link';
import { IActions, ISources } from 'q2-tecton-sdk';
import { Q2Btn } from '@nueve/q2-tecton-react';
import { useActions, useSources } from 'q2-tecton-hooks';
import { Box } from 'theme-ui';
import { useExternalAccount } from '~/modules/externalAccount/hooks';
import { deleteAccount } from '~/modules/externalAccount/hooks';

export interface NormalLinkProps {
  token?: any;
  env?: string;
  transactions?: boolean;
  getEnv?: any;
  handleHistory?: any;
  handleSuccess?: any;
  handleLinkToken?: any;
  reLogin?: boolean;
}

export const styles = {
  fontStyles: {
    fontWeight: 'bold'
  }
};

const NormalLink: FC<NormalLinkProps> = (props: NormalLinkProps) => {
  const { token, transactions, handleLinkToken, reLogin } = props;
  const actions: IActions | null = useActions();
  const sources: ISources | null = useSources();
  const [newToken, setNewToken] = useState('');
  const [externalAccount, setExternalAccount] = useExternalAccount();
  const [, deleteExternalAccount] = deleteAccount();
  const [link, setLink] = useState(false);

  const onSuccess = useCallback(
    async (public_token, metadata) => {
      // console.log(newToken, token, 'on success');
      if (reLogin) {
        console.log('new api');

        const result: any = await sources?.requestExtensionData!({
          route: 'add_external_account',

          body: {
            publicToken: public_token,

            verificationStatus: metadata.status,

            accountType: metadata.account.subtype,

            accountId: metadata.account_id,

            re_authentication: externalAccount?.result?.re_authentication,

            transaction_id: externalAccount?.transaction_id
          }
        });

        console.log('Addddresult', result);
      } else {
        setExternalAccount(
          metadata,
          metadata.accounts[0].verification_status,
          public_token,
          metadata.accounts[0].subtype
        );
      }
      actions?.showLoadingModal!('Almost done...');
    },
    [props?.env]
  );

  const onExit = useCallback(async () => {
    setLink(false);
  }, []);

  const onEvent = useCallback(async (eventName, metadata) => {
    console.log('event name meta data', eventName, metadata);
  }, []);

  const config = {
    token,
    onSuccess,
    env: props?.env,
    onExit,
    onEvent
  };

  const { open, ready } = usePlaidLink(config);

  useEffect(() => {
    if (reLogin) {
      console.log(token, 'token in link after relogin');
      if (!ready) {
        return;
      }
      setLink(true);
      open();
    }
  }, [ready, open, reLogin]);

  useEffect(() => {
    if (
      externalAccount?.verification_status === 'pending_manual_verification' &&
      link
    ) {
      handlePendingAccount();
    }
    if (
      externalAccount?.result?.status !== undefined &&
      link &&
      externalAccount?.result?.status !== 403
    )
      handleAddExternalAccount();
  }, [externalAccount]);

  async function handlePendingAccount() {
    actions?.clearLoadingModal!();
    let actionName = '';
    actionName = (await actions?.showModal!({
      modalType: 'info',
      title: 'Pending',
      message: 'Your request to add an external account is pending. ',
      close: false,
      button1: {
        text: 'OK',
        actionName: 'Clicked_OK_ERROR'
      }
    })) as string;
    if (actionName === 'close' || actionName === 'Clicked_OK_ERROR') {
      deleteExternalAccount();
      setLink(false);
      props?.getEnv();
    }
  }

  async function handleAddExternalAccount() {
    actions?.clearLoadingModal!();
    let actionName = '';
    if (
      externalAccount?.result?.status &&
      externalAccount?.result?.status !== 500
    ) {
      props?.handleSuccess();
    } else {
      console.log('else handle Suceesss');

      actionName = (await actions?.showModal!({
        modalType: 'error',
        title: 'Error',
        message:
          externalAccount?.add_external_account_response?.Result
            ?.ErrorDescription ||
          externalAccount?.error_description ||
          externalAccount?.message ||
          'Error in submitting the form ',
        close: false,
        button1: {
          text: 'OK',
          actionName: 'Clicked_RELOGIN_ERROR'
        },
        button2: {
          text: 'CANCEL',
          actionName: 'Clicked_CANCEL'
        }
      })) as string;
      if (actionName === 'Clicked_RELOGIN_ERROR') {
        await onExit();
        await handleLinkToken(externalAccount?.transaction_id);
        await setLink(false);
      }
      if (actionName === 'close' || actionName === 'Clicked_CANCEL') {
        actions?.navigateTo!('landingPage');
      }
    }
  }

  async function handleOpenLink() {
    setLink(true);
    open();
  }

  function renderDetails() {
    return (
      <Box>
        <h2>Getting Started</h2>
        <ul>
          <li>
            Choose{' '}
            <span style={{ fontWeight: 'bold' }}>Add External Account</span>{' '}
            below to begin
          </li>
          <li>
            Enter your financial institution’s login credentials to instantly
            link your external account
          </li>
          <li>
            OR enter your financial institution’s routing and account number,
            then in 1-2 business days choose{' '}
            <span style={{ fontWeight: 'bold' }}>Verify Micro-deposits</span>{' '}
            below
          </li>
          <li>
            Voila! Go to{' '}
            <span style={{ fontWeight: 'bold' }}>
              Menu – Move Money – Transfer Funds
            </span>{' '}
            to transfer to or from your newly linked external account
          </li>
        </ul>
        <Box style={{ justifyContent: 'center' }}>
          <p>
            To remove an External Transfer account, in the menu choose{' '}
            <span style={{ fontWeight: 'bold' }}>Preferences</span>,{' '}
            <span style={{ fontWeight: 'bold' }}>Display Preferences</span>,
            then select the External Account and choose{' '}
            <span style={{ fontWeight: 'bold' }}> Remove. </span>
          </p>
          <p>
            If you wish to add an external account for viewing access only,
            simply navigate to the main menu and select{' '}
            <span style={{ fontWeight: 'bold' }}> Link Account </span>
          </p>
        </Box>
        <Box
          className="pad-t(2)"
          style={{ display: 'flex', justifyContent: 'center' }}
        >
          <Q2Btn
            onClick={() => handleOpenLink()}
            disabled={!ready}
            color="primary"
          >
            Add External Account
          </Q2Btn>
        </Box>
        <Box style={{ display: 'flex', justifyContent: 'center' }}>
          <p style={{ fontSize: '12px' }}>(Domestic U.S. Accounts Only)</p>
        </Box>
        <Box
          className="pad-b(4)"
          style={{ display: 'flex', justifyContent: 'center' }}
        >
          {/* <Link href="/history" as="/history"> */}
          <Q2Btn
            onClick={() => props?.handleHistory()}
            color="primary"
            disabled={!transactions}
          >
            Verify Micro-deposits
          </Q2Btn>
          {/* </Link> */}
        </Box>
      </Box>
    );
  }
  return <Box>{link ? null : renderDetails()}</Box>;
};

export default NormalLink;
