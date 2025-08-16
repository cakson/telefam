import type { FC } from 'react';
import React from '../../lib/react-utils';

import type { OwnProps } from './AboutMonetizationModal';

import { Bundles } from '../../util/moduleLoader';

import useModuleLoader from '../../hooks/useModuleLoader';

const AboutMonetizationModalAsync: FC<OwnProps> = (props) => {
  const { isOpen } = props;
  const AboutMonetizationModal = useModuleLoader(Bundles.Extra, 'AboutMonetizationModal', !isOpen);

  // eslint-disable-next-line react/jsx-props-no-spreading
  return AboutMonetizationModal ? <AboutMonetizationModal {...props} /> : undefined;
};

export default AboutMonetizationModalAsync;
