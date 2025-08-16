import type { FC } from 'react';
import React from '../../lib/react-utils';

import type { OwnProps } from './SafeLinkModal';

import { Bundles } from '../../util/moduleLoader';

import useModuleLoader from '../../hooks/useModuleLoader';

const SafeLinkModalAsync: FC<OwnProps> = (props) => {
  const { url } = props;
  const SafeLinkModal = useModuleLoader(Bundles.Extra, 'SafeLinkModal', !url);

  // eslint-disable-next-line react/jsx-props-no-spreading
  return SafeLinkModal ? <SafeLinkModal {...props} /> : undefined;
};

export default SafeLinkModalAsync;
