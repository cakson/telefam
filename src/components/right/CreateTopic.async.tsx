import type { FC } from 'react';
import React from '../../lib/react-utils';

import type { OwnProps } from './CreateTopic';

import { Bundles } from '../../util/moduleLoader';

import useModuleLoader from '../../hooks/useModuleLoader';

import Loading from '../ui/Loading';

const CreateTopicAsync: FC<OwnProps> = (props) => {
  const CreateTopic = useModuleLoader(Bundles.Extra, 'CreateTopic');

  // eslint-disable-next-line react/jsx-props-no-spreading
  return CreateTopic ? <CreateTopic {...props} /> : <Loading />;
};

export default CreateTopicAsync;
