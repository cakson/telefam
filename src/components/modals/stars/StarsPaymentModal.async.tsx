import type { FC } from 'react';
import React from '../../../lib/react-utils';

import type { OwnProps } from './StarsPaymentModal';

import { Bundles } from '../../../util/moduleLoader';

import useModuleLoader from '../../../hooks/useModuleLoader';

const StarPaymentModalAsync: FC<OwnProps> = (props) => {
  const { modal } = props;
  const StarPaymentModal = useModuleLoader(Bundles.Stars, 'StarPaymentModal', !modal);

  // eslint-disable-next-line react/jsx-props-no-spreading
  return StarPaymentModal ? <StarPaymentModal {...props} /> : undefined;
};

export default StarPaymentModalAsync;
