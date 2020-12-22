import React, { useState, useEffect } from 'react';
// import {commerce} from '../../lib/commerce'
import { Typography, List, ListItem, ListItemText } from '@material-ui/core';

let data = {};

function Review({ checkoutToken, shippingInfo }) {
    // const [render, setRender] = useState(false);    
    const paddingStyle = {
        padding: '10px 0'
    };    
    console.log(checkoutToken.live)

    // const getShippingOption = async () => {
    //     try {
    //         data = await commerce.checkout.checkShippingOption(checkoutToken.id, {
    //             shipping_option_id: shippingData.shippingOption,
    //             country: shippingData.shippingCountry,
    //             region: shippingData.shippingSubdivision
    //         });            
    //         setRender(prevState => !prevState);
    //     } catch (e) {
    //         console.log(e);
    //     }
    // };

    // useEffect(() => {
    //     getShippingOption();
    // }, []);

    // if (!Object.keys(shippingInfo).length) return null;

    return (
        <>
            <Typography variant='h6' gutterBottom>Order summary</Typography>
            <List disablePadding>
                {checkoutToken.live.line_items.map((item) => (
                    <ListItem style={paddingStyle} key={item.name}>
                        <ListItemText primary={item.name} secondary={`Quantity: ${item.quantity}`} />
                        <Typography variant='body2'>{item.line_total.formatted_with_symbol}</Typography>
                    </ListItem>
                ))}
                <ListItem style={paddingStyle}>
                        <ListItemText primary={`Shipping option:`} secondary={`${shippingInfo.description}`} />
                        <Typography variant='body2'>{shippingInfo.price.formatted_with_symbol}</Typography>
                </ListItem>
                <ListItem style={paddingStyle}>
                    <ListItemText primary='Total' />
                    <Typography variant='subtitle1' style={{fontWeight: 700}}>
                        ${(checkoutToken.live.subtotal.raw + shippingInfo.price.raw).toFixed(2).toString()}
                    </Typography>
                </ListItem>
            </List>
        </>
    )
}

export default Review;
