import React, { useState, useEffect } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { Paper, Stepper, Step, StepLabel, Typography, CircularProgress, Divider, Button, CssBaseline } from '@material-ui/core';
import useStyles from './styles';
import { commerce } from '../../../lib/commerce';
import AddressForm from '../AddressForm';
import PaymentForm from '../PaymentForm';

function Checkout({ cart, order, onCaptureCheckout, error, onResetError }) {
    const [activeStep, setActiveStep] = useState(0);
    const [checkoutToken, setCheckoutToken] = useState(null);
    const [shippingData, setShippingData] = useState({});
    const classes = useStyles();
    const history = useHistory();

    const steps = ['Shipping Address', 'Payment Details'];

    let Confirmation = () => order.customer ? (
        <>
            <Typography variant='h5'>Thank you for your purchase, {order.customer.firstname} {order.customer.lastname}</Typography>
            <Divider className={classes.divider} />
            <Typography variant='subtitle2'>Order ref: {order.customer_reference}</Typography>
            <br />
            <Button component={Link} to='/' variant='outlined' type='button' onClick={onResetError}>Back to home</Button>
        </>
    ) : (
        <div className={classes.spinner}>
            <CircularProgress />
        </div>
    );

    if (error) {
        Confirmation = () => (
            <>
                <Typography variant='h5'>Error {error}</Typography>
                <br />
                <Button component={Link} to='/' variant='outlined' type='button' onClick={onResetError}>Back to home</Button>
            </>
        ); 
    }     

    const nextStep = () => setActiveStep((prevStep) => prevStep + 1);
    const backStep = () => setActiveStep((prevStep) => prevStep - 1);

    const next = (data) => {
        setShippingData(data);
        nextStep();
    }

    const Form = () => (activeStep === 0) ? <AddressForm 
                                                checkoutToken={checkoutToken}
                                                next={next} 
                                            /> : <PaymentForm 
                                                     shippingData={shippingData} 
                                                     checkoutToken={checkoutToken}
                                                     nextStep={nextStep} 
                                                     backStep={backStep} 
                                                     onCaptureCheckout={onCaptureCheckout} 
                                                 />;

    useEffect(() => {
        const generateToken = async () => {
            try {                
                const token = await commerce.checkout.generateToken(cart.id, { type: 'cart' });                
                setCheckoutToken(token);
            } catch(error) {
                history.push('/');                
            }
        }

        generateToken();
    // }, [cart.id]);
    }, []);

    return (        
        <>
            <CssBaseline />
            <div className={classes.toolbar} />
            <main className={classes.layout}>
                <Paper className={classes.paper}>
                    <Typography variant='h4' align='center'>Checkout</Typography>
                    <Stepper activeStep={activeStep} className={classes.stepper}>
                        {steps.map((step) => (
                            <Step>
                                <StepLabel>{step}</StepLabel>
                            </Step>
                        ))}
                    </Stepper>
                    {activeStep === steps.length ? <Confirmation /> : checkoutToken && <Form />}
                </Paper>
            </main>
        </>
    )
}

export default Checkout;