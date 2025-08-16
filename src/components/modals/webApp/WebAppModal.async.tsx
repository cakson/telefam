import type { FC } from 'react';
import React from '../../../lib/react-utils';

import type { OwnProps } from './WebAppModal';

import { Bundles } from '../../../util/moduleLoader';

import useModuleLoader from '../../../hooks/useModuleLoader';

const WebAppModalAsync: FC<OwnProps> = (props) => {
  const { modal } = props;
  const WebAppModal = useModuleLoader(Bundles.Extra, 'WebAppModal', !modal);

  // eslint-disable-next-line react/jsx-props-no-spreading
  return WebAppModal ? <WebAppModal {...props} /> : undefined;
};

export default WebAppModalAsync;
