import type { FC } from 'react';
import React from '../../../lib/react-utils';

import type { OwnProps } from './CollectibleInfoModal';

import { Bundles } from '../../../util/moduleLoader';

import useModuleLoader from '../../../hooks/useModuleLoader';

const CollectibleInfoModalAsync: FC<OwnProps> = (props) => {
  const { modal } = props;
  const CollectibleInfoModal = useModuleLoader(Bundles.Extra, 'CollectibleInfoModal', !modal);

  // eslint-disable-next-line react/jsx-props-no-spreading
  return CollectibleInfoModal ? <CollectibleInfoModal {...props} /> : undefined;
};

export default CollectibleInfoModalAsync;
