import React, { useState, useEffect, createContext } from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import { commerce } from './lib/commerce';
import { Products, Navbar, Cart, Checkout } from './components';

export const Context = createContext(null);

function App() {
    const [products, setProducts] = useState([]);
    const [cart, setCart] = useState({}); 
    const [order, setOrder] = useState({});
    const [errorMessage, setErrorMessage] = useState('');       
    
    const fetchProducts = async () => {
        try {
            const { data } = await commerce.products.list();
            setProducts(data);
        } catch (error) {
            console.log(error)
        }
    }

    const fetchCart = async () => {
        try {
            const response = await commerce.cart.retrieve();
            setCart(response);
        } catch (error) {
            console.log(error)            
        }
    }

    const handleAddToCart = async (productId, quantity) => {
        const { cart } = await commerce.cart.add(productId, quantity);
        setCart(cart);        
    }

    const handleUpdateCartQuantity = async (productId, quantity) => {
        try {
            const { cart } = await commerce.cart.update(productId, { quantity });
            setCart(cart);
        } catch (error) {
            console.error(error);
        }
    }

    const handleRemoveFromCart = async (productId) => {
        try {
            const { cart } = await commerce.cart.remove(productId);
            setCart(cart);
        } catch (error) {
            console.error(error);
        }
    }

    const handleEmptyCart = async () => {
        try {
            const { cart } = await commerce.cart.empty();
            setCart(cart)
        } catch (error) {
            console.error(error);
        }
    }

    const refreshCart = async () => {
        const newCart = await commerce.cart.refresh();
        setCart(newCart);
    }    
    
    const handlePaypalCaptureCheckout = async (checkoutTokenId, newOrder, amount, moveToNextStep) => {
        const getPaypalPaymentId = async (orderDetails) => {
            try {
                const paypalAuth = await commerce.checkout.capture(checkoutTokenId, {
                    ...orderDetails,
                    payment: {
                        gateway: 'paypal',
                        paypal: {
                            action: 'authorize'
                        }
                    }
                });
                renderPaypalButton(orderDetails, paypalAuth);
            } catch (e) {   
                // setErrorMessage(e.data.error.message);         
                console.log(e)
            }               
        } 
    
        const renderPaypalButton = (orderData, paypalAuth) => {
            console.log(window.paypal);
            try {
                window.paypal.Buttons({
                    env: 'sandbox',
                    commit: true,
                    createOrder: (data, actions) => {
                        return actions.order.create({
                            intent: "CAPTURE",
                            purchase_units: [
                                {
                                    description: "Your description",
                                    amount: {
                                        currency_code: "USD",
                                        value: amount,
                                    },
                                },
                            ],
                        });
                    },                                
                    onCancel: function(data, actions) {
                        console.log('oops')                    
                    },
                    onApprove: async (data, actions) => {                    
                        const order = await actions.order.capture();                    
                        captureOrder(orderData, order, paypalAuth)                   
                    },
                    onError: (err) => {                  
                        console.error(err);
                    },
                }).render('#paypal-button');
            } catch (e) {
                // setErrorMessage(e.data.error.message);
                console.log(e);
            }
        }        
    
        const captureOrder = async (orderDetails, data, auth) => {
            try {            
                await commerce.checkout.capture(checkoutTokenId, {
                    ...orderDetails,
                    payment: {
                        gateway: 'paypal',
                        paypal: {
                            action: 'capture',                        
                            payment_id: auth.payment_id,
                            payer_id: data.payer.payer_id
                        }
                    }
                })            
                // setOrder(orderDetails);                
            } catch (e) {
                // setErrorMessage(e.data.error.message);
                console.log(e);
            }        
            moveToNextStep();
        }
        getPaypalPaymentId(newOrder);
    }
    
    

    // const handleResetError = () => {
    //     setErrorMessage('');
    // }    

    const handleDeleteCart = async () => {
        try {
            const response = await commerce.cart.delete();
            console.log(response);
        } catch (e) {
            console.log(e)
        }
    }

    const context = {
        order,
        errorMessage,
        setOrder,
        setErrorMessage,
        refreshCart
    }

    useEffect(() => {
        fetchProducts();
        // handleDeleteCart();
        fetchCart();
    }, []);

    return (        
        <Router>
            <div>
                <Navbar totalItems={cart.total_items} />
                <Switch>
                    <Route exact path='/'>                    
                        <Products products={products} onAddToCart={handleAddToCart} /> 
                    </Route>
                    <Route exact path='/cart'>
                        <Cart 
                            cart={cart} 
                            onUpdateCartQuantity={handleUpdateCartQuantity}
                            onRemoveFromCart={handleRemoveFromCart}
                            onEmptyCart={handleEmptyCart}
                        />        
                    </Route>
                    <Route exact path='/checkout'>
                        <Context.Provider value={context}>
                            <Checkout
                                cart={cart}                                                         
                                onPaypalCaptureCheckout={handlePaypalCaptureCheckout}                              
                            />
                        </Context.Provider>
                    </Route>
                </Switch>
            </div> 
        </Router>                    
    )
}

export default App;