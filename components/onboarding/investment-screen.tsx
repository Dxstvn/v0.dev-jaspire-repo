"use client"

import { motion } from "framer-motion"

export function InvestmentScreen() {
  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        when: "beforeChildren",
        staggerChildren: 0.2,
      },
    },
  }

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 },
  }

  // Animation for the flow diagram
  const flowAnimation = {
    hidden: { pathLength: 0, opacity: 0 },
    visible: {
      pathLength: 1,
      opacity: 1,
      transition: {
        duration: 2,
        ease: "easeInOut",
      },
    },
  }

  return (
    <div className="flex-1 flex flex-col items-center justify-center p-6">
      <motion.div variants={containerVariants} initial="hidden" animate="visible" className="w-full max-w-md">
        <motion.div variants={itemVariants} className="text-center mb-6">
          <h1 className="text-3xl font-bold mb-2">Invest Automatically</h1>
          <p className="text-gray-400 text-lg">Your cashback is automatically invested based on your preferences.</p>
        </motion.div>

        <motion.div variants={itemVariants} className="w-full mb-8">
          {/* Improved Investment flow illustration with SVG animation */}
          <div className="relative h-64 w-full">
            <svg viewBox="0 0 420 250" className="w-full h-full">
              {/* Background */}
              <rect x="0" y="0" width="420" height="250" fill="transparent" />

              {/* Cashback container */}
              <motion.rect
                x="20"
                y="20"
                width="80"
                height="80"
                rx="10"
                ry="10"
                fill="#1f2937"
                stroke="#10b981"
                strokeWidth="2"
                variants={itemVariants}
              />

              {/* Cashback icon */}
              <motion.g variants={itemVariants}>
                <circle cx="60" cy="45" r="15" fill="#065f46" />
                <path d="M60 35v20M55 40h10M55 50h10" stroke="#10b981" strokeWidth="2" strokeLinecap="round" />
              </motion.g>
              <text x="60" y="75" textAnchor="middle" fill="white" fontSize="12">
                Cashback
              </text>

              {/* Investment engine - Increased width to fit text properly */}
              <motion.rect
                x="150"
                y="20"
                width="120"
                height="80"
                rx="10"
                ry="10"
                fill="#1f2937"
                stroke="#10b981"
                strokeWidth="2"
                variants={itemVariants}
              />

              {/* Update the position of the engine icon to center in the wider box */}
              <motion.g variants={itemVariants}>
                <circle cx="210" cy="45" r="15" fill="#065f46" />
                <path d="M205 40v10M210 35v20M215 40v10" stroke="#10b981" strokeWidth="2" strokeLinecap="round" />
              </motion.g>
              <text x="210" y="75" textAnchor="middle" fill="white" fontSize="12">
                Investment Engine
              </text>

              {/* Update the position of the portfolio box */}
              <motion.rect
                x="170"
                y="150"
                width="80"
                height="60"
                rx="10"
                ry="10"
                fill="#1f2937"
                stroke="#10b981"
                strokeWidth="2"
                variants={itemVariants}
              />

              {/* Update the position of the portfolio icon */}
              <motion.g variants={itemVariants}>
                <circle cx="210" cy="170" r="15" fill="#065f46" />
                <path
                  d="M200 170h20M205 165v10M210 160v20M215 165v10"
                  stroke="#10b981"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </motion.g>
              <text x="210" y="195" textAnchor="middle" fill="white" fontSize="12">
                Your Portfolio
              </text>

              {/* Strategy container - Adjust position */}
              <motion.rect
                x="320"
                y="20"
                width="80"
                height="80"
                rx="10"
                ry="10"
                fill="#1f2937"
                stroke="#10b981"
                strokeWidth="2"
                variants={itemVariants}
              />

              {/* Strategy icon */}
              <motion.g variants={itemVariants}>
                <circle cx="360" cy="45" r="15" fill="#065f46" />
                <path
                  d="M355 45l5 5 10-10"
                  stroke="#10b981"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </motion.g>
              <text x="360" y="75" textAnchor="middle" fill="white" fontSize="12">
                Your Strategy
              </text>

              {/* Update the flow lines to match the new positions */}
              <motion.path
                d="M100 60 H 150"
                fill="transparent"
                stroke="#10b981"
                strokeWidth="2"
                strokeDasharray="0 1"
                variants={flowAnimation}
              />

              <motion.path
                d="M270 60 H 320"
                fill="transparent"
                stroke="#10b981"
                strokeWidth="2"
                strokeDasharray="0 1"
                variants={flowAnimation}
              />

              <motion.path
                d="M210 100 V 150"
                fill="transparent"
                stroke="#10b981"
                strokeWidth="2"
                strokeDasharray="0 1"
                variants={flowAnimation}
              />

              {/* Update the animated particles to match the new positions */}
              <motion.circle
                cx="0"
                cy="0"
                r="4"
                fill="#10b981"
                animate={{
                  cx: [100, 150],
                  cy: [60, 60],
                  opacity: [0, 1, 0],
                }}
                transition={{
                  duration: 2,
                  repeat: Number.POSITIVE_INFINITY,
                  delay: 1,
                }}
              />

              <motion.circle
                cx="0"
                cy="0"
                r="4"
                fill="#10b981"
                animate={{
                  cx: [270, 320],
                  cy: [60, 60],
                  opacity: [0, 1, 0],
                }}
                transition={{
                  duration: 2,
                  repeat: Number.POSITIVE_INFINITY,
                  delay: 1.5,
                }}
              />

              <motion.circle
                cx="0"
                cy="0"
                r="4"
                fill="#10b981"
                animate={{
                  cx: [210, 210],
                  cy: [100, 150],
                  opacity: [0, 1, 0],
                }}
                transition={{
                  duration: 2,
                  repeat: Number.POSITIVE_INFINITY,
                  delay: 2,
                }}
              />
            </svg>
          </div>
        </motion.div>

        <motion.div variants={containerVariants} className="space-y-4">
          <motion.div
            variants={itemVariants}
            className="bg-gradient-to-r from-gray-900 to-gray-800 p-4 rounded-lg flex items-start"
            whileHover={{ scale: 1.02 }}
            transition={{ type: "spring", stiffness: 400, damping: 10 }}
          >
            <div className="bg-green-900/30 p-2 rounded-full mr-4">
              <svg className="w-6 h-6 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
            </div>
            <div>
              <h3 className="font-medium">Automated Investing</h3>
              <p className="text-gray-400 text-sm">
                Your cashback is automatically invested based on your chosen investment style.
              </p>
            </div>
          </motion.div>

          <motion.div
            variants={itemVariants}
            className="bg-gradient-to-r from-gray-900 to-gray-800 p-4 rounded-lg flex items-start"
            whileHover={{ scale: 1.02 }}
            transition={{ type: "spring", stiffness: 400, damping: 10 }}
          >
            <div className="bg-green-900/30 p-2 rounded-full mr-4">
              <svg className="w-6 h-6 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"
                />
              </svg>
            </div>
            <div>
              <h3 className="font-medium">Customizable Strategies</h3>
              <p className="text-gray-400 text-sm">
                Choose from conservative, balanced, aggressive, or dividend-focused investment styles.
              </p>
            </div>
          </motion.div>

          <motion.div
            variants={itemVariants}
            className="bg-gradient-to-r from-gray-900 to-gray-800 p-4 rounded-lg flex items-start"
            whileHover={{ scale: 1.02 }}
            transition={{ type: "spring", stiffness: 400, damping: 10 }}
          >
            <div className="bg-green-900/30 p-2 rounded-full mr-4">
              <svg className="w-6 h-6 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                />
              </svg>
            </div>
            <div>
              <h3 className="font-medium">Diversified Portfolio</h3>
              <p className="text-gray-400 text-sm">
                Your investments are spread across multiple assets to reduce risk and maximize returns.
              </p>
            </div>
          </motion.div>
        </motion.div>
      </motion.div>
    </div>
  )
}
