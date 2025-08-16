import type { FC } from 'react';
import React from '../../lib/react-utils';

import type { OwnProps } from './Main';

import { Bundles } from '../../util/moduleLoader';

import useModuleLoader from '../../hooks/useModuleLoader';

const MainAsync: FC<OwnProps> = (props) => {
  const Main = useModuleLoader(Bundles.Main, 'Main');

  // eslint-disable-next-line react/jsx-props-no-spreading
  return Main ? <Main {...props} /> : undefined;
};

export default MainAsync;
