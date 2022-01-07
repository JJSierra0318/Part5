import propTypes from 'prop-types'
import React from 'react'
import Togglabel from './Togglable'

const Blog = ({ blog, username, handleLike, handleDelete }) => {

  return (
    <div className='Blog'>
      {blog.title} - {blog.author}
      <Togglabel buttonLabel='view'>
        <div className='view'>
          {blog.url}<br/>
          likes: {blog.likes}  <button className='Like' onClick={handleLike}>like</button><br/>
          {blog.user.username}<br/>
          {blog.user.username === username
            ? <button onClick={handleDelete}>delete</button>
            : null}
        </div>
      </Togglabel>
    </div>
  )}

Blog.propTypes = {
  blog: propTypes.object.isRequired,
  username: propTypes.string.isRequired,
  handleLike: propTypes.func.isRequired,
  handleDelete: propTypes.func.isRequired
}

export default Blog