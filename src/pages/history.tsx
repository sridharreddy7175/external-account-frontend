import React, { FC, useEffect, useState } from 'react';
import { useActions, useSources } from 'q2-tecton-hooks';
import { IActions, ISources } from 'q2-tecton-sdk';
import { useRouter } from 'next/router';
import { connect } from 'react-redux';
import { Box } from 'theme-ui';
import { Q2Btn } from '@nueve/q2-tecton-react';
import Col from '~/components/Col';
import Row from '~/components/Row';
import StatusBox from '~/components/StatusBox';
import ManualLink from '~/components/ManualLink';

export interface HistoryProps {
  env?: string;
}

export const styles = {};

const History: FC<HistoryProps> = (props: HistoryProps) => {
  const actions: IActions | null = useActions();
  const sources: ISources | null = useSources();
  const router = useRouter();
  const [transactions, setTransactions] = useState<any[]>([]);
  const [publicToken, setPublicToken] = useState('');
  const [pendingLink, setPendingLink] = useState(false);
  const [uniqueId, setUniqueId] = useState(0);
  const [retry, setRetry] = useState(true);

  async function handleHistory() {
    await actions?.setFetching(true);

    const result: any = await sources?.requestExtensionData!({
      route: 'get_pending_transactions'
    });
    await setTransactions(result?.data?.payload);
    await setRetry(false);
    await actions?.setFetching(false);
  }

  useEffect(() => {
    if (!transactions?.length && retry) {
      handleHistory();
    }
  }, [transactions]);

  useEffect(() => {
    router.prefetch('/', '/');
    router.prefetch('/success', '/success');
  }, []);

  async function handlePendingTransaction(data: any) {
    if (data?.uniqueTransactionId) {
      const result: any = await sources?.requestExtensionData!({
        route: 'get_link_token_with_access_token',
        body: {
          access_token: data?.plaidAccessToken,
          status: data?.plaidVerificationStatus
        }
      });
      await setPendingLink(true);
      await setPublicToken(result?.data?.payload?.data);
      await setUniqueId(data?.uniqueTransactionId);
    }
  }

  return (
    <Box className="pad(5)" style={{ height: '600px' }}>
      <Row>
        <Col lg={9} md={10} sm={12} xs={12}>
          <Box p={2}>
            {pendingLink && uniqueId !== 0 ? (
              <ManualLink
                env={props?.env}
                token={publicToken}
                onChangeLink={() => setPendingLink(false)}
                uniqueId={uniqueId}
                handleSuccess={() => {
                  router.push('/success', '/success');
                }}
              />
            ) : (
              <Row>
                {transactions?.length > 0 ? (
                  <>
                    {transactions.map((transaction: any) => {
                      return (
                        <Col
                          lg={5}
                          md={5}
                          sm={11}
                          xs={12}
                          key={transaction?.uniqueTransactionId}
                        >
                          <StatusBox
                            details={transaction}
                            onClick={(data: any) =>
                              handlePendingTransaction(data)
                            }
                          />
                        </Col>
                      );
                    })}
                  </>
                ) : (
                  <p>No more pending requests to show</p>
                )}
              </Row>
            )}
          </Box>
        </Col>
      </Row>
      {!pendingLink && (
        <Box style={{ display: 'flex', justifyContent: 'center' }}>
          <Q2Btn
            onClick={() => actions?.navigateTo!('ExternalAccount', 'Main')}
            color="primary"
            class="mrg(3)"
          >
            Add another account
          </Q2Btn>
        </Box>
      )}
    </Box>
  );
};

export default connect(
  (state: any) => ({
    info: state.externalAccount.account_info,
    env: state.env?.env
  }),
  {}
)(History);
