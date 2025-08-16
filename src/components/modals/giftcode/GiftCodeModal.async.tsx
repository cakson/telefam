import type { FC } from 'react';
import React from '../../../lib/react-utils';

import type { OwnProps } from './GiftCodeModal';

import { Bundles } from '../../../util/moduleLoader';

import useModuleLoader from '../../../hooks/useModuleLoader';

const GiftCodeModalAsync: FC<OwnProps> = (props) => {
  const { modal } = props;
  const GiftCodeModal = useModuleLoader(Bundles.Extra, 'GiftCodeModal', !modal);

  // eslint-disable-next-line react/jsx-props-no-spreading
  return GiftCodeModal ? <GiftCodeModal {...props} /> : undefined;
};

export default GiftCodeModalAsync;
