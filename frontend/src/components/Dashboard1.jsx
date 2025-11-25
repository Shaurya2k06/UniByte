import { useEffect, useRef, useState } from "react";
import { useMetaMask } from "../hooks/useMetamask";
import { ethers } from 'ethers';
import axios from "axios";
import {
  Chart,
  LineElement,
  PointElement,
  LineController,
  CategoryScale,
  LinearScale,
  Filler,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Wallet, RefreshCw, Send, TrendingUp, ArrowUp } from "lucide-react";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import { containerVariants, cardVariants } from "../lib/animationVariants";
import { DashboardBackground } from "./FloatingBackground";

Chart.register(
  LineElement,
  PointElement,
  LineController,
  CategoryScale,
  LinearScale,
  Filler,
  Title,
  Tooltip,
  Legend
);

const AdminBalance = () => {
  const { isConnected, account } = useMetaMask();
  const [balance, setBalance] = useState("0");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const BITS_CONTRACT_ADDRESS = "0xfEc060d0CF069ce6b1518445dB538058e9eE063d"; 
  
  const BITS_ABI = [
    {
      "inputs": [{"internalType": "address", "name": "account", "type": "address"}],
      "name": "balanceOf",
      "outputs": [{"internalType": "uint256", "name": "", "type": "uint256"}],
      "stateMutability": "view",
      "type": "function"
    }
  ];

  const fetchBalance = async () => {
    if (!isConnected || !account || !window.ethereum) {
      setBalance("0");
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const network = await provider.getNetwork();
      console.log("Connected to network:", network.name, network.chainId);

      const contract = new ethers.Contract(
        BITS_CONTRACT_ADDRESS,
        BITS_ABI,
        provider
      );

      const balanceWei = await Promise.race([
        contract.balanceOf(account),
        new Promise((_, reject) => 
          setTimeout(() => reject(new Error("Request timeout")), 10000)
        )
      ]);

      const balanceFormatted = ethers.utils.formatUnits(balanceWei, 18);
      
      const balanceNumber = parseFloat(balanceFormatted);
      setBalance(balanceNumber.toLocaleString('en-US', {
        minimumFractionDigits: 0,
        maximumFractionDigits: 2
      }));

    } catch (err) {
      console.error("Detailed error:", err);
      
      let errorMessage = "Failed to fetch balance";
      if (err.message.includes("timeout")) {
        errorMessage = "Request timeout";
      } else if (err.message.includes("network")) {
        errorMessage = "Network error";
      } else if (err.message.includes("contract")) {
        errorMessage = "Contract not found";
      } else if (err.message.includes("Ethers")) {
        errorMessage = "Ethers.js not loaded";
      }
      
      setError(errorMessage);
      setBalance("Error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isConnected && account) {
      const timer = setTimeout(() => {
        fetchBalance();
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [isConnected, account]);

  const handleRefresh = () => {
    fetchBalance();
  };

  return (
    <motion.div 
      variants={cardVariants}
      className="flex-1 min-w-[250px] bg-white/70 backdrop-blur-xl rounded-2xl p-6 shadow-lg border border-gray-200/50 hover:shadow-xl transition-all duration-500 group"
      whileHover={{ y: -5, scale: 1.02 }}
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-gradient-to-r from-blue-100 to-purple-100 rounded-xl">
            <Wallet className="w-5 h-5 text-gray-700" />
          </div>
          <h3 className="text-lg font-semibold text-gray-800">
            Admin Balance
          </h3>
        </div>
        <motion.button
          onClick={handleRefresh}
          disabled={loading}
          className="p-2 rounded-xl hover:bg-gray-100 transition-colors duration-200 group/btn"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          <RefreshCw className={`w-4 h-4 text-gray-600 group-hover/btn:text-blue-600 transition-colors ${loading ? "animate-spin" : ""}`} />
        </motion.button>
      </div>

      <div className="space-y-3">
        {!isConnected ? (
          <motion.div 
            className="text-center py-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <span className="text-gray-500 text-lg">Connect Wallet</span>
            <p className="text-xs text-gray-400 mt-1">Connect to view balance</p>
          </motion.div>
        ) : loading ? (
          <motion.div 
            className="flex items-center gap-3"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <div className="animate-pulse bg-gray-200 h-8 w-32 rounded-xl"></div>
            <span className="text-sm text-gray-600">Loading...</span>
          </motion.div>
        ) : error ? (
          <motion.div 
            className="text-center py-2"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            <span className="text-lg text-red-500">Error</span>
            <p className="text-xs text-red-400">{error}</p>
            <motion.button 
              onClick={handleRefresh}
              className="text-xs text-blue-600 hover:underline mt-2"
              whileHover={{ scale: 1.05 }}
            >
              Retry
            </motion.button>
          </motion.div>
        ) : (
          <motion.div 
            className="space-y-2"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <div className="flex items-baseline gap-2">
              <motion.span 
                className="text-3xl font-bold text-gray-900"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 200, delay: 0.3 }}
              >
                {balance}
              </motion.span>
              <span className="text-sm text-gray-600 font-medium">BITS</span>
            </div>
            
            {account && (
              <motion.p 
                className="text-xs text-gray-400 font-mono bg-gray-50 px-2 py-1 rounded-lg"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
              >
                {account.slice(0, 6)}...{account.slice(-4)}
              </motion.p>
            )}
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};

const TotalTransactions = () => {
  const [totalTransactions, setTotalTransactions] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [previousTotal, setPreviousTotal] = useState(0);
  const [percentageChange, setPercentageChange] = useState(0);

  // Temporarily hardcode the values
  const TOKEN_ADDRESS = "0xfEc060d0CF069ce6b1518445dB538058e9eE063d";
  const ETHERSCAN_API_KEY = "YG3F5JK1XCCVGPHCRJGRBDTYXDR9WPUGUD";

  useEffect(() => {
    const fetchTransactionCount = async () => {
      try {
        setLoading(true);
        setError(null);

        console.log("Fetching transactions for:", TOKEN_ADDRESS);
        console.log("Using API key:", ETHERSCAN_API_KEY ? "Present" : "Missing");

        // Fetch all transactions for the token
        const response = await axios.get(
          `https://api-sepolia.etherscan.io/api`, {
            params: {
              module: 'account',
              action: 'tokentx',
              contractaddress: TOKEN_ADDRESS,
              startblock: 0,
              endblock: 99999999,
              page: 1,
              offset: 100, // Reduce to avoid timeouts
              sort: 'desc',
              apikey: ETHERSCAN_API_KEY
            }
          }
        );

        console.log("API Response:", response.data);

        if (response.data.status === '1' && response.data.result && response.data.result.length > 0) {
          const currentTotal = response.data.result.length;
          setTotalTransactions(currentTotal);
          setPercentageChange(12.5); // Demo percentage for now
        } else {
          console.log("No transactions found, using demo data");
          setTotalTransactions(0);
          setPercentageChange(0);
        }

      } catch (error) {
        console.error("Error fetching transaction count:", error);
        setError("Failed to fetch transaction data");
        
        // Fallback to demo data
        setTotalTransactions(25);
        setPercentageChange(8.3);
      } finally {
        setLoading(false);
      }
    };

    fetchTransactionCount();
    
    // Auto-refresh every 5 minutes
    const interval = setInterval(fetchTransactionCount, 5 * 60 * 1000);
    
    return () => clearInterval(interval);
  }, [TOKEN_ADDRESS, ETHERSCAN_API_KEY]);

  return (
    <motion.div 
      variants={cardVariants}
      className="flex-1 min-w-[250px] bg-white/70 backdrop-blur-xl rounded-2xl p-6 shadow-lg border border-gray-200/50 hover:shadow-xl transition-all duration-500 group"
      whileHover={{ y: -5, scale: 1.02 }}
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-gradient-to-r from-green-100 to-emerald-100 rounded-xl">
            <TrendingUp className="w-5 h-5 text-gray-700" />
          </div>
          <h3 className="text-lg font-semibold text-gray-800">
            Total Transactions
          </h3>
        </div>
        <motion.button
          onClick={() => window.location.reload()}
          className="p-2 rounded-xl hover:bg-gray-100 transition-colors duration-200 group/btn"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          <RefreshCw className="w-4 h-4 text-gray-600 group-hover/btn:text-green-600 transition-colors" />
        </motion.button>
      </div>
      
      <div className="space-y-3">
        {loading ? (
          <motion.div 
            className="flex items-center gap-3"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <div className="animate-pulse bg-gray-200 h-8 w-32 rounded-xl"></div>
            <span className="text-sm text-gray-600">Loading...</span>
          </motion.div>
        ) : error ? (
          <motion.div 
            className="text-center py-2"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            <span className="text-lg text-red-500">Error</span>
            <p className="text-xs text-red-400">{error}</p>
          </motion.div>
        ) : (
          <motion.div 
            className="space-y-2"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <div className="flex items-baseline gap-3">
              <motion.span 
                className="text-3xl font-bold text-gray-900"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 200, delay: 0.3 }}
              >
                {totalTransactions.toLocaleString()}
              </motion.span>
              <motion.div 
                className={`flex items-center gap-1 px-2 py-1 rounded-lg ${
                  percentageChange >= 0 
                    ? 'bg-green-50 text-green-600' 
                    : 'bg-red-50 text-red-600'
                }`}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 }}
              >
                <ArrowUp className={`w-3 h-3 ${percentageChange < 0 ? 'rotate-180' : ''}`} />
                <span className="text-sm font-medium">
                  {Math.abs(percentageChange).toFixed(1)}%
                </span>
              </motion.div>
            </div>
            <p className="text-xs text-gray-500">vs last 30 days</p>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};

const CoinFlow = () => {
  const chartRef = useRef(null);
  const chartInstanceRef = useRef(null);
  const [chartData, setChartData] = useState({
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
    data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const TOKEN_ADDRESS = "0xfEc060d0CF069ce6b1518445dB538058e9eE063d";
  const ETHERSCAN_API_KEY = "YG3F5JK1XCCVGPHCRJGRBDTYXDR9WPUGUD";

  const formatAmount = (value, decimals = 18) => {
    if (!value) return 0;
    try {
      return parseFloat(ethers.utils.formatUnits(value, decimals));
    } catch (error) {
      return 0;
    }
  };

  const processTransactionsByMonth = (transactions) => {
    const currentYear = new Date().getFullYear();
    const monthlyVolume = new Array(12).fill(0);
    
    transactions.forEach(tx => {
      const date = new Date(parseInt(tx.timeStamp) * 1000);
      if (date.getFullYear() === currentYear) {
        const month = date.getMonth();
        const amount = formatAmount(tx.value, parseInt(tx.tokenDecimal || 18));
        monthlyVolume[month] += amount;
      }
    });
    
    return monthlyVolume;
  };

  useEffect(() => {
    const fetchTransactionVolume = async () => {
      try {
        setLoading(true);
        setError(null);

        console.log("Fetching transaction volume for:", TOKEN_ADDRESS);

        const response = await axios.get(
          `https://api-sepolia.etherscan.io/api`, {
            params: {
              module: 'account',
              action: 'tokentx',
              contractaddress: TOKEN_ADDRESS,
              startblock: 0,
              endblock: 99999999,
              page: 1,
              offset: 1000, // Increase to get more transactions
              sort: 'desc',
              apikey: ETHERSCAN_API_KEY
            }
          }
        );

        console.log("Transaction volume API Response:", response.data);

        if (response.data.status === '1' && response.data.result && response.data.result.length > 0) {
          const monthlyData = processTransactionsByMonth(response.data.result);
          setChartData(prev => ({
            ...prev,
            data: monthlyData
          }));
        } else {
          console.log("No transactions found for volume calculation, using demo data");
          // Fallback demo data
          setChartData(prev => ({
            ...prev,
            data: [2000, 3000, 2500, 6000, 9000, 7000, 4000, 5000, 4500, 4000, 3500, 4000]
          }));
        }

      } catch (error) {
        console.error("Error fetching transaction volume:", error);
        setError("Failed to fetch transaction volume data");
        
        // Fallback to demo data
        setChartData(prev => ({
          ...prev,
          data: [2000, 3000, 2500, 6000, 9000, 7000, 4000, 5000, 4500, 4000, 3500, 4000]
        }));
      } finally {
        setLoading(false);
      }
    };

    fetchTransactionVolume();
    
    // Auto-refresh every 10 minutes
    const interval = setInterval(fetchTransactionVolume, 10 * 60 * 1000);
    
    return () => clearInterval(interval);
  }, [TOKEN_ADDRESS, ETHERSCAN_API_KEY]);

  useEffect(() => {
    if (!chartRef.current) return;
    
    const ctx = chartRef.current.getContext("2d");

    if (chartInstanceRef.current) {
      chartInstanceRef.current.destroy();
    }

    chartInstanceRef.current = new Chart(ctx, {
      type: "line",
      data: {
        labels: chartData.labels,
        datasets: [
          {
            label: "Volume of Tokens",
            data: chartData.data,
            borderColor: "#6366f1",
            backgroundColor: "rgba(99, 102, 241, 0.1)",
            fill: true,
            tension: 0.4,
            pointBackgroundColor: "#6366f1",
            pointBorderColor: "#ffffff",
            pointBorderWidth: 2,
            pointRadius: 4,
            pointHoverRadius: 6,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        interaction: {
          intersect: false,
          mode: 'index',
        },
        scales: {
          y: {
            beginAtZero: true,
            title: {
              display: true,
              text: "Volume of Tokens (BITS)",
              color: "#6b7280",
              font: { size: 12, weight: '500' }
            },
            grid: {
              color: "#f3f4f6",
              drawBorder: false,
            },
            ticks: {
              color: "#9ca3af",
              font: { size: 11 },
              callback: function(value) {
                return value.toLocaleString() + ' BITS';
              }
            }
          },
          x: {
            title: {
              display: true,
              text: "Month",
              color: "#6b7280",
              font: { size: 12, weight: '500' }
            },
            grid: {
              color: "#f3f4f6",
              drawBorder: false,
            },
            ticks: {
              color: "#9ca3af",
              font: { size: 11 }
            }
          },
        },
        plugins: {
          legend: {
            display: false,
          },
          tooltip: {
            backgroundColor: "rgba(17, 24, 39, 0.9)",
            titleColor: "#f9fafb",
            bodyColor: "#f9fafb",
            cornerRadius: 8,
            padding: 12,
            displayColors: false,
            callbacks: {
              label: function(context) {
                return `Volume: ${context.parsed.y.toLocaleString()} BITS`;
              }
            }
          }
        },
      },
    });

    return () => {
      chartInstanceRef.current?.destroy();
    };
  }, [chartData]);

  return (
    <motion.div 
      variants={cardVariants}
      className="w-full bg-white/70 backdrop-blur-xl rounded-2xl p-6 shadow-lg border border-gray-200/50 hover:shadow-xl transition-all duration-500"
      whileHover={{ y: -3 }}
    >
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-gradient-to-r from-indigo-100 to-purple-100 rounded-xl">
            <TrendingUp className="w-5 h-5 text-gray-700" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-800">
              Coin Flow Analytics
            </h3>
            <p className="text-xs text-gray-500">Monthly transaction volume</p>
          </div>
        </div>
        
        {loading && (
          <motion.div
            className="w-5 h-5 border-2 border-gray-300 border-t-gray-600 rounded-full"
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          />
        )}
      </div>
      
      {error ? (
        <div className="flex items-center justify-center h-[300px] text-red-500">
          <p className="text-sm">{error}</p>
        </div>
      ) : (
        <motion.div 
          className="w-full h-[300px]"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
        >
          <canvas ref={chartRef}></canvas>
        </motion.div>
      )}
    </motion.div>
  );
};

const SendTokens = () => {
  const { isConnected, account } = useMetaMask();
  const [recipientAddress, setRecipientAddress] = useState('');
  const [tokenAmount, setTokenAmount] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const BITS_CONTRACT_ADDRESS = "0xfEc060d0CF069ce6b1518445dB538058e9eE063d";
  
  const BITS_ABI = [
    {
      "inputs": [
        {"internalType": "address", "name": "to", "type": "address"},
        {"internalType": "uint256", "name": "amount", "type": "uint256"}
      ],
      "name": "transfer",
      "outputs": [{"internalType": "bool", "name": "", "type": "bool"}],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [{"internalType": "address", "name": "account", "type": "address"}],
      "name": "balanceOf",
      "outputs": [{"internalType": "uint256", "name": "", "type": "uint256"}],
      "stateMutability": "view",
      "type": "function"
    }
  ];

  const validateAddress = (address) => {
    try {
      return ethers.utils.isAddress(address);
    } catch {
      return false;
    }
  };

  const handleSendTokens = async () => {
    if (!isConnected || !account) {
      setError('Please connect your wallet first');
      return;
    }

    if (!recipientAddress.trim()) {
      setError('Please enter a recipient address');
      return;
    }

    if (!validateAddress(recipientAddress)) {
      setError('Please enter a valid wallet address');
      return;
    }

    if (!tokenAmount || parseFloat(tokenAmount) <= 0) {
      setError('Please enter a valid token amount');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      setSuccess(null);

      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      
      const contract = new ethers.Contract(
        BITS_CONTRACT_ADDRESS,
        BITS_ABI,
        signer
      );

      const balance = await contract.balanceOf(account);
      const balanceFormatted = parseFloat(ethers.utils.formatUnits(balance, 18));
      const amountToSend = parseFloat(tokenAmount);

      if (amountToSend > balanceFormatted) {
        setError(`Insufficient balance. You have ${balanceFormatted.toFixed(2)} BITS`);
        return;
      }

      const amountWei = ethers.utils.parseUnits(tokenAmount, 18);
      const tx = await contract.transfer(recipientAddress, amountWei);
      
      setSuccess('Transaction sent! Waiting for confirmation...');
      
      const receipt = await tx.wait();
      
      if (receipt.status === 1) {
        setSuccess(`Successfully sent ${tokenAmount} BITS to ${recipientAddress.slice(0, 6)}...${recipientAddress.slice(-4)}`);
        setRecipientAddress('');
        setTokenAmount('');
      } else {
        setError('Transaction failed');
      }

    } catch (err) {
      console.error('Send tokens error:', err);
      
      let errorMessage = 'Failed to send tokens';
      if (err.code === 4001) {
        errorMessage = 'Transaction rejected by user';
      } else if (err.message.includes('insufficient funds')) {
        errorMessage = 'Insufficient ETH for gas fees';
      } else if (err.message.includes('gas')) {
        errorMessage = 'Gas estimation failed';
      }
      
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const clearMessages = () => {
    setError(null);
    setSuccess(null);
  };

  return (
    <motion.div 
      variants={cardVariants}
      className="bg-white/70 backdrop-blur-xl rounded-2xl p-6 shadow-lg border border-gray-200/50 hover:shadow-xl transition-all duration-500 w-full"
      whileHover={{ y: -3 }}
    >
      <div className="flex items-center space-x-3 mb-6">
        <div className="p-2 bg-gradient-to-r from-purple-100 to-pink-100 rounded-xl">
          <Send className="w-5 h-5 text-gray-700" />
        </div>
        <h3 className="text-lg font-semibold text-gray-800">Send Tokens</h3>
      </div>
      
      {!isConnected ? (
        <motion.div 
          className="text-center py-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <p className="text-gray-500">Connect your wallet to send tokens</p>
        </motion.div>
      ) : (
        <motion.div 
          className="space-y-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Wallet Address</label>
            <motion.input
              type="text"
              placeholder="Enter recipient wallet address"
              value={recipientAddress}
              onChange={(e) => {
                setRecipientAddress(e.target.value);
                clearMessages();
              }}
              className="w-full p-3 bg-gray-50/50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-transparent transition-all duration-300"
              disabled={loading}
              whileFocus={{ scale: 1.01 }}
            />
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">No. of Tokens</label>
            <motion.input
              type="number"
              placeholder="Enter number of tokens"
              value={tokenAmount}
              onChange={(e) => {
                setTokenAmount(e.target.value);
                clearMessages();
              }}
              className="w-full p-3 bg-gray-50/50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-transparent transition-all duration-300"
              disabled={loading}
              step="0.01"
              min="0"
              whileFocus={{ scale: 1.01 }}
            />
          </div>

          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -10, scale: 0.9 }}
                className="bg-red-50/80 backdrop-blur-sm border border-red-200 rounded-xl p-3"
              >
                <p className="text-red-600 text-sm">{error}</p>
              </motion.div>
            )}

            {success && (
              <motion.div
                initial={{ opacity: 0, y: -10, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -10, scale: 0.9 }}
                className="bg-green-50/80 backdrop-blur-sm border border-green-200 rounded-xl p-3"
              >
                <p className="text-green-600 text-sm">{success}</p>
              </motion.div>
            )}
          </AnimatePresence>

          <motion.button 
            onClick={handleSendTokens}
            disabled={loading || !recipientAddress || !tokenAmount}
            className="w-full bg-gray-900 hover:bg-gray-800 disabled:bg-gray-400 text-white font-semibold py-3 px-4 rounded-xl transition-all duration-300 flex items-center justify-center gap-2 shadow-lg hover:shadow-xl group"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            {loading ? (
              <>
                <motion.div
                  className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                />
                Processing...
              </>
            ) : (
              <>
                <Send className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                SEND
              </>
            )}
          </motion.button>
        </motion.div>
      )}
    </motion.div>
  );
};

const ImagePlaceholder = () => {
  return (
    <motion.div 
      className="w-full flex justify-center items-center py-8"
      variants={cardVariants}
    >
      <motion.img
        src="/dashboardimage.svg"
        alt="Dashboard illustration"
        className="h-[180px] object-contain"
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

const Dashboard = () => {
  return (
    <div className="w-full min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 relative overflow-hidden pt-20">
      {/* Floating Background Elements */}
      <DashboardBackground />

      <div className="relative z-10">
        <motion.div 
          className="flex flex-col lg:flex-row gap-6 p-6"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <div className="w-full lg:w-[70%] flex flex-col gap-6">
            <div className="flex flex-col sm:flex-row gap-6">
              <AdminBalance />
              <TotalTransactions />
            </div>
            <CoinFlow />
          </div>
          <div className="w-full lg:w-[30%] flex flex-col gap-6">
            <ImagePlaceholder />
            <SendTokens />
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Dashboard;