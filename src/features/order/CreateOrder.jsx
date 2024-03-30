import {useState} from "react";
import {Form, redirect, useActionData, useNavigation} from "react-router-dom";
import {createOrder} from "../../services/apiRestaurant.js";
import Button from "../../ui/Button.jsx";
import {useDispatch, useSelector} from "react-redux";
import {clearCart, getCart, getTotalCartPrice} from "../cart/cartSlice.js";
import EmptyCart from "../cart/EmptyCart.jsx";
import store from "../../store.js";
import {formatCurrency} from "../../utils/helpers.js";
import {fetchAddress} from "../users/userSlice.js";

// https://uibakery.io/regex-library/phone-number
const isValidPhone = (str) =>
    /^\+?\d{1,4}?[-.\s]?\(?\d{1,3}?\)?[-.\s]?\d{1,4}[-.\s]?\d{1,4}[-.\s]?\d{1,9}$/.test(
        str
    );

function CreateOrder() {
    const [withPriority, setWithPriority] = useState(false);
    const navigation = useNavigation()
    const dispatch = useDispatch()
    const isSubmitting = navigation.state === "submitting"

    const {username, status: addressStatus, position, address, error: errorAddress} = useSelector(state => state.user)
    const isLoadingAddress = addressStatus === 'loading'

    const formError = useActionData() //to load data
    const cart = useSelector(getCart);
    const totalCartPrice = useSelector(getTotalCartPrice)
    const priortyPrice = totalCartPrice ? totalCartPrice * 0.2 : 0
    const totalPrice = totalCartPrice + priortyPrice

    if (!cart.length) return <EmptyCart/>

    return (
        <div className={'px-4 py-6'}>
            <h2 className={'text-xl font-semibold mb-8'}>Ready to order? Let's go!</h2>

            {/*<Form method={'POST'} action={'/order/new'}>*/}
            <Form method={'POST'}>
                <div className={'mb-5 flex gap-2 flex-col sm:flex-row sm:items-center'}>
                    <label className={'sm:basis-40'}>First Name</label>
                    <input
                        type="text"
                        name="customer"
                        required
                        className={'input w-full'}
                        defaultValue={username}
                    />
                </div>

                <div className={'mb-5 flex gap-2 flex-col sm:flex-row sm:items-center'}>
                    <label className={'sm:basis-40'}>Phone number</label>
                    <div className={'grow'}>
                        <input type="tel" name="phone" required className={'input w-full'}/>
                    </div>
                    {formError?.phone &&
                        <p className={'text-xs mt-2 text-red-700 bg-red-200 p-2 rounded-md'}>{formError.phone}</p>}
                </div>

                <div className={'mb-5 flex gap-2 flex-col sm:flex-row sm:items-center relative'}>
                    <label className={'sm:basis-40'}>Address</label>
                    <div className={'grow w-ful'}>
                        <input
                            type="text"
                            name="address"
                            disabled={isLoadingAddress}
                            defaultValue={address}
                            required
                            className={'input w-full'}
                        />
                        {addressStatus === 'error' &&
                            <p className={'text-xs mt-2 text-red-700 bg-red-200 p-2 rounded-md'}>{errorAddress}</p>}
                    </div>
                    {!position.latitude && !position.longitude &&
                        <span className={'absolute right-[4px] z-50 top-[3px] md:ring-[5px] md:top-[5px]'}>
                        <Button
                            disabled={isLoadingAddress || isSubmitting}
                            type={'small'}
                            onClick={(e) => {
                                e.preventDefault()
                                dispatch(fetchAddress())
                            }}>Get Position</Button>
                   </span>}
                </div>

                <div className={'mb-12 flex gap-5 items-center'}>
                    <input
                        type="checkbox"
                        name="priority"
                        id="priority"
                        value={withPriority}
                        onChange={(e) => setWithPriority(e.target.checked)}
                        className={'h-6 w-6 accent-yellow-400 focus:outline-none focus:ring focus:ring-yellow-400 focus:ring-offset-2'}
                    />
                    <label className={'font-medium'} htmlFor="priority">Want to yo give your order priority?</label>
                </div>

                <div>
                    <input type={"hidden"} name={'cart'} value={JSON.stringify(cart)}/>
                    <input type={'hidden'} name={'position'}
                           value={position.longitude && position.latitude ? `${position.latitude}, ${position.longitude}` : ''}/>
                    <Button type={'primary'}
                            disabled={isSubmitting}
                    >{isSubmitting ? 'Submitting' : `Order now from ${formatCurrency(totalPrice)}`}</Button>
                </div>
            </Form>
        </div>
    );
}

export async function action({request}) {

    const formData = await request.formData()

    const data = Object.fromEntries(formData)

    const order = {
        ...data,
        cart: JSON.parse(data.cart),
        priority: data.priority === "true"
    }

    const errors = {}
    if (!isValidPhone(order.phone)) errors.phone = "Please give us your correct your valid phone number. We might need it to contact you."

    if (Object.keys(errors).length > 0) return errors


    const newOrder = await createOrder(order)

    store.dispatch(clearCart())


    return redirect(`/order/${newOrder.id}`)
}

export default CreateOrder;
