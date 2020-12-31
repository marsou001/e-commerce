import React from 'react';
import { Button } from '@material-ui/core';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { AirlineSeatReclineExtraTwoTone } from '@material-ui/icons';

const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLIC_KEY);

function ReactStripe({ orderData, amount, checkoutToken, nextStep, backStep, onStripeCaptureCheckout }) {           
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
                
                // try {            
                    onStripeCaptureCheckout(checkoutToken.id, orderData, {
                        gateway: 'stripe',
                        payment_method_id: paymentMethod.id
                    });             
                    // if (response?.data?.error?.type !== 'requires_verification') {
                        console.log('jjj');
                        nextStep();
                        return;
                    // };
                                                        
                // } catch (response) {   
                    // try {                
                    //     console.log('hhh');
                    //     const { error, paymentIntent } = await stripe.handleCardAction(response.data.error.param);
        
                    //     if (error) throw error;                    
        
                    //     try {
                    //         onStripeCaptureCheckout(checkoutToken.id, orderData, {
                    //             gateway: 'stripe',
                    //             stripe: {
                    //                 payment_intent_id: paymentIntent.id
                    //             }
                    //         });
        
                    //         nextStep();
                    //     } catch (error) {
                    //         console.log(error);                            
                    //     }
                    // } catch (error) {
                    //     console.log(error);                
                    // }               
                // }
            } catch (error) {
                console.log(error)
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