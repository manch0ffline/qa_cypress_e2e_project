/// <reference types='cypress' />
/// <reference types='../support' />

import ArticlePageObject from '../support/pages/article.pageObject';
import HomePageObject from '../support/pages/home.pageObject';

describe('Article', () => {
  const articlePage = new ArticlePageObject();
  const homePage = new HomePageObject();
  let user;
  let article;

  beforeEach(() => {
    cy.visit('/');
    cy.task('db:clear')
      .then(() => cy.task('generateUser'))
      .then((generatedUser) => {
        user = generatedUser;
        return cy.task('generateArticle');
      })
      .then((generatedArticle) => {
        article = generatedArticle;
      });
  });

  it.only('should be created using New Article form', function () {
    cy.login(user.email, user.username, user.password);
    // articlePage.visit();

    cy.createArticle(article);

    homePage.assertHeaderContainUsername(user.username);
    cy.contains('h1', `Article title: ${article.title}`).should('be.visible');
  });

  // it.only('should be created using New Article form', function () {
  //   cy.get('@user').then(({ email, username, password }) => {
  //     cy.login(email, username, password);
  //     articlePage.visit();

  //     cy.get('@article').then(({ title, description, body }) => {
  //       cy.createArticle(title, description, body);

  //       homePage.assertHeaderContainUsername(username);
  //       cy.contains('h1', `Article title: ${title}`).should('be.visible');
  //     });
  //   });
  // });

  it('should be edited using Edit button', () => {
    cy.get('@user').then(({ email, username, password }) => {
      cy.login(email, username, password);

      cy.get('@article').then(({ title, description, body }) => {
        cy.createArticle(title, description, body);

        // articlePage.chekProfileUsername(username);
        homePage.assertHeaderContainUsername(username);

        // Editing
        cy.contains('h1', `Article title: ${title}`).click();

        cy.contains('a', `Edit Article`).click();

        articlePage.titleInput().clear();
        articlePage.typeTitle('Edited Title');

        articlePage.descriptionInput().clear();
        articlePage.typeDescription('Edited Description');

        articlePage.bodyInput().clear();
        articlePage.typeBody('Edited Body');

        articlePage.clickOnUpdateBtn();
        cy.contains('h1', `Edited Title`).should('be.visible');
      });
    });
  });

  it('should be deleted using Delete button', () => {
    cy.get('@user').then(({ email, username, password }) => {
      cy.login(email, username, password);

      cy.get('@article').then(({ title, description, body }) => {
        cy.createArticle(title, description, body);

        // articlePage.chekProfileUsername(username);
        homePage.assertHeaderContainUsername(username);
        cy.contains('h1', `Article title: ${title}`).should('be.visible');

        // Deleting
        cy.get('a[class="preview-link"]')
          .contains('h1', `Article title: ${title}`)
          .click();

        cy.contains('button', 'Delete Article').click();
      });
    });
  });
});
