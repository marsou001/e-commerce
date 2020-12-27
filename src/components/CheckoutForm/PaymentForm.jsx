import React, { useState, useEffect } from 'react';
import { Typography, Divider } from '@material-ui/core';
import { commerce } from '../../lib/commerce';
import Review from './Review';
import ReactPaypal from './ReactPaypal/ReactPaypal';
// import ReactStripe from './ReactStripe/ReactStripe';

function PaymentForm({shippingData, checkoutToken, nextStep, backStep, onStripeCaptureCheckout, onPaypalCaptureCheckout, onSetErrorMessage, onSetOrder }) {       
    const [shippingInfo, setShippingInfo] = useState({});       

    useEffect(() => {
        (async () => {
            try {
                const data = await commerce.checkout.checkShippingOption(checkoutToken.id, {
                    shipping_option_id: shippingData.shippingOption,
                    country: shippingData.shippingCountry,
                    region: shippingData.shippingSubdivision
                });            
                setShippingInfo(data);
            } catch (e) {
                console.log(e);
            }
        })();
    }, []);

    if (!Object.keys(shippingInfo).length) return null;
    
    return (
        <>
            <Review checkoutToken={checkoutToken} shippingData={shippingData} shippingInfo={shippingInfo} />
            <Divider />
            <Typography variant='h6' style={{margin: '20px 0'}} gutterBottom>Payment method</Typography>
            
            <ReactPaypal 
                checkoutToken={checkoutToken}
                shippingData={shippingData}
                amount={(checkoutToken.live.subtotal.raw + shippingInfo.price.raw).toFixed(2).toString()} 
                nextStep={nextStep}
                backStep={backStep}
                onPaypalCaptureCheckout={onPaypalCaptureCheckout}
                onSetErrorMessage={onSetErrorMessage}
                onSetOrder={onSetOrder}
            />
            {/* <ReactStripe
                shippingData={shippingData}
                shippingInfo={shippingInfo}
                checkoutToken={checkoutToken}
                nextStep={nextStep}
                backStep={backStep}
                onStripeCaptureCheckout={onStripeCaptureCheckout} 
            />             */}
        </>
    )
}

export default PaymentForm;