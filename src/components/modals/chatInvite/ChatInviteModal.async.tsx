import type { FC } from 'react';
import React from '../../../lib/react-utils';

import type { OwnProps } from './ChatInviteModal';

import { Bundles } from '../../../util/moduleLoader';

import useModuleLoader from '../../../hooks/useModuleLoader';

const ChatInviteModalAsync: FC<OwnProps> = (props) => {
  const { modal } = props;
  const ChatInviteModal = useModuleLoader(Bundles.Extra, 'ChatInviteModal', !modal);

  // eslint-disable-next-line react/jsx-props-no-spreading
  return ChatInviteModal ? <ChatInviteModal {...props} /> : undefined;
};

export default ChatInviteModalAsync;
