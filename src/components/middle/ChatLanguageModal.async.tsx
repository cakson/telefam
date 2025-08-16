import type { FC } from 'react';
import React from '../../lib/react-utils';

import type { OwnProps } from './ChatLanguageModal';

import { Bundles } from '../../util/moduleLoader';

import useModuleLoader from '../../hooks/useModuleLoader';

const ChatLanguageModalAsync: FC<OwnProps> = (props) => {
  const { isOpen } = props;
  const ChatLanguageModal = useModuleLoader(Bundles.Extra, 'ChatLanguageModal', !isOpen);

  // eslint-disable-next-line react/jsx-props-no-spreading
  return ChatLanguageModal ? <ChatLanguageModal {...props} /> : undefined;
};

export default ChatLanguageModalAsync;
