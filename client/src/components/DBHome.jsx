import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { getAllProducts } from '../api';
import { setAllProducts } from '../context/actions/productActions';

import {CChart} from '@coreui/react-chartjs';

const DBHome = () => {
  const products = useSelector((state) => state.products);
  const dispatch = useDispatch();

  const drinks = products?.filter(item => item.product_category === "drinks");
  const ssoup = products?.filter(item => item.product_category === "ssoup");
  const lunch = products?.filter(item => item.product_category === "lunch");
  const dinner = products?.filter(item => item.product_category === "dinner");
  const lbsides = products?.filter(item => item.product_category === "lbsides");
  const dsides = products?.filter(item => item.product_category === "dsides");
  const brunch = products?.filter(item => item.product_category === "brunch");
  
  useEffect(() => {
    if(!products){
      getAllProducts().then((data)=>{
        // console.log(data);
        dispatch(setAllProducts(data));
      });
    }
  }, []);
  
  return (
    <div className='flex items-center justify-center flex-col pt-6 w-full h-full'>
      <div className='grid w-full grid-cols-1 md:grid-cols-2 gap-4 h-full'>
        <div className='flex items-center justify-center'>
          <div className='w-340 md:w-508 '>
            <CChart
              type="bar"
              data={{
                labels: [
                  'Drinks/Deserts', 
                  'Soup/Salad', 
                  'Lunch', 
                  'Brunch', 
                  'Dinner', 
                  'L/Brunch-Sides', 
                  'Diner-Sides'],
                datasets: [
                  {
                    label: 'Category Counts',
                    backgroundColor: '#f87979',
                    data: [
                      drinks?.length,
                      ssoup?.length,
                      lunch?.length,
                      brunch?.length,
                      dinner?.length,
                      lbsides?.length,
                      dsides?.length,
                    ],
                  },
                ],
              }}
              labels="months"
            />
          </div>
        </div>
        <div className='w-full h-full flex items-center justify-center'>
          <div className='w-275 md:w-460'>
            <CChart
              type="doughnut"
              data={{
                labels: [
                  'Orders', 
                  'Delivered', 
                  'Cancelled', 
                  'Paid',
                  'Not Paid'
                ],
                datasets: [
                  {
                    backgroundColor: [
                      '#51FF00', 
                      '#00B6FF', 
                      '#008BFF', 
                      '#FFD100',
                      'FF00FB'
                    ],
                    data: [40, 20, 80, 34,56],
                  },
                ],
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default DBHome;