import { useState } from 'react';
import './style.css';
import { useContractRead, usePrepareContractWrite, useContractWrite, useWaitForTransaction, useAccount } from 'wagmi';
import FactoryPool from '../../assets/deployment/FactoryPool.json'
import USDT from '../../assets/deployment/USDT.json'
import { parseEther, formatEther } from 'viem';

function Tokenname(Pooltoken) {
    const { data: tokenname } = useContractRead({
        address: Pooltoken?.[3],
        abi: [{
            "inputs": [],
            "name": "symbol",
            "outputs": [
                {
                    "internalType": "string",
                    "name": "",
                    "type": "string"
                }
            ],
            "stateMutability": "view",
            "type": "function"
        }],
        functionName: 'symbol',
        enabled: Boolean(Pooltoken)
    })

    return tokenname
}

function USDTtotal(Pooltoken, data) {
    const { data: usdttotal } = useContractRead({
        address: data,
        abi: [{
            "inputs": [],
            "name": "poolusdtToken",
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
        functionName: "poolusdtToken",
        enabled: Boolean(Pooltoken),
        select: (data) => formatEther(data),
        watch: true,
    })

    return usdttotal
}

function Tokentotal(Pooltoken, data) {
    const { data: tokentotal } = useContractRead({
        address: data,
        abi: [{
            "inputs": [],
            "name": "poolToken1",
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
        functionName: "poolToken1",
        enabled: Boolean(Pooltoken),
        watch: true,
    })

    return tokentotal
}


function Poolitem({ pooladdress }) {
    const { address } = useAccount()
    const [usdtfram, setUsdtfram] = useState(null)
    const [tokenadd, setTokenadd] = useState(null)

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
        args: [pooladdress],
        functionName: 'campaigns',
        enabled: Boolean(pooladdress)
    })
    const tokenname = Tokenname(Pooltoken)
    const usdttotal = USDTtotal(Pooltoken, pooladdress)
    const tokentotal = Tokentotal(Pooltoken, pooladdress)

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
    const { data: tokenbalance } = useContractRead({
        address: Pooltoken?.[3],
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
        enabled: Boolean(Pooltoken?.[3]),
        watch: true,
        select: (data) => formatEther(data)
    })
    const { data: allowancetoken } = useContractRead({
        address: Pooltoken?.[3],
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
        args: [address, pooladdress],
        enabled: Boolean(address),
        watch: true,
        cacheTime: 2_000,
        select: (data) => formatEther(data)
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
        args: [address, pooladdress],
        enabled: Boolean(address),
        watch: true,
        cacheTime: 2_000,
        select: (data) => formatEther(data)
    })
    const { data: ballanceyouadd } = useContractRead({
        address: pooladdress,
        abi: [{
            "inputs": [
                {
                    "internalType": "address",
                    "name": "",
                    "type": "address"
                }
            ],
            "name": "balancesAddPool",
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
        functionName: "balancesAddPool",
        args: [address],
        enabled: Boolean(address),
        watch: true,
        select: (data) => formatEther(data)
    })
    const { config: TokenApprove } = usePrepareContractWrite({
        address: Pooltoken?.[3],
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
        args: [pooladdress, parseEther('10000')],
        enabled: Boolean(tokenadd) && Boolean(parseFloat((allowancetoken ?? 0)) < parseFloat(tokenadd)),
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
        args: [pooladdress, parseEther('10000')],
        enabled: Boolean(usdtfram) && Boolean(parseFloat(allowanceusdt) < parseFloat((usdtfram ?? 0))),
    })
    const { data: tokenapprove, write: approvetoken, isLoading: loadapprovetoken } = useContractWrite(TokenApprove)
    const { data: usdtapprove, write: approveusdt, isLoading: loadapproveusdt } = useContractWrite(usdtApprove)
    const { isLoading: LoadingTokenApprove, isSuccess: SuccessTokenApprove } = useWaitForTransaction({
        enabled: Boolean(tokenapprove),
        hash: tokenapprove?.hash,
    })
    const { isLoading: LoadingUSDTApprove, isSuccess: SuccessUSDTApprove } = useWaitForTransaction({
        enabled: Boolean(usdtapprove),
        hash: usdtapprove?.hash,
    })
    const { config: AddPool } = usePrepareContractWrite({
        address: pooladdress,
        abi: [{
            "inputs": [
                {
                    "internalType": "address",
                    "name": "_token1",
                    "type": "address"
                },
                {
                    "internalType": "uint256",
                    "name": "_amount",
                    "type": "uint256"
                }
            ],
            "name": "addPoolToken",
            "outputs": [],
            "stateMutability": "nonpayable",
            "type": "function"
        }],
        functionName: "addPoolToken",
        args: [Pooltoken?.[3], parseEther(String(tokenadd ?? '0'))],
        enabled: Boolean(Pooltoken?.[0] === address) && Boolean(parseFloat(allowancetoken) > parseFloat((tokenadd ?? 0))) && Boolean(tokenadd)
    })
    const { config: FramPool } = usePrepareContractWrite({
        address: pooladdress,
        abi: [{
            "inputs": [
                {
                    "internalType": "address",
                    "name": "_tokenUSDT",
                    "type": "address"
                },
                {
                    "internalType": "uint256",
                    "name": "_amount",
                    "type": "uint256"
                }
            ],
            "name": "FramPool",
            "outputs": [],
            "stateMutability": "nonpayable",
            "type": "function"
        }],
        functionName: "FramPool",
        args: [USDT.address, parseEther(String(usdtfram ?? '0'))],
        enabled: Boolean(parseFloat(allowanceusdt) > parseFloat((usdtfram ?? 0))) && Boolean(usdtfram)
    })

    const { config: WithDraw } = usePrepareContractWrite({
        address: pooladdress,
        abi: [{
            "inputs": [],
            "name": "withdrawPool",
            "outputs": [],
            "stateMutability": "nonpayable",
            "type": "function"
        }],
        functionName: "withdrawPool",
        enabled: Boolean(parseFloat(ballanceyouadd) > 0),
    })

    const { data: addpool, write: add, isLoading: loadadd } = useContractWrite(AddPool)
    const { data: frampool, write: fram, isLoading: loadfram } = useContractWrite(FramPool)
    const { data: withdraw, write: draw, isLoading: loaddraw } = useContractWrite(WithDraw)

    const { isLoading: AddPoolLoading } = useWaitForTransaction({
        enabled: Boolean(addpool),
        hash: addpool?.hash,
    })
    const { isLoading: FramPoolLoading } = useWaitForTransaction({
        enabled: Boolean(frampool),
        hash: frampool?.hash,
    })
    const { isLoading: withdrawLoading } = useWaitForTransaction({
        enabled: Boolean(address),
        hash: withdraw?.hash,
    })

    const addPool = () => {
        if (parseFloat(allowancetoken) < parseFloat(tokenadd)) {
            approvetoken?.()
        }
        else {
            add?.()
        }
    }
    const framPool = () => {
        if (parseFloat(allowanceusdt) < parseFloat(usdtfram ?? 0)) {
            approveusdt?.()
        }
        else {
            console.log()
            fram?.()
        }
    }
    const handleinput = (e, mode) => {
        const regex = /^[0-9]*\.?[0-9]*$/;
        if (regex.test(e.target.value)) {
            if (mode === 'add') {
                setTokenadd(e.target.value);
            }
            else {
                setUsdtfram(e.target.value);
            }

        }

        if (e.target.value === '') {
            if (mode === 'add') {
                setTokenadd(e.target.value);
            }
            else {
                setUsdtfram(e.target.value);
            }
        }

        if (mode === 'add') {
            if (parseFloat(e.target.value) > parseFloat(tokenbalance)) {
                setTokenadd(tokenbalance);
            }
        }
        else {
            if (parseFloat(e.target.value) > parseFloat(usdtbalance)) {
                setUsdtfram(usdtbalance);
            }
        }
    }

    return (
        <div className='grid-items'>
            < div className='grid-item item1' >
                <img className="imaging" src='https://upload.wikimedia.org/wikipedia/commons/9/92/Backyardpool.jpg' alt={pooladdress} />
                <div className='name'>{pooladdress}</div>
            </div >
            <div className='grid-item item2'>
                <div className='title'>Liquidty Pool : </div>
                <div className='total'>{tokenname}/USDT - {formatEther(String(tokentotal))}/{String(usdttotal)} </div>
            </div>
            <div className='grid-item item3'>
                {Pooltoken?.[0] === address &&
                    <div className='addfram'>
                        <input className='inputquantpool1' placeholder='0' value={tokenadd} onChange={(e) => handleinput(e, 'add')}></input>
                        <button disabled={((LoadingUSDTApprove && !SuccessUSDTApprove) || loadapproveusdt || FramPoolLoading || loadfram)} className='stake1' onClick={() => addPool()}> {(loadadd || AddPoolLoading || loadapprovetoken || (LoadingTokenApprove && SuccessTokenApprove)) ? 'Adding...' : 'Add Pool'}</button>
                    </div>
                }
                <div className='addfram'>
                    <input className='inputquantpool2' placeholder='0' value={usdtfram} onChange={(e) => handleinput(e, 'fram')}></input>
                    <button disabled={!address || (loadadd || AddPoolLoading || loadapprovetoken || (LoadingTokenApprove && !SuccessTokenApprove))} className='stake2' onClick={() => framPool()}> {((LoadingUSDTApprove && !SuccessUSDTApprove) || loadapproveusdt || FramPoolLoading || loadfram) ? 'Framing...' : 'Fram Pool'}</button>
                </div>
                <button disabled={!address} onClick={() => draw?.()} className='harvest'>{(loaddraw || withdrawLoading) ? 'Withdrawing..' : 'Withdraw'}</button >
            </div>
        </div >
    )
}

function Pool({ datas }) {
    return (
        <div className='grid-container'>
            {datas?.map((data) => (
                <div key={data}>
                    <Poolitem pooladdress={data} />
                </div>
            ))}
        </div>
    );
}

export default Pool;
