import React from 'react';
import { Typography, List, ListItem, ListItemText } from '@material-ui/core';

function Review({ checkoutToken }) {
    console.log(checkoutToken.live)
    const paddingStyle = {
        padding: '10px 0'
    }

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
                        <ListItemText primary={`Shipping option:`} secondary={`${checkoutToken.live.shipping.available_options[0].description}`} />
                        <Typography variant='body2'>{checkoutToken.live.shipping.available_options[0].price.formatted_with_symbol}</Typography>
                </ListItem>
                <ListItem style={paddingStyle}>
                    <ListItemText primary='Total' />
                    <Typography variant='subtitle1' style={{fontWeight: 700}}>
                        {checkoutToken.live.subtotal.formatted_with_symbol}
                    </Typography>
                </ListItem>
            </List>
        </>
    )
}

export default Review;
