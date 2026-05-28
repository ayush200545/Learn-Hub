import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuthStore } from '../store/authStore'
import { motion } from 'framer-motion'
import toast from 'react-hot-toast'
import { ArrowLeft, Github, Mail, Lock } from 'lucide-react'

export default function Login() {
  const { login } = useAuthStore()
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleLogin = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    const res = await login(email, password)
    setLoading(false)
    if (res.success) {
      toast.success('Welcome back!')
      navigate('/')
    } else {
      setError(res.error)
      toast.error(res.error)
    }
  }

  return (
    <div className="min-h-screen bg-[#0B0B14] flex items-center justify-center p-4 sm:p-6 lg:p-8 font-sans">
      <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-2 bg-[#14151F] rounded-3xl overflow-hidden border border-white/5 shadow-[0_0_80px_rgba(139,92,246,0.1)]">
        
        {/* Left Side: Illustration Panel */}
        <div className="hidden lg:flex flex-col justify-between p-12 bg-gradient-to-br from-[#1A1A2E] to-[#0B0B14] relative overflow-hidden">
          {/* Ambient Glows */}
          <div className="absolute top-[-10%] left-[-10%] w-[400px] h-[400px] bg-violet-600/20 rounded-full blur-[100px] pointer-events-none"></div>
          <div className="absolute bottom-[-10%] right-[-10%] w-[300px] h-[300px] bg-cyan-600/20 rounded-full blur-[100px] pointer-events-none"></div>
          
          <div className="relative z-10">
            <Link to="/" className="inline-flex items-center space-x-2 text-zinc-400 hover:text-white transition-colors mb-12">
              <ArrowLeft size={16} />
              <span className="text-sm font-semibold">Back to Home</span>
            </Link>
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-4xl font-bold text-white mb-4"
            >
              Welcome Back 👋
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-zinc-400 text-lg max-w-md"
            >
              Great to see you again! Access your account and continue your learning journey.
            </motion.p>
          </div>
          
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="relative z-10 flex-grow flex items-center justify-center mt-8"
          >
            <img src="/hero-img.png" alt="Welcome" className="w-full max-w-md object-contain drop-shadow-[0_20px_50px_rgba(139,92,246,0.3)]" />
          </motion.div>
        </div>

        {/* Right Side: Form Panel */}
        <div className="p-8 sm:p-12 lg:p-16 flex flex-col justify-center relative">
          <div className="max-w-md w-full mx-auto">
            
            <div className="text-center lg:text-left mb-10">
              <h2 className="text-2xl sm:text-3xl font-bold text-white mb-2">Login to your account</h2>
              <p className="text-zinc-400 text-sm">Welcome back! Please enter your details.</p>
            </div>

            {error && (
              <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm font-medium">
                {error}
              </div>
            )}

            <form onSubmit={handleLogin} className="space-y-5">
              <div>
                <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-2">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-4 top-3.5 text-zinc-500" size={18} />
                  <input 
                    type="email" 
                    required 
                    placeholder="Enter your email" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-[#0B0B14] border border-white/10 rounded-xl px-12 py-3.5 text-white placeholder-zinc-600 focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500 transition-all"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-2">Password</label>
                <div className="relative">
                  <Lock className="absolute left-4 top-3.5 text-zinc-500" size={18} />
                  <input 
                    type="password" 
                    required 
                    placeholder="Enter your password" 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-[#0B0B14] border border-white/10 rounded-xl px-12 py-3.5 text-white placeholder-zinc-600 focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500 transition-all"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between text-sm">
                <label className="flex items-center space-x-2 cursor-pointer group">
                  <input type="checkbox" className="w-4 h-4 rounded border-white/10 bg-[#0B0B14] checked:bg-violet-600 text-violet-600 focus:ring-violet-500" />
                  <span className="text-zinc-400 group-hover:text-zinc-300 transition-colors">Remember me</span>
                </label>
                <a href="#" className="text-violet-500 hover:text-violet-400 font-medium transition-colors">Forgot password?</a>
              </div>

              <button 
                type="submit" 
                disabled={loading}
                className="w-full bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white font-bold py-4 rounded-xl shadow-[0_0_20px_rgba(139,92,246,0.3)] hover:shadow-[0_0_30px_rgba(139,92,246,0.5)] transition-all flex justify-center items-center mt-6 disabled:opacity-50"
              >
                {loading ? <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div> : 'Login'}
              </button>
            </form>

            <div className="my-8 relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-white/10"></div>
              </div>
              <div className="relative flex justify-center text-xs uppercase tracking-wider">
                <span className="bg-[#14151F] px-4 text-zinc-500">Or continue with</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <a href="/api/social/login/google-oauth2/" className="flex items-center justify-center space-x-2 py-3 rounded-xl border border-white/10 hover:bg-white/5 text-zinc-300 transition-colors">
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
                </svg>
                <span className="text-sm font-medium">Google</span>
              </a>
              <a href="/api/social/login/github/" className="flex items-center justify-center space-x-2 py-3 rounded-xl border border-white/10 hover:bg-white/5 text-zinc-300 transition-colors">
                <Github size={20} />
                <span className="text-sm font-medium">GitHub</span>
              </a>
            </div>

            <p className="text-center text-sm text-zinc-500 mt-8">
              Don't have an account? <Link to="/signup" className="text-violet-500 hover:text-violet-400 font-medium transition-colors">Sign up</Link>
            </p>

          </div>
        </div>
      </div>
    </div>
  )
}
