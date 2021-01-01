import React, { useContext } from 'react';
import { Context } from '../../../App';
import { Button, Typography } from '@material-ui/core';
import { commerce } from '../../../lib/commerce';

function ReactPaypal({ orderData, checkoutToken, amount, nextStep, backStep }) {        
    const { setOrder, setErrorMessage, refreshCart } = useContext(Context);
    
    const showPaypalButton = () => {         
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
                setErrorMessage(e.data.error.message);         
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
                setErrorMessage(e.data.error.message);
                console.log(e);
            }
        }        
    
        const captureOrder = async (orderDetails, data, auth) => {
            try {            
                await commerce.checkout.capture(checkoutToken.id, {
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
                setOrder(orderDetails); 
                refreshCart();               
            } catch (e) {
                setErrorMessage(e.data.error.message);
                console.log(e);
            }        
            nextStep();
        }
        getPaypalPaymentId(orderData);      
    }
    
    return (
        <>
            <Typography variant='body2'>Pay with Paypal:</Typography>
            <br />
            <div style={{display: 'flex', justifyContent: 'space-between'}}>
                <Button variant='outlined' onClick={backStep}>Back</Button>
                <Button variant='contained' color='primary' onClick={showPaypalButton}>
                    Pay ${amount}
                </Button>
            </div>
            <br />
            <div id='paypal-button' />
        </>        
    )
}

export default ReactPaypal;
