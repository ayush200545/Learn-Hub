import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { CreditCard, QrCode, Building, Wallet, Lock, ShieldCheck, ArrowLeft, CheckCircle2, RefreshCw } from 'lucide-react'
import toast from 'react-hot-toast'

export default function RazorpaySimulator({ isOpen, onClose, amount, sessionTitle, onPaymentSuccess, email }) {
  const [activeTab, setActiveTab] = useState('upi') // upi, card, netbanking, wallet
  const [paymentState, setPaymentState] = useState('idle') // idle, processing, success
  
  // Card states
  const [cardNumber, setCardNumber] = useState('')
  const [cardExpiry, setCardExpiry] = useState('')
  const [cardCvv, setCardCvv] = useState('')
  const [cardName, setCardName] = useState('')

  // UPI states
  const [upiId, setUpiId] = useState('')
  const [showQr, setShowQr] = useState(false)

  // Netbanking states
  const [selectedBank, setSelectedBank] = useState('')

  // Formatter for Card Number
  const handleCardNumberChange = (e) => {
    let value = e.target.value.replace(/\D/g, '')
    if (value.length > 16) value = value.slice(0, 16)
    const formatted = value.match(/.{1,4}/g)?.join(' ') || value
    setCardNumber(formatted)
  }

  // Formatter for Expiry MM/YY
  const handleExpiryChange = (e) => {
    let value = e.target.value.replace(/\D/g, '')
    if (value.length > 4) value = value.slice(0, 4)
    if (value.length > 2) {
      setCardExpiry(`${value.slice(0, 2)}/${value.slice(2)}`)
    } else {
      setCardExpiry(value)
    }
  }

  const handlePay = () => {
    // Basic validation
    if (activeTab === 'card') {
      if (cardNumber.length < 19) {
        toast.error('Please enter a valid 16-digit card number')
        return
      }
      if (cardExpiry.length < 5) {
        toast.error('Please enter card expiry date (MM/YY)')
        return
      }
      if (cardCvv.length < 3) {
        toast.error('Please enter CVV')
        return
      }
      if (!cardName.trim()) {
        toast.error('Please enter cardholder name')
        return
      }
    } else if (activeTab === 'upi' && !showQr) {
      if (!upiId.includes('@')) {
        toast.error('Please enter a valid UPI ID (e.g., name@upi)')
        return
      }
    } else if (activeTab === 'netbanking' && !selectedBank) {
      toast.error('Please select your bank')
      return
    }

    // Trigger processing
    setPaymentState('processing')
  }

  useEffect(() => {
    if (paymentState === 'processing') {
      const timer = setTimeout(() => {
        setPaymentState('success')
      }, 2200)
      return () => clearTimeout(timer)
    } else if (paymentState === 'success') {
      const simulatedPaymentId = `pay_mock_${Math.random().toString(36).substring(2, 12).toUpperCase()}`
      const simulatedSignature = `sig_mock_${Math.random().toString(36).substring(2, 16).toLowerCase()}`
      const timer = setTimeout(() => {
        onPaymentSuccess({
          razorpay_payment_id: simulatedPaymentId,
          razorpay_signature: simulatedSignature
        })
      }, 1800)
      return () => clearTimeout(timer)
    }
  }, [paymentState])

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-zinc-950/70 backdrop-blur-md">
      {/* Background click blocks closing in processing/success states */}
      <div 
        onClick={() => {
          if (paymentState === 'idle') onClose()
        }} 
        className="absolute inset-0 z-0" 
      />

      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 30 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 30 }}
        className="bg-[#1a1f2c] text-zinc-100 rounded-2xl w-full max-w-[420px] shadow-2xl overflow-hidden font-sans border border-zinc-800 z-10 relative"
      >
        <AnimatePresence mode="wait">
          {paymentState === 'idle' && (
            <motion.div
              key="idle-screen"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              {/* Razorpay Classic Header */}
              <div className="bg-[#121620] px-6 py-5 border-b border-zinc-800/80 flex items-center justify-between">
                <div>
                  <div className="flex items-center space-x-2">
                    <div className="h-5 w-5 bg-[#3399cc] rounded-md flex items-center justify-center font-black text-white text-[10px]">
                      R
                    </div>
                    <span className="text-xs uppercase tracking-widest text-[#3399cc] font-black">
                      Razorpay Checkout
                    </span>
                  </div>
                  <h4 className="text-sm font-bold text-zinc-300 mt-1 line-clamp-1">
                    {sessionTitle}
                  </h4>
                  <p className="text-[10px] text-zinc-500 mt-0.5">
                    {email || 'attendee@demo.com'}
                  </p>
                </div>
                <div className="text-right">
                  <span className="text-[10px] text-zinc-500 uppercase block tracking-wider">Amount</span>
                  <span className="text-2xl font-black text-[#3399cc] font-sans leading-none">
                    ₹{amount}
                  </span>
                </div>
              </div>

              {/* Main Content Pane */}
              <div className="flex min-h-[250px]">
                {/* Left Tabs bar */}
                <div className="w-[110px] bg-[#121620]/50 border-r border-zinc-800/60 py-3 flex flex-col space-y-1">
                  <button
                    onClick={() => { setActiveTab('upi'); setShowQr(false); }}
                    className={`py-3 px-3 flex flex-col items-center justify-center space-y-1 text-center transition-colors ${
                      activeTab === 'upi' ? 'bg-[#1e293b] text-[#3399cc]' : 'text-zinc-400 hover:text-zinc-200'
                    }`}
                  >
                    <QrCode size={18} />
                    <span className="text-[9px] font-bold">UPI / QR</span>
                  </button>

                  <button
                    onClick={() => setActiveTab('card')}
                    className={`py-3 px-3 flex flex-col items-center justify-center space-y-1 text-center transition-colors ${
                      activeTab === 'card' ? 'bg-[#1e293b] text-[#3399cc]' : 'text-zinc-400 hover:text-zinc-200'
                    }`}
                  >
                    <CreditCard size={18} />
                    <span className="text-[9px] font-bold">Card</span>
                  </button>

                  <button
                    onClick={() => setActiveTab('netbanking')}
                    className={`py-3 px-3 flex flex-col items-center justify-center space-y-1 text-center transition-colors ${
                      activeTab === 'netbanking' ? 'bg-[#1e293b] text-[#3399cc]' : 'text-zinc-400 hover:text-zinc-200'
                    }`}
                  >
                    <Building size={18} />
                    <span className="text-[9px] font-bold">Netbanking</span>
                  </button>

                  <button
                    onClick={() => setActiveTab('wallet')}
                    className={`py-3 px-3 flex flex-col items-center justify-center space-y-1 text-center transition-colors ${
                      activeTab === 'wallet' ? 'bg-[#1e293b] text-[#3399cc]' : 'text-zinc-400 hover:text-zinc-200'
                    }`}
                  >
                    <Wallet size={18} />
                    <span className="text-[9px] font-bold">Wallets</span>
                  </button>
                </div>

                {/* Right Content Panel */}
                <div className="flex-grow p-5">
                  {/* UPI TAB */}
                  {activeTab === 'upi' && (
                    <div className="space-y-4 h-full flex flex-col justify-center">
                      {!showQr ? (
                        <>
                          <div className="text-center space-y-1">
                            <span className="text-xs text-zinc-400 block font-bold">Pay via Instant UPI ID</span>
                          </div>
                          
                          <div className="space-y-2">
                            <input
                              type="text"
                              placeholder="Enter UPI ID (e.g., info@okaxis)"
                              value={upiId}
                              onChange={(e) => setUpiId(e.target.value)}
                              className="w-full bg-[#121620] border border-zinc-800 rounded-xl px-3.5 py-2.5 text-xs text-zinc-200 focus:outline-none focus:border-[#3399cc] placeholder-zinc-650"
                            />
                            <p className="text-[9px] text-zinc-500">
                              Accepts Google Pay, PhonePe, Paytm, BHIM, etc.
                            </p>
                          </div>

                          <div className="relative flex py-1 items-center">
                            <div className="flex-grow border-t border-zinc-800" />
                            <span className="flex-shrink mx-3 text-[9px] text-zinc-500 uppercase tracking-widest font-black">OR</span>
                            <div className="flex-grow border-t border-zinc-800" />
                          </div>

                          <button
                            type="button"
                            onClick={() => setShowQr(true)}
                            className="w-full py-2.5 border border-dashed border-zinc-700 hover:border-[#3399cc] hover:text-[#3399cc] rounded-xl text-xs font-bold text-zinc-400 flex items-center justify-center space-x-1.5 transition-colors bg-[#121620]/30"
                          >
                            <QrCode size={14} />
                            <span>Scan QR Code instead</span>
                          </button>
                        </>
                      ) : (
                        <div className="flex flex-col items-center justify-center space-y-3 py-1">
                          <button
                            type="button"
                            onClick={() => setShowQr(false)}
                            className="self-start text-[10px] text-zinc-400 hover:text-[#3399cc] flex items-center space-x-1"
                          >
                            <ArrowLeft size={10} />
                            <span>Back</span>
                          </button>

                          {/* Beautiful QR Code mockup */}
                          <div className="p-3 bg-white rounded-xl shadow-md flex items-center justify-center border border-zinc-200">
                            <svg className="w-28 h-28 text-zinc-900" viewBox="0 0 100 100" fill="currentColor">
                              {/* QR Code pattern mockup */}
                              <rect x="5" y="5" width="20" height="20" />
                              <rect x="9" y="9" width="12" height="12" fill="white" />
                              <rect x="75" y="5" width="20" height="20" />
                              <rect x="79" y="9" width="12" height="12" fill="white" />
                              <rect x="5" y="75" width="20" height="20" />
                              <rect x="9" y="79" width="12" height="12" fill="white" />
                              
                              <rect x="35" y="5" width="5" height="15" />
                              <rect x="45" y="15" width="10" height="5" />
                              <rect x="60" y="5" width="5" height="25" />
                              <rect x="35" y="35" width="30" height="5" />
                              
                              <rect x="5" y="35" width="15" height="10" />
                              <rect x="25" y="30" width="5" height="20" />
                              
                              <rect x="75" y="35" width="10" height="25" />
                              <rect x="90" y="45" width="5" height="5" />
                              
                              <rect x="35" y="50" width="10" height="10" />
                              <rect x="55" y="45" width="10" height="15" />
                              
                              <rect x="30" y="75" width="25" height="5" />
                              <rect x="45" y="85" width="15" height="10" />
                              
                              <rect x="65" y="70" width="10" height="25" />
                              <rect x="85" y="75" width="10" height="10" />
                            </svg>
                          </div>

                          <div className="text-center">
                            <span className="text-[10px] font-bold text-zinc-400">Scan this QR Code via UPI App</span>
                            <p className="text-[9px] text-[#3399cc] mt-0.5">UPI ID: sessionly@paytm</p>
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {/* CARD TAB */}
                  {activeTab === 'card' && (
                    <div className="space-y-3.5">
                      <div className="space-y-1">
                        <label className="block text-[9px] font-bold uppercase tracking-wider text-zinc-400">
                          Card Number
                        </label>
                        <div className="relative">
                          <input
                            type="text"
                            placeholder="4111 2222 3333 4444"
                            value={cardNumber}
                            onChange={handleCardNumberChange}
                            className="w-full bg-[#121620] border border-zinc-800 rounded-xl pl-3 pr-10 py-2.5 text-xs text-zinc-200 focus:outline-none focus:border-[#3399cc] placeholder-zinc-700 tracking-wider"
                          />
                          <CreditCard size={14} className="absolute right-3.5 top-3.5 text-zinc-600" />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-1">
                          <label className="block text-[9px] font-bold uppercase tracking-wider text-zinc-400">
                            Expiry Date
                          </label>
                          <input
                            type="text"
                            placeholder="MM/YY"
                            value={cardExpiry}
                            onChange={handleExpiryChange}
                            className="w-full bg-[#121620] border border-zinc-800 rounded-xl px-3 py-2.5 text-xs text-zinc-200 focus:outline-none focus:border-[#3399cc] placeholder-zinc-700"
                          />
                        </div>

                        <div className="space-y-1">
                          <label className="block text-[9px] font-bold uppercase tracking-wider text-zinc-400">
                            CVV
                          </label>
                          <input
                            type="password"
                            placeholder="123"
                            maxLength={3}
                            value={cardCvv}
                            onChange={(e) => setCardCvv(e.target.value.replace(/\D/g, ''))}
                            className="w-full bg-[#121620] border border-zinc-800 rounded-xl px-3 py-2.5 text-xs text-zinc-200 focus:outline-none focus:border-[#3399cc] placeholder-zinc-700"
                          />
                        </div>
                      </div>

                      <div className="space-y-1">
                        <label className="block text-[9px] font-bold uppercase tracking-wider text-zinc-400">
                          Cardholder Name
                        </label>
                        <input
                          type="text"
                          placeholder="Jane Smith"
                          value={cardName}
                          onChange={(e) => setCardName(e.target.value)}
                          className="w-full bg-[#121620] border border-zinc-800 rounded-xl px-3 py-2.5 text-xs text-zinc-200 focus:outline-none focus:border-[#3399cc] placeholder-zinc-700"
                        />
                      </div>
                    </div>
                  )}

                  {/* NETBANKING TAB */}
                  {activeTab === 'netbanking' && (
                    <div className="space-y-3 h-full flex flex-col justify-center">
                      <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider block">
                        Select Bank
                      </span>
                      
                      <div className="grid grid-cols-2 gap-2">
                        {['SBI', 'HDFC', 'ICICI', 'AXIS', 'KOTAK', 'YES'].map((bank) => (
                          <button
                            key={bank}
                            type="button"
                            onClick={() => setSelectedBank(bank)}
                            className={`py-2 px-3 rounded-xl border text-[10px] font-black transition-colors ${
                              selectedBank === bank
                                ? 'bg-[#3399cc]/15 border-[#3399cc] text-[#3399cc]'
                                : 'bg-[#121620] border-zinc-800 text-zinc-400 hover:text-zinc-200'
                            }`}
                          >
                            {bank} Bank
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* WALLETS TAB */}
                  {activeTab === 'wallet' && (
                    <div className="space-y-2 h-full flex flex-col justify-center">
                      <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider block mb-1">
                        Select Wallet
                      </span>

                      {['Paytm Wallet', 'PhonePe Wallet', 'MobiKwik', 'Freecharge'].map((w) => (
                        <button
                          key={w}
                          type="button"
                          onClick={() => setPaymentState('processing')}
                          className="w-full py-2.5 bg-[#121620] border border-zinc-850 hover:border-zinc-750 text-left px-3.5 rounded-xl text-xs font-medium text-zinc-300 hover:text-white transition-colors flex items-center justify-between"
                        >
                          <span>{w}</span>
                          <span className="text-[10px] text-[#3399cc]">Pay ₹{amount}</span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Secure Footer Button */}
              <div className="bg-[#121620] p-4 border-t border-zinc-800/80 flex items-center justify-between">
                <div className="flex items-center space-x-1.5 text-zinc-550">
                  <ShieldCheck size={14} className="text-emerald-500" />
                  <span className="text-[9px] uppercase tracking-wider font-bold">100% Secure Checkout</span>
                </div>
                
                {/* Pay button for card, netbanking, QR */}
                {activeTab !== 'wallet' && (
                  <button
                    type="button"
                    onClick={handlePay}
                    className="px-6 py-2.5 bg-[#3399cc] hover:bg-[#287da8] text-white font-black rounded-xl text-xs flex items-center space-x-1.5 transition-all shadow-md shadow-[#3399cc]/15 active:scale-95"
                  >
                    <Lock size={11} />
                    <span>Pay ₹{amount}</span>
                  </button>
                )}
              </div>
            </motion.div>
          )}

          {/* Processing Screen */}
          {paymentState === 'processing' && (
            <motion.div
              key="processing-screen"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className="px-8 py-16 flex flex-col items-center justify-center text-center space-y-4"
            >
              <RefreshCw size={36} className="text-[#3399cc] animate-spin" />
              <div>
                <h4 className="text-base font-bold text-zinc-200">Contacting Payment Gateway...</h4>
                <p className="text-xs text-zinc-500 mt-1.5">
                  Confirming your UPI/Bank transaction. Please do not close or refresh this screen.
                </p>
              </div>
              <div className="w-24 h-1 bg-zinc-800 rounded-full overflow-hidden">
                <div className="h-full bg-[#3399cc] rounded-full w-1/2 animate-infinite-loading"></div>
              </div>
            </motion.div>
          )}

          {/* Success Screen */}
          {paymentState === 'success' && (
            <motion.div
              key="success-screen"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className="px-8 py-14 flex flex-col items-center justify-center text-center space-y-4"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: [0, 1.2, 1] }}
                transition={{ duration: 0.5, ease: 'easeOut' }}
              >
                <CheckCircle2 size={54} className="text-emerald-500 fill-emerald-500/10" />
              </motion.div>
              <div>
                <h4 className="text-lg font-black text-emerald-400">Payment Successful!</h4>
                <p className="text-xs text-zinc-400 mt-1">
                  Reservation confirmed & ticket issued.
                </p>
                <p className="text-[10px] text-zinc-600 mt-3 font-mono font-bold uppercase tracking-wider">
                  Txn ID: pay_NB8a{Math.random().toString(36).substring(2, 10).toUpperCase()}
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  )
}
