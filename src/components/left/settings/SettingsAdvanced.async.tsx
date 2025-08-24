import type { FC } from '../../../lib/teact/teact';
import React from '../../../lib/teact/teact';

import type { OwnProps } from './SettingsAdvanced';

const SettingsAdvancedAsync: FC<OwnProps> = (props) => {
  const { isActive } = props;
  const SettingsAdvanced = isActive
    ? require('./SettingsAdvanced').default
    : undefined;

  return SettingsAdvanced ? <SettingsAdvanced {...props} /> : undefined;
};

export default SettingsAdvancedAsync;