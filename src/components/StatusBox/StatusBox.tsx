import React, { FC } from 'react';
import { Q2Btn } from '@nueve/q2-tecton-react';
import { Box } from 'theme-ui';
import theme from '~/theme';

export interface StatusBoxProps {
  details: any;
  onClick?: any;
}

export const styles = {};

const StatusBox: FC<StatusBoxProps> = (props: StatusBoxProps) => {
  const { details, onClick } = props;

  function formattedDate(date: string): string {
    if (date?.length > 10) {
      date = date.slice(0, 10).toString();
    }
    const pattern = /(\d{4})-(\d{2})-(\d{2})/;
    if (!date || !date.match(pattern)) {
      return '';
    }
    return date.replace(pattern, '$2/$3/$1');
  }

  return (
    <Box pb={3}>
      <Box
        style={{
          borderRadius: '5px',
          border: `1px solid ${theme.colors.greyL2}`,
          boxShadow: '0 2px 4px rgba(0, 0, 0, .125)'
        }}
        mx={1}
      >
        <Box
          bg={theme.colors.primary}
          style={{
            borderRadius: '2px'
          }}
          pt={1}
        />
        <Box
          pt={3}
          pb={2}
          px={2}
          style={{ textAlign: 'center', minHeight: '160px' }}
        >
          <Box style={{ minHeight: '30px' }}>
            <span>Date: </span>
            <strong style={{ fontWeight: 510 }}>
              {formattedDate(details.createdDate)}
            </strong>
          </Box>
          <Box style={{ minHeight: '30px' }}>
            <span>Status: </span>
            <strong style={{ fontWeight: 510 }}>Verification Pending</strong>
          </Box>
          <Box style={{ minHeight: '30px' }}>
            <span>Ref id: </span>
            <strong style={{ fontWeight: 510 }}>
              XXXXXXXX
              {details.uniqueTransactionId.substr(
                details.uniqueTransactionId.length - 6
              )}
            </strong>
          </Box>
          <Box className="mrg(2)">
            <Q2Btn color="primary" onClick={() => onClick(details)}>
              Verify Micro Deposits
            </Q2Btn>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};
StatusBox.defaultProps = {};

export default StatusBox;
