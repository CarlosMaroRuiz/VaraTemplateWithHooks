import React from 'react';

import { motion } from 'framer-motion';

const HomePage = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.5, staggerChildren: 0.2 } },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-lime-400 to-green-500">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          className="pt-24 pb-16 text-center"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.h1
            className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-4 text-white"
            variants={itemVariants}
          >
            Bienvenido a la plantilla de Monogatari
          </motion.h1>
          <motion.p
            className="text-xl sm:text-2xl text-white mb-8"
            variants={itemVariants}
          >
            Desarrolla DApps con React.js y Sails.rs
          </motion.p>
          <motion.div variants={itemVariants}>
            <a
              href='https://vara-template-with-hooks-docs-8u1sl9ktr.vercel.app'
              className="bg-white hover:bg-lime-100 text-lime-600 font-semibold py-3 px-8 rounded-lg shadow-md transition duration-300 ease-in-out inline-block"
            >
              Comenzar ahora
            </a>
          </motion.div>
        </motion.div>

        <motion.div
          className="pt-16 pb-24"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.h2
            className="text-3xl font-bold mb-12 text-center text-white"
            variants={itemVariants}
          >
            Características principales
          </motion.h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            <motion.div
              className="bg-white p-8 rounded-lg shadow-lg"
              variants={itemVariants}
              whileHover={{ scale: 1.05 }}
            >
              <h3 className="text-xl font-semibold mb-4 text-lime-600">Contratos inteligentes</h3>
              <p className="text-gray-600">
                Desarrolla e implementa contratos inteligentes de alto nivel en la red Vara con nuestros hooks y template.
              </p>
            </motion.div>
            <motion.div
              className="bg-white p-8 rounded-lg shadow-lg"
              variants={itemVariants}
              whileHover={{ scale: 1.05 }}
            >
              <h3 className="text-xl font-semibold mb-4 text-lime-600">Gestión de wallet</h3>
              <p className="text-gray-600">
                Gestiona wallets, transacciones y estados con nuestros hooks React personalizados para la red Vara.
              </p>
            </motion.div>
            <motion.div
              className="bg-white p-8 rounded-lg shadow-lg"
              variants={itemVariants}
              whileHover={{ scale: 1.05 }}
            >
              <h3 className="text-xl font-semibold mb-4 text-lime-600">Agiliza tu desarrollo</h3>
              <p className="text-gray-600">
                Acelera tu desarrollo de DApps utilizando nuestros hooks para interactuar con contratos realizados con Sails.rs.
              </p>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default HomePage;