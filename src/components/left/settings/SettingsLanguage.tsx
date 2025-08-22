import type { FC } from '../../../lib/teact/teact';
import React, {
  memo, useEffect, useMemo, useState,
} from '../../../lib/teact/teact';
import { getActions, withGlobal } from '../../../global';

import type { AccountSettings, LangCode, SharedSettings } from '../../../types';
import { SettingsScreens } from '../../../types';

import { selectIsCurrentUserPremium } from '../../../global/selectors';
import { selectSharedSettings } from '../../../global/selectors/sharedState';
import { IS_TRANSLATION_SUPPORTED } from '../../../util/browser/windowEnvironment';
import { oldSetLanguage } from '../../../util/oldLangProvider';

import useFlag from '../../../hooks/useFlag';
import useHistoryBack from '../../../hooks/useHistoryBack';
import useLastCallback from '../../../hooks/useLastCallback';
import useOldLang from '../../../hooks/useOldLang';

import ItemPicker, { type ItemPickerOption } from '../../common/pickers/ItemPicker';
import Checkbox from '../../ui/Checkbox';
import ListItem from '../../ui/ListItem';
import Loading from '../../ui/Loading';
import RadioGroup from '../../ui/RadioGroup';

type OwnProps = {
  isActive?: boolean;
  onReset: () => void;
};

type StateProps = {
  isCurrentUserPremium: boolean;
} & Pick<AccountSettings, 'canTranslate' | 'canTranslateChats' | 'doNotTranslate'
| 'isChatGptIntegrationEnabled' | 'useChatGptForTranslation' | 'translationDisplayStyle'>
& Pick<SharedSettings, 'language' | 'languages'>;

const SettingsLanguage: FC<OwnProps & StateProps> = ({
  isActive,
  languages,
  language,
  canTranslate,
  canTranslateChats,
  doNotTranslate,
  isChatGptIntegrationEnabled,
  useChatGptForTranslation,
  translationDisplayStyle = 'replace',
  onReset,
}) => {
  const {
    loadLanguages,
    setSettingOption,
    setSharedSettingOption,
    openSettingsScreen,
  } = getActions();

  const [selectedLanguage, setSelectedLanguage] = useState<string>(language);
  const [isLoading, markIsLoading, unmarkIsLoading] = useFlag();

  // Chat translation is now available for all users
  const canTranslateChatsEnabled = canTranslateChats;

  const lang = useOldLang();

  useEffect(() => {
    if (!languages?.length) {
      loadLanguages();
    }
  }, [languages]);

  // No longer need to disable chat translation based on premium/ChatGPT status

  const handleChange = useLastCallback((langCode: string) => {
    setSelectedLanguage(langCode);
    markIsLoading();

    void oldSetLanguage(langCode as LangCode, () => {
      unmarkIsLoading();

      setSharedSettingOption({ language: langCode as LangCode });
    });
  });

  const options = useMemo(() => {
    if (!languages) return undefined;
    const currentLangCode = (window.navigator.language || 'en').toLowerCase();
    const shortLangCode = currentLangCode.substr(0, 2);

    return languages.map(({ langCode, nativeName, name }) => ({
      value: langCode,
      label: nativeName,
      subLabel: name,
      isLoading: langCode === selectedLanguage && isLoading,
    } satisfies ItemPickerOption)).sort((a) => {
      return currentLangCode && (a.value === currentLangCode || a.value === shortLangCode) ? -1 : 0;
    });
  }, [isLoading, languages, selectedLanguage]);

  const handleShouldTranslateChange = useLastCallback((newValue: boolean) => {
    setSettingOption({ canTranslate: newValue });
  });

  const handleShouldTranslateChatsChange = useLastCallback((newValue: boolean) => {
    setSettingOption({ canTranslateChats: newValue });
  });

  const doNotTranslateText = useMemo(() => {
    if (!IS_TRANSLATION_SUPPORTED || !doNotTranslate.length) {
      return undefined;
    }

    if (doNotTranslate.length === 1) {
      const originalNames = new Intl.DisplayNames([language], { type: 'language' });
      return originalNames.of(doNotTranslate[0])!;
    }

    return lang('Languages', doNotTranslate.length);
  }, [doNotTranslate, lang, language]);

  const handleDoNotSelectOpen = useLastCallback(() => {
    openSettingsScreen({ screen: SettingsScreens.DoNotTranslate });
  });

  const handleUseChatGptChange = useLastCallback((newValue: boolean) => {
    setSettingOption({ useChatGptForTranslation: newValue });
  });

  const handleTranslationDisplayStyleChange = useLastCallback((value: string) => {
    setSettingOption({ translationDisplayStyle: value as 'replace' | 'both' });
  });

  useHistoryBack({
    isActive,
    onBack: onReset,
  });

  return (
    <div className="settings-content settings-language custom-scroll">
      {IS_TRANSLATION_SUPPORTED && (
        <>
          <div className="settings-item">
            <Checkbox
              label={lang('ShowTranslateButton')}
              checked={canTranslate}
              onCheck={handleShouldTranslateChange}
            />
            <p className="settings-item-description mt-0 mb-3">
              {lang('lng_translate_settings_about')}
            </p>
          </div>

          <div className="settings-item">
            <Checkbox
              label={lang('ShowTranslateChatButton')}
              checked={canTranslateChatsEnabled}
              onCheck={handleShouldTranslateChatsChange}
            />
          </div>

          {(canTranslate || canTranslateChatsEnabled) && (
            <>
              {isChatGptIntegrationEnabled && (
                <div className="settings-item">
                  <Checkbox
                    label="Use ChatGPT for translation"
                    checked={Boolean(useChatGptForTranslation)}
                    onCheck={handleUseChatGptChange}
                  />
                </div>
              )}

              <div className="settings-item">
                <h4 className="settings-item-header mb-2">
                  Translation Display Style
                </h4>
                <RadioGroup
                  name="translation-display-style"
                  selected={translationDisplayStyle}
                  options={[
                    { value: 'replace', label: 'Replace Original Text' },
                    { value: 'both', label: 'Show Both Original and Translation' },
                  ]}
                  onChange={handleTranslationDisplayStyleChange}
                />
              </div>

              <div className="settings-item">
                <ListItem
                  narrow
                  onClick={handleDoNotSelectOpen}
                >
                  {lang('DoNotTranslate')}
                  <span className="settings-item__current-value">{doNotTranslateText}</span>
                </ListItem>
              </div>
            </>
          )}
        </>
      )}
      
      <div className="settings-item settings-item-picker">
        <h4 className="settings-item-header">
          {lang('Localization.InterfaceLanguage')}
        </h4>
        {options ? (
          <ItemPicker
            items={options}
            selectedValue={selectedLanguage}
            forceRenderAllItems
            onSelectedValueChange={handleChange}
            itemInputType="radio"
            className="settings-picker"
          />
        ) : (
          <Loading />
        )}
      </div>
    </div>
  );
};

export default memo(withGlobal<OwnProps>(
  (global): StateProps => {
    const {
      canTranslate, canTranslateChats, doNotTranslate,
      isChatGptIntegrationEnabled, useChatGptForTranslation, translationDisplayStyle,
    } = global.settings.byKey;
    const { language, languages } = selectSharedSettings(global);

    const isCurrentUserPremium = selectIsCurrentUserPremium(global);

    return {
      isCurrentUserPremium,
      languages,
      language,
      canTranslate,
      canTranslateChats,
      doNotTranslate,
      isChatGptIntegrationEnabled,
      useChatGptForTranslation,
      translationDisplayStyle,
    };
  },
)(SettingsLanguage));
