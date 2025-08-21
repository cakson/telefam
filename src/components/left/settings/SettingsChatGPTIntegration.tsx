import type { FC } from '../../../lib/teact/teact';
import React, { memo, useCallback, useState } from '../../../lib/teact/teact';
import { getActions, withGlobal } from '../../../global';

import type { AccountSettings } from '../../../types';

import useHistoryBack from '../../../hooks/useHistoryBack';
import useLastCallback from '../../../hooks/useLastCallback';
import useOldLang from '../../../hooks/useOldLang';

import Checkbox from '../../ui/Checkbox';
import InputText from '../../ui/InputText';
import ListItem from '../../ui/ListItem';
import RadioGroup from '../../ui/RadioGroup';
import TextArea from '../../ui/TextArea';

type OwnProps = {
  isActive?: boolean;
  onReset: () => void;
};

type StateProps = Pick<AccountSettings, 
  'isChatGptIntegrationEnabled' | 'chatGptApiKey' | 'chatGptModel' | 'chatGptTranslationContext' | 'useChatGptForTranslation'>;

const ChatGPTModel = {
  GPT_5_NANO: 'gpt-5-nano',
  GPT_5_MINI: 'gpt-5-mini',
} as const;

type ChatGPTModelType = typeof ChatGPTModel[keyof typeof ChatGPTModel];

const SettingsChatGPTIntegration: FC<OwnProps & StateProps> = ({
  isActive,
  isChatGptIntegrationEnabled = false,
  useChatGptForTranslation = false,
  chatGptApiKey = '',
  chatGptModel = ChatGPTModel.GPT_5_NANO,
  chatGptTranslationContext = '',
  onReset,
}) => {
  const { setSettingOption } = getActions();

  const lang = useOldLang();

  const [localApiKey, setLocalApiKey] = useState(chatGptApiKey);
  const [localModel, setLocalModel] = useState<ChatGPTModelType>(chatGptModel as ChatGPTModelType);
  const [localContext, setLocalContext] = useState(chatGptTranslationContext);
  const [isEnabled, setIsEnabled] = useState(isChatGptIntegrationEnabled);

  useHistoryBack({
    isActive,
    onBack: onReset,
  });

  const handleApiKeyChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setLocalApiKey(e.target.value);
  }, []);

  const handleApiKeyBlur = useLastCallback(() => {
    setSettingOption({ chatGptApiKey: localApiKey });
  });

  const handleModelChange = useLastCallback((value: string) => {
    const model = value as ChatGPTModelType;
    setLocalModel(model);
    setSettingOption({ chatGptModel: model });
  });

  const handleContextChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setLocalContext(e.target.value);
  }, []);

  const handleContextBlur = useLastCallback(() => {
    setSettingOption({ chatGptTranslationContext: localContext });
  });

  const handleToggleIntegration = useLastCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const enabled = e.target.checked;
    setIsEnabled(enabled);
    setSettingOption({ 
      isChatGptIntegrationEnabled: enabled,
      // If disabling, also turn off ChatGPT translation preference
      ...((!enabled && useChatGptForTranslation) && { useChatGptForTranslation: false })
    });
  });

  const modelOptions = [
    { value: ChatGPTModel.GPT_5_NANO, label: 'GPT-5 Nano' },
    { value: ChatGPTModel.GPT_5_MINI, label: 'GPT-5 Mini' },
  ];

  return (
    <div className="settings-content custom-scroll">
      <div className="settings-item">
        <Checkbox
          label="Enable ChatGPT Integration"
          checked={isEnabled}
          onChange={handleToggleIntegration}
        />
        <p className="settings-item-description">
          Enable ChatGPT integration for enhanced translation features across the app.
        </p>
      </div>

      {isEnabled && (
        <>
      <div className="settings-item">
        <h4 className="settings-item-header">API Configuration</h4>
        
        <InputText
          label="API Key"
          placeholder="Enter your ChatGPT API key"
          value={localApiKey}
          onChange={handleApiKeyChange}
          onBlur={handleApiKeyBlur}
          type="password"
        />
        
        <p className="settings-item-description">
          Your API key will be stored locally and used to connect to ChatGPT services.
        </p>
      </div>

      <div className="settings-item">
        <h4 className="settings-item-header">Model Selection</h4>
        
        <RadioGroup
          name="chatgpt-model"
          selected={localModel}
          options={modelOptions}
          onChange={handleModelChange}
        />
        
        <p className="settings-item-description">
          Choose the ChatGPT model to use for translations.
        </p>
      </div>

      <div className="settings-item">
        <h4 className="settings-item-header">Translation Context</h4>
        
        <TextArea
          label="Context (Optional)"
          placeholder="Provide context for better translations (e.g., formal tone, specific terminology)"
          value={localContext}
          onChange={handleContextChange}
          onBlur={handleContextBlur}
          maxLength={500}
        />
        
        <p className="settings-item-description">
          This context will be used as system instructions for the translation model.
        </p>
      </div>
        </>
      )}
    </div>
  );
};

export default memo(withGlobal<OwnProps>(
  (global): StateProps => {
    const {
      isChatGptIntegrationEnabled,
      useChatGptForTranslation,
      chatGptApiKey,
      chatGptModel,
      chatGptTranslationContext,
    } = global.settings.byKey;

    return {
      isChatGptIntegrationEnabled,
      useChatGptForTranslation,
      chatGptApiKey,
      chatGptModel,
      chatGptTranslationContext,
    };
  },
)(SettingsChatGPTIntegration));