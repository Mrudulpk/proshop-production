import React,{useState,useEffect} from 'react'
import {Link, useParams } from 'react-router-dom';
import {Row,Col,ListGroup,Image,Button,Card } from 'react-bootstrap';
import Message from '../components/Message';
import Loader from '../components/Loader';
import { PayPalButtons ,usePayPalScriptReducer } from '@paypal/react-paypal-js';
import { useSelector} from 'react-redux';
import {toast} from 'react-toastify';
import { useDeliverOrderMutation,
    usePayOrderMutation,
    useGetPayPalClientIdQuery,
    useGetOrderDetailsQuery,
    useRazorpayOrderMutation
     } from '../slices/ordersApiSlice'
import axios from 'axios'     

const OrderScreen = () => {
    const { id: orderId } = useParams();
    const { userInfo } = useSelector((state) => state.auth);

    const { data: order, refetch, isLoading, error } = useGetOrderDetailsQuery(orderId);

    const [payOrder, { isLoading: loadingPay }] = usePayOrderMutation();

    const [{ isPending }, paypalDispatch] = usePayPalScriptReducer();

    const { data: paypal, isLoading: loadingPayPal, error: errorPayPal } =  useGetPayPalClientIdQuery();


    const [deliverOrder, { isLoading: loadingDeliver }] = useDeliverOrderMutation()

    const [razorpayOrder, { isLoading: loadingRazorpay }] = useRazorpayOrderMutation();
    

    

    useEffect(() => {
        if (!errorPayPal && !loadingPayPal && paypal.clientId) {
            const loadPayPalScript = async () => {
                paypalDispatch({
                    type: 'resetOptions',
                    value: {
                        'client-id': paypal.clientId,
                        currency: 'USD'
                    }
                });
                paypalDispatch({ type: 'setLoadingStatus', value: 'pending'});
            }
            if (order && !order.isPaid) {
                if(!window.paypal) {
                    loadPayPalScript();
                }
            }
        }
    },[order, paypal, paypalDispatch, loadingPayPal, errorPayPal]);

    function onApprove (data, actions) {
        return actions.order.capture().then(async function (details) {
            try {
                console.log("details",details)
                await payOrder({ orderId, details });
                
                refetch();
                toast.success('Payment successful');
            } catch (err) {
                toast.error(err?.data?.message || err.message);
            }
        });
    }

    async function onApproveTest () {
        await payOrder({ orderId, details: {payer: {}}});
        refetch();
        toast.success('Payment successful')
    }

    function onError (err) {
        toast.error(err.message);
    }

    function createOrder (data, actions) {
        return actions.order.create({
            purchase_units: [
                {
                    amount: {
                        value: order.totalPrice 
                    }
                }
            ]
        })
        .then((orderId) => {
            return orderId;
        })
    }

    const deliverOrderHandler = async () => {
        try {
            await deliverOrder(orderId);
            refetch();
            toast.success('Order delivered');
        } catch (err) {
            toast.error(err?.data?.message || err.message)
        }
    }


    const amount = order?.totalPrice

    const handlePayment = (e) => {
      e.preventDefault();
      if (amount === ""){
        alert("Please enter amount");
      } else {
        var options = {
          key: "rzp_test_xr8Td2rGcfIzsM",
          key_secret: "GCXvKketpNW27snVHnoL54wy",
          amount: amount * 100,
          currency:"INR",
          name:"abc",
          description:"qwerty",
          handler: async function(response) {
        
            //     orderCreationId: order_id,
            //     razorpayPaymentId: response.razorpay_payment_id,
            //     razorpayOrderId: response.razorpay_order_id,
            //     razorpaySignature: response.razorpay_signature,
                    const id= response.razorpay_payment_id
                    const status = "COMPLETED"
                    const update_time= Date.now()
                    const email_address = "testmode@gmail.com"
                    const details= { 
                        id,
                        status,
                        update_time,
                        payer:{email_address}
                    }

            if(response.razorpay_payment_id){
                await payOrder({ orderId, details});
                refetch();
                toast.success('Payment successful')
            }
            else {
                toast.error('Payment Failed')
            }
            alert(response.razorpay_payment_id)

          },
          prefill: {
            name:"mrudul",
            email:"mruthulpk@gmail.com",
            contact:"9876543210"
          },
          notes: {
            address:"Razorpay Corporate office"
          },
          theme: {
            color:"#3399cc"
          }
        };
        var pay = new window.Razorpay(options);
        pay.open();
      }
    }

    const handleRazorpay = (e) => {
        e.preventDefault();
      if (amount === ""){
        alert("Please enter amount");
      } else {
        var options = {
          key: "rzp_test_xr8Td2rGcfIzsM",
          key_secret: "GCXvKketpNW27snVHnoL54wy",
          amount: amount * 100,
          currency:"INR",
          name:"abc",
          description:"qwerty",
          handler: async function(response) {
                    
                    const details= { 
                        id : response.razorpay_payment_id,
                        status : "COMPLETED",
                        update_time: Date.now(),
                        payer:{email_address: "testmode@gmail.com"}
                    }                    
            if(response.razorpay_payment_id){
               await axios.put(`/api/orders/${orderId}/pay`,{...details})
                    .then(((response) => {
                        refetch()
                        console.log('Data saved successfully', response.data.message);
                        toast.success('Data saved successfully')
                    }))
                    .catch((error) => {
                        console.log('Error saving data', error);
                        toast.error('Error saving data')
                    })
            }
            else {
                toast.error('Payment Failed')
            }
          },
          prefill: {
            name:"mrudul",
            email:"mruthulpk@gmail.com",
            contact:"9876543210"
          },
          notes: {
            address:"Razorpay Corporate office"
          },
          theme: {
            color:"#3399cc"
          }
        };
        var pay = new window.Razorpay(options);
        pay.open();
      }
    }



  return isLoading ? <Loader /> : error ? <Message variant="danger" /> : (
        <>
            <h1>Order {order._id}</h1>
            <Row>
                <Col md={8}>
                    <ListGroup variant='flush'>
                        <ListGroup.Item>
                            <h2>Shipping</h2>
                            <p>
                                <strong>Name: </strong> {order.user.name}
                            </p>
                            <p>
                                <strong>Email: </strong> {order.user.email}
                            </p>
                            <p>
                                <strong>Address: </strong>
                                {order.shippingAddress.address}, {order.shippingAddress.city}{' '}
                                {order.shippingAddress.postalCode}, {order.shippingAddress.country}
                            </p>
                            {order.isDelivered ? (
                                <Message variant= 'success'>
                                    Delivered on {order.deliveredAt}
                                </Message>
                            ) : (<Message variant='danger'>Not Delivered</Message>)}
                        </ListGroup.Item>

                        <ListGroup.Item>
                            <h2>Payment Method</h2>
                            <p>
                                <strong>Method: </strong>
                                {order.paymentMethod}
                            </p>
                            {order.isPaid ? (
                                <Message variant= 'success'>
                                    Paid on {order.paidAt}
                                </Message>
                            ) : (<Message variant='danger'>Not Paid</Message>)}
                        </ListGroup.Item>


                        <ListGroup.Item>
                            <h2>Order Items</h2>
                            {order.orderItems.map((item,index) => (
                               <ListGroup.Item key={index}>
                               <Row>
                                   <Col md={1}>
                                       <Image src={item.image} alt={item.name} fluid rounded />
                                   </Col>
                                   <Col>
                                       <Link to={`/products/${item.product}`}>
                                           {item.name}
                                       </Link>
                                   </Col>
                                   <Col md={4}>
                                       { item.qty } x ${ item.price } = ${ item.qty * item.price}
                                   </Col>
                               </Row>
                           </ListGroup.Item>
                            ))}
                        </ListGroup.Item>
                        
                    </ListGroup>
                </Col>
                <Col md={4}>
                    <Card>
                        <ListGroup variant='flush'>
                            <ListGroup.Item>
                                <h2>Order Summary</h2>
                            </ListGroup.Item>

                            <ListGroup.Item>
                                <Row>
                                    <Col>Items</Col>
                                    <Col>${order.itemsPrice}</Col>
                                </Row>

                                <Row>
                                    <Col>Shipping</Col>
                                    <Col>${order.shippingPrice}</Col>
                                </Row>

                                <Row>
                                    <Col>Tax</Col>
                                    <Col>${order.taxPrice}</Col>
                                </Row>

                                <Row>
                                    <Col>Total</Col>
                                    <Col>${order.totalPrice}</Col>
                                </Row>
                            </ListGroup.Item>

                            {
                                !order.isPaid && (
                                    <ListGroup.Item>
                                        {loadingPay && <Loader />}

                                        {
                                            isPending ? (<Loader /> ) : (
                                                <div>
                                                    <Button onClick={onApproveTest} style={{marginBottom: '10px'}}>
                                                        Test Pay Order
                                                    </Button>
                                                    <Button onClick={handlePayment} style={{marginBottom: '10px'}} >
                                                        Razorpay
                                                    </Button>
                                                    <Button onClick={handleRazorpay} style={{marginBottom: '10px'}} >
                                                        Razorpay
                                                    </Button>
                                                    <div>
                                                        <PayPalButtons
                                                            createOrder={createOrder}
                                                            onApprove={onApprove}
                                                            onError={onError}></PayPalButtons>
                                                    </div>
                                                </div>
                                            )
                                        }
                                    </ListGroup.Item>
                                )
                            }


                            {/* Pay order placeholder */}
                            
                                {loadingDeliver && <Loader />}

                                { userInfo && userInfo.isAdmin && order.isPaid && !order.isDelivered && (
                                    <ListGroup.Item>
                                        <Button 
                                            type='button'
                                            className='btn btn-block'
                                            onClick={deliverOrderHandler}>
                                                Mark As Delivered
                                            </Button>
                                    </ListGroup.Item>
                                )}

                        </ListGroup>
                    </Card>
                </Col>
            </Row>
        </>            
  )
}

export default OrderScreen