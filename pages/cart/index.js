import styles from '../../styles/Cart.module.css';
import Image from 'next/image';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
import {
  PayPalScriptProvider,
  PayPalButtons,
  usePayPalScriptReducer,
} from '@paypal/react-paypal-js';
import { useRouter } from 'next/router';
import axios from 'axios';
import { reset } from '../../redux/cartSlice';
import OrderDetail from '../../components/OrderDetail';
import Link from 'next/link'

const Cart = () => {
  const { cart } = useSelector((state) => state);
  const [customerData, setCustomerData] = useState({
    name: '',
    address: '',
    mobileNum: '',
  });
  const [clickedCheckout, setClickedCheckout] = useState(false);
  const [showPaymentOpt, setShowPaymentOpt] = useState(false);
  const amount = Math.ceil(cart.total / 77.91);
  const currency = 'USD';
  const style = { layout: 'vertical' };
  const dispatch = useDispatch();
  const router = useRouter();
  //payapal button wrapper
  const ButtonWrapper = ({ currency, showSpinner }) => {
    const [{ options, isPending }, dispatch] = usePayPalScriptReducer();
    useEffect(() => {
      dispatch({
        type: 'resetOptions',
        value: {
          ...options,
          currency: currency,
        },
      });
    }, [currency, showSpinner]);

    return (
      <>
        {showSpinner && isPending && <div className="spinner" />}
        <PayPalButtons
          style={style}
          disabled={false}
          forceReRender={[amount, currency, style]}
          fundingSource={undefined}
          createOrder={(data, actions) => {
            return actions.order
              .create({
                purchase_units: [
                  {
                    amount: {
                      currency_code: currency,
                      value: amount,
                    },
                  },
                ],
              })
              .then((orderId) => {
                return orderId;
              });
          }}
          onApprove={function (data, actions) {
            return actions.order.capture().then(function (details) {
              const shipping = details.purchase_units[0].shipping;
              createOrder({
                customer: customerData.name,
                address: customerData.address,
                mobileNum: customerData.mobileNum,
                total: cart.total,
                method: 1,
              });
            });
          }}
        />
      </>
    );
  };
  const createOrder = async (data) => {
    try {
      const res = await axios.post(`${process.env.BASE_URL}/api/order`, data);
      if (res.status === 201) {
        dispatch(reset());
        router.push(`/order/${res.data._id}`);
      }
    } catch (err) {
      console.log(err);
    }
  };
  return (
    <div className={styles.container}>
      {cart.products.length > 0 ? (
        <>
          <div className={styles.left}>
            <table className={styles.table}>
              <thead>
                <tr className={styles.trTitle}>
                  <th>Product</th>
                  <th>Name</th>
                  <th>Extras</th>
                  <th>Price</th>
                  <th>Quantity</th>
                  <th>Total</th>
                </tr>
              </thead>
              <tbody>
                {cart.products.map((product) => (
                  <tr className={styles.tr} key={product._id}>
                    <td>
                      <div className={styles.imgContainer}>
                        <Image
                          src={product.img}
                          layout="fill"
                          objectFit="cover"
                          alt=""
                        />
                      </div>
                    </td>
                    <td>
                      <span className={styles.name}>{product.title}</span>
                    </td>
                    <td>
                      <span className={styles.extras}>
                        {product.extras.length > 0
                          ? product.extras.map((extra, index) => (
                              <span key={extra._id}>
                                {` ${index + 1}.${extra.text}`}
                              </span>
                            ))
                          : 'none'}
                      </span>
                    </td>
                    <td>
                      <span className={styles.price}>Rs. {product.price}</span>
                    </td>
                    <td>
                      <span className={styles.quantity}>
                        {product.quantity}
                      </span>
                    </td>
                    <td>
                      <span className={styles.total}>
                        Rs.{product.price * product.quantity}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className={styles.right}>
            <div className={styles.wrapper}>
              <h2 className={styles.title}>CART TOTAL</h2>
              <div className={styles.totalText}>
                <b className={styles.totalTextTitle}>Subtotal:</b>Rs.
                {cart.total}
              </div>
              <div className={styles.totalText}>
                <b className={styles.totalTextTitle}>Discount:</b>Rs. 0.00
              </div>
              <div className={styles.totalText}>
                <b className={styles.totalTextTitle}>Total:</b>Rs. {cart.total}
              </div>
              {showPaymentOpt ? (
                <div className={styles.paymentMethods}>
                  <button
                    className={styles.payButton}
                    onClick={() =>
                      createOrder({
                        customer: customerData.name,
                        address: customerData.address,
                        mobileNum: customerData.mobileNum,
                        total: cart.total,
                        method: 0,
                      })
                    }
                  >
                    CASH ON DELIVERY
                  </button>
                  <PayPalScriptProvider
                    options={{
                      'client-id':
                        'AfpGqko9bMhp_U0YFhPPC2DxsTtWDl0gfAUiEGOI8x-bQqSd-bnE4ceKhRjvbzp_Wuhu1QJQaemz1_nt',
                      components: 'buttons',
                      currency: 'USD',
                      'disable-funding': 'credit,card,p24',
                    }}
                  >
                    <ButtonWrapper currency={currency} showSpinner={false} />
                  </PayPalScriptProvider>
                </div>
              ) : (
                <button
                  onClick={() => setClickedCheckout(true)}
                  className={styles.button}
                >
                  CHECKOUT NOW!
                </button>
              )}
            </div>
          </div>
        </>
      ) : (
        <div className={styles.emptyCartText}>
          Cart is Empty, Add Delicious Pizza From <Link href='/'><a className={styles.homeLink}>Home</a></Link>
        </div>
      )}
      {clickedCheckout && (
        <OrderDetail
          total={cart.total}
          createOrder={createOrder}
          customerData={customerData}
          setCustomerData={setCustomerData}
          setClickedCheckout={setClickedCheckout}
          setShowPaymentOpt={setShowPaymentOpt}
        />
      )}
    </div>
  );
};

export default Cart;
