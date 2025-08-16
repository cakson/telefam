import type { FC } from 'react';
import React from '../../../lib/react-utils';

import type { OwnProps } from './FrozenAccountModal';

import { Bundles } from '../../../util/moduleLoader';

import useModuleLoader from '../../../hooks/useModuleLoader';

const FrozenAccountModalAsync: FC<OwnProps> = (props) => {
  const { modal } = props;
  const FrozenAccountModal = useModuleLoader(Bundles.Extra, 'FrozenAccountModal', modal);

  // eslint-disable-next-line react/jsx-props-no-spreading
  return FrozenAccountModal ? <FrozenAccountModal {...props} /> : undefined;
};

export default FrozenAccountModalAsync;
