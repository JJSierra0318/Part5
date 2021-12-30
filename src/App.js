import React, { useState, useEffect } from 'react'
import Blog from './components/Blog'
import blogService from './services/blogs'
import loginService from './services/login'
import ErrorNotification from './components/notifications/error'
import AddedNotification from './components/notifications/added'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [addedMessage, setAddedMessage] = useState(null)
  const [errorMessage, setErrorMessage] = useState(null)

  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  const [newTitle, setNewTitle] = useState('')
  const [newAuthor, setNewAuthor] = useState('')
  const [newUrl, setNewUrl] = useState('')

  const [user, setUser] = useState(null)

  useEffect(() => {
    blogService.getAll().then(blogs =>
      setBlogs( blogs )
    )  
  }, [])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogappUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])

  const handleLogin = async (event) => {
    event.preventDefault()
    try {
      const user = await loginService.login({username, password})
      blogService.setToken(user.token)
      window.localStorage.setItem('loggedBlogappUser', JSON.stringify(user))
      
      setUser(user)
      setUsername('')
      setPassword('')

    } catch (exception) {
      setErrorMessage('wrong Credentials')
      setTimeout(() => {
        setErrorMessage(null)
      }, 5000)
    }
  }

  const handleLogout = async (event) => {
    try {
      window.localStorage.removeItem('loggedBlogappUser')
      setUser(null)
    } catch (exception) {
      console.log('user already logged out')
    }
  }

  /*const loginForm = () => {
    <loginForm
      username={username}
      password={password}
      handleSubmit={handleLogin}
      handleUsernameChange={({ target }) => setUsername(target.value)}
      handlePasswordChange={({ target }) => setPassword(target.value)}
    />
  }*/

  const addBlog = async (event) => {
    try {
      event.preventDefault()
      const blogObject = {
        title: newTitle,
        author: newAuthor,
        url: newUrl
      }

      const response = await blogService.create(blogObject)
      setBlogs(blogs.concat(response))
      setAddedMessage(newTitle + ' by ' + newAuthor + ' added')
      setTimeout(() => {
        setAddedMessage(null)
      },5000)
      setNewTitle('')
      setNewAuthor('')
      setNewUrl('')
    } catch (error) {
      setErrorMessage('all fields must be filled')
    }
    
    
  }

  const loginForm = () => {
    return (
      <div>
        <h2>Login</h2>
  
        <form onSubmit={handleLogin}>
          <div>
            username <input 
            value={username}
            name="Username"
            onChange={({ target }) => setUsername(target.value)}/>
          </div>
          <div>
            password <input
            type="password"
            value={password} 
            name="Password"
            onChange={({ target }) => setPassword(target.value)}/>
          </div>
          <div>
            <button>login</button>
          </div>
        </form>
      </div>
    )
  }

  const blogForm = () => (
    <div>
      <h2>Create a new blog</h2>
      <form onSubmit={addBlog}>
        <div>
          title: <input
            value={newTitle}
            onChange={({ target }) => setNewTitle(target.value)}
          />
        </div>
        <div>
          author: <input
            value={newAuthor}
            onChange={({ target }) => setNewAuthor(target.value)}
          />
        </div>
        <div>
          url: <input
            value={newUrl}
            onChange={({ target }) => setNewUrl(target.value)}
          />
        </div>
        <br/>
        <button>Create</button>
      </form>
    </div>
  )

  return (
    <div>
      <h1>Blogs</h1>
      <AddedNotification message={addedMessage} />
      <ErrorNotification message={errorMessage} />
      {user === null ?
        loginForm() :
        <div>
          <p>{user.name} logged in <button onClick={() => {handleLogout()}}>Logout</button></p>
          {blogForm()}
          {blogs.map(blog =>
        <Blog key={blog.id} blog={blog} />
          )}
        </div>
      }
    </div>
  )
}

export default App