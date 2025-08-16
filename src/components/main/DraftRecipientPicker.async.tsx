import type { FC } from 'react';
import React from '../../lib/react-utils';

import type { OwnProps } from './DraftRecipientPicker';

import { Bundles } from '../../util/moduleLoader';

import useModuleLoader from '../../hooks/useModuleLoader';

const DraftRecipientPickerAsync: FC<OwnProps> = (props) => {
  const { requestedDraft } = props;
  const DraftRecipientPicker = useModuleLoader(Bundles.Extra, 'DraftRecipientPicker', !requestedDraft);

  // eslint-disable-next-line react/jsx-props-no-spreading
  return DraftRecipientPicker ? <DraftRecipientPicker {...props} /> : undefined;
};

export default DraftRecipientPickerAsync;
