import type { FC } from 'react';
import React from '../../../lib/react-utils';

import type { OwnProps } from './ReportModal';

import { Bundles } from '../../../util/moduleLoader';

import useModuleLoader from '../../../hooks/useModuleLoader';

const ReportModalAsync: FC<OwnProps> = (props) => {
  const { modal } = props;
  const ReportModal = useModuleLoader(Bundles.Extra, 'ReportModal', !modal);

  // eslint-disable-next-line react/jsx-props-no-spreading
  return ReportModal ? <ReportModal {...props} /> : undefined;
};

export default ReportModalAsync;
