import React from 'react'
import '@testing-library/jest-dom/extend-expect'
import { fireEvent, render } from '@testing-library/react'
import BlogForm from './blogForm'

test('<BlogForm /> calls the event handler properly with the details of the new blog', () => {
  const createBlog = jest.fn()
  const component = render(<BlogForm createBlog={createBlog} />)

  const title = component.container.querySelector('#title')
  const author = component.container.querySelector('#author')
  const url = component.container.querySelector('#url')
  const form = component.container.querySelector('form')

  fireEvent.change(title, {target: { value: 'testing the blog form' }})
  fireEvent.change(author, {target: { value: 'sierra' }})
  fireEvent.change(url, {target: { value: 'https://testing.com' }})
  fireEvent.submit(form)

  expect(createBlog.mock.calls).toHaveLength(1)
  expect(createBlog.mock.calls[0][0].title).toBe('testing the blog form')
  expect(createBlog.mock.calls[0][0].author).toBe('sierra')
  expect(createBlog.mock.calls[0][0].url).toBe('https://testing.com')
})