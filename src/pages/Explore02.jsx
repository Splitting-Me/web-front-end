import React from 'react';
import PageTitle from '../components/pagetitle/PageTitle';
import HotPick from '../components/hotpick/HotPick';
import { useAccount, useContractRead } from 'wagmi';
import Market from '../assets/deployment/MarketPlace.json'
import { useState } from 'react';
import { address } from 'faker/lib/locales/az';


function Explore02() {
    const { address } = useAccount()
    const [mode, setMode] = useState('Market')
    const { data: nftlitts } = useContractRead({
        address: Market.address,
        abi: [{
            "inputs": [],
            "name": "getNFTs",
            "outputs": [
                {
                    "internalType": "uint256[]",
                    "name": "",
                    "type": "uint256[]"
                }
            ],
            "stateMutability": "view",
            "type": "function"
        }],
        functionName: 'getNFTs',
        watch: true,
        enabled: true,
    })


    return (
        <div className='page-explore'>
            <PageTitle title='Marketplace' />
            <div className='btn-market'>
                <button onClick={() => setMode('Market')} className={`${(mode === 'Market' ? 'active' : '')}`} >Market</button>
                <button onClick={() => setMode('MyNFT')} className={`${mode === 'MyNFT' ? 'active' : ''} ${address ? '' : 'on'}`}>Your NFT</button>
            </div>
            {(mode === 'MyNFT' && <HotPick data={nftlitts} mode={'MyNFT'} />)}
            {(mode === 'Market' && <HotPick data={nftlitts} mode={'Market'} />)}
        </div>
    );
}

export default Explore02;