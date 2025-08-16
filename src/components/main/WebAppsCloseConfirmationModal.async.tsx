import type { FC } from 'react';
import React from '../../lib/react-utils';

import { Bundles } from '../../util/moduleLoader';

import useModuleLoader from '../../hooks/useModuleLoader';

const WebAppsCloseConfirmationModalAsync: FC = (props) => {
  const { modal } = props;
  const WebAppsCloseConfirmationModal = useModuleLoader(Bundles.Extra, 'WebAppsCloseConfirmationModal', !modal);

  // eslint-disable-next-line react/jsx-props-no-spreading
  return WebAppsCloseConfirmationModal ? <WebAppsCloseConfirmationModal isOpen={modal} /> : undefined;
};

export default WebAppsCloseConfirmationModalAsync;
