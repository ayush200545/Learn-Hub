import React from 'react'
import { Link } from 'react-router-dom'
import { Calendar, Clock, User, Tag, Lock } from 'lucide-react'
import { motion } from 'framer-motion'
import { useAuthStore } from '../../store/authStore'

export default function SessionCard({ session }) {
  const { isAuthenticated } = useAuthStore()
  
  // Format price helper
  const formatPrice = (price) => {
    const val = parseFloat(price)
    return val === 0 ? 'Free' : `₹${val.toLocaleString()}`
  }

  // Format date helper
  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  return (
    <motion.div
      whileHover={{ y: -5 }}
      className="group relative h-full flex flex-col bg-[#14151F] border border-white/5 rounded-2xl overflow-hidden hover:border-violet-500/50 transition-all duration-300 shadow-lg hover:shadow-[0_10px_30px_rgba(139,92,246,0.15)]"
    >
      {/* Image Section */}
      <div className="h-48 w-full overflow-hidden bg-black relative">
        <div className="absolute top-3 left-3 z-20">
          <span className="px-3 py-1 bg-violet-600 text-white text-[10px] font-bold uppercase tracking-wider rounded-md shadow-md">
            {session.category?.name || 'Featured'}
          </span>
        </div>
        
        {session.image ? (
          <img
            src={session.image}
            alt={session.title}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 opacity-90"
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-900 to-purple-900 flex items-center justify-center group-hover:scale-110 transition-transform duration-700">
            <span className="text-6xl opacity-50">{session.category?.icon || '📚'}</span>
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-[#14151F] via-transparent to-transparent opacity-80"></div>
      </div>

      {/* Content Section */}
      <div className="p-5 flex flex-col flex-grow">
        <h3 className="text-lg font-bold text-white line-clamp-2 mb-3 leading-snug group-hover:text-violet-400 transition-colors">
          {session.title}
        </h3>
        
        <div className="flex items-center justify-between mb-4 mt-auto">
          <div className="flex items-center space-x-2">
            <img
              src={session.creator?.display_avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${session.creator?.username}`}
              alt={session.creator?.username}
              className="w-7 h-7 rounded-full bg-zinc-800 object-cover"
            />
            <span className="text-xs font-medium text-zinc-400">
              {session.creator?.first_name || session.creator?.username || 'Instructor'}
            </span>
          </div>
          
          <div className="flex items-center space-x-1 bg-yellow-500/10 px-2 py-1 rounded-md">
            <span className="text-yellow-500 text-xs">⭐</span>
            <span className="text-xs font-bold text-white">4.8</span>
            <span className="text-[10px] text-zinc-500">(2.4k)</span>
          </div>
        </div>

        <div className="flex items-center justify-between pt-4 border-t border-white/5">
          <div className="flex items-center space-x-2">
            <span className="text-xl font-bold text-white">{formatPrice(session.price)}</span>
            {parseFloat(session.price) > 0 && (
              <span className="text-xs text-zinc-500 line-through">₹{(parseFloat(session.price) * 1.5).toFixed(0)}</span>
            )}
          </div>
          
          <Link
            to={`/sessions/${session.id}`}
            className="text-xs font-bold text-violet-500 hover:text-violet-400 flex items-center space-x-1 transition-colors"
          >
            <span>Details</span>
            <span>›</span>
          </Link>
        </div>
      </div>
    </motion.div>
  )
}
