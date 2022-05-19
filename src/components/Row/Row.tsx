import React, { FC, ReactNode } from 'react';
import cx from 'classnames';
import { Flex } from 'theme-ui';

export interface RowProps {
  align?: string;
  children?: ReactNode;
  class?: string;
  className?: string;
  style?: object;
}

const Row: FC<RowProps> = (props: RowProps) => {
  const { align, className, children } = props;
  return (
    <Flex
      {...props}
      className={cx(className, 'q2-row', [
        ...(align !== undefined ? [`${align}-align-columns`] : [])
      ])}
      sx={{ justifyContent: 'center' }}
    >
      {children}
    </Flex>
  );
};
Row.defaultProps = {
  children: [],
  style: {}
};

export default Row;
