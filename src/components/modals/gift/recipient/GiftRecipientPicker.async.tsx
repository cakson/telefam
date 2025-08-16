import type { FC } from 'react';
import React from '../../../../lib/react-utils';

import type { OwnProps } from './GiftRecipientPicker';

import { Bundles } from '../../../../util/moduleLoader';

import useModuleLoader from '../../../../hooks/useModuleLoader';

const GiftRecipientPickerAsync: FC<OwnProps> = (props) => {
  const { modal } = props;
  const GiftRecipientPicker = useModuleLoader(Bundles.Stars, 'GiftRecipientPicker', !modal);

  // eslint-disable-next-line react/jsx-props-no-spreading
  return GiftRecipientPicker ? <GiftRecipientPicker {...props} /> : undefined;
};

export default GiftRecipientPickerAsync;
