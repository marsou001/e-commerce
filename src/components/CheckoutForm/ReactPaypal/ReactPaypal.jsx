import React, { useRef } from 'react';
import { Button, Typography } from '@material-ui/core';
import { commerce } from '../../../lib/commerce';

function ReactPaypal({ checkoutToken, shippingData, amount, nextStep, backStep, onPaypalCaptureCheckout, onSetErrorMessage, onSetOrder }) {    
    const paypalRef = useRef();    

    const getPaypalPaymentId = async (orderDetails) => {
        try {
            const paypalAuth = await commerce.checkout.capture(checkoutToken.id, {
                ...orderDetails,
                payment: {
                    gateway: 'paypal',
                    paypal: {
                        action: 'authorize'
                    }
                }
            });
            console.log(orderDetails)
            renderPaypalButton(orderDetails, paypalAuth);
            // renderPaypalButton(paypalAuth);
        } catch (e) {            
            console.log(e)
        }               
    } 

    const renderPaypalButton = (orderData, paypalAuth) => {
    // const renderPaypalButton = (paypalAuth) => {
        console.log(window.paypal);
        try {
            window.paypal.Buttons({
                env: 'sandbox',
                commit: true,
                // createOrder: (data, actions) => {
                //     return actions.order.create({
                //         intent: "CAPTURE",
                //         purchase_units: [
                //             {
                //                 description: "Your description",
                //                 amount: {
                //                     currency_code: "USD",
                //                     value: amount,
                //                 },
                //             },
                //         ],
                //     });
                // },     
                createOrder: (data, actions) => {
                    return paypalAuth.payment_id;
                },              
                onCancel: function(data, actions) {
                    console.log(data, 'background-color: #f00');
                    console.log(actions, 'background-color: #f00');
                },
                onApprove: async (data, actions) => {
                    // console.log(data, 'background-color: #0f0');
                    // console.log(actions, 'background-color: #0f0');
                    // const order = await actions.order.capture();
                    // console.log(order);
                    // captureOrder(orderData, data, paypalAuth.payment_id)                   
                    captureOrder(orderData, data)                   
                },
                onError: (err) => {                  
                    console.error(err);
                },
            }).render('#cont');
        } catch (e) {
            console.log(e)
        }
    }        

    const captureOrder = async (orderDetails, data) => {
    // const captureOrder = async (orderDetails, data, paymentId) => {
        try {
            // console.log(data, paymentId);
            // console.log(data.paymentID || paymentId)
            const order = await commerce.checkout.capture(checkoutToken.id, {
                ...orderDetails,
                payment: {
                    gateway: 'paypal',
                    paypal: {
                        action: 'capture',
                        // payment_id: paymentId,
                        payment_id: data.paymentId,
                        payer_id: data.payerID
                    }
                }
            })
            console.log(order);
            onSetOrder(orderDetails);
        } catch (e) {
            onSetErrorMessage(e.data.error.message);
            console.log(e);
        }
        console.log('step')
        nextStep();
    }

    const handleSubmit = (e) => {
        e.preventDefault();       

        const orderData = {
            line_items: checkoutToken.live.line_items,
            customer: {
                firstname: shippingData.firstName,
                lastname: shippingData.lastName,
                email: shippingData.email
            },
            shipping: {
                name: 'Primary',
                street: shippingData.address1,
                town_city: shippingData.city,
                county_state: shippingData.shippingSubdivision,
                postal_zip_code: shippingData.zip,
                country: shippingData.shippingCountry
            },
            fulfillment: {
                shipping_method: shippingData.shippingOption
            },                    
        }      

        getPaypalPaymentId(orderData);
    }
    
    return (
        <>
            <Typography variant='body2'>Pay with Paypal:</Typography>
            <form onSubmit={handleSubmit}>
                <Button variant='contained' color='primary' type='submit'>Pay {amount}</Button>
            </form>
            {/* <div ref={paypalRef} /> */}
            <div id='cont' />
        </>        
    )
}

export default ReactPaypal;
