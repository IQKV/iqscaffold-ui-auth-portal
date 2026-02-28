import { Select } from "@mantine/core";
import { IconLanguage } from "@tabler/icons-react";
import { i18n } from "@lingui/core";
import {
  availableLocales,
  dynamicActivateLocale,
  localeToFlagEmojiMap,
  localeToNameMap,
  type SupportedLocales,
} from "@/shared/locales";

export function LocaleSwitcher() {
  const currentLocale = i18n.locale as SupportedLocales;

  const localeOptions = availableLocales.map((locale) => ({
    value: locale,
    label: `${localeToFlagEmojiMap[locale as SupportedLocales]} ${localeToNameMap[locale as SupportedLocales]}`,
  }));

  const handleLocaleChange = async (value: string | null) => {
    if (value && availableLocales.includes(value)) {
      await dynamicActivateLocale(value);
      // Store locale preference in cookie
      document.cookie = `locale=${value}; path=/; max-age=31536000`; // 1 year
      // Reload to apply locale changes
      window.location.reload();
    }
  };

  return (
    <Select
      data={localeOptions}
      value={currentLocale}
      onChange={handleLocaleChange}
      leftSection={<IconLanguage size={16} />}
      comboboxProps={{ withinPortal: false }}
      styles={{
        input: {
          minWidth: "150px",
        },
      }}
    />
  );
}
