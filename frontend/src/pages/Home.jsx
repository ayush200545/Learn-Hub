import React, { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Search, SlidersHorizontal, Sparkles } from 'lucide-react'
import { sessionApi } from '../api'
import SessionCard from '../components/shared/SessionCard'
import SkeletonCard from '../components/shared/SkeletonCard'

export default function Home() {
  const [sessions, setSessions] = useState([])
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  
  // Search & Filter state
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('')
  const [sortBy, setSortBy] = useState('-created_at')

  useEffect(() => {
    // Load categories
    const loadCategories = async () => {
      try {
        const res = await sessionApi.getCategories()
        setCategories(res.data.results || res.data)
      } catch (err) {
        console.error('Failed to load categories', err)
      }
    }
    loadCategories()
  }, [])

  useEffect(() => {
    const fetchSessions = async () => {
      setLoading(true)
      try {
        const params = {
          ordering: sortBy,
        }
        if (searchTerm) params.search = searchTerm
        if (selectedCategory) params.category = selectedCategory

        const res = await sessionApi.getSessions(params)
        setSessions(res.data.results || res.data)
      } catch (err) {
        console.error('Failed to load sessions', err)
      } finally {
        setLoading(false)
      }
    }

    // Debounce search slightly
    const delayDebounceFn = setTimeout(() => {
      fetchSessions()
    }, 300)

    return () => clearTimeout(delayDebounceFn)
  }, [searchTerm, selectedCategory, sortBy])

  return (
    <div className="min-h-screen flex flex-col bg-[#0B0B14] overflow-hidden font-sans text-white">
      
      {/* ── HERO BANNER ── */}
      <section className="relative pt-28 pb-20 md:pt-36 md:pb-24 overflow-hidden">
        {/* Background glow */}
        <div className="absolute top-[-10%] right-[10%] w-[500px] h-[500px] bg-violet-600/20 rounded-full blur-[120px] pointer-events-none"></div>
        <div className="absolute top-[20%] left-[-10%] w-[400px] h-[400px] bg-cyan-600/10 rounded-full blur-[120px] pointer-events-none"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left Text */}
          <div className="flex flex-col items-start text-left">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center px-4 py-1.5 rounded-full text-[10px] font-bold text-violet-300 border border-violet-500/30 bg-violet-500/10 mb-6 uppercase tracking-widest"
            >
              Empower Your Future
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-5xl sm:text-6xl md:text-7xl font-bold leading-[1.1] tracking-tight mb-6"
            >
              Learn Skills. <br />
              Build Future. <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-500 via-fuchsia-400 to-cyan-400">
                Be Limitless.
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-zinc-400 text-lg mb-8 max-w-lg"
            >
              Explore top-quality courses crafted by industry experts. Learn at your pace and achieve your goals.
            </motion.p>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="flex flex-wrap items-center gap-4 mb-10"
            >
               <button className="px-8 py-3.5 rounded-xl bg-violet-600 hover:bg-violet-500 text-white font-bold transition-all shadow-[0_0_20px_rgba(139,92,246,0.4)] flex items-center space-x-2">
                 <span>Explore Courses</span>
                 <span>→</span>
               </button>
               <button className="px-8 py-3.5 rounded-xl border border-white/20 hover:bg-white/5 text-white font-bold transition-all flex items-center space-x-2">
                 <span>Watch Demo</span>
                 <span>▶</span>
               </button>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="flex items-center space-x-4"
            >
              <div className="flex -space-x-3">
                {[1,2,3,4].map(i => (
                  <div key={i} className="w-10 h-10 rounded-full border-2 border-[#0B0B14] bg-zinc-800 overflow-hidden">
                    <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${i}`} className="w-full h-full object-cover" alt="avatar" />
                  </div>
                ))}
                <div className="w-10 h-10 rounded-full border-2 border-[#0B0B14] bg-yellow-500 flex items-center justify-center text-xs font-bold text-black z-10">
                  +2k
                </div>
              </div>
              <div className="text-sm pl-2">
                <p className="font-bold text-white">Join 20,000+ learners</p>
                <p className="text-zinc-400">already growing with LearnHub.</p>
              </div>
            </motion.div>
          </div>

          {/* Right Image */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="relative hidden lg:block"
          >
            <div className="absolute inset-0 bg-gradient-to-tr from-violet-600/30 to-cyan-600/30 rounded-full blur-[100px] z-0"></div>
            <img src="/hero-img.png" alt="Learn" className="relative z-10 w-full object-contain filter hue-rotate-15 drop-shadow-[0_0_50px_rgba(139,92,246,0.3)]" />
          </motion.div>
        </div>
      </section>

      {/* ── FEATURES BANNER ── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-20 -mt-6 mb-16">
        <div className="bg-[#14151F] border border-white/5 rounded-2xl p-6 shadow-2xl flex flex-wrap justify-between items-center gap-6">
          {[
            { icon: '💼', title: 'Expert Instructors', desc: 'Learn from industry professionals' },
            { icon: '🔄', title: 'Flexible Learning', desc: 'Learn anytime, anywhere' },
            { icon: '📜', title: 'Certificate', desc: 'Earn certificates on completion' },
            { icon: '♾️', title: 'Lifetime Access', desc: 'Access courses forever' }
          ].map((f, i) => (
            <div key={i} className="flex items-center space-x-4">
              <div className="w-12 h-12 rounded-xl bg-[#1E1E2C] flex items-center justify-center text-xl shadow-[0_0_15px_rgba(255,255,255,0.05)] border border-white/5">
                {f.icon}
              </div>
              <div>
                <h4 className="text-sm font-bold text-white">{f.title}</h4>
                <p className="text-xs text-zinc-400">{f.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── POPULAR COURSES ── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full">
        <div className="flex justify-between items-end mb-8">
          <div>
            <h2 className="text-3xl font-bold text-white flex items-center space-x-2">
              <span>Popular Courses</span>
              <span className="text-violet-500">✦</span>
            </h2>
          </div>
          <button className="text-sm font-semibold text-zinc-400 hover:text-white transition-colors flex items-center space-x-1">
            <span>View all courses</span>
            <span>›</span>
          </button>
        </div>

        {/* Filter Bar */}
        <div className="mb-8 flex flex-col md:flex-row gap-4 items-center">
          <div className="relative flex-grow w-full md:w-auto">
            <Search className="absolute left-4 top-3.5 text-zinc-500" size={18} />
            <input
              type="text"
              placeholder="Search courses..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-[#14151F] border border-white/5 rounded-xl pl-12 pr-4 py-3 text-sm text-white placeholder-zinc-500 focus:border-violet-500 focus:outline-none focus:ring-1 focus:ring-violet-500"
            />
          </div>
          <div className="relative w-full md:w-auto">
            <SlidersHorizontal className="absolute left-4 top-3.5 text-zinc-500" size={16} />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="w-full md:w-auto bg-[#14151F] border border-white/5 rounded-xl pl-11 pr-8 py-3 text-sm text-zinc-300 focus:border-violet-500 focus:outline-none appearance-none"
            >
              <option value="-created_at">Latest</option>
              <option value="price">Price: Low to High</option>
              <option value="-price">Price: High to Low</option>
            </select>
          </div>
        </div>
        
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((i) => <SkeletonCard key={i} />)}
          </div>
        ) : sessions.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {sessions.map((session) => (
              <SessionCard key={session.id} session={session} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-[#14151F] rounded-2xl border border-white/5">
            <div className="text-5xl mb-4">🔍</div>
            <h3 className="text-xl font-bold text-white mb-2">No courses found</h3>
            <p className="text-zinc-500 max-w-md mx-auto">Try adjusting your search criteria or explore our other categories.</p>
          </div>
        )}
      </section>

      {/* ── STATS BANNER ── */}
      <section className="w-full py-16 relative overflow-hidden mt-10">
        <div className="absolute inset-0 bg-[#14151F] border-y border-white/5 z-0"></div>
        {/* Wavy line effect */}
        <div className="absolute inset-0 opacity-20 pointer-events-none" style={{ backgroundImage: "url('data:image/svg+xml,%3Csvg viewBox=\"0 0 1440 320\" xmlns=\"http://www.w3.org/2000/svg\"%3E%3Cpath fill=\"none\" stroke=\"%238A2BE2\" stroke-width=\"4\" d=\"M0,160L48,176C96,192,192,224,288,213.3C384,203,480,149,576,149.3C672,149,768,203,864,229.3C960,256,1056,256,1152,240C1248,224,1344,192,1392,176L1440,160\"/%3E%3C/svg%3E')", backgroundSize: 'cover', backgroundPosition: 'center' }}></div>
        
        <div className="max-w-7xl mx-auto px-4 relative z-10 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          <div>
            <h3 className="text-4xl md:text-5xl font-bold text-white mb-2">20K+</h3>
            <p className="text-zinc-400 text-sm">Active Learners</p>
          </div>
          <div>
            <h3 className="text-4xl md:text-5xl font-bold text-white mb-2">150+</h3>
            <p className="text-zinc-400 text-sm">Expert Instructors</p>
          </div>
          <div>
            <h3 className="text-4xl md:text-5xl font-bold text-white mb-2">500+</h3>
            <p className="text-zinc-400 text-sm">Courses</p>
          </div>
          <div>
            <h3 className="text-4xl md:text-5xl font-bold text-white mb-2">95%</h3>
            <p className="text-zinc-400 text-sm">Satisfaction Rate</p>
          </div>
        </div>
      </section>

      {/* ── BROWSE BY CATEGORY ── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 w-full">
        <div className="flex justify-between items-end mb-10">
          <h2 className="text-3xl font-bold text-white flex items-center space-x-2">
            <span>Browse by Category</span>
            <span className="text-violet-500">✦</span>
          </h2>
          <button className="text-sm font-semibold text-zinc-400 hover:text-white transition-colors flex items-center space-x-1">
            <span>Explore all</span>
            <span>›</span>
          </button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {[
            { icon: '</>', name: 'Web Development', color: 'text-cyan-400' },
            { icon: '✒️', name: 'UI/UX Design', color: 'text-fuchsia-400' },
            { icon: '📊', name: 'Data Science', color: 'text-green-400' },
            { icon: '📱', name: 'Mobile Development', color: 'text-pink-400' },
            { icon: '🎯', name: 'Marketing Strategy', color: 'text-orange-400' }
          ].map((cat, i) => (
            <button key={i} onClick={() => setSelectedCategory(cat.name)} className="flex flex-col items-center justify-center p-8 bg-[#14151F] border border-white/5 rounded-2xl hover:border-violet-500/50 hover:bg-[#1A1A2E] transition-all group">
              <div className={`text-4xl mb-4 ${cat.color} group-hover:scale-110 transition-transform`}>{cat.icon}</div>
              <h3 className="text-sm font-bold text-zinc-300 text-center">{cat.name}</h3>
            </button>
          ))}
        </div>
      </section>
      
      {/* ── TESTIMONIALS ── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-24 w-full">
        <div className="flex justify-between items-end mb-10">
          <h2 className="text-3xl font-bold text-white flex items-center space-x-2">
            <span>What Our Learners Say</span>
            <span className="text-violet-500">✦</span>
          </h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { name: 'Sarah Johnson', role: 'Web Developer', text: '"LearnHub changed the way I learn online. The content is top-notch and instructors are amazing!"' },
            { name: 'David Williams', role: 'UI/UX Designer', text: '"The courses are well-structured and very beginner-friendly. Highly recommended!"' },
            { name: 'Emily Davis', role: 'Data Analyst', text: '"I got a promotion after completing the Data Science course. Worth every penny!"' }
          ].map((t, i) => (
            <div key={i} className="bg-[#14151F] border border-white/5 rounded-2xl p-8 relative">
              <div className="absolute top-6 right-6 text-4xl text-violet-500/20 font-serif">"</div>
              <p className="text-zinc-400 text-sm italic mb-6 relative z-10">{t.text}</p>
              <div className="flex items-center space-x-3 mt-auto">
                <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${t.name}`} className="w-10 h-10 rounded-full bg-zinc-800" alt={t.name} />
                <div>
                  <h4 className="text-sm font-bold text-white">{t.name}</h4>
                  <p className="text-xs text-violet-400">{t.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
