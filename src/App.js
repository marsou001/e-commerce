import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import { commerce } from './lib/commerce';
import { Products, Navbar, Cart, Checkout } from './components';

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

    const handleStripeCaptureCheckout = async (checkoutTokenId, newOrder, paymentGateway) => {
        try {            
            const incomingOrder = await commerce.checkout.capture(checkoutTokenId, {
                ...newOrder, 
                payment: { ...paymentGateway }
            });
            setOrder(incomingOrder);            

            refreshCart();
        } catch (error) {   
            console.log(error)         
            setErrorMessage(error.data.error.message);
        }
    }
    
    // const handlePaypalCaptureCheckout = async (checkoutTokenId, newOrder, paymentGateway) => {
    //     const getPaypalPaymentId = async (orderDetails) => {
    //         try {
    //             const paypalAuth = await commerce.checkout.capture(checkoutToken.id, {
    //                 ...orderDetails,
    //                 payment: {
    //                     gateway: 'paypal',
    //                     paypal: {
    //                         action: 'authorize'
    //                     }
    //                 }
    //             });
    
    //             renderPaypalButton(paypalAuth);
    //         } catch (e) {            
    //             console.log(e)
    //         }               
    //     } 
    
    //     const  renderPaypalButton = (orderData, paypalAuth) => {
    //         window.paypal.Button.render({
    //             env: 'sandbox',
    //             commit: true,
    //             payment: function() {
    //                 return paypalAuth.payment_id
    //             },
    //             onAuthorize: function(data, actions) {
    //                 console.log('%cdata: ' + data, 'background-color: #0f0');
    //                 console.log('%cactions: ' + actions, 'background-color: #0f0');
    //                 captureOrder(orderData, data)
    //             },
    //             onCancel: function(data, actions) {
    //                 console.log('%cdata: ' + data, 'background-color: #f00');
    //                 console.log('%cactions: ' + actions, 'background-color: #f00');
    //             }           
    //         })
    //     }        
    
    //     const captureOrder = async (orderDetails, data) => {
    //         try {
    //             const order = commerce.checkout.capture(checkoutToken.id, {
    //                 ...orderDetails,
    //                 payment: {
    //                     gateway: 'paypal',
    //                     paypal: {
    //                         action: 'authorize',
    //                         payment_id: data.payment_id,
    //                         payer_id: data.payer_id
    //                     }
    //                 }
    //             })
    //             console.log(order);
    //         } catch (e) {
    //             console.log(e);
    //         }
    //     }

    //     try {            
    //         const incomingOrder = await commerce.checkout.capture(checkoutTokenId, {
    //             ...newOrder, 
    //             payment: { ...paymentGateway }
    //         });
    //         setOrder(incomingOrder);            

    //         refreshCart();
    //     } catch (error) {   
    //         console.log(error)         
    //         setErrorMessage(error.data.error.message);
    //     }
    // }
    
    

    const handleResetError = () => {
        setErrorMessage('');
    }

    const handleSetErrorMessage = (string) => {
        setErrorMessage(string);
    }

    // const handleDeleteCart = async () => {
    //     try {
    //         const response = await commerce.cart.delete();
    //         console.log(response);
    //     } catch (e) {
    //         console.log(e)
    //     }
    // }

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
                        <Checkout
                            cart={cart} 
                            order={order}
                            onStripeCaptureCheckout={handleStripeCaptureCheckout}
                            // onPaypalCaptureCheckout={handlePaypalCaptureCheckout}
                            error={errorMessage}
                            onResetError={handleResetError}
                            onSetErrorMessage={handleSetErrorMessage}
                            onSetOrder={setOrder}
                        />
                    </Route>
                </Switch>
            </div> 
        </Router>                    
    )
}

export default App;