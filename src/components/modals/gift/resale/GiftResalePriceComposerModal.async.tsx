import type { FC } from 'react';
import React from '../../../../lib/react-utils';

import type { OwnProps } from './GiftResalePriceComposerModal';

import { Bundles } from '../../../../util/moduleLoader';

import useModuleLoader from '../../../../hooks/useModuleLoader';

const GiftResalePriceComposerModalAsync: FC<OwnProps> = (props) => {
  const { modal } = props;
  const GiftResalePriceComposerModal = useModuleLoader(Bundles.Stars, 'GiftResalePriceComposerModal', !modal);

  // eslint-disable-next-line react/jsx-props-no-spreading
  return GiftResalePriceComposerModal ? <GiftResalePriceComposerModal {...props} /> : undefined;
};

export default GiftResalePriceComposerModalAsync;
