import { MIME_TYPES } from '../../../../src/config/constants';
import {
  buildFileImageId,
  buildFilePdfId,
  buildFileVideoId,
  DOCUMENT_ITEM_TEXT_EDITOR_SELECTOR,
  ITEM_PANEL_DESCRIPTION_ID,
  ITEM_PANEL_ID,
  ITEM_PANEL_NAME_ID,
  ITEM_PANEL_TABLE_ID,
} from '../../../../src/config/selectors';
import {
  getDocumentExtra,
  getEmbeddedLinkExtra,
  getFileExtra,
  getS3FileExtra,
} from '../../../../src/utils/itemExtra';

const expectPanelLayout = ({ name, extra, creator, description, mimetype }) => {
  const panel = cy.get(`#${ITEM_PANEL_ID}`);
  panel.get(`#${ITEM_PANEL_NAME_ID}`).contains(name);
  panel.get(`#${ITEM_PANEL_DESCRIPTION_ID}`).contains(description);
  panel.get(`#${ITEM_PANEL_TABLE_ID}`).should('exist').contains(creator);

  if (mimetype) {
    panel.get(`#${ITEM_PANEL_TABLE_ID}`).contains(mimetype);

    panel
      .get(`#${ITEM_PANEL_TABLE_ID}`)
      .contains(getFileExtra(extra)?.size || getS3FileExtra(extra)?.size);
  }
};

export const expectDocumentViewScreenLayout = ({
  name,
  extra,
  creator,
  description,
}) => {
  cy.get(DOCUMENT_ITEM_TEXT_EDITOR_SELECTOR).then((editor) => {
    expect(editor.html()).to.contain(getDocumentExtra(extra)?.content);
  });

  expectPanelLayout({
    name,
    extra,
    creator,
    description,
  });
};

export const expectFileViewScreenLayout = ({
  id,
  name,
  extra,
  creator,
  description,
}) => {
  const mimetype =
    getFileExtra(extra)?.mimetype || getS3FileExtra(extra)?.contenttype;

  // embedded element
  let selector = null;
  if (MIME_TYPES.IMAGE.includes(mimetype)) {
    selector = `#${buildFileImageId(id)}`;
  } else if (MIME_TYPES.VIDEO.includes(mimetype)) {
    selector = `#${buildFileVideoId(id)}`;
  } else if (MIME_TYPES.PDF.includes(mimetype)) {
    selector = `#${buildFilePdfId(id)}`;
  }
  cy.get(selector).should('exist');

  // table
  expectPanelLayout({ name, extra, creator, description, mimetype });
};

export const expectLinkViewScreenLayout = ({
  id,
  name,
  extra,
  description,
}) => {
  const { url, html } = getEmbeddedLinkExtra(extra);

  // embedded element
  if (html) {
    cy.get(`#${id}`).then((element) => {
      // transform innerhtml content to match provided html
      const parsedHtml = element.html().replaceAll('=""', '');
      expect(parsedHtml).to.contain(html);
    });
  } else {
    cy.get(`iframe#${id}`).should('have.attr', 'src', url);
  }

  // table
  const panel = cy.get(`#${ITEM_PANEL_ID}`);
  panel.get(`#${ITEM_PANEL_NAME_ID}`).contains(name);
  panel.get(`#${ITEM_PANEL_DESCRIPTION_ID}`).contains(description);
};
