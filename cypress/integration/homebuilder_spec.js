describe('HHBuilder end-to-end tests', function () {
  beforeEach(function () {
    cy.visit('/index.html');
  });

  it('should contain specific elements', function () {
    cy.title().should('include', 'HOME BUILDER');
    cy.get('input[name="age"]').should('exist');
    cy.get('select[name="rel"]').should('exist');
    cy.get('input[name="smoker"]').should('exist');
    cy.get('.add').should('exist');
    cy.get('button[type="submit"]').should('exist');
    cy.get('.debug').should('exist');
  });

  it('should have default inputs', function () {
    cy.get('input[name="age"]').should('be.empty');
    cy.get('select[name="rel"]').should('have.value', '');
    cy.get('input[name="smoker"]').should('not.be.checked');
  });

  it('should require values for age and relationship', function () {
    cy.get('.add').click();
    cy.get('.age-msg').should('have.text', '* Required');
    cy.get('.rel-msg').should('have.text', '* Required');
  });

  it('error messages should disappear when errors are corrected', function () {
    cy.get('.add').click();
    cy.get('.age-msg').should('exist');
    cy.get('.rel-msg').should('exist');

    cy.get('input[name="age"]').type('12');
    cy.get('.age-msg').should('not.exist');
    cy.get('.rel-msg').should('exist');

    cy.get('select[name="rel"]').select('Child');
    cy.get('.rel-msg').should('not.exist');
  });

  it('should require specific values in age input', function () {
    cy.get('input[name="age"]').type('abcd');
    cy.get('.age-msg').should('have.text', '* Please input a valid age');
  });

  it('should require values > 0 for age input', function () {
    cy.get('input[name="age"]').type('0');
    cy.get('.age-msg').should('have.text', '* Age should be between 1 - 120');
  });

  it('should require values <= 120 for age input', function () {
    cy.get('input[name="age"]').type('121');
    cy.get('.age-msg').should('have.text', '* Age should be between 1 - 120');
  });

  it('should allow spaces in age input', function () {
    cy.get('input[name="age"]').type('17   ');
    cy.get('.age-msg').should('not.exist');
  });

  it('should display member when user clicks add button (with valid inputs)', function () {
    cy.get('.member-profile').should('not.exist');

    cy.get('input[name="age"]').type('12');
    cy.get('select[name="rel"]').select('Child');
    cy.get('.add').click();

    cy.get('.member-profile > h4').eq(0).should('have.text', 'child');
    cy.get('.member-profile > h4').eq(1).should('have.text', 'Age: 12');
    cy.get('.member-profile > h4').eq(2).should('have.text', 'Non-smoker');
  });

  it('should be able to add multiple members', function () {
    cy.get('input[name="age"]').type('12');
    cy.get('select[name="rel"]').select('Child');
    cy.get('.add').click();

    cy.get('input[name="age"]').type('47');
    cy.get('select[name="rel"]').select('Parent');
    cy.get('input[name="smoker"]').check();
    cy.get('.add').click();

    cy.get('.member-profile').eq(0).should('exist');
    cy.get('.member-profile').eq(1).should('exist');
  });

  it('should clear all inputs when user successfully adds a member', function () {
    cy.get('input[name="age"]').type('47');
    cy.get('select[name="rel"]').select('Parent');
    cy.get('input[name="smoker"]').check();
    cy.get('.add').click();

    cy.get('input[name="age"]').should('be.empty');
    cy.get('select[name="rel"]').should('have.value', '');
    cy.get('input[name="smoker"]').should('not.be.checked');
  });

  it('should be able to delete a member', function () {
    cy.get('input[name="age"]').type('81');
    cy.get('select[name="rel"]').select('Grandparent');
    cy.get('.add').click();

    cy.get('.member-profile').should('exist');
    cy.get('.delete-member').should('exist');

    cy.get('.delete-member').click();

    cy.get('.member-profile').should('not.exist');
    cy.get('.delete-member').should('not.exist');
  });

  it('submit button should be enabled only when members are present', function () {
    cy.get('button[type="submit"]').should('be.disabled');

    cy.get('input[name="age"]').type('81');
    cy.get('select[name="rel"]').select('Grandparent');
    cy.get('.add').click();

    cy.get('button[type="submit"]').should('be.enabled');

    cy.get('.delete-member').click();

    cy.get('button[type="submit"]').should('be.disabled');
  });

  it('should append json household data to .debug upon submission', function () {
    var expected = '{"0":{"age":"30","relationship":"self","smoker":"false"}}';

    cy.get('input[name="age"]').type('30');
    cy.get('select[name="rel"]').select('Self');
    cy.get('.add').click();
    cy.get('button[type="submit"]').click();

    cy.get('.debug').should('have.text', expected);
  });
});