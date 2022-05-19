import React, { FC, ReactNode } from 'react';
import cx from 'classnames';
import { Box } from 'theme-ui';

export interface ColProps {
  children?: ReactNode;
  className?: string;
  class?: string;
  lg?: number;
  md?: number;
  sm?: number;
  xs?: number;
  align?: string;
  style?: object;
}

export const styles = {
  q2Col: {}
};

const Col: FC<ColProps> = (props: ColProps) => {
  const { lg, md, sm, xs, align, className, children, style } = props;
  return (
    <Box
      {...props}
      style={{
        ...styles.q2Col,
        ...style
      }}
      className={cx(className, 'q2-col', [
        ...(lg !== undefined ? [`lg-${lg}`] : []),
        ...(md !== undefined ? [`md-${md}`] : []),
        ...(sm !== undefined ? [`sm-${sm}`] : []),
        ...(xs !== undefined ? [`xs-${xs}`] : []),
        ...(align !== undefined ? [`${align}-align`] : [])
      ])}
    >
      {children}
    </Box>
  );
};
Col.defaultProps = {
  children: [],
  className: 'q2-col',
  // lg: 0,
  // md: 0,
  // xs: 0,
  // sm: 0,
  style: {}
};

export default Col;
