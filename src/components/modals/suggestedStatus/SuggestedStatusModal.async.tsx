import type { FC } from 'react';
import React from '../../../lib/react-utils';

import type { OwnProps } from './SuggestedStatusModal';

import { Bundles } from '../../../util/moduleLoader';

import useModuleLoader from '../../../hooks/useModuleLoader';

const SuggestedStatusModalAsync: FC<OwnProps> = (props) => {
  const { modal } = props;
  const SuggestedStatusModal = useModuleLoader(Bundles.Extra, 'SuggestedStatusModal', !modal);

  // eslint-disable-next-line react/jsx-props-no-spreading
  return SuggestedStatusModal ? <SuggestedStatusModal {...props} /> : undefined;
};

export default SuggestedStatusModalAsync;
