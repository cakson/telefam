import type { FC } from 'react';
import React from '../../../lib/react-utils';

import type { OwnProps } from './GiftModal';

import { Bundles } from '../../../util/moduleLoader';

import useModuleLoader from '../../../hooks/useModuleLoader';

const GiftModalAsync: FC<OwnProps> = (props) => {
  const { modal } = props;
  const GiftModal = useModuleLoader(Bundles.Stars, 'GiftModal', !modal);

  // eslint-disable-next-line react/jsx-props-no-spreading
  return GiftModal ? <GiftModal {...props} /> : undefined;
};

export default GiftModalAsync;
