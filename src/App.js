import React, { useState, useEffect, useRef } from 'react'
import Blog from './components/Blog'
import blogService from './services/blogs'
import loginService from './services/login'
import ErrorNotification from './components/notifications/error'
import AddedNotification from './components/notifications/added'
import LoginForm from './components/loginForm'
import BlogForm from './components/blogForm'
import Togglable from './components/Togglable'

function compareLikes (a, b) {
  if (parseInt(a.likes) < parseInt(b.likes)) {
    return 1
  }
  if (parseInt(a.likes) > parseInt(b.likes)) {
    return -1
  }
  return 0
}

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [addedMessage, setAddedMessage] = useState(null)
  const [errorMessage, setErrorMessage] = useState(null)

  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  const [user, setUser] = useState(null)

  const blogFormRef = useRef()

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
      const user = await loginService.login({ username, password })
      blogService.setToken(user.token)
      window.localStorage.setItem('loggedBlogappUser', JSON.stringify(user))
      setUser(user)
      setUsername('')
      setPassword('')

    } catch (exception) {
      console.log(exception)
      setErrorMessage('wrong Credentials')
      setTimeout(() => {
        setErrorMessage(null)
      }, 5000)
    }
  }

  const handleLogout = async () => {
    try {
      window.localStorage.removeItem('loggedBlogappUser')
      setUser(null)
    } catch (exception) {
      console.log('user already logged out')
    }
  }

  const addBlog = async (blogObject) => {
    try {
      blogFormRef.current.toggleVisibility()
      const response = await blogService.create(blogObject)
      setBlogs(blogs.concat(response))
      setAddedMessage(response.title + ' by ' + response.author + ' added')
      setTimeout(() => {
        setAddedMessage(null)
      },5000)
    } catch (error) {
      setErrorMessage('all fields must be filled')
      setTimeout(() => {
        setErrorMessage(null)
      }, 5000)
    }
  }

  const handleLike = async id => {
    try {
      const blog = blogs.find(b => b.id === id)
      const changedBlog = { ...blog, likes: parseInt(blog.likes) + 1 }
      const returnedBlog = await blogService.update(id, changedBlog)
      setBlogs(blogs.map(blog => blog.id !== id ? blog : returnedBlog))
    } catch (error) {
      setErrorMessage('Blog was already removed from the server')
      setTimeout(() => {
        setErrorMessage(null)
      }, 5000)
    }
  }

  const handleDelete = async id => {
    try {
      const toDelete = blogs.find(b => b.id === id)
      const ok = window.confirm(`Delete ${toDelete.title} by ${toDelete.author}`)
      if (ok) {
        await blogService.remove(id)
        setBlogs(blogs.filter(b => b.id !== id))
        setAddedMessage(`Deleted ${toDelete.title}`)
        setTimeout(() => {
          setAddedMessage(null)
        },5000)
      }
    } catch (error) {
      setBlogs(blogs.filter(b => b.id !== id))
      setErrorMessage('Blog was already removed from the server')
      setTimeout(() => {
        setErrorMessage(null)
      }, 5000)
    }
  }

  return (
    <div>
      <h1>Blogs</h1>
      <AddedNotification message={addedMessage} />
      <ErrorNotification message={errorMessage} />
      {user === null ?
        <LoginForm
          username={username}
          password={password}
          handleSubmit={handleLogin}
          handleUsernameChange={({ target }) => setUsername(target.value)}
          handlePasswordChange={({ target }) => setPassword(target.value)}
        /> :
        <div>
          <p>{user.name} logged in <button onClick={() => {handleLogout()}}>Logout</button></p>
          <Togglable buttonLabel={'create a new blog'} ref={blogFormRef}>
            <BlogForm createBlog={addBlog}/>
          </Togglable>
          {blogs.sort(compareLikes).map(blog =>
            <Blog key={blog.id} blog={blog} handleLike={() => handleLike(blog.id)} username={user.username} handleDelete={() => handleDelete(blog.id)}/>
          )}
        </div>
      }
    </div>
  )
}

export default App