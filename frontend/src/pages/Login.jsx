import { Mail, User2Icon, Lock } from 'lucide-react'
import React from 'react'
import api from '../configs/api'
import { useDispatch } from 'react-redux'
import { login } from '../../store/features/authSlice'
import toast from 'react-hot-toast'

const Login = () => {
  const dispatch = useDispatch()
  const query = new URLSearchParams(window.location.search)
  const urlstate = query.get('state')
  const [state, setState] = React.useState(urlstate || "login")

  const [formData, setFormData] = React.useState({
    name: '',
    email: '',
    password: ''
  })

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const { data } = await api.post(`/api/user/${state}`, formData)
      dispatch(login(data))
      localStorage.setItem('token', data.token)
      toast.success(data.message)
    } catch (err) {
      toast.error(err?.response?.data?.message || err.message)
      console.log(err.message);
    }
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-green-600 to-gray-500">
      <form
        onSubmit={handleSubmit}
        className="sm:w-87.5 w-full text-center bg-gray-900 border border-gray-800 rounded-2xl px-8">
        <h1 className="text-white text-3xl mt-10 font-medium">
          {state === "login" ? "Login" : "Sign up"}
        </h1>

        <p className="text-gray-400 text-sm mt-2">Please {state} to continue</p>

        {state !== "login" && (
          <div className="flex items-center mt-6 w-full bg-gray-800 border border-gray-700 h-12 rounded-full overflow-hidden pl-6 gap-2 ">
            <User2Icon size={16} color='#6B7280' />
            <input type="text" name="name" placeholder="Name" className="w-full bg-transparent text-white placeholder-gray-400 border-none outline-none " value={formData.name} onChange={handleChange} required />
          </div>
        )}

        <div className="flex items-center w-full mt-4 bg-gray-800 border border-gray-700 h-12 rounded-full overflow-hidden pl-6 gap-2 ">
          <Mail size={16} color='#6B7280' />
          <input type="email" name="email" placeholder="Email id" autoComplete="username" value={formData.email} onChange={handleChange} required
          className="w-full bg-transparent text-white placeholder-gray-400 border-none outline-none" />
        </div>

        <div className=" flex items-center mt-4 w-full bg-gray-800 border border-gray-700 h-12 rounded-full overflow-hidden pl-6 gap-2 ">
          <Lock size={16} color='#6B7280' />
          <input type="password" name="password" placeholder="Password" autoComplete={state === "login" ? "current-password" : "new-password"}
          className="w-full bg-transparent text-white placeholder-gray-400 border-none outline-none"
           value={formData.password} onChange={handleChange} required />
        </div>

        <div className="mt-4 text-left">
          <button className="text-sm text-green-400 hover:underline">
            Forget password?
          </button>
        </div>

        <button type="submit" className="mt-2 w-full h-11 rounded-full text-white bg-green-600 hover:bg-green-500 transition " >
          {state === "login" ? "Login" : "Sign up"}
        </button>

        <p onClick={() => {
          setState(prev => prev === "login" ? "register" : "login")
          setFormData({ name: '', email: '', password: '' })
        }} className="text-gray-400 text-sm mt-3 mb-11 cursor-pointer" >
          {state === "login" ? "Don't have an account?" : "Already have an account?"}
          <span className="text-green-400 hover:underline ml-1">click here</span>
        </p>
      </form>
    </div>
  )
}

export default Login