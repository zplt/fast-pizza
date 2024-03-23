import React from 'react';
import {Link} from "react-router-dom";
import SearchOrder from "../features/order/SearchOrder.jsx";
import Username from "../features/users/Username.jsx";

function Header() {
    return (
        <header className={'bg-yellow-500 uppercase px-4 py-3 border-b border-stone-500 sm:px-6 flex items-center justify-between'} >
            <Link className={'tracking-widest]'} to={'/'}>Fast React Pizza Co.</Link>

            <SearchOrder/>
            <Username />
        </header>
    );
}

export default Header;