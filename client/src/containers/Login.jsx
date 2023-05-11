import React, { useEffect, useState } from 'react';
import { LoginBg, Logo } from '../assets';
import { LoginInput } from '../components';
import {FaEnvelope, FaLock, FcGoogle} from "../assets/icons";
import {motion} from "framer-motion";
import { buttonClick } from '../animations';
import {useNavigate} from 'react-router-dom';

import {
getAuth, 
signInWithPopup, 
GoogleAuthProvider, 
createUserWithEmailAndPassword, 
signInWithEmailAndPassword
} from 'firebase/auth';
import {app} from '../config/firebase.config';
import { validateUserJWTToken } from '../api';
import { setUserDetails } from '../context/actions/userActions';
import { useDispatch, useSelector } from 'react-redux';

const Login =()=> {

  const [userEmail, setuserEmail] = useState("");
  const [isSignUp, setisSignUp] = useState(false);
  const [password, setPassword] = useState("");
  const [confirm_password, setconfirm_password] = useState("");

  const firebaseAuth = getAuth(app);
  const provider = new GoogleAuthProvider();

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const user = useSelector((state) => state.user);

  useEffect(() => {
    if(user){
      navigate("/", {replace: true});
    }
  
  }, [user]);
  

  const logingWithGoogle = async ()=>{
    // console.log("clicked");
    await signInWithPopup(firebaseAuth, provider).then(userCred => {
      firebaseAuth.onAuthStateChanged((cred)=>{
        // console.log(cred);
        if(cred){
          cred.getIdToken().then(token => {
              // console.log(token);
              validateUserJWTToken(token).then(data => {
                // console.log(data);
                dispatch(setUserDetails(data));
              });
              navigate("/", {replace: true});
          });
        }
      });
    });
  };

    const signUpWithEmailPass = async () => {
    if(userEmail === ""|| password === "" || confirm_password === "") {
      // console.log('they are empty');
      //alert msg

    }else{
      if(password === confirm_password ){
        setuserEmail("");
        setPassword("");
        setconfirm_password("");
         await createUserWithEmailAndPassword(
          firebaseAuth, 
          userEmail, 
          password
          ).then(userCred => {
            // console.log(cred);
          firebaseAuth.onAuthStateChanged((cred)=>{
            if(cred){
              cred.getIdToken().then(token => {
                  // console.log(token);
                  validateUserJWTToken(token).then(data => {
                    // console.log(data);
                    dispatch(setUserDetails(data));
                  });
                  navigate("/", {replace: true});
              });
            }
          });
         });
        console.log("equal");
      }else{
         //alert msg
      }
    }
  };

  const signInWithEmailPass = async () =>{
    if((userEmail !== "" && password !=="")){
      await signInWithEmailAndPassword(firebaseAuth, userEmail, password).then(userCred => {
        firebaseAuth.onAuthStateChanged((cred)=>{
          if(cred){
            cred.getIdToken().then(token => {
                // console.log(token);
                validateUserJWTToken(token).then(data => {
                  // console.log(data);
                  dispatch(setUserDetails(data));
                });
                navigate("/", {replace: true});
            });
          }
        });
       });
    }else{
      //alert message 
    }

  };

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
        <p className='text-xl text-textColor -mt-6'>{isSignUp ? "Sign-Up" : "Sign-in"} with the following</p>

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

        {/* Button section */}
        {isSignUp ? (
        <motion.button
         {...buttonClick} 
          className='w-full px-4 py-2 rounded-md bg-red-400 cursor-pointer
           text-white text-xl capitalize hover:bg-red-500 transition-all duration-150'
          onClick={signUpWithEmailPass}
         >
          Sign Up
        </motion.button>
         ) : (
         <motion.button 
         {...buttonClick} 
          className='w-full px-4 py-2 rounded-md bg-red-400 cursor-pointer
           text-white text-xl capitalize hover:bg-red-500 transition-all duration-150'
           onClick={signInWithEmailPass}
        >
          Sign In
        </motion.button>
        )}
        </div>
          <div className='flex items-center justify-center gap-16'>
            <div className='w-24 h-[1px] rounded-md bg-white'></div> 
            <p className='text-white'>Or</p>
            <div className='w-24 h-[1px] rounded-md bg-white'></div> 
          </div>

          <motion.div {...buttonClick}
          className="flex items-center justify-center px-20 py-2 bg-lightOverlay backdrop-blur-md cursor-pointer rounded-3xl gap-4"
          onClick={logingWithGoogle}
          >
           <FcGoogle className='text-3xl'/>
           <p className='capitalize text-base text-headingColor'>
            Sign in With Google
            </p>

          </motion.div>
      </div>
    </div>  
  );
};

export default Login;