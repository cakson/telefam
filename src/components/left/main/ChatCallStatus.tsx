import type { FC } from 'react';
import React, { memo } from '../../../lib/react-utils';

import buildClassName from '../../../util/buildClassName';

import styles from './ChatCallStatus.module.scss';

type OwnProps = {
  isSelected?: boolean;
  isActive?: boolean;
  isMobile?: boolean;
};

const ChatCallStatus: FC<OwnProps> = ({
  isSelected,
  isActive,
  isMobile,
}) => {
  return (
    <div className={buildClassName(
      styles.root,
      isActive && styles.active,
      isSelected && !isMobile && styles.selected,
    )}
    >
      <div className={styles.indicator}>
        <div className={styles.indicatorInner} />
        <div className={styles.indicatorInner} />
        <div className={styles.indicatorInner} />
      </div>
    </div>
  );
};

export default memo(ChatCallStatus);
