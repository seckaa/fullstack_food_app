export const setCartItem = (items) =>{
    return {
        type: "SET_CART_ITEMS", 
        items : items,
    };
};

export const getCartItem = () =>{
    return {
        type: "GET_CART_ITEMS", 
    };
};

export const clearCartItem = () =>{
    return {
        type: "CLEAR_CART_ITEMS", 
        items : null,
    };
};