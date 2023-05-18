const router = require('express').Router();
const admin = require('firebase-admin');
const db = admin.firestore();
db.settings({ignoreUndefinedProperties: true});

const stripe = require('stripe')(process.env.STRIP_KEY)

const express = require('express');
const { json } = require('express');

router.post("/create", async (req, res) => {
    try {
        const id = Date.now();
        const data = {
            productId:id,
            product_name: req.body.product_name,
            product_category: req.body.product_category,
            product_price: req.body.product_price,
            imageURL: req.body.imageURL,
          };
          const response = await db.collection("products").doc(`/${id}/`).set(data);
          console.log(response);
          return res.status(200).send({success: true, data: response});
    } catch (err) {
        return res.send({success: false, msg: `Error: ${err}` });
    }
});

// get all products
router.get("/all", async(req, res) => {
    (async()=>{
        try {
            let query = db.collection("products");
            let response =[];
            await query.get().then((querysnap) => {
                let docs = querysnap.docs;
                docs.map((doc) =>{
                    response.push({...doc.data()});
                });
                return response;
            });
            return res.status(200).send({success: true, data: response});
        } catch (err) {
            // console.log(err);
            return res.send({success: false, msg: `Error: ${err}` });
        }
    })();
});

// delete a product
router.delete("/delete/:productId", async(req, res) => {
    const productId = req.params.productId;

    try {
        await db.collection("products").doc(`/${productId}/`).delete().then((result) => {
            return res.status(200).send({success: true, data: result});
        });
    } catch (err) {
        return res.send({success: false, msg: `Error: ${err}`});
    }

});

//create a new cart
router.post("/addToCart/:userId", async (req, res) => {
    const userId = req.params.userId;
    const productId = req.body.productId;

    try {
        const doc = await db 
         .collection("cartItems")
         .doc(`/${userId}/`)
         .collection("items")
         .doc(`/${productId}/`)
         .get();

         if(doc.data()){
            const quantity = doc.data().quantity + 1;
            const updateItem = await db
            .collection("cartItems")
            .doc(`/${userId}/`)
            .collection("items")
            .doc(`/${productId}/`)
            .update({quantity});

            return res.status(200).send({success: true, data: updateItem});
         }else{
            const data = {
                productId:productId,
                product_name: req.body.product_name,
                product_category: req.body.product_category,
                product_price: req.body.product_price,
                imageURL: req.body.imageURL,
                quantity: 1,
            };
            const addItems = await db
            .collection("cartItems")
            .doc(`/${userId}/`)
            .collection("items")
            .doc(`/${productId}/`)
            .set(data);

            return res.status(200).send({success: true, data: addItems});
         }
    } catch (err) {
        return res.send({success: false, msg: `Error: ${err}`});
    }
});

// update cart increase and decrease quantity
router.post("/updateCart/:user_id", async (req, res) => {
    const userId = req.params.user_id;
    const productId = req.query.productId;
    const type = req.query.type;

    try {
        const doc = await db 
         .collection("cartItems")
         .doc(`/${userId}/`)
         .collection("items")
         .doc(`/${productId}/`)
         .get();
         
         if(doc.data()){
            if(type === "increment"){
                // increment
                const quantity = doc.data().quantity + 1;
                const updateItem = await db
                .collection("cartItems")
                .doc(`/${userId}/`)
                .collection("items")
                .doc(`/${productId}/`)
                .update({quantity});

                return res.status(200).send({success: true, data: updateItem});
            }else{
                // delete / decrement
                if(doc.data().quantity === 1){
                    await db
                    .collection("cartItems")
                    .doc(`/${userId}/`)
                    .collection("items")
                    .doc(`/${productId}/`)
                    .delete()
                    .then((result) => {
                        return res.status(200).send({success: true, data: result});
                    });
                }else{
                    const quantity = doc.data().quantity - 1;
                    const updateItem = await db
                    .collection("cartItems")
                    .doc(`/${userId}/`)
                    .collection("items")
                    .doc(`/${productId}/`)
                    .update({quantity});

                    return res.status(200).send({success: true, data: updateItem});
                }
            }
         }
    } catch (err) {
        return res.send({success: false, msg: `Error: ${err}`});
    }
});

// get all the cart item for a user
router.get("/getCartItems/:user_id", async (req, res) => {
    const userId = req.params.user_id;
    (async () => {
        try {
            let query = db
             .collection("cartItems")
             .doc(`/${userId}/`)
             .collection("items");

             let response = [];

             await query.get().then((querysnap) => {
                let docs = querysnap.docs;

                docs.map((doc) => {
                    response.push({...doc.data()});
                });
                return response;
             });
             return res.status(200).send({success: true, data: response});
        } catch (err) {
            return res.send({success: false, msg: `Error: ${err}`});
        }
    })();
});

// strip config
router.post('/create-checkout-session', async (req, res) => {
    const customer = await stripe.customers.create({
        metadata :{
            user_id: req.body.data.user.user_id,
            cart: JSON.stringify(req.body.data.cart),
            total:req.body.data.total,
        },
    });

    const line_items = req.body.data.cart.map((item) => {
        return {
            price_data: {
                currency: "usd",
                product_data: {
                  name: item.product_name,
                  images: [item.imageURL],
                  metadata: {
                    id: item.productId,
                  },
                },
                unit_amount: item.product_price * 100,
              },
            quantity: item.quantity,
        }
    });

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      shipping_address_collection: {allowed_countries: ["US"]},
      shipping_options: [
        {
        shipping_rate_data: {
            type: 'fixed_amount',
            fixed_amount: {amount: 0, currency: 'usd'},
            display_name: 'Free shipping',
            delivery_estimate: {
              minimum: {unit: 'hour',value: 1},
              maximum: {unit: 'hour',value: 2},
            },
          },
      },
     ],
      phone_number_collection:{
        enabled:true,
      },
      line_items,
      customer: customer.id,
      mode: 'payment',
      success_url: `${process.env.CLIENT_URL}/checkout-success`,
      cancel_url: `${process.env.CLIENT_URL}/`,
    });
  
    res.send({url: session.url});
  });

  let endpointSecret;
//   const endpointSecret = process.env.WEBHOOK_SECRET;

  router.post(
    "/webhook", 
    express.raw({type: "application/json"}), 
    (req, res) => {
    const sig = req.headers["stripe-signature"];
  
    let eventType;
    let data;
  
    if(endpointSecret){
        let event;
        try {
            event = stripe.webhooks.constructEvent(request.body, sig, endpointSecret);
            } catch (err) {
            res.status(400).send(`Webhook Error: ${err.message}`);
            return;
            }
        data = event.data.object;
        eventType = event.type;
    }else{
        data = req.body.data.object;
        eventType = req.body.type;
    }

    // Handle the event
    if(eventType === "checkout.session.completed"){
        // console.log(data);
        stripe.customers.retrieve(data.customer).then(customer => {
            console.log("customer details :" +customer);
            console.log("Data :" +data);
            createOrder(customer, data, res);
        });
    }

    response.send().end();
  }
  );


  const createOrder = async (customer, intent, res)=>{
    console.log("inside the orders")
    try {
        const orderId = Date.now();
        const data = {
            intentId: intent.id,
            orderId: orderId,
            amount: intent.amount_total,
            created: intent.created,
            payment_method_types: intent.payment_method_types,
            status: intent.payment_status,
            customer: intent.customer_details,
            shipping_details: intent.shipping_details,
            userId: customer.metadata.user_id,
            items: JSON.parse(customer.metadata.cart),
            total: customer.metadata.total,
            sts: "preparing",
        };
        await db.collection("orders").doc(`/${orderId}/`).set(data);

        deleteCart(customer.metadata.user_id, JSON.parse(customer.metadata.cart));
        console.log("*********************");
        return res.status(200).send({success:true});
    } catch (err) {
        console.log(err);
    }
  };

  const deleteCart = (userId, items) => {
    console.log("inside the orders")
    console.log(userId);

    console.log("************************")
    items.map(async (data) => {
        console.log("------------inside------------");
        await db
        .collection("cartItems")
        .doc(`/${userId}/`)
        .collection("items")
        .doc(`/${data.productId}/`)
        .delete()
        .then(() => {console.log("----------success---------")});
    });
  }

module.exports = router;