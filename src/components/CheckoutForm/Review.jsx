import React from 'react';
import { Typography, List, ListItem, ListItemText } from '@material-ui/core';

function Review({ checkoutToken, shippingInfo }) {
    const paddingStyle = {
        padding: '10px 0'
    };    
    console.log(checkoutToken.live)    

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
