import React, { useContext } from 'react';
import { Button } from '@material-ui/core';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { commerce } from '../../../lib/commerce';
import { Context } from '../../../App';
import { loadStripe } from '@stripe/stripe-js';

const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLIC_KEY_TEST);

function ReactStripe({ orderData, amount, checkoutToken, nextStep, backStep }) {           
    const Payment = () => {
        const stripe = useStripe();
        const elements = useElements();

        const { setOrder, setErrorMessage, refreshCart } = useContext(Context);

        const handleSubmit = async (event, elements, stripe) => {
            event.preventDefault();
    
            if (!elements || !stripe) return;
    
            const cardElement = elements.getElement(CardElement);
    
            try {
                const { error, paymentMethod } = await stripe.createPaymentMethod({ type: 'card', card: cardElement });
                if (error) throw error;                                                   
                
                try {            
                    const incomingOrder = await commerce.checkout.capture(checkoutToken.id, {
                        ...orderData,
                        payment: {
                            gateway: 'stripe',
                            stripe: {
                                payment_method_id: paymentMethod.id
                            }
                        }
                    });                                 
                    setOrder(incomingOrder);
                    refreshCart();
                    return;                                                        
                } catch (response) {   
                    if (response.statusCode !== 402 || response.data.error.type !== 'requires_verification') {                                                
                        setErrorMessage(response.data.error.message);
                        return;
                    }

                    try {                                        
                        const { error, paymentIntent } = await stripe.handleCardAction(response.data.error.param);
        
                        if (error) throw error;                    
        
                        try {
                            const order = await commerce.checkout.capture(checkoutToken.id, {
                                ...orderData,
                                payment: {
                                    gateway: 'stripe',
                                    stripe: {
                                        payment_intent_id: paymentIntent.id
                                    }
                                }
                            });                            
                            setOrder(order);
                            refreshCart();
                            return;
                        } catch (error) {
                            console.log(error);
                            setErrorMessage(error.data.error.message);                            
                        }
                    } catch (error) {
                        console.log(error); 
                        setErrorMessage(error);               
                    }               
                }
            } catch (error) {
                console.log(error)
                setErrorMessage(error);
            } finally {
                nextStep();                
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