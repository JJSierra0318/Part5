import React from 'react'
import '@testing-library/jest-dom/extend-expect'
import { fireEvent, render } from '@testing-library/react'
import Blog from './Blog'

describe('Blog', () => {

  const blog = {
    title: 'Testing the frontend',
    author: 'sierra',
    url: 'https.com',
    likes: 1,
    user: {
      username: 'sierra',
      name: 'juan'
    }
  }

  const mockLike = jest.fn()
  const mockDelete = jest.fn()

  let component

  beforeEach(() => {
    component = render(<Blog blog={blog} handleLike={mockLike} handleDelete={mockDelete} username='user'/>)
  })

  test('renders only title and author by default', () => {
    expect(component.container).toHaveTextContent(`${blog.title} - ${blog.author}`)

    const div = component.container.querySelector('.view')
    expect(div.parentNode).toHaveStyle('display: none')
  })

  test('renders everything when the view button is clicked', () => {

    const button = component.getByText('view')
    fireEvent.click(button)

    const div = component.container.querySelector('.view')
    expect(div.parentNode).not.toHaveStyle('display: none')
  })

  test('handles correctly the like button beeing clicked twice', () => {

    const button = component.container.querySelector('.Like')
    fireEvent.click(button)
    fireEvent.click(button)

    expect(mockLike.mock.calls).toHaveLength(2)
  })
})

