import React, { useState } from 'react';
import { LoginBg, Logo } from '../assets';
import { LoginInput } from '../components';
import {FaEnvelope, FaLock} from "../assets/icons";
import {motion} from "framer-motion";
import { buttonClick } from '../animations';

const Login =()=> {

  const [userEmail, setuserEmail] = useState("");
  const [isSignUp, setisSignUp] = useState(false);
  const [password, setPassword] = useState("");
  const [confirm_password, setconfirm_password] = useState("");

  return (
    <div className='w-screen h-screen relative overflow-hidden flex'>
    {/**Background image */}  
    <img src={LoginBg} className="w-full h-full object-cover absolute top-0 left-0" 
    alt=''/>

    {/* content box */}
    <div className='flex flex-col items-center bg-lightOverlay w-[80%] md:w-508 h-full z-10 backdrop-blur-md p-4 px-4 py-12 gap-6'>
    {/* Top Logo Section */}
      <div className='flex items-center justify-start gap-4 w-full'>
        <img src={Logo} className='w-8'
        alt=''/>
        <p className='text-headingColor font-semiboldbold text-2xl'>City</p>
      </div>
      {/* Welcome Text */}
      <p className='text-headingColor font-semiboldbold text-3xl'>Welcome Back</p>
      <p className='text-xl text-textColor -mt-6'>Sign in with the following</p>

      {/* Input Section */}
      <div className='w-full flex flex-col items-center justify-center gap-6 px-4 md:px-12 py-4'>
        <LoginInput 
        placeholder={"Email here"} 
        icon={<FaEnvelope className='text-xl text-textColor '/>}
        inputState={userEmail} 
        inputStateFunc={setuserEmail} 
        type="email" 
        isSignUp={isSignUp}/>

        <LoginInput  
        placeholder={"Password here"} 
        icon={<FaLock className='text-xl text-textColor '/>}
        inputState={password} 
        inputStateFunc={setPassword} 
        type="password" 
        isSignUp={isSignUp}/>

       {isSignUp && (
         <LoginInput  
         placeholder={"Confirm Password here"} 
         icon={<FaLock className='text-xl text-textColor '/>}
         inputState={confirm_password} 
         inputStateFunc={setconfirm_password} 
         type="password" 
         isSignUp={isSignUp}/>
       )}

      {!isSignUp ? (
      <p>
        Dont have an account: {""}
        <motion.button 
        {...buttonClick} 
        className='text-red-600 underline cursor-pointer bg-transparent'
        onClick={()=>setisSignUp(true)}
        >
          Create One
        </motion.button>
       </p>
       ):( 
        <p>
        Already have an account: {""}
        <motion.button 
        {...buttonClick} 
        className='text-red-600 underline cursor-pointer bg-transparent'
        onClick={()=>setisSignUp(false)}
        >
          Sign-in here
        </motion.button>
       </p>
       )}
      </div>
    </div>


    </div>
  );
};

export default Login;