import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { bookingApi } from '../api'
import { Calendar, Clock, DollarSign, Ban, ShieldCheck, CreditCard, PlayCircle } from 'lucide-react'
import toast from 'react-hot-toast'
import { motion } from 'framer-motion'

export default function UserDashboard() {
  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('upcoming') // 'upcoming' or 'past'

  const loadBookings = async () => {
    setLoading(true)
    try {
      const res = await bookingApi.getMyBookings()
      setBookings(res.data.results || res.data)
    } catch (err) {
      toast.error('Failed to load bookings.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search)
    if (urlParams.get('razorpay_payment_id') && urlParams.get('razorpay_payment_link_id')) {
      const confirmPayment = async () => {
        const loadingToast = toast.loading('Verifying secure payment via Razorpay...')
        try {
          await bookingApi.confirmRazorpayPayment({
            razorpay_payment_id: urlParams.get('razorpay_payment_id'),
            razorpay_payment_link_id: urlParams.get('razorpay_payment_link_id'),
            razorpay_payment_link_reference_id: urlParams.get('razorpay_payment_link_reference_id'),
            razorpay_payment_link_status: urlParams.get('razorpay_payment_link_status'),
            razorpay_signature: urlParams.get('razorpay_signature'),
          })
          toast.dismiss(loadingToast)
          toast.success('Payment verified! Your seat is booked.')
          // Clean URL
          window.history.replaceState({}, document.title, window.location.pathname)
          loadBookings()
        } catch (err) {
          toast.dismiss(loadingToast)
          toast.error('Payment verification failed or was cancelled.')
          // Clean URL
          window.history.replaceState({}, document.title, window.location.pathname)
          loadBookings()
        }
      }
      confirmPayment()
    } else {
      loadBookings()
    }
  }, [])

  const handleCancel = async (bookingId) => {
    if (!window.confirm('Are you sure you want to cancel this booking?')) return

    try {
      await bookingApi.updateBookingStatus(bookingId, 'cancelled')
      toast.success('Booking cancelled successfully!')
      loadBookings()
    } catch (err) {
      toast.error('Failed to cancel booking.')
    }
  }

  const handlePay = async (bookingId) => {
    try {
      toast.loading('Redirecting to Stripe checkout...')
      const res = await bookingApi.createCheckoutSession(bookingId)
      window.location.href = res.data.checkout_url
    } catch (err) {
      toast.error('Failed to start checkout session.')
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'confirmed': return 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/30 dark:text-emerald-400'
      case 'cancelled': return 'bg-red-100 text-red-800 dark:bg-red-950/30 dark:text-red-400'
      default: return 'bg-amber-100 text-amber-800 dark:bg-amber-950/30 dark:text-amber-400'
    }
  }

  const getPaymentStatusColor = (status) => {
    switch (status) {
      case 'paid': return 'bg-blue-150 text-blue-800 dark:bg-blue-950/30 dark:text-blue-400'
      case 'failed': return 'bg-rose-100 text-rose-800 dark:bg-rose-950/30 dark:text-rose-400'
      default: return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-950/30 dark:text-yellow-450'
    }
  }

  const filterBookings = () => {
    const now = new Date()
    return bookings.filter((b) => {
      const sessionDate = new Date(b.session.start_time)
      const isPast = sessionDate < now
      if (activeTab === 'upcoming') {
        return !isPast && b.status !== 'cancelled'
      } else {
        return isPast || b.status === 'cancelled'
      }
    })
  }

  const filtered = filterBookings()

  // Mock User Stats for demonstration
  const userStats = {
    level: 12,
    xp: 4500,
    nextLevelXp: 5000,
    coursesCompleted: 4,
    hoursLearned: 38,
    certificates: 2
  }

  return (
    <div className="min-h-screen bg-[#0B0B14] font-sans text-white flex">
      
      {/* ── SIDEBAR NAVIGATION ── */}
      <aside className="hidden md:flex flex-col w-64 bg-[#14151F] border-r border-white/5 h-screen sticky top-0 left-0 pt-20">
        <div className="p-6">
          <div className="flex items-center space-x-3 mb-10">
            <div className="w-10 h-10 rounded-full bg-violet-600 flex items-center justify-center font-bold text-white shadow-[0_0_15px_rgba(139,92,246,0.5)]">
              {user?.username?.charAt(0).toUpperCase() || 'U'}
            </div>
            <div>
              <p className="text-sm font-bold text-white">{user?.first_name || user?.username || 'User'}</p>
              <p className="text-xs text-violet-400">Level {userStats.level} Learner</p>
            </div>
          </div>

          <nav className="space-y-2">
            {[
              { name: 'Dashboard', icon: '📊', active: true },
              { name: 'My Courses', icon: '📚', active: false },
              { name: 'Messages', icon: '💬', active: false },
              { name: 'Certificates', icon: '🎓', active: false },
              { name: 'Settings', icon: '⚙️', active: false },
            ].map((item, i) => (
              <button
                key={i}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-sm font-bold transition-all ${
                  item.active
                    ? 'bg-violet-600/10 text-violet-400 border border-violet-500/20 shadow-inner'
                    : 'text-zinc-400 hover:bg-white/5 hover:text-white'
                }`}
              >
                <span>{item.icon}</span>
                <span>{item.name}</span>
              </button>
            ))}
          </nav>
        </div>
        <div className="mt-auto p-6 border-t border-white/5">
          <button className="w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-sm font-bold text-zinc-400 hover:bg-red-500/10 hover:text-red-400 transition-colors">
            <span>🚪</span>
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* ── MAIN CONTENT ── */}
      <main className="flex-1 p-6 lg:p-10 pb-20 pt-24 md:pt-10 overflow-y-auto">
        <header className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h1 className="text-3xl font-black text-white">Welcome back, {user?.first_name || user?.username}! 👋</h1>
            <p className="text-zinc-400 text-sm mt-1">Ready to continue your learning journey?</p>
          </div>
          <div className="flex space-x-3">
            <button
              onClick={() => setActiveTab('upcoming')}
              className={`px-5 py-2.5 rounded-xl text-sm font-bold transition-colors ${activeTab === 'upcoming' ? 'bg-white text-black' : 'bg-[#14151F] text-zinc-400 border border-white/5 hover:text-white'}`}
            >
              Active
            </button>
            <button
              onClick={() => setActiveTab('past')}
              className={`px-5 py-2.5 rounded-xl text-sm font-bold transition-colors ${activeTab === 'past' ? 'bg-white text-black' : 'bg-[#14151F] text-zinc-400 border border-white/5 hover:text-white'}`}
            >
              Completed
            </button>
          </div>
        </header>

        {/* ── PROFILE & STATS CARDS ── */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
          {/* XP Progress Card */}
          <div className="md:col-span-2 bg-[#14151F] border border-white/5 rounded-3xl p-6 shadow-xl relative overflow-hidden group">
            <div className="absolute top-[-50%] right-[-10%] w-64 h-64 bg-violet-600/10 rounded-full blur-[50px] pointer-events-none group-hover:bg-violet-600/20 transition-colors"></div>
            
            <div className="flex justify-between items-end mb-6 relative z-10">
              <div>
                <p className="text-xs font-bold text-zinc-400 uppercase tracking-widest mb-1">Current Level</p>
                <div className="flex items-center space-x-2">
                  <span className="text-4xl font-black text-white">{userStats.level}</span>
                  <span className="text-sm font-bold text-violet-400 bg-violet-600/20 px-2 py-1 rounded-md">Novice</span>
                </div>
              </div>
              <div className="text-right">
                <span className="text-2xl font-black text-white">{userStats.xp}</span>
                <span className="text-sm font-bold text-zinc-500"> / {userStats.nextLevelXp} XP</span>
              </div>
            </div>
            
            <div className="relative z-10">
              <div className="w-full h-3 bg-black rounded-full overflow-hidden border border-white/10 shadow-inner">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${(userStats.xp / userStats.nextLevelXp) * 100}%` }}
                  transition={{ duration: 1.5, ease: "easeOut" }}
                  className="h-full bg-gradient-to-r from-violet-600 to-fuchsia-500 rounded-full shadow-[0_0_10px_rgba(139,92,246,0.8)]"
                ></motion.div>
              </div>
              <p className="text-xs text-zinc-500 font-bold mt-3 text-right">500 XP to next level</p>
            </div>
          </div>

          <div className="bg-[#14151F] border border-white/5 rounded-3xl p-6 shadow-xl flex flex-col justify-center items-center text-center">
            <div className="w-12 h-12 bg-cyan-500/10 text-cyan-400 rounded-2xl flex items-center justify-center text-2xl mb-3 border border-cyan-500/20 shadow-[0_0_15px_rgba(34,211,238,0.2)]">📚</div>
            <h3 className="text-3xl font-black text-white">{userStats.coursesCompleted}</h3>
            <p className="text-xs font-bold text-zinc-400 uppercase tracking-widest">Completed</p>
          </div>

          <div className="bg-[#14151F] border border-white/5 rounded-3xl p-6 shadow-xl flex flex-col justify-center items-center text-center">
            <div className="w-12 h-12 bg-amber-500/10 text-amber-400 rounded-2xl flex items-center justify-center text-2xl mb-3 border border-amber-500/20 shadow-[0_0_15px_rgba(245,158,11,0.2)]">⏱️</div>
            <h3 className="text-3xl font-black text-white">{userStats.hoursLearned}h</h3>
            <p className="text-xs font-bold text-zinc-400 uppercase tracking-widest">Hours Learned</p>
          </div>
        </div>

        {/* ── COURSE LIST ── */}
        <h2 className="text-xl font-bold text-white mb-6 flex items-center space-x-2">
          <span>{activeTab === 'upcoming' ? 'In Progress' : 'Completed Courses'}</span>
          <span className="text-violet-500">✦</span>
        </h2>

        {loading ? (
          <div className="text-center py-20">
            <div className="w-10 h-10 border-4 border-violet-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-16 bg-[#14151F] border border-white/5 rounded-3xl p-6 shadow-xl">
            <div className="text-4xl mb-4">🚀</div>
            <h3 className="text-xl font-bold text-white">No active courses</h3>
            <p className="text-sm text-zinc-400 mt-2 max-w-sm mx-auto">
              You haven't enrolled in any courses yet. Explore our catalog and start learning today!
            </p>
            <Link to="/" className="inline-block mt-6 px-6 py-3 bg-violet-600 text-white font-bold rounded-xl text-sm shadow-[0_0_15px_rgba(139,92,246,0.3)] hover:bg-violet-500 transition-colors">
              Explore Courses
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {filtered.map((booking) => (
              <motion.div
                key={booking.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-[#14151F] border border-white/5 rounded-3xl p-6 shadow-xl flex flex-col md:flex-row gap-6 hover:border-violet-500/30 transition-colors group"
              >
                {/* Course Image */}
                <div className="w-full md:w-40 h-32 bg-black rounded-2xl overflow-hidden relative shrink-0">
                  {booking.session.image ? (
                    <img src={booking.session.image} alt={booking.session.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                  ) : (
                    <div className="absolute inset-0 bg-gradient-to-tr from-indigo-900 to-purple-900 flex items-center justify-center">
                      <span className="text-3xl opacity-50">{booking.session.category?.icon || '📚'}</span>
                    </div>
                  )}
                  <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors duration-300"></div>
                </div>

                {/* Course Details */}
                <div className="flex flex-col flex-grow">
                  <div className="flex justify-between items-start mb-2">
                    <span className="text-[10px] px-2.5 py-1 bg-violet-600/20 text-violet-300 border border-violet-500/20 rounded-md font-bold uppercase tracking-wider">
                      {booking.session.category?.name || 'Course'}
                    </span>
                    <span className={`text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-md ${
                      booking.status === 'confirmed' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/20' : 
                      booking.status === 'cancelled' ? 'bg-red-500/20 text-red-400 border border-red-500/20' : 
                      'bg-amber-500/20 text-amber-400 border border-amber-500/20'
                    }`}>
                      {booking.status}
                    </span>
                  </div>

                  <h3 className="text-lg font-bold text-white mb-2 leading-tight line-clamp-2">
                    {booking.session.title}
                  </h3>

                  {/* Mock Progress */}
                  {activeTab === 'upcoming' && booking.status === 'confirmed' && (
                    <div className="mt-auto pt-4">
                      <div className="flex justify-between items-end mb-2">
                        <span className="text-xs text-zinc-400 font-bold">Progress</span>
                        <span className="text-xs text-white font-bold">45%</span>
                      </div>
                      <div className="w-full h-2 bg-black rounded-full overflow-hidden border border-white/5">
                        <div className="h-full bg-violet-500 rounded-full" style={{ width: '45%' }}></div>
                      </div>
                    </div>
                  )}

                  {/* Actions */}
                  <div className="mt-4 pt-4 border-t border-white/5 flex items-center gap-3">
                    {activeTab === 'upcoming' && booking.status === 'confirmed' && (
                      <Link
                        to={`/courses/${booking.id}`}
                        className="flex-1 py-2.5 bg-white text-black font-bold rounded-xl hover:bg-zinc-200 transition-colors text-xs flex items-center justify-center space-x-1.5 text-center shadow-lg"
                      >
                        <PlayCircle size={14} />
                        <span>Continue</span>
                      </Link>
                    )}
                    {booking.payment_status === 'pending' && !booking.session.is_free && (
                      <button
                        onClick={() => handlePay(booking.id)}
                        className="flex-1 py-2.5 bg-amber-500 text-black font-bold rounded-xl hover:bg-amber-400 transition-colors text-xs flex items-center justify-center space-x-1.5 shadow-lg shadow-amber-500/20"
                      >
                        <CreditCard size={14} />
                        <span>Pay Now</span>
                      </button>
                    )}
                    {activeTab === 'upcoming' && booking.status !== 'cancelled' && (
                      <button
                        onClick={() => handleCancel(booking.id)}
                        className="p-2.5 border border-white/10 text-zinc-400 hover:bg-red-500/10 hover:text-red-400 hover:border-red-500/20 text-xs font-bold rounded-xl transition-colors shrink-0"
                        title="Cancel Booking"
                      >
                        <Ban size={16} />
                      </button>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}
