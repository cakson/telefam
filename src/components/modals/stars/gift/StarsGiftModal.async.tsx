import type { FC } from 'react';
import React from '../../../../lib/react-utils';

import type { OwnProps } from './StarsGiftModal';

import { Bundles } from '../../../../util/moduleLoader';

import useModuleLoader from '../../../../hooks/useModuleLoader';

const StarsGiftModalAsync: FC<OwnProps> = (props) => {
  const { modal } = props;
  const StarsGiftModal = useModuleLoader(Bundles.Stars, 'StarsGiftModal', !modal);

  // eslint-disable-next-line react/jsx-props-no-spreading
  return StarsGiftModal ? <StarsGiftModal {...props} /> : undefined;
};

export default StarsGiftModalAsync;
