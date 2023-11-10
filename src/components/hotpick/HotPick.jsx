import React, { useState } from 'react';
import './style.scss';
import CardModal from '../layouts/CardModal';
import icon1 from '../../assets/images/icon/rain1.svg'
import icon2 from '../../assets/images/icon/rain2.svg'
import icon3 from '../../assets/images/icon/usdc.svg'
import { Link } from 'react-router-dom';
import USDT from '../../assets/deployment/USDT.json'
import Market from '../../assets/deployment/MarketPlace.json'
import { useAccount, useContractRead, usePrepareContractWrite, useContractWrite, useWaitForTransaction } from 'wagmi';
import { formatEther, parseEther } from 'viem';

const shortenMiddle = (inputString, keepLength) => {
    if (inputString.length <= keepLength * 2) {
        return inputString;
    }

    const start = inputString.slice(0, keepLength);
    const end = inputString.slice(-keepLength);

    return `${start}...${end}`;
};

function NFT({ data, address, shop }) {
    const [modalShow, setModalShow] = useState(false);
    const [mode, setMode] = useState('')

    const { data: pricenft } = useContractRead({
        address: Market.address,
        abi: [{
            "inputs": [
                {
                    "internalType": "uint256",
                    "name": "",
                    "type": "uint256"
                }
            ],
            "name": "idToListedNFT",
            "outputs": [
                {
                    "internalType": "uint256",
                    "name": "tokenId",
                    "type": "uint256"
                },
                {
                    "internalType": "address payable",
                    "name": "seller",
                    "type": "address"
                },
                {
                    "internalType": "uint256",
                    "name": "price",
                    "type": "uint256"
                }
            ],
            "stateMutability": "view",
            "type": "function"
        }],
        args: [Number(data)],
        functionName: 'idToListedNFT',
        watch: true,
        enabled: Boolean(data),
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
        args: [address, Market.address],
        watch: true,
        enabled: Boolean(address) && Boolean(Market.address),
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
        args: [Market.address, String((pricenft?.[2]) ?? '0')],
        enabled: Boolean(address) && Boolean(Number(allowanceusdt) < Number(pricenft?.[2])),
    })

    const { config: buyNFT } = usePrepareContractWrite({
        address: Market.address,
        abi: [{
            "inputs": [
                {
                    "internalType": "uint256",
                    "name": "_tokenId",
                    "type": "uint256"
                }
            ],
            "name": "buyNFT",
            "outputs": [],
            "stateMutability": "payable",
            "type": "function"
        }],
        functionName: "buyNFT",
        args: [data],
        enabled: Boolean(address) && Boolean(pricenft?.[2]) && Boolean(address !== String(pricenft?.[1])),
    })
    const { config: cancelListedNFT } = usePrepareContractWrite({
        address: Market.address,
        abi: [{
            "inputs": [
                {
                    "internalType": "uint256",
                    "name": "_tokenId",
                    "type": "uint256"
                }
            ],
            "name": "cancelListedNFT",
            "outputs": [],
            "stateMutability": "nonpayable",
            "type": "function"
        }],
        functionName: "cancelListedNFT",
        args: [data],
        enabled: Boolean(address) && Boolean(pricenft?.[2]) && Boolean(address === String(pricenft?.[1])),
    })

    const { data: usdtapprove, write: approveusdt, isLoading: loadapproveusdt } = useContractWrite(usdtApprove)
    const { data: buynft, write: buy, isLoading: buynftload } = useContractWrite(buyNFT)
    const { data: cancelnft, write: cancel, isLoading: cancelload } = useContractWrite(cancelListedNFT)
    const { isLoading: LoadingUSDTApprove, isSuccess: approveSucces } = useWaitForTransaction({
        enabled: Boolean(address),
        hash: usdtapprove?.hash,
    })

    const { isLoading: LoadingbuyNFT } = useWaitForTransaction({
        enabled: Boolean(address),
        hash: buynft?.hash,
    })

    const { isLoading: CancelNFT } = useWaitForTransaction({
        enabled: Boolean(address),
        hash: cancelnft?.hash,
    })
    const Purchase = () => {
        if (Number(allowanceusdt) < Number(formatEther(pricenft?.[2]))) {
            approveusdt?.()
        }
        else {
            buy?.()
        }
    }

    const Edit = () => {
        setModalShow(true)
        setMode('edit')
    }

    const Cancel = () => {
        cancel?.()
    }

    return (
        <>{
            (shop === 'Market' && address !== pricenft?.[1]) ?
                <div className="col-xl-3 col-lg-4 col-md-6 col-sm-6 tf-loadmore 3d cyber">
                    <div className="sc-product style2">
                        <div className="top">
                            <div className="tag">{data}</div>
                        </div>
                        <div className="bottom">
                            <div className="details-product">
                                <div className="author">
                                    <div className="avatar">
                                        <img src='https://pub-static.fotor.com/assets/projects/pages/d5bdd0513a0740a8a38752dbc32586d0/fotor-03d1a91a0cec4542927f53c87e0599f6.jpg' alt="images" />
                                    </div>
                                    <div className="content">
                                        <div className="position">Owner</div>
                                        <div className="name">{shortenMiddle(String((pricenft?.[1]) ?? '0'), 12)}</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="features">
                            <div className="product-media">
                                <img src='https://toquoc.mediacdn.vn/280518851207290880/2023/4/28/screenshot3-1682666317502330816495.png' alt="images" />
                            </div>
                            <div className="rain-drop1"><img src={icon1} alt="images" /></div>
                            <div className="rain-drop2"><img src={icon2} alt="images" /></div>
                        </div>
                        <div className="bottom-style2">
                            <div className="price">
                                <div className="icon"><img src={icon3} alt="images" /></div>
                                <div className="content">
                                    <div className="cash">{String(formatEther((pricenft?.[2]) ?? 0))}</div>
                                    <div className="name">USDT</div>
                                </div>
                            </div>

                            {
                                address === String(pricenft?.[1]) ?
                                    <>
                                        <Link to='' onClick={() => { Edit() }} className="button-cus m-cus"> {((LoadingUSDTApprove && !approveSucces) || loadapproveusdt) ? 'Approving..' : (LoadingbuyNFT || buynftload) ? 'Buying' : 'Edit'}</Link>
                                        <Link to='' onClick={() => { Cancel() }} className="button-cus"> {(cancelload || CancelNFT) ? 'Cancelling' : 'Cancel'}</Link>
                                    </>

                                    : <Link to='' onClick={() => { Purchase() }} className="button-cus"> {((LoadingUSDTApprove && !approveSucces) || loadapproveusdt) ? 'Approving..' : (LoadingbuyNFT || buynftload) ? 'Buying' : 'Purchase'}</Link>
                            }



                        </div>

                        <CardModal
                            show={modalShow}
                            mode={mode}
                            id={data}
                            onHide={() => setModalShow(false)}
                        />
                    </div>
                </div>
                : (shop === 'MyNFT' && address === pricenft?.[1]) ?
                    <div className="col-xl-3 col-lg-4 col-md-6 col-sm-6 tf-loadmore 3d cyber">
                        < div className="sc-product style2">
                            <div className="top">
                                <div className="tag">{data}</div>
                            </div>
                            <div className="bottom">
                                <div className="details-product">
                                    <div className="author">
                                        <div className="avatar">
                                            <img src='https://pub-static.fotor.com/assets/projects/pages/d5bdd0513a0740a8a38752dbc32586d0/fotor-03d1a91a0cec4542927f53c87e0599f6.jpg' alt="images" />
                                        </div>
                                        <div className="content">
                                            <div className="position">Owner</div>
                                            <div className="name">{shortenMiddle(String((pricenft?.[1]) ?? '0'), 12)}</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="features">
                                <div className="product-media">
                                    <img src='https://toquoc.mediacdn.vn/280518851207290880/2023/4/28/screenshot3-1682666317502330816495.png' alt="images" />
                                </div>
                                <div className="rain-drop1"><img src={icon1} alt="images" /></div>
                                <div className="rain-drop2"><img src={icon2} alt="images" /></div>
                            </div>
                            <div className="bottom-style2">
                                <div className="price">
                                    <div className="icon"><img src={icon3} alt="images" /></div>
                                    <div className="content">
                                        <div className="cash">{String(formatEther((pricenft?.[2]) ?? 0))}</div>
                                        <div className="name">USDT</div>
                                    </div>
                                </div>

                                {
                                    address === String(pricenft?.[1]) ?
                                        <>
                                            <Link to='' onClick={() => { Edit() }} className="button-cus m-cus"> {((LoadingUSDTApprove && !approveSucces) || loadapproveusdt) ? 'Approving..' : (LoadingbuyNFT || buynftload) ? 'Buying' : 'Edit'}</Link>
                                            <Link to='' onClick={() => { Cancel() }} className="button-cus"> {(cancelload || CancelNFT) ? 'Cancelling' : 'Cancel'}</Link>
                                        </>

                                        : <Link to='' onClick={() => { Purchase() }} className="button-cus"> {((LoadingUSDTApprove && !approveSucces) || loadapproveusdt) ? 'Approving..' : (LoadingbuyNFT || buynftload) ? 'Buying' : 'Purchase'}</Link>
                                }



                            </div>

                            <CardModal
                                show={modalShow}
                                mode={mode}
                                id={data}
                                onHide={() => setModalShow(false)}
                            />
                        </div >
                    </div>
                    : <div className='dp-none'></div>
        }
        </>
    )
}




function HotPick({ data, mode }) {
    const { address } = useAccount()


    return (
        <section className="tf-hot-pick">
            <div className="tf-container">
                <div className="row ">
                    <div className="col-md-12 pd32">
                        <div className="tf-heading wow fadeInUp">

                        </div>
                    </div>
                    <div className="col-md-12">
                        {
                            <div className="row tf-filter-container wow fadeInUp">
                                {
                                    data?.map(idx => (

                                        <NFT data={String(idx)} address={address} shop={mode} key={idx} />

                                    ))
                                }
                            </div>
                        }



                    </div>

                </div>
            </div>


        </section>
    );
}

export default HotPick;