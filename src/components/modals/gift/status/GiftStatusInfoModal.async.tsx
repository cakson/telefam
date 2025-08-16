import type { FC } from 'react';
import React from '../../../../lib/react-utils';

import type { OwnProps } from './GiftStatusInfoModal';

import { Bundles } from '../../../../util/moduleLoader';

import useModuleLoader from '../../../../hooks/useModuleLoader';

const GiftStatusInfoModalAsync: FC<OwnProps> = (props) => {
  const { modal } = props;
  const GiftStatusInfoModal = useModuleLoader(Bundles.Stars, 'GiftStatusInfoModal', !modal);

  // eslint-disable-next-line react/jsx-props-no-spreading
  return GiftStatusInfoModal ? <GiftStatusInfoModal {...props} /> : undefined;
};

export default GiftStatusInfoModalAsync;
