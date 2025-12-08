import { useState } from "react"

function RegisterPage() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    branch: "",
    year: "",
  })

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    console.log("Register form submitted:", form)
  }

  return (
    <div className="auth-container">
      <h2>Create an account</h2>
      <form className="auth-form" onSubmit={handleSubmit}>
        <label>
          Name
          <input
            name="name"
            value={form.name}
            onChange={handleChange}
            required
          />
        </label>

        <label>
          Email
          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            required
          />
        </label>

        <label>
          Password
          <input
            type="password"
            name="password"
            value={form.password}
            onChange={handleChange}
            required
          />
        </label>

        <label>
          Branch
          <input
            name="branch"
            value={form.branch}
            onChange={handleChange}
            placeholder="AIML / CSE / ECE..."
          />
        </label>

        <label>
          Year
          <input
            name="year"
            value={form.year}
            onChange={handleChange}
            placeholder="2 / 3 / 4"
          />
        </label>

        <button type="submit">Register</button>
      </form>
    </div>
  )
}

export default RegisterPage
