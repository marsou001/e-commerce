import React, { useState, useEffect } from 'react';
import { Typography, Divider, FormControl, InputLabel, Select, MenuItem } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { commerce } from '../../lib/commerce';
import Review from './Review';
import ReactPaypal from './ReactPaypal/ReactPaypal';
import ReactStripe from './ReactStripe/ReactStripe';

function PaymentForm({shippingData, checkoutToken, nextStep, backStep, onStripeCaptureCheckout, onPaypalCaptureCheckout }) {       
    const [shippingInfo, setShippingInfo] = useState({});       
    const [option, setOption] = useState('');

    const useStyles = makeStyles((theme) => ({
        formControl: {
            margin: theme.spacing(1),
            minWidth: 150
        }
    }));

    const classes = useStyles();

    const PaymentMethod = () => {
        if (option === 'paypal') {
            return <ReactPaypal 
                shippingData={shippingData}
                checkoutToken={checkoutToken}                
                amount={(checkoutToken.live.subtotal.raw + shippingInfo.price.raw).toFixed(2).toString()}
                nextStep={nextStep}
                backStep={backStep}
                onPaypalCaptureCheckout={onPaypalCaptureCheckout}                
            />
        } else if (option === 'bank card') {
            return <ReactStripe              
                shippingData={shippingData}  
                checkoutToken={checkoutToken}                
                amount={(checkoutToken.live.subtotal.raw + shippingInfo.price.raw).toFixed(2).toString()}
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
            <Typography variant='h6' style={{margin: '20px 0'}} gutterBottom>Choose a payment method</Typography>            
            <FormControl className={classes.formControl}>
                <InputLabel id='payment method'>Payment method</InputLabel>
                <Select labelId='payment method' id='payment method' onChange={(e) => setOption(e.target.value)}>
                    <MenuItem value='paypal'>Paypal</MenuItem>
                    <MenuItem value='bank card'>Bank Card</MenuItem>
                </Select>
            </FormControl>

            <br /><br />
            <br />

            {option ? <PaymentMethod /> : ''}            
        </>
    )
}

export default PaymentForm;