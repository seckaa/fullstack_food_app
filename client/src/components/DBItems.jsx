import React from 'react';
import {DataTable} from '../components';
// import {HiCurrencyRupee} from '../assets/icons';
import { useDispatch, useSelector } from 'react-redux';
import { deleteAProduct, getAllProducts } from '../api';
import { setAllProducts } from '../context/actions/productActions';
import { alertNull, alertSuccess } from '../context/actions/alertAction';


const DBItems = () => {
const products = useSelector((state) => state.products);
const dispatch = useDispatch();

  return (
    <div className='flex items-center justify-center gap-4 pt-6 w-full'>
      <DataTable 
      columns={[
        {
          title: "Image" , 
          field:"imageURL", render: (rowData) => (
          <img
            className='w-36 h-16 object-contain rounded-md'
            src={rowData.imageURL} alt=''
          />
        ),},
        { 
          title: 'Name', 
          field: 'product_name' 
        },
        { 
          title: 'Category', 
          field: 'product_category' 
        },
        { 
          title: 'Price', 
          field: 'product_price',
          // render: (rowData) => (
          //   <p className='text-2xl font-semibold text-textColor'>
          //     <HiCurrencyRupee className='text-red-400' />{""}
          //     {parseFloat(rowData.product_price).toFixed(2)}
          //   </p>
          render: (rowData) => (
            <p className='text-xl font-semibold text-textColor flex items-center justify-center gap-2'>
              <span className='text-red-400'>$</span>
              {parseFloat(rowData.product_price).toFixed(2)}
            </p>
          ),
        },
      ]}
      data={products}
      title= "List of Products"
      actions={[
        {
          icon: "edit",
          tooltip: "Edit data",
          onClick: (event, rowData) => {
            alert("You want to edit "+rowData.productId);
          },
        },
        {
          icon: "delete",
          tooltip: "Delete data",
          onClick: (event, rowData) => {
            // alert("You want to delete "+rowData.productId);
            if(window.confirm(
              "Are you sure, You want to perform this action"
              )){
                deleteAProduct(rowData.productId).then((res) => {
                  dispatch(alertSuccess("Prodeuct delete"));
                  setInterval(() => {
                    dispatch(alertNull());
                  }, 3000);
                  getAllProducts().then((data) => {
                    dispatch(setAllProducts(data));
                  });
                });
              }
          },
        },
      ]}
      />      
    </div>
  );
};

export default DBItems;


// render: (rowData) => (
//   <p className='text-2xl font-semibold text-textColor'>
//     {/* <HiCurrencyRupee className='text-red-400' />{""} */}
//     <span className='text-red-400'>$</span>{""}
//     {parseFloat(rowData.product_price).toFixed(2)}
//   </p>
// ),