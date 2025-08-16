import type { FC } from 'react';
import React from '../../../lib/react-utils';

import type { OwnProps } from './LocationAccessModal';

import { Bundles } from '../../../util/moduleLoader';

import useModuleLoader from '../../../hooks/useModuleLoader';

const LocationAccessModalAsync: FC<OwnProps> = (props) => {
  const { modal } = props;
  const LocationAccessModal = useModuleLoader(Bundles.Extra, 'LocationAccessModal', !modal);

  // eslint-disable-next-line react/jsx-props-no-spreading
  return LocationAccessModal ? <LocationAccessModal {...props} /> : undefined;
};

export default LocationAccessModalAsync;
