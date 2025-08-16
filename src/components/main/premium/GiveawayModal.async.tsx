import type { FC } from 'react';
import React from '../../../lib/react-utils';

import type { OwnProps } from './GiveawayModal';

import { Bundles } from '../../../util/moduleLoader';

import useModuleLoader from '../../../hooks/useModuleLoader';

const GiveawayModalAsync: FC<OwnProps> = (props) => {
  const { isOpen } = props;
  const GiveawayModal = useModuleLoader(Bundles.Extra, 'GiveawayModal', !isOpen);

  // eslint-disable-next-line react/jsx-props-no-spreading
  return GiveawayModal ? <GiveawayModal {...props} /> : undefined;
};

export default GiveawayModalAsync;
