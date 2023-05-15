import { motion } from 'framer-motion';
import React from 'react';
import { slidIn } from '../animations';


const Cart = () => {
  return <motion.div 
   {...slidIn}
   className='fixed z-50 top-0 right-0 w300 md:w-508 bg-lightOverlay backdrop-blur-md shadow-md h-full'
    >

  </motion.div>
};

export default Cart;