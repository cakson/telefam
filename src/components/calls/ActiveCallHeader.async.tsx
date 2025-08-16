import type { FC } from 'react';
import React from '../../lib/react-utils';

import { Bundles } from '../../util/moduleLoader';

import useModuleLoader from '../../hooks/useModuleLoader';

type OwnProps = {
  isActive?: boolean;
};

const ActiveCallHeaderAsync: FC<OwnProps> = (props) => {
  const { isActive } = props;
  const ActiveCallHeader = useModuleLoader(Bundles.Calls, 'ActiveCallHeader', !isActive);

  return ActiveCallHeader ? <ActiveCallHeader /> : undefined;
};

export default ActiveCallHeaderAsync;
