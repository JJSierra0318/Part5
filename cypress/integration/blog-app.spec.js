describe('BLog app', function() {
  beforeEach(function() {
    cy.request('POST', 'http://localhost:3003/api/testing/reset')
    const user = {
      name: 'Sierra',
      username: 'JSierra',
      password: 'password'
    }
    cy.request('POST', 'http://localhost:3003/api/users/', user)
    cy.visit('http://localhost:3000')
  })

  it('displays the login form by default', function() {
    cy.contains('Blogs')
    cy.contains('Login')
  })

  describe('Login', function () {
    it('succeds with correct credentials', function() {
      cy.get('#username').type('JSierra')
      cy.get('#password').type('password')
      cy.get('#login-button').click()

      cy.contains('Sierra logged in')
    })

    it('fails with wrong password', function() {
      cy.get('#username').type('JSierra')
      cy.get('#password').type('wrong')
      cy.get('#login-button').click()

      cy.get('.Error')
        .should('contain', 'wrong Credentials')
        .and('have.css', 'color', 'rgb(255, 0, 0)')

      cy.get('html').should('not.contain', 'Sierra logged in')
    })
  })

  describe('when logged in', function() {
    beforeEach(function() {
      cy.login({ username: 'JSierra', password: 'password' })
    })

    it('a new blog can be created', function() {
      cy.contains('create a new blog').click()
      cy.get('#title').type('Testing the creation of a blog')
      cy.get('#author').type('Sierra')
      cy.get('#url').type('https://url.com')
      cy.get('#create-button').click()
      cy.contains('Testing the creation of a blog')
    })

    describe('and a blog exists', function() {
      beforeEach(function() {
        cy.createBlog({ title: 'First Blog Saved', author: 'Sierra', url: 'https://com.com' })
        cy.createBlog({ title: 'Second Blog Saved', author: 'Sierra', url: 'https://com2.com' })
      })

      it('users can like a blog', function() {
        cy.contains('First Blog Saved')
          .contains('view').click()
        cy.contains('First Blog Saved')
          .contains('like').click()
        cy.contains('First Blog Saved')
          .contains('likes: 1')
      })

      it('users can delete their blogs', function() {
        cy.contains('First Blog Saved')
          .contains('view').click()
        cy.contains('First Blog Saved')
          .contains('delete').click()
        cy.contains('Deleted First Blog Saved')
        cy.should('not.contain', 'First Blog Saved - Sierra')
      })

      it.only('blogs are sorted by likes', async function() {
        //Verifies that First Blog Saved is the blog on the top
        cy.get('#Blog').contains('First Blog Saved')
          .contains('view').click()
        //likes the second blog, so it shoud be now the blog on the top of the page
        cy.contains('Second Blog Saved')
          .contains('view').click()
        cy.contains('Second Blog Saved')
          .contains('like').click()
        cy.contains('Second Blog Saved')
          .contains('likes: 1')
        //verifies that Second Blog Saved is now the blog on the top
        cy.get('#Blog')
          .contains('Second Blog Saved')
      })
    })
  })
})