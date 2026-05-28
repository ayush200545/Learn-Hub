import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuthStore } from '../store/authStore'
import { motion } from 'framer-motion'
import toast from 'react-hot-toast'
import { ArrowLeft, Github, Mail, Lock, User, UserCheck } from 'lucide-react'

export default function Signup() {
  const { register } = useAuthStore()
  const navigate = useNavigate()
  
  const [formData, setFormData] = useState({
    firstName: '',
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'user'
  })
  
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleRegister = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    
    if (formData.password.length < 8) {
      setError('Password must be at least 8 characters.')
      setLoading(false)
      return
    }
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match.')
      setLoading(false)
      return
    }

    const res = await register(formData)
    setLoading(false)
    if (res.success) {
      toast.success('Account created! Welcome to LearnHub 🎉')
      navigate('/')
    } else {
      setError(res.error)
      toast.error(res.error)
    }
  }

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  return (
    <div className="min-h-screen bg-[#0B0B14] flex items-center justify-center p-4 sm:p-6 lg:p-8 font-sans">
      <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-2 bg-[#14151F] rounded-3xl overflow-hidden border border-white/5 shadow-[0_0_80px_rgba(139,92,246,0.1)]">
        
        {/* Left Side: Illustration Panel */}
        <div className="hidden lg:flex flex-col justify-between p-12 bg-gradient-to-br from-[#1A1A2E] to-[#0B0B14] relative overflow-hidden">
          {/* Ambient Glows */}
          <div className="absolute top-[-10%] right-[-10%] w-[400px] h-[400px] bg-violet-600/20 rounded-full blur-[100px] pointer-events-none"></div>
          <div className="absolute bottom-[20%] left-[-10%] w-[300px] h-[300px] bg-indigo-600/20 rounded-full blur-[100px] pointer-events-none"></div>
          
          <div className="relative z-10">
            <Link to="/" className="inline-flex items-center space-x-2 text-zinc-400 hover:text-white transition-colors mb-12">
              <ArrowLeft size={16} />
              <span className="text-sm font-semibold">Back to Home</span>
            </Link>
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-4xl lg:text-5xl font-bold text-white mb-6 leading-tight"
            >
              Start Learning <br />Today! 🚀
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-zinc-400 text-lg max-w-md"
            >
              Join thousands of learners and access premium expert-led courses anywhere, anytime.
            </motion.p>
          </div>
          
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="relative z-10 flex-grow flex items-center justify-center mt-12"
          >
            <img src="/hero-img.png" alt="Signup" className="w-full max-w-md object-contain drop-shadow-[0_20px_50px_rgba(139,92,246,0.3)] filter hue-rotate-15" />
          </motion.div>
        </div>

        {/* Right Side: Form Panel */}
        <div className="p-8 sm:p-10 lg:p-12 flex flex-col justify-center relative max-h-[90vh] overflow-y-auto custom-scrollbar">
          <div className="max-w-md w-full mx-auto">
            
            <div className="text-center lg:text-left mb-8">
              <h2 className="text-2xl sm:text-3xl font-bold text-white mb-2">Create your account</h2>
              <p className="text-zinc-400 text-sm">Fill in the details to get started.</p>
            </div>

            {error && (
              <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm font-medium">
                {error}
              </div>
            )}

            <form onSubmit={handleRegister} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-semibold text-zinc-400 uppercase tracking-wider mb-2">First Name</label>
                  <div className="relative">
                    <User className="absolute left-4 top-3.5 text-zinc-500" size={16} />
                    <input type="text" name="firstName" required placeholder="Jane" value={formData.firstName} onChange={handleChange}
                      className="w-full bg-[#0B0B14] border border-white/10 rounded-xl pl-11 pr-4 py-3 text-white text-sm placeholder-zinc-600 focus:border-violet-500 focus:ring-1 focus:ring-violet-500 transition-all" />
                  </div>
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-zinc-400 uppercase tracking-wider mb-2">Username</label>
                  <div className="relative">
                    <UserCheck className="absolute left-4 top-3.5 text-zinc-500" size={16} />
                    <input type="text" name="username" required placeholder="janedoe" value={formData.username} onChange={handleChange}
                      className="w-full bg-[#0B0B14] border border-white/10 rounded-xl pl-11 pr-4 py-3 text-white text-sm placeholder-zinc-600 focus:border-violet-500 focus:ring-1 focus:ring-violet-500 transition-all" />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-zinc-400 uppercase tracking-wider mb-2">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-4 top-3.5 text-zinc-500" size={16} />
                  <input type="email" name="email" required placeholder="jane@example.com" value={formData.email} onChange={handleChange}
                    className="w-full bg-[#0B0B14] border border-white/10 rounded-xl pl-11 pr-4 py-3 text-white text-sm placeholder-zinc-600 focus:border-violet-500 focus:ring-1 focus:ring-violet-500 transition-all" />
                </div>
              </div>
              
              <div>
                <label className="block text-[11px] font-semibold text-zinc-400 uppercase tracking-wider mb-2">Password</label>
                <div className="relative">
                  <Lock className="absolute left-4 top-3.5 text-zinc-500" size={16} />
                  <input type="password" name="password" required placeholder="At least 8 characters" value={formData.password} onChange={handleChange}
                    className="w-full bg-[#0B0B14] border border-white/10 rounded-xl pl-11 pr-4 py-3 text-white text-sm placeholder-zinc-600 focus:border-violet-500 focus:ring-1 focus:ring-violet-500 transition-all" />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-zinc-400 uppercase tracking-wider mb-2">Confirm Password</label>
                <div className="relative">
                  <Lock className="absolute left-4 top-3.5 text-zinc-500" size={16} />
                  <input type="password" name="confirmPassword" required placeholder="Repeat password" value={formData.confirmPassword} onChange={handleChange}
                    className="w-full bg-[#0B0B14] border border-white/10 rounded-xl pl-11 pr-4 py-3 text-white text-sm placeholder-zinc-600 focus:border-violet-500 focus:ring-1 focus:ring-violet-500 transition-all" />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-zinc-400 uppercase tracking-wider mb-2 mt-2">I want to...</label>
                <div className="grid grid-cols-2 gap-3">
                  <button type="button" onClick={() => setFormData({...formData, role: 'user'})}
                    className={`py-2.5 px-3 rounded-xl border text-xs font-bold transition-all ${
                      formData.role === 'user' ? 'bg-violet-600 border-violet-600 text-white shadow-[0_0_15px_rgba(139,92,246,0.3)]' : 'border-white/10 text-zinc-400 hover:border-violet-500/50'
                    }`}>📚 Learn</button>
                  <button type="button" onClick={() => setFormData({...formData, role: 'creator'})}
                    className={`py-2.5 px-3 rounded-xl border text-xs font-bold transition-all ${
                      formData.role === 'creator' ? 'bg-indigo-600 border-indigo-600 text-white shadow-[0_0_15px_rgba(79,70,229,0.3)]' : 'border-white/10 text-zinc-400 hover:border-indigo-500/50'
                    }`}>🎓 Teach</button>
                </div>
              </div>

              <button 
                type="submit" 
                disabled={loading}
                className="w-full bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white font-bold py-4 rounded-xl shadow-[0_0_20px_rgba(139,92,246,0.3)] hover:shadow-[0_0_30px_rgba(139,92,246,0.5)] transition-all flex justify-center items-center mt-6 disabled:opacity-50"
              >
                {loading ? <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div> : 'Sign Up'}
              </button>
            </form>

            <div className="my-6 relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-white/10"></div>
              </div>
              <div className="relative flex justify-center text-[10px] uppercase tracking-wider">
                <span className="bg-[#14151F] px-4 text-zinc-500">Or continue with</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <a href="/api/social/login/google-oauth2/" className="flex items-center justify-center space-x-2 py-2.5 rounded-xl border border-white/10 hover:bg-white/5 text-zinc-300 transition-colors">
                <svg className="w-4 h-4" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
                </svg>
                <span className="text-xs font-medium">Google</span>
              </a>
              <a href="/api/social/login/github/" className="flex items-center justify-center space-x-2 py-2.5 rounded-xl border border-white/10 hover:bg-white/5 text-zinc-300 transition-colors">
                <Github size={16} />
                <span className="text-xs font-medium">GitHub</span>
              </a>
            </div>

            <p className="text-center text-sm text-zinc-500 mt-6">
              Already have an account? <Link to="/login" className="text-violet-500 hover:text-violet-400 font-medium transition-colors">Login</Link>
            </p>

          </div>
        </div>
      </div>
    </div>
  )
}
