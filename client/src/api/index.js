import axios from "axios";


export const baseURL = 
"http://127.0.0.1:5001/fullstack-food-app-e054e/us-central1/app";

export const validateUserJWTToken = async (token) => {
    try {
        const res = await axios.get(`${baseURL}/api/users/jwtVerification`, {
            headers:{Authorization: "Bearer " + token},
        })
        return res.data.data;
    } catch (err) {
        return null;
    }

};

// add new product 

export const addnewProduct = async (data) => {
    try {
        const res = await axios.post(`${baseURL}/api/products/create`,{...data});
        return res.data.data;
    } catch (error) {
        return null;
    }    
};

// get all products 

export const getAllProducts = async () => {
    try {
        const res = await axios.get(`${baseURL}/api/products/all`);
        return res.data.data;
    } catch (error) {
        return null;
    }    
};

// delete a product
export const deleteAProduct = async (productId) => {
    try {
        const res = await axios.delete(`${baseURL}/api/products/delete/${productId}`);
        return res.data.data;
    } catch (error) {
        return null;
    }    
};

//get all users
export const getAllUsers = async () => {
    try {
        const res = await axios.get(`${baseURL}/api/users/all`);
        return res.data.data;
    } catch (error) {
        return null
    }
};

// add an item to cart
export const addNewItemToCart = async (user_id, data) => {
    try {
        const res = await axios.post(
         `${baseURL}/api/products/addToCart/${user_id}`,
         {...data}
        );
        return res.data.data;
    } catch (error) {
        return null;
    }    
};

//get all Items
export const getAllCartItems = async(user_id) => {
    try {
        const res = await axios.get(
            `${baseURL}/api/products/getCartItems/${user_id}`
            );
        return res.data.data;
    } catch (error) {
        return null
    }
};