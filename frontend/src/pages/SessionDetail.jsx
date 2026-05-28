import React, { useEffect, useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useAuthStore } from '../store/authStore'
import toast from 'react-hot-toast'
import { 
  Calendar, Clock, DollarSign, Users, Award, ShieldAlert, ArrowLeft, Send,
  CheckCircle2, ChevronDown, ChevronUp, BookOpen, Sparkles, Unlock, ListChecks 
} from 'lucide-react'
import { sessionApi, bookingApi } from '../api'

export default function SessionDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { user, setIsLoginOpen } = useAuthStore()
  const [session, setSession] = useState(null)
  const [loading, setLoading] = useState(true)
  const [bookingLoading, setBookingLoading] = useState(false)
  const [notes, setNotes] = useState('')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [hasBooked, setHasBooked] = useState(false)
  
  // Accordion curriculum control
  const [expandedModules, setExpandedModules] = useState([0])
  
  const [pendingBooking, setPendingBooking] = useState(null)

  const toggleModule = (index) => {
    if (expandedModules.includes(index)) {
      setExpandedModules(expandedModules.filter((i) => i !== index))
    } else {
      setExpandedModules([...expandedModules, index])
    }
  }

  useEffect(() => {
    const loadSession = async () => {
      setLoading(true)
      try {
        const res = await sessionApi.getSession(id)
        setSession(res.data)

        // Check if user has already booked this session (only if authenticated)
        const hasToken = !!localStorage.getItem('access_token')
        if (hasToken) {
          try {
            const bookingsRes = await bookingApi.getMyBookings()
            const myBookings = bookingsRes.data.results || bookingsRes.data
            const booked = myBookings.some((b) => b.session?.id === parseInt(id))
            setHasBooked(booked)
          } catch (bookingErr) {
            console.error('Failed to load user bookings status (likely expired token)', bookingErr)
          }
        }
      } catch (err) {
        toast.error('Failed to load session details.')
        navigate('/')
      } finally {
        setLoading(false)
      }
    }
    loadSession()
  }, [id, user])

  const handleBooking = async (e) => {
    e.preventDefault()
    setBookingLoading(true)
    try {
      // 1. Create booking
      const res = await bookingApi.createBooking({
        session_id: session.id,
        notes,
      })

      const newBooking = res.data

      if (session.is_free) {
        toast.success('Successfully registered for session!')
        navigate('/dashboard/user')
      } else {
        // Fetch real Razorpay Payment Link from backend
        toast.loading('Redirecting to secure payment portal...')
        const orderRes = await bookingApi.createRazorpayOrder(newBooking.id)
        
        // Redirect to the Razorpay hosted payment page
        if (orderRes.data && orderRes.data.short_url) {
          window.location.href = orderRes.data.short_url
        } else {
          toast.dismiss()
          toast.error('Failed to generate payment link.')
        }
      }
    } catch (err) {
      const errMsg = err.response?.data ? Object.values(err.response.data).flat().join(', ') : 'Booking failed'
      toast.error(errMsg)
    } finally {
      setBookingLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-zinc-50 dark:bg-zinc-950">
        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    )
  }

  const isCreator = user?.id === session.creator?.id
  const formatPrice = (price) => {
    const val = parseFloat(price)
    return val === 0 ? 'Free' : `₹${val.toLocaleString()}`
  }

  return (
    <div className="min-h-screen bg-[#0B0B14] font-sans text-white pb-20">
      
      {/* ── BACK NAVIGATION ── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <Link to="/" className="inline-flex items-center space-x-2 text-sm font-bold text-zinc-400 hover:text-white transition-colors">
          <ArrowLeft size={16} />
          <span>Back to courses</span>
        </Link>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Title Section */}
        <div className="mb-8">
          <div className="flex items-center space-x-3 mb-4">
            <span className="px-3 py-1 bg-violet-600/20 text-violet-400 border border-violet-500/30 text-[10px] font-bold uppercase tracking-wider rounded-md">
              {session.category?.name || 'Featured'}
            </span>
            <span className="flex items-center text-yellow-500 text-sm font-bold space-x-1">
              <span>⭐ 4.8</span>
              <span className="text-zinc-500 font-normal">(2,451 reviews)</span>
            </span>
          </div>
          <h1 className="text-3xl md:text-5xl font-black tracking-tight leading-tight max-w-4xl">
            {session.title}
          </h1>
          <p className="mt-4 text-zinc-400 max-w-3xl text-lg font-medium">
            {session.description?.substring(0, 150)}...
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* ── LEFT COLUMN: Media & Content ── */}
          <div className="lg:col-span-2 space-y-8">
            
            {/* Video Player Placeholder */}
            <div className="w-full aspect-video bg-[#14151F] border border-white/10 rounded-2xl overflow-hidden relative group cursor-pointer shadow-2xl">
              {session.image ? (
                <img src={session.image} alt={session.title} className="w-full h-full object-cover opacity-60 group-hover:opacity-40 transition-opacity duration-500" />
              ) : (
                <div className="absolute inset-0 bg-gradient-to-tr from-indigo-900 via-purple-900 to-black opacity-80"></div>
              )}
              
              {/* Play Button */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-20 h-20 bg-violet-600/80 backdrop-blur-md rounded-full flex items-center justify-center border border-white/20 group-hover:scale-110 transition-transform shadow-[0_0_30px_rgba(139,92,246,0.5)]">
                  <div className="w-0 h-0 border-t-[12px] border-t-transparent border-l-[20px] border-l-white border-b-[12px] border-b-transparent ml-2"></div>
                </div>
              </div>
              
              {/* Progress / Controls bar (mock) */}
              <div className="absolute bottom-0 left-0 right-0 h-12 bg-black/60 backdrop-blur-md border-t border-white/10 flex items-center px-4 space-x-4">
                <div className="w-0 h-0 border-t-[6px] border-t-transparent border-l-[10px] border-l-white border-b-[6px] border-b-transparent"></div>
                <div className="flex-grow h-1 bg-white/20 rounded-full overflow-hidden">
                  <div className="w-1/3 h-full bg-violet-500"></div>
                </div>
                <span className="text-xs font-bold text-white">01:24 / 45:00</span>
              </div>
            </div>

            {/* Content Tabs */}
            <div className="bg-[#14151F] border border-white/5 rounded-2xl overflow-hidden">
              <div className="flex border-b border-white/5 overflow-x-auto">
                <button className="px-8 py-5 border-b-2 border-violet-500 text-white font-bold text-sm whitespace-nowrap bg-white/5">Overview</button>
                <button className="px-8 py-5 border-b-2 border-transparent text-zinc-400 hover:text-white font-bold text-sm whitespace-nowrap transition-colors">Curriculum</button>
                <button className="px-8 py-5 border-b-2 border-transparent text-zinc-400 hover:text-white font-bold text-sm whitespace-nowrap transition-colors">Instructor</button>
                <button className="px-8 py-5 border-b-2 border-transparent text-zinc-400 hover:text-white font-bold text-sm whitespace-nowrap transition-colors">Reviews</button>
              </div>
              
              <div className="p-8">
                <h3 className="text-xl font-bold mb-4">About This Course</h3>
                <p className="text-zinc-400 leading-relaxed whitespace-pre-line text-sm font-medium mb-8">
                  {session.description}
                </p>

                {Array.isArray(session.benefits) && session.benefits.length > 0 && (
                  <div className="mb-8">
                    <h3 className="text-xl font-bold mb-4 flex items-center space-x-2">
                      <Sparkles className="text-violet-500" size={20} />
                      <span>What you'll learn</span>
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {session.benefits.map((benefit, i) => (
                        <div key={i} className="flex items-start space-x-3 text-zinc-300 text-sm bg-white/5 p-4 rounded-xl border border-white/5">
                          <CheckCircle2 className="text-violet-500 shrink-0 mt-0.5" size={16} />
                          <span>{benefit}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* ── RIGHT COLUMN: Booking Widget ── */}
          <div className="lg:col-span-1">
            <div className="bg-[#14151F] border border-white/5 rounded-3xl p-6 shadow-2xl sticky top-24">
              <div className="flex flex-col mb-6">
                <span className="text-4xl font-black text-white">
                  {formatPrice(session.price)}
                </span>
                {parseFloat(session.price) > 0 && (
                  <span className="text-sm font-bold text-zinc-500 line-through mt-1">₹{(parseFloat(session.price) * 1.5).toFixed(0)}</span>
                )}
              </div>

              {/* Action Buttons */}
              <div className="space-y-4 mb-8">
                {!user ? (
                  <button
                    onClick={() => setIsLoginOpen(true)}
                    className="w-full py-4 bg-violet-600 hover:bg-violet-500 text-white font-bold rounded-xl transition-colors text-sm shadow-[0_0_20px_rgba(139,92,246,0.3)] flex items-center justify-center space-x-2"
                  >
                    <Unlock size={16} />
                    <span>Login to Enroll</span>
                  </button>
                ) : isCreator ? (
                  <button disabled className="w-full py-4 bg-zinc-800 text-zinc-500 font-bold rounded-xl cursor-not-allowed text-sm">
                    You Created This Course
                  </button>
                ) : hasBooked ? (
                  <Link to="/dashboard/user" className="w-full py-4 block bg-emerald-600/20 text-emerald-500 border border-emerald-500/30 font-bold rounded-xl text-center text-sm hover:bg-emerald-600/30 transition-colors">
                    Go to Dashboard
                  </Link>
                ) : session.spots_remaining === 0 ? (
                  <button disabled className="w-full py-4 bg-zinc-800 text-zinc-500 font-bold rounded-xl cursor-not-allowed text-sm">
                    Sold Out
                  </button>
                ) : (
                  <button
                    onClick={() => setIsModalOpen(true)}
                    className="w-full py-4 bg-violet-600 hover:bg-violet-500 text-white font-bold rounded-xl transition-all shadow-[0_0_20px_rgba(139,92,246,0.3)] text-sm"
                  >
                    Enroll Now
                  </button>
                )}
                
                <p className="text-xs text-center font-bold text-zinc-500 uppercase tracking-widest">
                  30-Day Money-Back Guarantee
                </p>
              </div>

              {/* Course Meta */}
              <div className="space-y-4 pt-6 border-t border-white/5">
                <h4 className="font-bold text-white text-sm mb-4">This course includes:</h4>
                <div className="flex items-center space-x-3 text-zinc-400 text-sm">
                  <Clock size={16} className="text-violet-400" />
                  <span>{session.duration_minutes} minutes on-demand video</span>
                </div>
                <div className="flex items-center space-x-3 text-zinc-400 text-sm">
                  <Calendar size={16} className="text-violet-400" />
                  <span>Live sessions starting soon</span>
                </div>
                <div className="flex items-center space-x-3 text-zinc-400 text-sm">
                  <Users size={16} className="text-violet-400" />
                  <span>{session.spots_remaining} spots remaining</span>
                </div>
                <div className="flex items-center space-x-3 text-zinc-400 text-sm">
                  <Award size={16} className="text-violet-400" />
                  <span>Certificate of completion</span>
                </div>
              </div>
              
              {/* Instructor Mini Profile */}
              <div className="mt-8 pt-6 border-t border-white/5">
                <div className="flex items-center space-x-4">
                  <img
                    src={session.creator?.display_avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${session.creator?.username}`}
                    alt="Instructor"
                    className="w-12 h-12 rounded-full bg-zinc-800 border-2 border-white/10"
                  />
                  <div>
                    <p className="text-xs text-zinc-500 font-bold uppercase tracking-wider mb-1">Instructor</p>
                    <p className="text-sm font-bold text-white">{session.creator?.first_name || session.creator?.username}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Booking Confirmation Modal ── */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="bg-[#14151F] border border-white/10 rounded-3xl p-6 sm:p-8 w-full max-w-md shadow-2xl relative">
            <h3 className="text-2xl font-black text-white">Confirm Enrollment</h3>
            <p className="text-sm text-zinc-400 mt-2 font-medium">
              You are enrolling in <span className="text-white font-bold">{session.title}</span>
            </p>

            <form onSubmit={handleBooking} className="mt-6 space-y-5">
              <div>
                <label className="block text-xs font-bold text-zinc-500 uppercase tracking-wider mb-2">
                  Special Notes (Optional)
                </label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="What are your goals?"
                  rows={3}
                  className="w-full px-4 py-3 rounded-xl border border-white/10 bg-black/50 text-sm focus:outline-none focus:ring-1 focus:ring-violet-500 text-white"
                ></textarea>
              </div>

              {!session.is_free && (
                <div className="flex items-start space-x-3 p-4 bg-violet-600/10 text-violet-300 rounded-xl border border-violet-500/20 text-xs font-medium">
                  <ShieldAlert size={18} className="shrink-0 mt-0.5 text-violet-400" />
                  <span>
                    Secure checkout via Razorpay. Total amount: <strong className="text-white">{formatPrice(session.price)}</strong>
                  </span>
                </div>
              )}

              <div className="flex items-center justify-end space-x-3 pt-6 mt-6 border-t border-white/5">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-5 py-3 rounded-xl text-sm font-bold text-zinc-400 hover:text-white hover:bg-white/5 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={bookingLoading}
                  className="px-6 py-3 bg-violet-600 text-white font-bold rounded-xl text-sm hover:bg-violet-500 transition-colors shadow-lg disabled:opacity-50 flex items-center space-x-2"
                >
                  <Send size={14} />
                  <span>{bookingLoading ? 'Processing...' : 'Complete Purchase'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  )
}
