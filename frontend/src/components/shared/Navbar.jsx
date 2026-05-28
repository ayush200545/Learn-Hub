import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuthStore } from '../../store/authStore'
import { Search, ShoppingCart, User as UserIcon, LayoutDashboard, LogOut, Menu, X, BookOpen } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import toast from 'react-hot-toast'

export default function Navbar() {
  const { user, logout, isAuthenticated } = useAuthStore()
  const navigate = useNavigate()
  const [isOpen, setIsOpen] = useState(false)

  const handleLogout = async () => {
    await logout()
    toast.success('Logged out successfully')
    navigate('/')
    setIsOpen(false)
  }

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-[#0B0B14]/90 backdrop-blur-xl border-b border-white/5 transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Logo */}
          <div className="flex-shrink-0 flex items-center">
            <Link to="/" className="flex items-center space-x-3 group">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-600 to-indigo-600 flex items-center justify-center shadow-[0_0_15px_rgba(139,92,246,0.5)] group-hover:shadow-[0_0_25px_rgba(139,92,246,0.8)] transition-all">
                <BookOpen size={20} className="text-white" />
              </div>
              <span className="text-2xl font-bold text-white tracking-tight">
                LearnHub
              </span>
            </Link>
          </div>

          {/* Desktop Center Links */}
          <div className="hidden md:flex items-center space-x-8">
            <Link to="/" className="text-sm font-medium text-white hover:text-violet-400 transition-colors">Home</Link>
            <Link to="/courses" className="text-sm font-medium text-zinc-400 hover:text-white transition-colors">Courses</Link>
            <Link to="/categories" className="text-sm font-medium text-zinc-400 hover:text-white transition-colors">Categories</Link>
            <Link to="/about" className="text-sm font-medium text-zinc-400 hover:text-white transition-colors">About</Link>
            <Link to="/community" className="text-sm font-medium text-zinc-400 hover:text-white transition-colors">Community</Link>
          </div>

          {/* Desktop Right Actions */}
          <div className="hidden md:flex items-center space-x-6">
            <button className="text-zinc-400 hover:text-white transition-colors">
              <Search size={20} />
            </button>
            <button className="text-zinc-400 hover:text-white transition-colors relative">
              <ShoppingCart size={20} />
              <span className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-violet-600 rounded-full text-[9px] flex items-center justify-center text-white font-bold border-2 border-[#0B0B14]">2</span>
            </button>

            {isAuthenticated ? (
              <div className="flex items-center space-x-4 ml-2 border-l border-white/10 pl-6">
                <Link to={user?.role === 'creator' ? '/dashboard/creator' : '/dashboard/user'} className="text-zinc-400 hover:text-white transition-colors">
                  <LayoutDashboard size={20} />
                </Link>
                <div className="flex items-center space-x-3 bg-white/5 rounded-full py-1.5 px-2 pr-4 border border-white/10">
                  <img src={user?.display_avatar} alt="Profile" className="w-8 h-8 rounded-full border border-violet-500 object-cover" />
                  <span className="text-sm font-semibold text-white max-w-[100px] truncate">{user?.first_name || user?.username}</span>
                </div>
                <button onClick={handleLogout} className="text-red-400 hover:text-red-300 transition-colors">
                  <LogOut size={20} />
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <Link to="/login" className="px-6 py-2.5 bg-violet-600 hover:bg-violet-500 text-white text-sm font-semibold rounded-xl shadow-[0_0_15px_rgba(139,92,246,0.3)] hover:shadow-[0_0_25px_rgba(139,92,246,0.5)] transition-all">
                  Sign In
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button onClick={() => setIsOpen(!isOpen)} className="p-2 rounded-xl text-zinc-400 hover:text-white hover:bg-white/5">
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden border-t border-white/10 bg-[#14151F]"
          >
            <div className="px-4 py-6 space-y-4">
              <Link to="/" onClick={() => setIsOpen(false)} className="block text-white font-medium">Home</Link>
              <Link to="/courses" onClick={() => setIsOpen(false)} className="block text-zinc-400 hover:text-white">Courses</Link>
              <Link to="/categories" onClick={() => setIsOpen(false)} className="block text-zinc-400 hover:text-white">Categories</Link>
              
              <div className="pt-4 border-t border-white/10">
                {isAuthenticated ? (
                  <div className="space-y-4">
                    <div className="flex items-center space-x-3">
                      <img src={user?.display_avatar} alt="Profile" className="w-10 h-10 rounded-full border border-violet-500" />
                      <div>
                        <div className="text-white font-semibold">{user?.first_name || user?.username}</div>
                        <div className="text-xs text-zinc-500 capitalize">{user?.role}</div>
                      </div>
                    </div>
                    <Link to={user?.role === 'creator' ? '/dashboard/creator' : '/dashboard/user'} onClick={() => setIsOpen(false)} className="block text-zinc-400 hover:text-white">Dashboard</Link>
                    <button onClick={handleLogout} className="block text-red-400 hover:text-red-300 w-full text-left">Logout</button>
                  </div>
                ) : (
                  <Link to="/login" onClick={() => setIsOpen(false)} className="block w-full py-3 text-center bg-violet-600 text-white font-semibold rounded-xl">
                    Sign In
                  </Link>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  )
}
