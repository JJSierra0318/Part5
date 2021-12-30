import React from "react";

const loginForm = ({
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
          username <input value={username} onChange={handleUsernameChange}/>
        </div>
        <div>
          password <input value={password} onChange={handlePasswordChange}/>
        </div>
        <div>
          <button>login</button>
        </div>
      </form>
    </div>
  )
}

// eslint-disable-next-line import/no-anonymous-default-export
export default {loginForm}