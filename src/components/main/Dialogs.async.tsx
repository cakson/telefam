import type { FC } from 'react';
import React from '../../lib/react-utils';

import { Bundles } from '../../util/moduleLoader';

import useModuleLoader from '../../hooks/useModuleLoader';

const DialogsAsync: FC = ({ isOpen }) => {
  const Dialogs = useModuleLoader(Bundles.Extra, 'Dialogs', !isOpen);

  // eslint-disable-next-line react/jsx-props-no-spreading
  return Dialogs ? <Dialogs /> : undefined;
};

export default DialogsAsync;
