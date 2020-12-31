import React from 'react';
import { Button, Typography } from '@material-ui/core';

function ReactPaypal({ checkoutToken, orderData, amount, nextStep, backStep, onPaypalCaptureCheckout }) {        
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
