import type { FC } from 'react';
import React from '../../../../lib/react-utils';

import type { OwnProps } from './ChatRefundModal';

import { Bundles } from '../../../../util/moduleLoader';

import useModuleLoader from '../../../../hooks/useModuleLoader';

const ChatRefundModalAsync: FC<OwnProps> = (props) => {
  const { modal } = props;
  const ChatRefundModal = useModuleLoader(Bundles.Stars, 'ChatRefundModal', !modal);

  // eslint-disable-next-line react/jsx-props-no-spreading
  return ChatRefundModal ? <ChatRefundModal {...props} /> : undefined;
};

export default ChatRefundModalAsync;
