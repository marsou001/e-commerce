import React, { useState, useEffect } from 'react';
import { Typography, Divider, Select, MenuItem } from '@material-ui/core';
import { commerce } from '../../lib/commerce';
import Review from './Review';
import ReactPaypal from './ReactPaypal/ReactPaypal';
import ReactStripe from './ReactStripe/ReactStripe';

function PaymentForm({shippingData, checkoutToken, nextStep, backStep, onStripeCaptureCheckout, onPaypalCaptureCheckout, onSetErrorMessage, onSetOrder }) {       
    const [shippingInfo, setShippingInfo] = useState({});       
    const [option, setOption] = useState('');

    const PaymentMethod = () => {
        if (option === 'paypal') {
            return <ReactPaypal 
                checkoutToken={checkoutToken}
                shippingData={shippingData}
                amount={(checkoutToken.live.subtotal.raw + shippingInfo.price.raw).toFixed(2).toString()} 
                nextStep={nextStep}
                backStep={backStep}
                onPaypalCaptureCheckout={onPaypalCaptureCheckout}
                onSetErrorMessage={onSetErrorMessage}
                onSetOrder={onSetOrder}
            />
        } else if (option === 'bank card') {
            return <ReactStripe
                shippingData={shippingData}
                shippingInfo={shippingInfo}
                checkoutToken={checkoutToken}
                nextStep={nextStep}
                backStep={backStep}
                onStripeCaptureCheckout={onStripeCaptureCheckout} 
            />
        }
    }

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

            <Select labelId='payment method' id='payment method' onChange={(e) => setOption(e.target.value)}>
                <MenuItem value='paypal'>Paypal</MenuItem>
                <MenuItem value='bank card'>Bank Card</MenuItem>
            </Select>

            <br /><br />
            <br />

            {option ? <PaymentMethod /> : ''}
            
            {/* <ReactPaypal 
                checkoutToken={checkoutToken}
                shippingData={shippingData}
                amount={(checkoutToken.live.subtotal.raw + shippingInfo.price.raw).toFixed(2).toString()} 
                nextStep={nextStep}
                backStep={backStep}
                onPaypalCaptureCheckout={onPaypalCaptureCheckout}
                onSetErrorMessage={onSetErrorMessage}
                onSetOrder={onSetOrder}
            /> */}
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