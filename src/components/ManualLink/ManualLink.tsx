import React, { useCallback, useEffect, FC } from 'react';
import { usePlaidLink } from 'react-plaid-link';
import { useActions } from 'q2-tecton-hooks';
import { IActions } from 'q2-tecton-sdk';
import { useExternalAccount } from '~/modules/externalAccount/hooks';

export interface ManualLinkProps {
  token?: any;
  env?: string;
  onChangeLink?: any;
  uniqueId?: Number;
  handleSuccess?: any;
}

const ManualLink: FC<ManualLinkProps> = (props: ManualLinkProps) => {
  const { token, onChangeLink, uniqueId } = props;

  const actions: IActions | null = useActions();
  const [externalAccount, setExternalAccount] = useExternalAccount();

  const onSuccess = useCallback(
    async (public_token, metadata) => {
      setExternalAccount(
        metadata,
        metadata.accounts[0].verification_status,
        public_token,
        metadata.accounts[0].subtype,
        uniqueId
      );
      actions?.showLoadingModal!('Almost done...');
    },
    [props?.env]
  );

  const onExit = useCallback(async () => {
    onChangeLink();
  }, []);

  async function handleError(errorMessage: string) {
    let actionName = '';
    actionName = (await actions?.showModal!({
      modalType: 'error',
      title: 'Error',
      message: errorMessage,
      close: false,
      button1: {
        text: 'OK',
        actionName: 'Clicked_OK_ERROR'
      }
    })) as string;
    if (actionName === 'close' || actionName === 'Clicked_OK_ERROR') {
      actions?.navigateTo!('landingPage');
    }
  }

  useEffect(() => {
    if (
      externalAccount?.status !== undefined &&
      externalAccount?.status !== 403
    )
      handleAddExternalAccount();
  }, [externalAccount]);

  async function handleAddExternalAccount() {
    actions?.clearLoadingModal!();
    if (externalAccount?.status && externalAccount?.status !== 500) {
      props?.handleSuccess();
    } else {
      const error =
        externalAccount?.add_external_account_response?.Result
          ?.ErrorDescription ||
        externalAccount?.error_description ||
        externalAccount?.message ||
        'Error in submitting the form ';
      handleError(error);
    }
  }

  const onEvent = useCallback(async (eventName, metadata) => {
    console.log('event name meta data manual', eventName, metadata);
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
    if (!ready) {
      return;
    }
    open();
  }, [ready, open]);

  return null;
};

export default ManualLink;
