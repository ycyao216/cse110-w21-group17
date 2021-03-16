context('Window', () => {
    beforeEach(() => {
        cy.visit('http://localhost:3000');
        cy.wait(100);
    })


    it('cy.window() - test modifying the global window object', () => {
        cy.window().then((win) => {
            cy.visit('http://localhost:3000');
            cy.wait(100);
        }).then(() => {
            cy.visit('http://localhost:3000/user/bo');
            cy.wait(100);
        })
    })
})