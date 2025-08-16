import type { FC } from 'react';
import React from '../../../lib/react-utils';

import type { OwnProps } from './ChatlistModal';

import { Bundles } from '../../../util/moduleLoader';

import useModuleLoader from '../../../hooks/useModuleLoader';

const ChatlistModalAsync: FC<OwnProps> = (props) => {
  const { modal } = props;
  const ChatlistModal = useModuleLoader(Bundles.Extra, 'ChatlistModal', !modal);

  // eslint-disable-next-line react/jsx-props-no-spreading
  return ChatlistModal ? <ChatlistModal {...props} /> : undefined;
};

export default ChatlistModalAsync;
