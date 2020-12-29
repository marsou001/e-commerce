import React from 'react';
import { Button, Typography } from '@material-ui/core';
import { commerce } from '../../../lib/commerce';

function ReactPaypal({ checkoutToken, shippingData, amount, nextStep, backStep, onPaypalCaptureCheckout, onSetErrorMessage, onSetOrder }) {    
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
            renderPaypalButton(orderDetails, paypalAuth);
        } catch (e) {            
            console.log(e)
        }               
    } 

    const renderPaypalButton = (orderData, paypalAuth) => {
        console.log(window.paypal);
        try {
            window.paypal.Buttons({
                env: 'sandbox',
                commit: true,
                createOrder: (data, actions) => {
                    return actions.order.create({
                        intent: "CAPTURE",
                        purchase_units: [
                            {
                                description: "Your description",
                                amount: {
                                    currency_code: "USD",
                                    value: amount,
                                },
                            },
                        ],
                    });
                },                                
                onCancel: function(data, actions) {
                    console.log('oops')                    
                },
                onApprove: async (data, actions) => {                    
                    const order = await actions.order.capture();                    
                    captureOrder(orderData, order, paypalAuth)                   
                },
                onError: (err) => {                  
                    console.error(err);
                },
            }).render('#paypal-button');
        } catch (e) {
            console.log(e)
        }
    }        

    const captureOrder = async (orderDetails, data, auth) => {
        try {            
            const order = await commerce.checkout.capture(checkoutToken.id, {
                ...orderDetails,
                payment: {
                    gateway: 'paypal',
                    paypal: {
                        action: 'capture',                        
                        payment_id: auth.payment_id,
                        payer_id: data.payer.payer_id
                    }
                }
            })            
            onSetOrder(orderDetails);
        } catch (e) {
            onSetErrorMessage(e.data.error.message);
            console.log(e);
        }        nextStep();
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
            <br />
            <form onSubmit={handleSubmit}>
                <Button variant='contained' color='primary' type='submit'>Pay {amount}</Button>
            </form>
            <br />
            <div id='paypal-button' />
        </>        
    )
}

export default ReactPaypal;
