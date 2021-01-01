import React, { useState, useEffect } from 'react';
import { Typography, Divider, FormControl, InputLabel, Select, MenuItem } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { commerce } from '../../lib/commerce';
import Review from './Review';
import ReactPaypal from './ReactPaypal/ReactPaypal';
import ReactStripe from './ReactStripe/ReactStripe';

function PaymentForm({shippingData, checkoutToken, nextStep, backStep, onSetOrder, onSetErrorMessage, onPaypalCaptureCheckout }) {       
    const [shippingInfo, setShippingInfo] = useState({});       
    const [paymentMethod, setPaymentMethod] = useState('');

    const useStyles = makeStyles((theme) => ({
        formControl: {      
            margin: theme.spacing(1),      
            minWidth: 150
        }
    }));

    const classes = useStyles();    

    const withFunctions = (WrappedComponent) => {
        function WithFunctions(props) {

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

            return <WrappedComponent 
                       orderData={orderData}
                       checkoutToken={checkoutToken}                
                       amount={(checkoutToken.live.subtotal.raw + shippingInfo.price.raw).toFixed(2).toString()}
                       nextStep={nextStep}
                       backStep={backStep}
                       onSetOrder={onSetOrder}
                       onSetErrorMessage={onSetErrorMessage} 
                       {...props}
                   />
        }
        return WithFunctions;
    }

    const EnhancedPaypal = withFunctions(ReactPaypal); 
    const EnhancedStripe = withFunctions(ReactStripe);

    const PaymentMethods = () => {
        if (paymentMethod === 'paypal') {
            return <EnhancedPaypal onPaypalCaptureCheckout={onPaypalCaptureCheckout} />;            
        } else if (paymentMethod === 'bank card') {
            return <EnhancedStripe />;
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
            <Typography variant='h6' style={{marginTop: 20}}>Choose a payment method</Typography>            
            <FormControl className={classes.formControl}>
                <InputLabel id='payment method'>Payment method</InputLabel>
                <Select labelId='payment method' id='payment method' onChange={(e) => setPaymentMethod(e.target.value)}>
                    <MenuItem value='paypal'>Paypal</MenuItem>
                    <MenuItem value='bank card'>Bank Card</MenuItem>
                </Select>
            </FormControl>

            <br /><br />
            <br />

            {paymentMethod ? <PaymentMethods /> : ''}            
        </>
    )
}

export default PaymentForm;