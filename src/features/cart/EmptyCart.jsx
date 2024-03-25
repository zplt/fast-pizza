import { Link } from 'react-router-dom';
import Button from "../../ui/Button.jsx";
import LinkButton from "../../ui/LinkButton.jsx";

function EmptyCart() {
  return (
    <div className={'py-3 px-4'}>
        <LinkButton to="/menu" className={'text-sm text-blue-500 hover:text-blue-700 hover:underline'}>&larr; Back to menu</LinkButton>

      <p className={'font-semibold mt-7'}>Your cart is still empty. Start adding some pizzas :)</p>
    </div>
  );
}

export default EmptyCart;
