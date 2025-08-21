import { useTranslation } from 'react-i18next';
function LanguageSwitcher() {
  const { i18n } = useTranslation();

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
  };

  return (
    <div style={{ padding: '10px', textAlign: 'right' }}>
      <label>{i18n.t('select_language')}:</label>
      <select
        onChange={(e) => changeLanguage(e.target.value)}
        value={i18n.language}
        style={{ marginLeft: '8px',color:"black" }}
      >
        <option value="en">English</option>
        <option value="ru">Русский</option>
        <option value="de">Deutsch</option>
      </select>
    </div>
  );
}

export default LanguageSwitcher;