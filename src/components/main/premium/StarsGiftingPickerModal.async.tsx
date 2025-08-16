import type { FC } from 'react';
import React from '../../../lib/react-utils';

import type { OwnProps } from './StarsGiftingPickerModal';

import { Bundles } from '../../../util/moduleLoader';

import useModuleLoader from '../../../hooks/useModuleLoader';

const StarsGiftingPickerModalAsync: FC<OwnProps> = (props) => {
  const { isOpen } = props;
  const StarsGiftingPickerModal = useModuleLoader(Bundles.Stars, 'StarsGiftingPickerModal', !isOpen);

  // eslint-disable-next-line react/jsx-props-no-spreading
  return StarsGiftingPickerModal ? <StarsGiftingPickerModal {...props} /> : undefined;
};

export default StarsGiftingPickerModalAsync;
