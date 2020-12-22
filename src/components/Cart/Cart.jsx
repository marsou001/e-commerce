import React from 'react';
import { Link } from 'react-router-dom';
import { Container, Grid, Button, Typography } from '@material-ui/core';
import useStyles from './styles';
import CartItem from './CartItem/CartItem';

function Cart({ cart, onUpdateCartQuantity, onRemoveFromCart, onEmptyCart }) {
    const classes = useStyles();

    const EmptyCart = () => (
        <Typography variant='subtitle1'>You have no items in your shopping cart, <Link to='/' className={classes.link}>start adding some!</Link></Typography>        
    )

    const FilledCart = () => (
        <>
            <Grid container spacing={3}>
                {cart.line_items.map((item => (
                    <Grid item key={item.id} xs={12} sm={4}>
                        <CartItem
                            item={item}
                            onUpdateCartQuantity={onUpdateCartQuantity} 
                            onRemoveFromCart={onRemoveFromCart}                            
                        />
                    </Grid>
                )))}
            </Grid>
            <div className={classes.cardDetails}>
                <Typography variant='h4'>
                    Subtotal: {cart.subtotal.formatted_with_symbol}
                </Typography>
                <div>
                    <Button className={classes.emptyButton} size='large' type='button' variant='contained' color='secondary' onClick={onEmptyCart}>Empty Cart</Button>
                    <Button component={Link} to='/checkout' className={classes.checkoutButton} size='large' type='button' variant='contained' color='primary'>Checkout</Button>
                </div>
            </div>
        </>
    )

    if (!cart.line_items) return 'Loading...';

    return (
        <Container>
            <div className={classes.toolbar} />
            <Typography className={classes.title} variant='h3' gutterBottom>Your shopping cart</Typography>
            {!cart.line_items.length ? <EmptyCart /> : <FilledCart />}
        </Container>
    )
}


export default Cart;