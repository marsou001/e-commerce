import React from 'react';
import { Button, Typography } from '@material-ui/core';

function ReactPaypal({ checkoutToken, shippingData, amount, nextStep, backStep, onPaypalCaptureCheckout }) {    
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

    const moveToNextStep = () => nextStep();
    
    const showPaypalButton = () => {
        onPaypalCaptureCheckout(checkoutToken.id, orderData, amount, moveToNextStep);        
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
