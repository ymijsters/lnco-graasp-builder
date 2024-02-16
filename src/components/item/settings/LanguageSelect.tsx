import { SelectProps } from '@mui/material';

import { DiscriminatedItem } from '@graasp/sdk';
import { langs } from '@graasp/translations';
import { Select } from '@graasp/ui';

import { mutations } from '@/config/queryClient';
import { LANGUAGE_SELECTOR_ID } from '@/config/selectors';
import { useCanUpdateItem } from '@/hooks/authorization';

const LanguageSelect = ({ item }: { item: DiscriminatedItem }): JSX.Element => {
  const { mutate: changeLang } = mutations.useEditItem();
  const { allowed: canEdit } = useCanUpdateItem(item);

  const onChange: SelectProps['onChange'] = (e) => {
    const { value: newLang } = e.target;
    changeLang({ id: item.id, lang: newLang as string });
  };

  const values = Object.entries(langs).map(([k, v]) => ({ value: k, text: v }));

  return (
    <Select
      id={LANGUAGE_SELECTOR_ID}
      disabled={!canEdit}
      size="small"
      values={values}
      value={item.lang}
      onChange={onChange}
    />
  );
};

export default LanguageSelect;
