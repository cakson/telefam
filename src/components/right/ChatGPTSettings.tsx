import type { FC } from '../../lib/teact/teact';
import React, {
  memo, useEffect, useState,
} from '../../lib/teact/teact';
import { getActions, withGlobal } from '../../global';

import type { ApiChat } from '../../api/types';

import {
  selectChat,
  selectChatGptContext,
  selectCurrentMessageList,
} from '../../global/selectors';

import useFlag from '../../hooks/useFlag';
import useLang from '../../hooks/useLang';
import useLastCallback from '../../hooks/useLastCallback';

import renderText from '../common/helpers/renderText';

import Icon from '../common/icons/Icon';
import FloatingActionButton from '../ui/FloatingActionButton';
import Spinner from '../ui/Spinner';
import TextArea from '../ui/TextArea';

import './management/Management.scss';

type OwnProps = {
  isActive: boolean;
};

type StateProps = {
  chatId?: string;
  chat?: ApiChat;
  initialContext?: string;
};

const ChatGPTSettings: FC<OwnProps & StateProps> = ({
  isActive,
  chatId,
  chat,
  initialContext,
}) => {
  const { setChatGptContext } = getActions();
  const lang = useLang();
  const [context, setContext] = useState(initialContext || '');
  const [isFieldTouched, markFieldTouched, unmarkFieldTouched] = useFlag();
  const [isLoading, setIsLoading] = useState(false);

  // Update local state when initialContext changes (e.g., when switching chats)
  useEffect(() => {
    setContext(initialContext || '');
    unmarkFieldTouched();
  }, [chatId, initialContext, unmarkFieldTouched]);

  const handleContextChange = useLastCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setContext(e.target.value);
    markFieldTouched();
  });

  const handleSave = useLastCallback(() => {
    if (!chatId) return;
    
    setIsLoading(true);
    setChatGptContext({ chatId, context });
    
    // Simulate save completion
    setTimeout(() => {
      setIsLoading(false);
      unmarkFieldTouched();
    }, 200);
  });

  if (!chat) {
    return null;
  }

  return (
    <div className="Management">
      <div className="custom-scroll">
        <div className="section">
          <div className="section-info">
            {renderText(lang('ChatGPTSettingsInfo', { chatName: chat.title }), ['simple_markdown'])}
          </div>
        </div>
        
        <div className="section">
          <h3 className="section-heading">
            {lang('ChatSpecificTranslationContext')}
          </h3>
          <p className="section-help">
            {lang('ChatSpecificTranslationContextDescription')}
          </p>
          <TextArea
            value={context}
            onChange={handleContextChange}
            placeholder={lang('ChatSpecificTranslationContextPlaceholder')}
            rows={8}
            autoFocus={isActive}
          />
        </div>
      </div>
      <FloatingActionButton
        isShown={isFieldTouched}
        onClick={handleSave}
        disabled={isLoading}
        ariaLabel={lang('Save')}
      >
        {isLoading ? (
          <Spinner color="white" />
        ) : (
          <Icon name="check" />
        )}
      </FloatingActionButton>
    </div>
  );
};

export default memo(withGlobal<OwnProps>(
  (global): StateProps => {
    const { chatId } = selectCurrentMessageList(global) || {};
    const chat = chatId ? selectChat(global, chatId) : undefined;
    const initialContext = chatId ? selectChatGptContext(global, chatId) : undefined;

    return {
      chatId,
      chat,
      initialContext,
    };
  },
)(ChatGPTSettings));