import './swap.css'
import usdc from '../../assets/images/icon/usdc.svg'
import arrow from '../../assets/images/icon/211688_forward_arrow_icon.svg'
import { useState, useRef } from 'react'
import { useContractRead, useAccount, usePrepareContractWrite, useContractWrite, useWaitForTransaction } from 'wagmi'
import { parseEther } from 'viem'
import FactoryPool from '../../assets/deployment/FactoryPool.json'
import USDT from '../../assets/deployment/USDT.json'
import TokenAbi from '../../assets/artifacts/contracts/CampaignTypesTokenERC20.sol/CampaignTypesTokenERC20.json'
import { formatEther } from 'viem'
import { useEffect } from 'react'
import { useDebounce } from 'use-debounce'


function truncateAndEllipsis(text, maxLength = 20) {
    if (typeof text !== 'string') {
        text = text.toString(); // Chuyển đổi thành chuỗi nếu không phải là chuỗi
    }
    if (text.length <= maxLength) {
        return text;
    } else {
        return text.substring(0, maxLength - 3) + "...";
    }
}

function Token({ data, address, setBalance, setSymbol, handleAddActiveClass, setPool, setToken }) {
    const setData = () => {
        setPool(data)
        setBalance(String(quantity))
        setSymbol(symbol)
        handleAddActiveClass()
        setToken(Pooltoken?.[3])
    }

    const { data: Pooltoken } = useContractRead({
        address: FactoryPool.address,
        abi: [{
            "inputs": [
                {
                    "internalType": "address",
                    "name": "",
                    "type": "address"
                }
            ],
            "name": "campaigns",
            "outputs": [
                {
                    "internalType": "address",
                    "name": "owner",
                    "type": "address"
                },
                {
                    "internalType": "address",
                    "name": "campaignAddress",
                    "type": "address"
                },
                {
                    "internalType": "address",
                    "name": "token0",
                    "type": "address"
                },
                {
                    "internalType": "address",
                    "name": "token1",
                    "type": "address"
                }
            ],
            "stateMutability": "view",
            "type": "function"
        }],
        args: [data],
        functionName: 'campaigns',
        enabled: Boolean(data)
    })

    const { data: name } = useContractRead({
        address: Pooltoken?.[3],
        abi: [TokenAbi.abi[13]],
        functionName: 'name',
        enabled: Boolean(Pooltoken?.[3])
    })

    const { data: symbol } = useContractRead({
        address: Pooltoken?.[3],
        abi: [TokenAbi.abi[16]],
        functionName: 'symbol',
        enabled: Boolean(Pooltoken?.[3])
    })

    const { data: quantity } = useContractRead({
        address: Pooltoken?.[3],
        abi: [TokenAbi.abi[6]],
        functionName: 'balanceOf',
        args: [address],
        enabled: Boolean(Pooltoken?.[3]),
        watch: true,
        select: (data) => formatEther(data)
    })

    return (
        <div onClick={() => setData()} className='tokenlist'>
            <div>Symbol: {symbol}</div>
            <div>Name: {name}</div>
        </div>
    )
}

function TokenList({ address, handleAddActiveClass, setBalance, setSymbol, setPool, setToken }) {
    const { data: Poollist } = useContractRead({
        address: FactoryPool.address,
        abi: [{
            "inputs": [],
            "name": "getCampaignsAddresses",
            "outputs": [
                {
                    "internalType": "address[]",
                    "name": "",
                    "type": "address[]"
                }
            ],
            "stateMutability": "view",
            "type": "function"
        }],
        functionName: 'getCampaignsAddresses',
    })
    return (
        <>
            {
                Poollist?.map((data, index) => (
                    String(data) !== '0' && <div key={index} >
                        <Token data={data} address={address} setBalance={setBalance} setSymbol={setSymbol} handleAddActiveClass={handleAddActiveClass} setPool={setPool} setToken={setToken} />
                    </div>
                ))
            }
        </>
    )
}

const Swap = () => {
    const { address } = useAccount()
    const [quantity, setQuantity] = useState('')
    const [balance, setBalance] = useState('')
    const [symbol, setSymbol] = useState(null)
    const [pool, setPool] = useState(null)
    const [token, setToken] = useState(null)
    const [token1, setToken1] = useState(null)
    const [token2, setToken2] = useState(null)
    const [mode, setMode] = useState(true)
    const [finalquant] = useDebounce(quantity, 200)
    const elementRef = useRef(null);

    const { data: usdtbalance } = useContractRead({
        address: USDT.address,
        abi: [{
            "inputs": [
                {
                    "internalType": "address",
                    "name": "account",
                    "type": "address"
                }
            ],
            "name": "balanceOf",
            "outputs": [
                {
                    "internalType": "uint256",
                    "name": "",
                    "type": "uint256"
                }
            ],
            "stateMutability": "view",
            "type": "function"
        }],
        functionName: 'balanceOf',
        args: [address],
        select: (data) => formatEther(data),
        watch: true,
        enabled: Boolean(address),
    })

    const { data: allowanceusdt } = useContractRead({
        address: USDT.address,
        abi: [{
            "inputs": [
                {
                    "internalType": "address",
                    "name": "owner",
                    "type": "address"
                },
                {
                    "internalType": "address",
                    "name": "spender",
                    "type": "address"
                }
            ],
            "name": "allowance",
            "outputs": [
                {
                    "internalType": "uint256",
                    "name": "",
                    "type": "uint256"
                }
            ],
            "stateMutability": "view",
            "type": "function"
        }],
        functionName: "allowance",
        args: [address, pool],
        watch: true,
        enabled: Boolean(address) && Boolean(pool),
        select: (data) => formatEther(data)
    })
    const { data: allowancetoken } = useContractRead({
        address: token,
        abi: [{
            "inputs": [
                {
                    "internalType": "address",
                    "name": "",
                    "type": "address"
                },
                {
                    "internalType": "address",
                    "name": "",
                    "type": "address"
                }
            ],
            "name": "allowance",
            "outputs": [
                {
                    "internalType": "uint256",
                    "name": "",
                    "type": "uint256"
                }
            ],
            "stateMutability": "view",
            "type": "function"
        }],
        functionName: "allowance",
        args: [address, pool],
        enabled: Boolean(address),
        watch: true,
        select: (data) => formatEther(data)
    })
    const { config: usdtApprove } = usePrepareContractWrite({
        address: USDT.address,
        abi: [{
            "inputs": [
                {
                    "internalType": "address",
                    "name": "spender",
                    "type": "address"
                },
                {
                    "internalType": "uint256",
                    "name": "amount",
                    "type": "uint256"
                }
            ],
            "name": "approve",
            "outputs": [
                {
                    "internalType": "bool",
                    "name": "",
                    "type": "bool"
                }
            ],
            "stateMutability": "nonpayable",
            "type": "function"
        }],
        functionName: "approve",
        args: [pool, parseEther(String((usdtbalance || '0')))],
    })
    const { config: TokenApprove } = usePrepareContractWrite({
        address: token,
        abi: [{
            "inputs": [
                {
                    "internalType": "address",
                    "name": "spender",
                    "type": "address"
                },
                {
                    "internalType": "uint256",
                    "name": "value",
                    "type": "uint256"
                }
            ],
            "name": "approve",
            "outputs": [
                {
                    "internalType": "bool",
                    "name": "",
                    "type": "bool"
                }
            ],
            "stateMutability": "nonpayable",
            "type": "function"
        }],
        functionName: "approve",
        args: [pool, parseEther('10000')],
        enabled: Boolean(address),
    })
    const { config: swapp } = usePrepareContractWrite({
        address: pool,
        abi: [{
            "inputs": [
                {
                    "internalType": "address",
                    "name": "_from",
                    "type": "address"
                },
                {
                    "internalType": "address",
                    "name": "_to",
                    "type": "address"
                },
                {
                    "internalType": "uint256",
                    "name": "_amount",
                    "type": "uint256"
                }
            ],
            "name": "swap",
            "outputs": [],
            "stateMutability": "nonpayable",
            "type": "function"
        }],
        functionName: "swap",
        args: [token1, token2, parseEther((finalquant ? String(finalquant) : '0'))],
        enabled: Boolean(address)
    })
    const { data: usdtapprove, write: approveusdt, isLoading: loadapproveusdt } = useContractWrite(usdtApprove)
    const { data: tokenapprove, write: approvetoken, isLoading: loadapprovetoken } = useContractWrite(TokenApprove)
    const { data: swappp, write: Swapp, isLoading: swapload } = useContractWrite(swapp)
    const { isLoading: approving, isSuccess: approvesuccess } = useWaitForTransaction({
        data: usdtapprove?.hash
    })
    const { isLoading: approvingtoken, isSuccess: approvetokensuccess } = useWaitForTransaction({
        data: tokenapprove?.hash
    })
    const { isLoading: swapping, isSuccess: swapsuccess } = useWaitForTransaction({
        data: swappp?.hash
    })

    const handleinput = (e) => {

        const regex = /^[0-9]*\.?[0-9]*$/;
        if (regex.test(e.target.value)) {
            setQuantity(e.target.value);
        }

        if (e.target.value === '') {
            setQuantity(e.target.value);
        }

        if (mode) {
            if (parseFloat(e.target.value) > parseFloat(balance)) {
                setQuantity(balance);
            }
        }
        else {
            if (parseFloat(e.target.value) > parseFloat(usdtbalance)) {
                setQuantity(usdtbalance);
            }
        }

    }

    const handleAddActiveClass = () => {
        elementRef.current.classList.toggle('active');
    };

    const swap = () => {
        if (mode) {
            if (Number(allowancetoken) < Number(finalquant)) {
                approvetoken?.()
            }
            else {
                Swapp?.()
            }
        }

        else {
            if (Number(allowanceusdt) < Number(finalquant)) {
                approveusdt?.()
            }
            else {
                Swapp?.()
            }
        }
    }

    useEffect(() => {
        if (mode) {
            setToken1(token)
            setToken2(USDT.address)
        }
        else {
            setToken1(USDT.address)
            setToken2(token)
        }
    }, [mode, token])

    return (
        <div className='swapcontainer'>
            <div class="wrapper">
                <div><span class="dot"></span></div>
                <div><span class="dot"></span></div>
                <div><span class="dot"></span></div>
                <div><span class="dot"></span></div>
                <div><span class="dot"></span></div>
                <div><span class="dot"></span></div>
                <div><span class="dot"></span></div>
                <div><span class="dot"></span></div>
                <div><span class="dot"></span></div>
                <div><span class="dot"></span></div>
                <div><span class="dot"></span></div>
                <div><span class="dot"></span></div>
                <div><span class="dot"></span></div>
                <div><span class="dot"></span></div>
                <div><span class="dot"></span></div>
            </div>
            {
                mode && <div className='swap' >
                    {
                        <div className='tokencontainer' ref={elementRef}>
                            <TokenList address={address} setBalance={setBalance} setSymbol={setSymbol} handleAddActiveClass={handleAddActiveClass} setPool={setPool} setToken={setToken} />
                        </div>
                    }
                    <div className='input'>
                        <label>Tokens Pay</label>
                        <div className='inputcontent'>
                            <input placeholder='0' value={quantity} onChange={(e) => handleinput(e)}></input>
                            <div id='choosetoken' onClick={() => handleAddActiveClass()}>
                                <img src={usdc} alt='usdc' />
                                <h2>{symbol}</h2>
                                <img className="arrow" src={arrow} alt="down2" />
                            </div>
                        </div>
                        <h3>Balance: {truncateAndEllipsis((balance ?? 0), 20)} {symbol}</h3>
                    </div>

                    <div onClick={() => setMode(!mode)} className='swapbtn'>↕</div>

                    <div className='input'>
                        <label>You reveive</label>
                        <div className='inputcontent'>
                            <input placeholder='0' disabled></input>
                            <div>
                                <img src={usdc} alt='usdc' />
                                <h2>USDT</h2>
                            </div>
                        </div>

                        <h3>Balance: {truncateAndEllipsis((usdtbalance ?? '0'), 20)} USDT</h3>
                    </div>
                    <button disabled={!address || !quantity || (swapping && !swapsuccess) || (approving && !approvesuccess) || swapload || loadapproveusdt || loadapprovetoken || (approvingtoken && !approvetokensuccess)} onClick={() => swap()}>{((swapping && !swapsuccess) || (approving && !approvesuccess) || swapload || loadapproveusdt || loadapprovetoken || (approvingtoken && !approvetokensuccess)) ? 'Swapping' : 'Swap'}</button>
                </div>
            }

            {
                !mode && <div className='swap' >
                    {
                        <div className='tokencontainer' ref={elementRef}>
                            <TokenList address={address} setBalance={setBalance} setSymbol={setSymbol} handleAddActiveClass={handleAddActiveClass} setPool={setPool} setToken={setToken} />
                        </div>
                    }
                    <div className='input'>
                        <label>Tokens Pay</label>
                        <div className='inputcontent'>
                            <input placeholder='0' value={quantity} onChange={(e) => handleinput(e)}></input>

                            <div>
                                <img src={usdc} alt='usdc' />
                                <h2>USDT</h2>
                            </div>
                        </div>

                        <h3>Balance: {truncateAndEllipsis((usdtbalance ?? '0'), 20)} USDT</h3>

                    </div>

                    <div onClick={() => setMode(!mode)} className='swapbtn'>↕</div>

                    <div className='input'>
                        <label>You reveive</label>
                        <div className='inputcontent'>
                            <input placeholder='0' disabled></input>
                            <div id='choosetoken' onClick={() => handleAddActiveClass()}>
                                <img src={usdc} alt='usdc' />
                                <h2>{symbol}</h2>
                                <img className="arrow" src={arrow} alt="down2" />
                            </div>
                        </div>
                        <h3>Balance: {truncateAndEllipsis((balance || '0'), 20)} {symbol}</h3>
                    </div>
                    <button disabled={!address || !quantity || (swapping && !swapsuccess) || (approving && !approvesuccess) || swapload || loadapproveusdt || loadapprovetoken || (approvingtoken && !approvetokensuccess)} onClick={() => swap()}>{((swapping && !swapsuccess) || (approving && approvesuccess) || swapload || loadapproveusdt || loadapprovetoken || (approvingtoken && !approvetokensuccess)) ? 'Swapping' : 'Swap'}</button>
                </div>
            }

        </div>
    )
}

export default Swap