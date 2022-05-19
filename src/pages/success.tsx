import React, { FC } from 'react';
import { Q2Btn } from '@nueve/q2-tecton-react';
import { useActions } from 'q2-tecton-hooks';
import { IActions } from 'q2-tecton-sdk';
import { useRouter } from 'next/router';
import { connect } from 'react-redux';
import { Box } from 'theme-ui';
// import { deleteAccount } from '~/modules/externalAccount/hooks';
import { deleteAccount } from '../modules/externalAccount/hooks';
import { HashMap } from '~/types';

export interface SuccessProps {
  info?: InfoProps;
}

export interface InfoProps {
  account_type?: string;
  account_number?: string;
}

export const styles = {
  alignStyles: {
    display: 'flex'
  },
  headingStyles: {
    fontSize: ' 20px',
    letterSpacing: '0.5px'
  },
  fontStyles: {
    fontWeight: 'bold'
  }
};

const Success: FC<SuccessProps> = (props: SuccessProps) => {
  const actions: IActions | null = useActions();
  const router = useRouter();
  const [, deleteExternalAccount] = deleteAccount();

  async function handleAddAnotherAccount() {
    await actions?.setFetching(true);
    deleteExternalAccount();
    router.push('/', '/');
    actions?.navigateTo!('ExternalAccount', 'Main');
    await actions?.setFetching(false);
  }

  function handleBackToHome() {
    // deleteExternalAccount();
    actions?.navigateTo!('landingPage');
  }

  function capitalizeFirstLetter(string) {
    return string?.charAt(0).toUpperCase() + string?.slice(1);
  }

  return (
    <Box className="mrg-t(5) pad-b(5)">
      {props?.info !== undefined && (
        <Box
          style={{
            ...styles.alignStyles,
            flexDirection: 'column',
            textAlign: 'center'
          }}
        >
          <Box>
            <p
              className="clr(app-gray-d1)"
              style={{ ...styles.headingStyles, fontWeight: 'bold' }}
            >
              Success! Your new external account has been added
            </p>
            <p className="clr(app-gray-d1)">
              To transfer funds, visit the Main Menu – Move Money – Transfer
              Funds
            </p>
          </Box>
          <Box>
            <p className="clr(app-gray-d1) pad-t(3)">
              Account Type:
              <span style={{ fontWeight: 'bold' }}>
                {' '}
                {capitalizeFirstLetter(props?.info?.account_type)}
              </span>
            </p>
            <p className="clr(app-gray-d1) ">
              Account Number:
              <span style={{ fontWeight: 'bold' }}>
                {' '}
                {props?.info?.account_number}
              </span>
            </p>
          </Box>
          <Box>
            <Q2Btn onClick={handleBackToHome} color="secondary" class="mrg(3)">
              Back to Home
            </Q2Btn>
            <Q2Btn
              onClick={handleAddAnotherAccount}
              color="primary"
              class="mrg(3)"
            >
              Add another account
            </Q2Btn>
          </Box>
        </Box>
      )}
    </Box>
  );
};

export default connect(
  (state: HashMap) => ({
    info: state.externalAccount.result.account_info
  }),
  {}
)(Success);
