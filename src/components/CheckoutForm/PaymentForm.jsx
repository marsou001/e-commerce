import React from 'react';
import { Typography, Button, Divider } from '@material-ui/core';
import { Elements, CardElement, ElementsConsumer } from '@stripe/react-stripe-js';
// import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import Review from './Review';

const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLIC_KEY);

// function PaymentForm({shippingData, checkoutToken, nextStep, backStep, onCaptureCheckout }) {        
//     const Payment = () => {
//         const stripe = useStripe();
//         const elements = useElements();

//         const handleSubmit = async (event, elements, stripe) => {
//             event.preventDefault();
    
//             if (!elements || !stripe) return;
    
//             const cardElement = elements.getElement(CardElement);
    
//             try {
//                 const { error, paymentMethod } = await stripe.createPaymentMethod({ type: 'card', card: cardElement });
//                 if (error) throw error;            
    
//                 const orderData = {
//                     line_items: checkoutToken.live.line_items,
//                     customer: {
//                         firstname: shippingData.firstName,
//                         lastname: shippingData.lastName,
//                         email: shippingData.email
//                     },
//                     shipping: {
//                         name: 'Primary',
//                         street: shippingData.address1,
//                         town_city: shippingData.city,
//                         county_state: shippingData.shippingSubdivision,
//                         postal_zip_code: shippingData.zip,
//                         country: shippingData.shippingCountry
//                     },
//                     fulfillment: {
//                         shipping_method: shippingData.shippingOption
//                     },
//                     payment: {
//                         gateway: 'stripe',
//                         stripe: {
//                             payment_method_id: paymentMethod.id
//                         }
//                     }
//                 }            
//                 console.log(orderData)
//                 onCaptureCheckout(checkoutToken.id, orderData);
//                 nextStep();
    
//             } catch (error) {
//                 console.log(error);
//             }
    
//         }

//         return (
//             <form onSubmit={(e) => handleSubmit(e, elements, stripe)}>
//                 <CardElement />
//                 <br /> <br />
//                 <div style={{display: 'flex', justifyContent: 'space-between'}}>
//                     <Button variant='outlined' onClick={backStep}>Back</Button>
//                     <Button type='submit' variant='contained' disabled={!stripe} color='primary'>
//                         Pay {checkoutToken.live.subtotal.formatted_with_symbol}
//                     </Button>
//                 </div>
//             </form> 
//         )
//     }
    
//     return (
//         <>
//             <Review checkoutToken={checkoutToken} />
//             <Divider />
//             <Typography variant='h6' style={{margin: '20px 0'}} gutterBottom>Payment method</Typography>
//             <Elements stripe={stripePromise}>
//                 <Payment />
//             </Elements>
//         </>
//     )
// }

function PaymentForm({shippingData, checkoutToken, nextStep, backStep, onCaptureCheckout }) {        

    const handleSubmit = async (event, elements, stripe) => {
        event.preventDefault();

        if (!elements || !stripe) return;

        const cardElement = elements.getElement(CardElement);

        try {
            const { error, paymentMethod } = await stripe.createPaymentMethod({ type: 'card', card: cardElement });
            if (error) throw error;            

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
                payment: {
                    gateway: 'stripe',
                    stripe: {
                        payment_method_id: paymentMethod.id
                    }
                }
            }            
            console.log(orderData)
            onCaptureCheckout(checkoutToken.id, orderData);
            nextStep();

        } catch (error) {
            console.log(error);
        }

    }            
    
    return (
        <>
            <Review checkoutToken={checkoutToken} />
            <Divider />
            <Typography variant='h6' style={{margin: '20px 0'}} gutterBottom>Payment method</Typography>
            <Elements stripe={stripePromise}>
                <ElementsConsumer>
                    {({ stripe, elements }) => (
                        <form onSubmit={(e) => handleSubmit(e, elements, stripe)}>
                            <CardElement />
                            <br /> <br />
                            <div style={{display: 'flex', justifyContent: 'space-between'}}>
                                <Button variant='outlined' onClick={backStep}>Back</Button>
                                <Button type='submit' variant='contained' disabled={!stripe} color='primary'>
                                    Pay {checkoutToken.live.subtotal.formatted_with_symbol}
                                </Button>
                            </div>
                        </form>
                    )}    
                </ElementsConsumer> 
            </Elements>
        </>
    )
}


export default PaymentForm;