import React from 'react'
import './lending.css'

const Lending = () => {
    return (
        <div className='lendingcontainer'>
            <div className='lendingimg'>
                <img src='https://cdn.dribbble.com/users/260537/screenshots/3981198/dribbble_animation.gif' alt='Splittingme' />
                <button>Choose NFT</button>
            </div>
            <div className='lendinginformation'>
                <h1>Your NFT Price: 100 USDC</h1>
                <button>Check Price</button>
                <button>Confirm</button>
            </div>
            <div className='lendingpayback'>
                <h1>Your Loan: 100 USDC</h1>
                <h1>Rate: 5%</h1>
                <h1>Total: {100 + 100 * (5 / 100)} USDC</h1>
                <button>Pay</button>
            </div>
        </div>
    )
}

export default Lending