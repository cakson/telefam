import React, { memo, useCallback, useState } from '../../../lib/teact/teact';
import { getActions, getGlobal, setGlobal } from '../../../global';

import type { AccountSettings } from '../../../types';

import { copyTextToClipboard } from '../../../util/clipboard';
import { buildClassName } from '../../../util/buildClassName';

import useHistoryBack from '../../../hooks/useHistoryBack';
import useLang from '../../../hooks/useLang';

import Button from '../../ui/Button';
import Modal from '../../ui/Modal';
import TextArea from '../../ui/TextArea';

import styles from './SettingsAdvanced.module.scss';

type OwnProps = {
  isActive?: boolean;
  onReset: () => void;
};

const SettingsAdvanced = ({
  isActive,
  onReset,
}: OwnProps) => {
  const { showNotification, setSettingOption, setSharedSettingOption, updateAttachmentSettings, setThemeSettings } = getActions();
  const lang = useLang();
  
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [importValue, setImportValue] = useState('');

  useHistoryBack({
    isActive,
    onBack: onReset,
  });

  const handleExportSettings = useCallback(() => {
    const global = getGlobal();
    
    // Collect client-side settings
    const clientSettings = {
      accountSettings: global.settings.byKey,
      sharedSettings: global.sharedState?.settings,
      attachmentSettings: global.attachmentSettings,
      themes: global.settings.themes,
      chatSpecificSettings: global.translations?.byChatId ? 
        Object.entries(global.translations.byChatId).reduce((acc, [chatId, translations]) => {
          const hasSettings = translations.chatGptContext || 
                            translations.requestedLanguage || 
                            translations.manualMessageLanguages ||
                            translations.excludedMessageIds;
          
          if (hasSettings) {
            acc[chatId] = {
              chatGptContext: translations.chatGptContext,
              requestedLanguage: translations.requestedLanguage,
              manualMessageLanguages: translations.manualMessageLanguages,
              excludedMessageIds: translations.excludedMessageIds,
            };
          }
          return acc;
        }, {} as Record<string, any>) : {},
    };

    // Convert to JSON and encode to base64
    const json = JSON.stringify(clientSettings, null, 2);
    const base64 = btoa(unescape(encodeURIComponent(json)));
    
    // Copy to clipboard
    copyTextToClipboard(base64);
    
    // Show notification
    showNotification({
      message: lang('ClientSideSettingsExported'),
    });
  }, [lang, showNotification]);

  const handleOpenImportModal = useCallback(() => {
    setIsImportModalOpen(true);
    setImportValue('');
  }, []);

  const handleCloseImportModal = useCallback(() => {
    setIsImportModalOpen(false);
    setImportValue('');
  }, []);

  const handleImportValueChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setImportValue(e.target.value);
  }, []);

  const handleConfirmImport = useCallback(() => {
    const base64Input = importValue.trim();
    
    if (!base64Input) {
      showNotification({
        message: lang('ClientSideSettingsImportError'),
      });
      return;
    }
    
    try {
      // Decode base64 and parse JSON
      const json = decodeURIComponent(escape(atob(base64Input)));
      const importedSettings = JSON.parse(json);
      
      const global = getGlobal();
      
      // Import account settings
      if (importedSettings.accountSettings) {
        // Import all settings at once to ensure they all get applied
        setSettingOption(importedSettings.accountSettings);
      }
      
      // Import shared settings
      if (importedSettings.sharedSettings) {
        setSharedSettingOption(importedSettings.sharedSettings);
      }
      
      // Import attachment settings
      if (importedSettings.attachmentSettings) {
        updateAttachmentSettings(importedSettings.attachmentSettings);
      }
      
      // Import theme settings
      if (importedSettings.themes) {
        Object.entries(importedSettings.themes).forEach(([theme, settings]) => {
          setThemeSettings({ theme: theme as any, ...settings as any });
        });
      }
      
      // Import chat-specific settings
      if (importedSettings.chatSpecificSettings) {
        // Process all chat settings after all other imports to ensure we have the latest global state
        setTimeout(() => {
          const latestGlobal = getGlobal();
          let updatedTranslations = latestGlobal.translations || { byChatId: {} };
          
          Object.entries(importedSettings.chatSpecificSettings).forEach(([chatId, settings]: [string, any]) => {
            const existingChatTranslations = updatedTranslations.byChatId?.[chatId] || {};
            
            // Build the complete translation object for this chat
            const newChatTranslations: any = { 
              ...existingChatTranslations,
              // Always preserve byLangCode if it exists
              byLangCode: existingChatTranslations.byLangCode || {},
            };
            
            // Add all the settings from the import
            if (settings.chatGptContext) {
              newChatTranslations.chatGptContext = settings.chatGptContext;
            }
            
            if (settings.requestedLanguage) {
              newChatTranslations.requestedLanguage = settings.requestedLanguage;
            }
            
            if (settings.manualMessageLanguages) {
              newChatTranslations.manualMessageLanguages = settings.manualMessageLanguages;
            }
            
            if (settings.excludedMessageIds) {
              newChatTranslations.excludedMessageIds = settings.excludedMessageIds;
            }
            
            // Update the translations object
            updatedTranslations = {
              ...updatedTranslations,
              byChatId: {
                ...updatedTranslations.byChatId,
                [chatId]: newChatTranslations,
              },
            };
          });
          
          // Apply all chat-specific settings at once
          setGlobal({
            ...latestGlobal,
            translations: updatedTranslations,
          });
        }, 100); // Small delay to ensure other settings are applied first
      }
      
      // Close modal and show success notification
      handleCloseImportModal();
      showNotification({
        message: lang('ClientSideSettingsImported'),
      });
    } catch (error) {
      // Show error notification
      showNotification({
        message: lang('ClientSideSettingsImportError'),
      });
    }
  }, [importValue, lang, setSettingOption, showNotification, setSharedSettingOption, updateAttachmentSettings, setThemeSettings, handleCloseImportModal]);

  return (
    <div className="settings-content custom-scroll">
      <div className={styles.container}>
        <div className={styles.section}>
          <h4 className={styles.sectionHeader}>{lang('ClientSideSettings')}</h4>
          
          <p className={styles.sectionDescription}>
            {lang('ClientSideSettingsDescription')}
          </p>
          
          <div className={styles.buttonGroup}>
            <Button
              className={styles.exportButton}
              onClick={handleExportSettings}
            >
              {lang('ExportClientSideSettings')}
            </Button>
            
            <Button
              className={styles.importButton}
              onClick={handleOpenImportModal}
            >
              {lang('ImportClientSideSettings')}
            </Button>
          </div>
        </div>
      </div>
      
      <Modal
        isOpen={isImportModalOpen}
        onClose={handleCloseImportModal}
        onEnter={handleConfirmImport}
        title={lang('ImportClientSideSettings')}
        className="import-settings-modal"
      >
        <p className={styles.modalDescription}>
          {lang('PasteBase64Settings')}
        </p>
        <TextArea
          value={importValue}
          onChange={handleImportValueChange}
          placeholder={lang('Base64SettingsPlaceholder')}
          rows={8}
          noReplaceNewlines
        />
        <div className={styles.modalButtons}>
          <Button
            onClick={handleCloseImportModal}
            color="secondary"
          >
            {lang('Cancel')}
          </Button>
          <Button
            onClick={handleConfirmImport}
            color="primary"
          >
            {lang('ImportAction')}
          </Button>
        </div>
      </Modal>
    </div>
  );
};

export default memo(SettingsAdvanced);