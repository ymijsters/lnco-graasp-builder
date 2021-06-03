import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core';
import TextEditor from '../../common/TextEditor';
import { buildDocumentExtra, getDocumentExtra } from '../../../utils/itemExtra';
import BaseForm from './BaseItemForm';
import { ITEM_FORM_DOCUMENT_TEXT_ID } from '../../../config/selectors';

const useStyles = makeStyles((theme) => ({
  textEditorWrapper: {
    marginTop: theme.spacing(2),
  },
}));

const DocumentForm = ({ onChange, item }) => {
  const classes = useStyles();

  const handleOnChange = (content) => {
    onChange({
      ...item,
      extra: buildDocumentExtra({ content }),
    });
  };

  const value = getDocumentExtra(item?.extra)?.content;

  return (
    <>
      <BaseForm onChange={onChange} item={item} />
      <div className={classes.textEditorWrapper}>
        <TextEditor
          id={ITEM_FORM_DOCUMENT_TEXT_ID}
          value={value}
          onChange={handleOnChange}
        />
      </div>
    </>
  );
};

DocumentForm.propTypes = {
  onChange: PropTypes.func.isRequired,
  item: PropTypes.shape({
    extra: PropTypes.shape({}),
  }).isRequired,
};

export default DocumentForm;
