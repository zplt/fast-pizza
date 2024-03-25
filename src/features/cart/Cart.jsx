import { Link } from 'react-router-dom';
import LinkButton from "../../ui/LinkButton.jsx";
import Button from "../../ui/Button.jsx";
import CartItem from "./CartItem.jsx";
import {useDispatch, useSelector} from "react-redux";
import {clearCart, getCart} from "./cartSlice.js";
import EmptyCart from "./EmptyCart.jsx";

function Cart() {
  const dispatch = useDispatch()
  const username = useSelector(state => state.user.username)
  const cart = useSelector(getCart);

  if(!cart.length) return <EmptyCart/>

  return (
    <div className={'px-4 py-3 '}>
      <LinkButton to="/menu" className={'text-sm text-blue-500 hover:text-blue-700 hover:underline'}>&larr; Back to menu</LinkButton>

      <h2 className={'mt-7 text-xl font-semibold'}>Your cart, {username}</h2>

      <ul className={'divide-y divide-stone-400 border-b mt-3'}>
        {cart.map((item)=>(
            <CartItem item={item} key={item.id}/>
        ))}
      </ul>

      <div className={'mt-6 space-x-2'}>
        <Button type={'primary'} to="/order/new">Order pizzas</Button>

        <Button type={'secondary'} onClick={()=>dispatch(clearCart())}>Clear cart</Button>

      </div>
    </div>
  );
}

export default Cart;
