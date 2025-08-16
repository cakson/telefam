import type { FC } from 'react';
import React from '../../../../lib/react-utils';

import type { OwnProps } from './GiftWithdrawModal';

import { Bundles } from '../../../../util/moduleLoader';

import useModuleLoader from '../../../../hooks/useModuleLoader';

const GiftWithdrawModalAsync: FC<OwnProps> = (props) => {
  const { modal } = props;
  const GiftWithdrawModal = useModuleLoader(Bundles.Stars, 'GiftWithdrawModal', !modal);

  // eslint-disable-next-line react/jsx-props-no-spreading
  return GiftWithdrawModal ? <GiftWithdrawModal {...props} /> : undefined;
};

export default GiftWithdrawModalAsync;
