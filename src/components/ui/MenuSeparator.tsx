import type { FC } from 'react';
import React from '../../lib/react-utils';

import buildClassName from '../../util/buildClassName';

import styles from './MenuSeparator.module.scss';

type OwnProps = {
  className?: string;
  size?: 'thin' | 'thick';
};

const MenuSeparator: FC<OwnProps> = ({ className, size = 'thin' }) => {
  return (
    <div className={buildClassName(styles.root, styles[size], className)} />
  );
};

export default MenuSeparator;
