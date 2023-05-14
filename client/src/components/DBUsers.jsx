import React from 'react';
import { useEffect } from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {setAllUserDetails} from '../context/actions/allUsersAction';
import {getAllUsers} from '../api'
import DataTable from './DataTable';
import { Avatar } from '../assets';

const DBUsers = () => {
  const allUsers = useSelector((state) => state.allUsers);
  const dispatch = useDispatch();

  // useEffect((allUsers, dispatch) => {
    useEffect(() => {
    if(!allUsers){
      getAllUsers().then((data) => {
        dispatch(setAllUserDetails(data));
      });
    }
  }, []);
  
  return (
    <div className='flex items-center justify-center gap-4 pt-6 w-full'>
    <DataTable 
    columns={[
      {
        title: "Image" , 
        field:"photoURL", render: (rowData) => (
        <img
          className='w-36 h-16 object-contain rounded-md'
          src={rowData.photoURL ? rowData.photoURL : Avatar } alt=''
        />
      ),},
      { 
        title: 'Name', 
        field: 'displayName' 
      },
      { 
        title: 'Email', 
        field: 'email',
      },
      { 
        title: 'Verified', 
        field: 'emailVerified',
        render: (rowData) => (
          <p 
            className={`px-2 py-1 w-32 text-center text-primary rounded-md ${
              rowData.emailVerified ? "bg-emerald-500" : "bg-red-500"
            }`}
          >
            {rowData.emailVerified ? "Verified" : "Not Verified"}
          </p>
        )
      },
    ]}
    data={allUsers}
    title= "List of Users"
    // actions={[
    //   {
    //     icon: "edit",
    //     tooltip: "Edit data",
    //     onClick: (event, rowData) => {
    //       alert("You want to edit "+rowData.uid);
    //     },
    //   },
    //   {
    //     icon: "delete",
    //     tooltip: "Delete data",
    //     onClick: (event, rowData) => {
    //       // alert("You want to delete "+rowData.productId);
    //       if(window.confirm(
    //         "Are you sure, You want to perform this action"
    //         )){
    //           deleteAProduct(rowData.uid).then((res) => {
    //             dispatch(alertSuccess("Prodeuct delete"));
    //             setInterval(() => {
    //               dispatch(alertNull());
    //             }, 3000);
    //             getAllProducts().then((data) => {
    //               dispatch(setAllProducts(data));
    //             });
    //           });
    //         }
    //     },
    //   },
    // ]}
    />      
  </div>
  );
};

export default DBUsers;

// 44