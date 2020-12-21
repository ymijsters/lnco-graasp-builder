import { buildItemPath } from '../../src/config/paths';
import {
  buildItemCard,
  buildItemLink,
  buildNavigationLink,
  ITEM_SCREEN_ERROR_ALERT_ID,
  NAVIGATION_HOME_LINK_ID,
} from '../../src/config/selectors';
import { SIMPLE_ITEMS } from '../fixtures/items';

describe('Create Item', () => {
  it('visit Home', () => {
    cy.setUpApi({ items: SIMPLE_ITEMS });
    cy.visit('/');

    // should get own items
    cy.wait('@getOwnItems').then(({ response: { body } }) => {
      // check item is created and displayed
      for (const item of body) {
        cy.get(`#${buildItemCard(item.id)}`).should('exist');
      }
    });

    // visit child
    const { id: childId } = SIMPLE_ITEMS[0];
    cy.get(`#${buildItemLink(childId)}`).click();

    // should get children
    cy.wait('@getChildren').then(({ response: { body } }) => {
      // check item is created and displayed
      for (const item of body) {
        cy.get(`#${buildItemCard(item.id)}`).should('exist');
      }
    });

    // visit child
    const { id: childChildId } = SIMPLE_ITEMS[2];
    cy.get(`#${buildItemLink(childChildId)}`).click();

    // should get children
    cy.wait('@getChildren').then(({ response: { body } }) => {
      // check has no children
      expect(body.length).to.equal(0);
    });

    // return parent with navigation
    cy.get(`#${buildNavigationLink(childId)}`).click();
    // should get children
    cy.wait('@getChildren').then(({ response: { body } }) => {
      // check item is created and displayed
      for (const item of body) {
        cy.get(`#${buildItemCard(item.id)}`).should('exist');
      }
    });
  });

  it('visit item by id', () => {
    cy.setUpApi({ items: SIMPLE_ITEMS });
    const { id } = SIMPLE_ITEMS[0];
    cy.visit(buildItemPath(id));

    // should get current item
    cy.wait('@getItem');

    // should get children
    cy.wait('@getChildren').then(({ response: { body } }) => {
      // check item is created and displayed
      for (const item of body) {
        cy.get(`#${buildItemCard(item.id)}`).should('exist');
      }
    });

    // visit home
    cy.get(`#${NAVIGATION_HOME_LINK_ID}`).click();

    // should get own items
    cy.wait('@getOwnItems').then(({ response: { body } }) => {
      // check item is created and displayed
      for (const item of body) {
        cy.get(`#${buildItemCard(item.id)}`).should('exist');
      }
    });
  });

  it('visiting non-existing item display no item here', () => {
    cy.setUpApi({ items: SIMPLE_ITEMS, getItemError: true });
    const { id } = SIMPLE_ITEMS[0];
    cy.visit(buildItemPath(id));

    // should get current item
    cy.wait('@getItem').then(() => {
      cy.get(`#${ITEM_SCREEN_ERROR_ALERT_ID}`).should('exist');
    });
  });
});
