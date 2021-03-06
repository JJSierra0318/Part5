import propTypes from 'prop-types'
import React from 'react'

const LoginForm = ({
  handleSubmit,
  handleUsernameChange,
  handlePasswordChange,
  username,
  password
}) => {
  return (
    <div>
      <h2>Login</h2>

      <form onSubmit={handleSubmit}>
        <div>
          username <input id='username' type='text' value={username} onChange={handleUsernameChange}/>
        </div>
        <div>
          password <input id='password' type='password' value={password} onChange={handlePasswordChange}/>
        </div>
        <div>
          <button id='login-button'>login</button>
        </div>
      </form>
    </div>
  )
}

LoginForm.propTypes = {
  handleSubmit: propTypes.func.isRequired,
  handleUsernameChange: propTypes.func.isRequired,
  handlePasswordChange: propTypes.func.isRequired,
  username: propTypes.string.isRequired,
  password: propTypes.string.isRequired
}

export default LoginForm