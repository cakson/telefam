import type { FC } from 'react';
import React from '../../lib/react-utils';

import type { OwnProps } from './MuteChatModal';

import { Bundles } from '../../util/moduleLoader';

import useModuleLoader from '../../hooks/useModuleLoader';

const MuteChatModalAsync: FC<OwnProps> = (props) => {
  const { isOpen } = props;
  const MuteChatModal = useModuleLoader(Bundles.Extra, 'MuteChatModal', !isOpen);

  // eslint-disable-next-line react/jsx-props-no-spreading
  return MuteChatModal ? <MuteChatModal {...props} /> : undefined;
};

export default MuteChatModalAsync;
