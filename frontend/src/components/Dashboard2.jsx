import React from "react";
import { ChevronRight, Users, Calendar, Plus, TrendingUp, Clock, Check, X, Activity, ExternalLink } from "lucide-react";
import axios from "axios";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { containerVariants, cardVariants } from "../lib/animationVariants";
import { DashboardBackground } from "./FloatingBackground";

const token = localStorage.getItem("jwt");

// Student List Component
const StudentList = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const response = await axios.get("https://byteme-ue8b.onrender.com/user/allStudents", {
          headers: {
            "Content-Type": "application/json",
            ...(token && { Authorization: `Bearer ${token}` }),
          },
          withCredentials: true,
        });
        console.log(response.data)

        const mappedStudents = response.data.students.map((student) => ({
          username: student.userName,
          key: student.walletAddress,
          status: student.feeStatus ? "paid" : "unpaid",
        }));

        setStudents(mappedStudents);
      } catch (error) {
        console.error("Error fetching students:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStudents();
  }, []);

  return (
    <motion.div 
      variants={cardVariants}
      className="bg-white/70 backdrop-blur-xl rounded-2xl shadow-lg border border-gray-200/50 hover:shadow-xl transition-all duration-500 overflow-hidden"
      whileHover={{ y: -5, scale: 1.01 }}
    >
      <div className="flex items-center justify-between p-6 border-b border-gray-200/50">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-gradient-to-r from-blue-100 to-indigo-100 rounded-xl">
            <Users className="w-5 h-5 text-gray-700" />
          </div>
          <h3 className="text-lg font-semibold text-gray-800">Students List</h3>
        </div>
        <motion.button 
          className="flex items-center space-x-2 text-sm text-gray-600 hover:text-gray-800 transition-colors"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <span>View All</span>
          <ChevronRight className="w-4 h-4" />
        </motion.button>
      </div>

      {/* Header */}
      <div className="grid grid-cols-3 p-4 bg-gray-50/50 border-b border-gray-200/30">
        <div className="text-sm font-medium text-gray-700 text-center">Username</div>
        <div className="text-sm font-medium text-gray-700 text-center">Wallet Key</div>
        <div className="text-sm font-medium text-gray-700 text-center">Status</div>
      </div>

      {/* Content */}
      <div className="max-h-80 overflow-y-auto">
        {loading ? (
          <div className="flex items-center justify-center py-8">
            <motion.div
              className="w-8 h-8 border-2 border-gray-300 border-t-gray-600 rounded-full"
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            />
          </div>
        ) : (
          <AnimatePresence>
            {students.slice(0, 6).map((student, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="grid grid-cols-3 p-4 hover:bg-gray-50/50 transition-colors duration-200 group"
                whileHover={{ scale: 1.01 }}
              >
                <div className="text-sm font-medium text-gray-900 text-center truncate">
                  {student.username}
                </div>
                <div className="text-xs text-gray-600 font-mono text-center truncate">
                  {student.key ? `${student.key.slice(0, 6)}...${student.key.slice(-4)}` : 'N/A'}
                </div>
                <div className="flex justify-center">
                  <motion.span
                    className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                      student.status === "paid"
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-700"
                    }`}
                    whileHover={{ scale: 1.05 }}
                  >
                    {student.status === "paid" ? (
                      <Check className="w-3 h-3 mr-1" />
                    ) : (
                      <X className="w-3 h-3 mr-1" />
                    )}
                    {student.status}
                  </motion.span>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        )}
      </div>
    </motion.div>
  );
};

// Add New Event Component
const AddNewEvent = ({ setEvent }) => {
  return (
    <motion.div 
      variants={cardVariants}
      className="bg-white/70 backdrop-blur-xl rounded-2xl shadow-lg border border-gray-200/50 hover:shadow-xl transition-all duration-500 p-6"
      whileHover={{ y: -5, scale: 1.02 }}
    >
      <div className="flex items-center space-x-3 mb-6">
        <div className="p-2 bg-gradient-to-r from-purple-100 to-pink-100 rounded-xl">
          <Calendar className="w-5 h-5 text-gray-700" />
        </div>
        <h3 className="text-lg font-semibold text-gray-800">Add New Event</h3>
      </div>

      <motion.button
        className="w-full bg-gray-900 hover:bg-gray-800 text-white rounded-xl p-4 flex items-center justify-center space-x-2 transition-all duration-300 group shadow-lg hover:shadow-xl"
        onClick={() => setEvent(true)}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        <motion.div
          className="p-2 bg-white/20 rounded-lg group-hover:bg-white/30 transition-colors"
          whileHover={{ rotate: 90 }}
          transition={{ duration: 0.3 }}
        >
          <Plus className="w-5 h-5" />
        </motion.div>
        <span className="font-medium">Create Event</span>
      </motion.button>
    </motion.div>
  );
};

// Image Component
const ImagePlaceholder = () => {
  return (
    <motion.div 
      variants={cardVariants}
      className="flex-1 flex items-center justify-center p-6"
    >
      <motion.img
        src="/dashboard2image.svg"
        alt="Dashboard illustration"
        className="max-w-full h-auto max-h-80 object-contain"
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.6 }}
        whileHover={{ 
          scale: 1.05,
          rotate: 2,
          transition: { duration: 0.3 }
        }}
      />
    </motion.div>
  );
};

// Transaction History Component
const TransactionHistory = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const TOKEN_ADDRESS = "0xfEc060d0CF069ce6b1518445dB538058e9eE063d";
  const ETHERSCAN_API_KEY = "YG3F5JK1XCCVGPHCRJGRBDTYXDR9WPUGUD";

  const formatAddress = (address) => {
    if (!address) return 'N/A';
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  const formatAmount = (value, decimals = 18) => {
    if (!value) return '0';
    try {
      const amount = parseInt(value) / Math.pow(10, decimals);
      return amount.toFixed(2);
    } catch (error) {
      return '0';
    }
  };

  const getTimeAgo = (timestamp) => {
    try {
      const now = Date.now() / 1000;
      const diff = now - parseInt(timestamp);
      
      if (diff < 60) return `${Math.floor(diff)}s ago`;
      if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
      if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
      return `${Math.floor(diff / 86400)}d ago`;
    } catch (error) {
      return 'Unknown';
    }
  };

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Fetch ERC-20 token transfers from Sepolia testnet
        const response = await axios.get(
          `https://api-sepolia.etherscan.io/api`, {
            params: {
              module: 'account',
              action: 'tokentx',
              contractaddress: TOKEN_ADDRESS,
              startblock: 0,
              endblock: 99999999,
              page: 1,
              offset: 20,
              sort: 'desc',
              apikey: ETHERSCAN_API_KEY
            }
          }
        );

        console.log("API Response:", response.data);

        if (response.data.status === '1' && response.data.result && response.data.result.length > 0) {
          const formattedTransactions = response.data.result.map((tx) => ({
            id: `${tx.hash.slice(0, 8)}...${tx.hash.slice(-6)}`,
            hash: tx.hash,
            from: formatAddress(tx.from),
            to: formatAddress(tx.to),
            amount: `${formatAmount(tx.value, parseInt(tx.tokenDecimal || 18))} ${tx.tokenSymbol || 'BITS'}`,
            time: getTimeAgo(tx.timeStamp),
            status: 'completed',
            blockNumber: tx.blockNumber,
            gasUsed: tx.gasUsed,
            gasPrice: tx.gasPrice
          }));
          
          setTransactions(formattedTransactions);
        } else {
          // No transactions found - show empty state
          setTransactions([]);
        }
      } catch (error) {
        console.error("Error fetching transactions:", error);
        setError("Failed to fetch transactions from Etherscan API");
        
        // Fallback to demo transactions
        setTransactions([
          { id: "DEMO001", from: "0x1234...5678", to: "0x9abc...def0", amount: "150 BITS", time: "2 min ago", status: "completed", hash: "0x1234567890abcdef" },
          { id: "DEMO002", from: "0x2345...6789", to: "0xabcd...ef01", amount: "75 BITS", time: "5 min ago", status: "pending", hash: "0x234567890abcdef1" },
          { id: "DEMO003", from: "0x3456...789a", to: "0xbcde...f012", amount: "200 BITS", time: "8 min ago", status: "completed", hash: "0x34567890abcdef12" },
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchTransactions();
    
    // Auto-refresh every 30 seconds
    const interval = setInterval(fetchTransactions, 30000);
    
    return () => clearInterval(interval);
  }, [TOKEN_ADDRESS, ETHERSCAN_API_KEY]);

  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed':
        return <Check className="w-3 h-3" />;
      case 'pending':
        return <Clock className="w-3 h-3" />;
      case 'failed':
        return <X className="w-3 h-3" />;
      default:
        return <Activity className="w-3 h-3" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-700';
      case 'pending':
        return 'bg-yellow-100 text-yellow-700';
      case 'failed':
        return 'bg-red-100 text-red-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const openInEtherscan = (hash) => {
    if (hash && hash !== 'undefined') {
      window.open(`https://sepolia.etherscan.io/tx/${hash}`, '_blank');
    }
  };

  return (
    <motion.div 
      variants={cardVariants}
      className="w-full bg-white/70 backdrop-blur-xl rounded-2xl shadow-lg border border-gray-200/50 hover:shadow-xl transition-all duration-500 overflow-hidden"
      whileHover={{ y: -3 }}
    >
      <div className="flex items-center justify-between p-6 border-b border-gray-200/50">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-gradient-to-r from-indigo-100 to-purple-100 rounded-xl">
            <TrendingUp className="w-5 h-5 text-gray-700" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-800">Transaction History</h3>
            <p className="text-xs text-gray-500">Token: {TOKEN_ADDRESS.slice(0, 8)}...{TOKEN_ADDRESS.slice(-6)} (Sepolia)</p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          {loading && (
            <motion.div
              className="w-4 h-4 border-2 border-gray-300 border-t-gray-600 rounded-full"
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            />
          )}
          <motion.button 
            className="flex items-center space-x-2 text-sm text-gray-600 hover:text-gray-800 transition-colors"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => window.open(`https://sepolia.etherscan.io/token/${TOKEN_ADDRESS}`, '_blank')}
          >
            <span>View on Etherscan</span>
            <ExternalLink className="w-4 h-4" />
          </motion.button>
        </div>
      </div>

      {error && (
        <div className="p-4 bg-red-50 border-b border-red-200">
          <p className="text-sm text-red-600">{error}</p>
        </div>
      )}

      {/* Header */}
      <div className="grid grid-cols-6 p-4 bg-gray-50/50 border-b border-gray-200/30">
        <div className="text-sm font-medium text-gray-700 text-center">Transaction ID</div>
        <div className="text-sm font-medium text-gray-700 text-center">From</div>
        <div className="text-sm font-medium text-gray-700 text-center">To</div>
        <div className="text-sm font-medium text-gray-700 text-center">Amount</div>
        <div className="text-sm font-medium text-gray-700 text-center">Time</div>
        <div className="text-sm font-medium text-gray-700 text-center">Status</div>
      </div>

      {/* Content */}
      <div className="divide-y divide-gray-100/50 max-h-80 overflow-y-auto">
        {loading ? (
          <div className="flex items-center justify-center py-8">
            <motion.div
              className="w-8 h-8 border-2 border-gray-300 border-t-gray-600 rounded-full"
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            />
          </div>
        ) : transactions.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12">
            <Activity className="w-12 h-12 text-gray-400 mb-4" />
            <p className="text-gray-500 text-sm">No transactions found</p>
            <p className="text-gray-400 text-xs mt-1">Transactions will appear here once they occur</p>
          </div>
        ) : (
          <AnimatePresence>
            {transactions.map((transaction, index) => (
              <motion.div
                key={transaction.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                className="grid grid-cols-6 p-4 hover:bg-gray-50/50 transition-colors duration-200 group cursor-pointer"
                whileHover={{ scale: 1.01 }}
                onClick={() => openInEtherscan(transaction.hash)}
              >
                <div className="text-xs text-gray-900 text-center font-mono flex items-center justify-center">
                  {transaction.id}
                  {transaction.hash && transaction.hash !== 'undefined' && (
                    <ExternalLink className="w-3 h-3 ml-1 opacity-0 group-hover:opacity-100 transition-opacity" />
                  )}
                </div>
                <div className="text-xs text-gray-600 text-center truncate font-mono">
                  {transaction.from}
                </div>
                <div className="text-xs text-gray-600 text-center truncate font-mono">
                  {transaction.to}
                </div>
                <div className="text-xs font-medium text-gray-900 text-center">
                  {transaction.amount}
                </div>
                <div className="text-xs text-gray-500 text-center">
                  {transaction.time}
                </div>
                <div className="flex justify-center">
                  <motion.span
                    className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(transaction.status)}`}
                    whileHover={{ scale: 1.05 }}
                  >
                    {getStatusIcon(transaction.status)}
                    <span className="ml-1 capitalize">{transaction.status}</span>
                  </motion.span>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        )}
      </div>

      {/* Footer with timestamp */}
      <div className="p-4 bg-gray-50/30 border-t border-gray-200/30">
        <p className="text-xs text-gray-500 text-center">
          Last updated: {new Date().toLocaleTimeString()} • Auto-refresh every 30s
        </p>
      </div>
    </motion.div>
  );
};

// Main Dashboard Layout
const Dashboard2 = ({ setEvent }) => {
  return (
    <div className="w-full min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 relative overflow-hidden pt-20">
      {/* Floating Background Elements */}
      <DashboardBackground />

      <div className="relative z-10">
        <motion.div 
          className="flex flex-col gap-6 p-6"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* First Row - Responsive Layout */}
          <div className="flex flex-col lg:flex-row gap-6">
            {/* Left Column */}
            <div className="w-full lg:w-[40%] flex flex-col gap-6">
              <AddNewEvent setEvent={setEvent} />
              <ImagePlaceholder />
            </div>

            {/* Right Column */}
            <div className="w-full lg:w-[60%]">
              <StudentList />
            </div>
          </div>

          {/* Second Row - Full Width Transaction History */}
          <TransactionHistory />
        </motion.div>
      </div>
    </div>
  );
};

export default Dashboard2;