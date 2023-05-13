import React, { useState } from 'react';
import {statuses} from '../utils/styles'
import {Spinner} from '../components';
import { FaCloudUploadAlt, MdDelete } from '../assets/icons';
import {deleteObject, getDownloadURL, getStorage, ref, uploadBytesResumable } from 'firebase/storage';
import { storage } from '../config/firebase.config';
import { useDispatch, useSelector } from 'react-redux';
import { alertDanger, alertNull, alertSuccess } from '../context/actions/alertAction';
import { buttonClick } from '../animations';
import { motion } from 'framer-motion';
import { addnewProduct,getAllProducts } from '../api';
import {setAllProducts} from '../context/actions/productActions'


const DBNewItem = () => {
  const [itemName, setItemName] = useState("");
  const [category, setCategory] = useState(null);
  const [price, setPrice] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [progress, setProgress] = useState(null);
  const [imageDownloadURL, setimageDownloadURL] = useState(null);
  
  const alert = useSelector((state) => state.alert);
  const dispatch = useDispatch();


  const uploadImage = (e) =>{
    setIsLoading(true);
    const imageFile = e.target.files[0];
    //  console.log(storage);
    const storageRef = ref(storage, `Images/${Date.now()}_${imageFile.name}`);
    // console.log(storageRef);
    const uploadTask = uploadBytesResumable(storageRef, imageFile);
    // console.log(uploadTask);
    uploadTask.on(
      'state_changed', 
      (snapshot) => {
        setProgress((snapshot.bytesTransferred / snapshot.totalBytes) * 100 );
      }, 
      (error) => {
        console.log(error);
        dispatch(alertDanger(`Error: ${error}`));
        setTimeout(() => {
          dispatch(alertNull());
        }, 3000);
      }, 
      () =>{
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          // console.log('File available at', downloadURL);
          setimageDownloadURL(downloadURL);
          setIsLoading(false);
          setProgress(null);

          dispatch(alertSuccess("Image uploaded to the cloud"));
          setTimeout(() => {
            dispatch(alertNull());
          }, 3000);
        });
      });
  };

  const deleteImageFromFirebase = () => {
    // console.log("Image deleted")
    setIsLoading(true);
    const deleteRef = ref(storage, imageDownloadURL);

    deleteObject(deleteRef).then(() => {
      setimageDownloadURL(null);
      setIsLoading(false);

      dispatch(alertSuccess("Image deleted from the cloud"));
          setTimeout(() => {
            dispatch(alertNull());
          }, 3000);
    });
  };

  const submitNewData = () =>{
    const data = {
      product_name: itemName,
      product_category: category,
      product_price: price,
      imageURL: imageDownloadURL,
    };
    // console.log(data);
    //add data
    addnewProduct(data).then(res =>{
      console.log(res);
      dispatch(alertSuccess("New Item added"));
      setTimeout(() => {
        dispatch(alertNull());
      }, 3000);
      setimageDownloadURL(null);
      setItemName("");
      setPrice("");
      setCategory(null); 
    });
    // get all products
    getAllProducts().then((data) => {
      dispatch(setAllProducts(data));
    });

  };

  return (
    <div className='flex items-center justify-center flex-col pt-6 px-24 w-full'>
      <div className='border border-gray-300 rounded-md p-4 w-full flex items-center justify-center flex-col gap-4'>
        <InputValueField
          type="text" 
          placeHolder={"Item Name here"}
          stateFunc={setItemName}
          stateValue={itemName}
        />

        <div className='w-full flex items-center justify-around gap-3 flex-wrap'>
          {statuses && statuses?.map(data => (
            <p 
              key={data.id} 
              onClick={() => setCategory(data.category)}
              className={`
              px-4 py-2 rounded-md text-xl text-textColor 
              font-semibold cursor-pointer hover:shadow-md border
               border-gray-200 backdrop-blur-md ${data.category === category ? `bg-red-400 text-primary` : `bg-transparent`}
            `}>{data.title}</p>
          ))}
        </div>

        <InputValueField
          type="number" 
          placeHolder={"Item price here"}
          stateFunc={setPrice}
          stateValue={price}
        />

        <div className='w-full bg-card backdrop-blur-md h-370 
        rounded-md border-2 border-dotted border-gray-300 cursor-pointer'>
          {isLoading ? <div className='w-full h-full flex flex-col items-center justify-evenly px-24'>
            <Spinner/> 
            {Math.round(progress >0) && (
              <div className='w-full flex flex-col items-center justify-center gap-2'>
                <div className='w-full flex justify-between'>
                  <span className='text-base font-medium text-textColor'>
                    Progress
                  </span>
                  <span className='text-sm font-medium text-textColor'>
                   {Math.round(progress) > 0 && (
                    <>{`${Math.round(progress)}%`}</>
                    )}
                  </span>
                </div>  

                <div className='w-full rounded-full bg-gray-200 h-2.5'>
                  <div
                   className='bg-red-600 rounded-full h-2.5 transition-all duration-300 ease-in-out'
                   style={{
                     width: `${Math.round(progress)}%`,
                   }}
                  ></div>
                </div>              
              </div>
            )}
          </div> : <>
          {!imageDownloadURL ? <>
              <label>
                <div className='flex flex-col items-center justify-center h-full w-full cursor-pointer'>
                 <div className='flex flex-col items-center justify-center cursor-pointer'>
                    <p className='text-4xl font-bold'>
                      <FaCloudUploadAlt className='rotate-0'/>
                    </p>
                    <p className='text-lg text-textColor'>
                        Click to upload an image
                    </p>
                  </div>
                </div>
                <input
                  type="file" 
                  name="upload-image"
                  accept='image/*'
                  onChange={uploadImage}
                  className='h-0 w-0'
                />
              </label>
            </>
               : <>
                    <div className="relative w-full h-full overflow-hidden rounded-md">
                      <motion.img
                      //  {...imageWhileHover}
                      whileHover={{scale: 1.15}}
                       src={imageDownloadURL}
                       className="w-full h-full object-cover"
                      />
                      <motion.button 
                       {...buttonClick}
                       type="button"
                       className="absolute top-3 right-3 p-3 rounded-full bg-red-500 text-xl cursor-pointer outline-none hover:shadow-md duration-500 transition-all ease-in-out"
                       onClick={() => deleteImageFromFirebase
                        (imageDownloadURL)}
                      >
                       <MdDelete className='-rotate-0'/>
                      </motion.button>
                    </div>
                 </>}
          </>}
        </div>

        <motion.button 
         onClick={submitNewData}
         {...buttonClick}
         className='w-9/12 py-2 rounded-md bg-red-400 text-primary hover:bg-red-500 cursor-pointer'
         >
          Save
        </motion.button>
      </div>     
    </div>
  );
};

export const InputValueField = ({
  type, 
  placeHolder, 
  stateValue, 
  stateFunc
  }) => {
    return (<><input 
    type={type} 
    placeholder={placeHolder}
    className='w-full px-4 py-2 bg-lightOverlay shadow-md outline-none rounded-md border border-gray-200 focus:border-red-400'
    value={stateValue}
    onChange={(e) => stateFunc(e.target.value)}
    
    /></>);
};

export default DBNewItem;