describe("Appointments", () => {

  beforeEach(() => {
    cy.request("/api/debug/reset");
  
    cy.visit("/");
  
    cy.contains("Monday");
   });

  it("should book an interview", () => {
    cy.get("[alt=Add]")
      .first()
      .click()
    
    cy.get("[data-testid=student-name-input]").type("Lydia Miller-Jones");

    cy.get("[alt='Tori Malcolm']").click();

    cy.contains("Save").click();

    cy.contains(".appointment__card--show", "Lydia Miller-Jones");
    cy.contains(".appointment__card--show", "Tori Malcolm");
  });

  it("should edit an interview", () => {
    cy.get("[alt=Edit]")
      .click({ force: true })

    cy.get("[alt='Tori Malcolm']").click();

    cy.contains("Save").click();

    cy.contains(".appointment__card--show", "Archie Cohen");
    cy.contains(".appointment__card--show", "Tori Malcolm");
  });

  it("should cancel an interview", () => {
    cy.get("[alt=Delete]")
      .click({ force: true })

    cy.contains("Confirm").click();

    cy.contains(/deleting/i).should("exist")
    cy.contains(/deleting/i).should("not.exist")

    cy.contains(".appointment__card--show", "Archie Cohen")
      .should("not.exist");
  });
});
