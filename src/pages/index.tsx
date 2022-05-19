import React, { FC, useEffect, useState } from 'react';
import { Q2Loading } from '@nueve/q2-tecton-react';
import { IActions, ISources } from 'q2-tecton-sdk';
import { useActions, useSources } from 'q2-tecton-hooks';
import { connect } from 'react-redux';
import router from 'next/router';
import Link from '../components/Link';
import { useLinkToken } from '~/modules/link/hooks';
import { useEnv } from '~/modules/envData/hooks';

export interface HomeProps {}

const Home: FC<HomeProps> = (props: HomeProps) => {
  const actions: IActions | null = useActions();
  const sources: ISources | null = useSources();
  const [linkToken, fetchLinkToken] = useLinkToken();
  const [env, fetchEnv] = useEnv();
  const [newToken, setNewToken] = useState('');
  const [reLogin, setReLogin] = useState(false);

  useEffect(() => {
    if (env?.env && !linkToken?.token) {
      fetchLinkToken();
    }
  }, [env]);

  useEffect(() => {
    fetchEnv();
  }, []);

  useEffect(() => {
    if (linkToken?.message) {
      handleError();
    }
  }, [linkToken]);

  async function handleError() {
    actions?.clearLoadingModal!();
    let actionName = '';
    actionName = (await actions?.showModal!({
      modalType: 'error',
      title: 'Error',
      message: `${linkToken?.message}` || 'Error in submitting the form ',
      close: false,
      button1: {
        text: 'OK',
        actionName: 'Clicked_OK'
      }
    })) as string;
    if (actionName === 'Clicked_OK' || actionName === 'close') {
      await actions?.navigateTo!('landingPage');
    }
  }

  useEffect(() => {
    if (linkToken?.token) {
      setNewToken(linkToken?.token);
    }
  }, [linkToken?.token]);

  async function handleLinkNewToken(id: string) {
    await setNewToken('');
    const result: any = await sources?.requestExtensionData!({
      route: 'get_link_token_via_db',
      body: {
        transaction_id: id
      }
    });
    await setReLogin(true);
    await setNewToken(result?.data?.payload?.link_token);
  }

  return (
    <div className="pad(3) mrg-b(4)" style={{ height: '600px' }}>
      {newToken && env ? (
        <Link
          token={newToken}
          env={env?.env}
          transactions={env?.transactions_exists}
          getEnv={() => fetchEnv()}
          handleHistory={() =>
            actions?.navigateTo!('ExternalAccount', 'Status')
          }
          handleSuccess={() => router.push('/success')}
          handleLinkToken={(id: string) => {
            handleLinkNewToken(id);
          }}
          reLogin={reLogin}
        />
      ) : (
        <Q2Loading style={{ display: 'flex', justifyContent: 'center' }} />
      )}
    </div>
  );
};

export default Home;
// export default connect(
//   (state: any) => ({
//     baseUrl: state.env?.Q2SDK_ASSET_BASE_URLS
//   }),
//   {}
// )(Home);
