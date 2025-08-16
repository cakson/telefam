import type { FC } from 'react';
import React from '../../../lib/react-utils';

import type { OwnProps } from './MiddleSearch';

import { Bundles } from '../../../util/moduleLoader';

import useModuleLoader from '../../../hooks/useModuleLoader';

const MiddleSearchAsync: FC<OwnProps> = (props) => {
  const { isActive } = props;
  const MiddleSearch = useModuleLoader(Bundles.Extra, 'MiddleSearch', !isActive, true);

  // eslint-disable-next-line react/jsx-props-no-spreading
  return MiddleSearch ? <MiddleSearch {...props} /> : undefined;
};

export default MiddleSearchAsync;
