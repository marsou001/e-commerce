import React from 'react';
import { Button } from '@material-ui/core';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';

const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLIC_KEY);

function ReactStripe({ shippingData, amount, checkoutToken, nextStep, backStep, onStripeCaptureCheckout }) {           
    const Payment = () => {
        const stripe = useStripe();
        const elements = useElements();

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
                }            

                console.log(orderData);
                
                onStripeCaptureCheckout(checkoutToken.id, orderData, {
                    gateway: 'stripe',
                    stripe: {
                        payment_method_id: paymentMethod.id
                    }
                });
                nextStep();
    
            } catch (error) {
                console.log(error);
            }
    
        }

        return (
            <form onSubmit={(e) => handleSubmit(e, elements, stripe)}>
                <CardElement />
                <br /> <br />
                <div style={{display: 'flex', justifyContent: 'space-between'}}>
                    <Button variant='outlined' onClick={backStep}>Back</Button>
                    <Button type='submit' variant='contained' disabled={!stripe} color='primary'>
                        Pay ${amount}
                    </Button>
                </div>
            </form> 
        )
    }

    return (
        <Elements stripe={stripePromise}>
            <Payment />
        </Elements> 
    )
}
    
export default ReactStripe;