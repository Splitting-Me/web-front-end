import React, { useEffect, useState } from 'react';
import { Modal } from 'react-bootstrap';
import { useContractRead, usePrepareContractWrite, useContractWrite, useWaitForTransaction } from 'wagmi';
import NFT from '../../assets/deployment/NFTSplittingME.json'
import Market from '../../assets/deployment/MarketPlace.json'
import { formatEther, parseEther } from 'viem';

const CardModal = (props) => {
    const [price, setPrice] = useState('')

    const { data: approved } = useContractRead({
        address: NFT.address,
        abi: [{
            "inputs": [
                {
                    "internalType": "uint256",
                    "name": "tokenId",
                    "type": "uint256"
                }
            ],
            "name": "getApproved",
            "outputs": [
                {
                    "internalType": "address",
                    "name": "",
                    "type": "address"
                }
            ],
            "stateMutability": "view",
            "type": "function"
        }],
        functionName: 'getApproved',
        args: [props?.id],
        watch: true,
        enabled: Boolean(props?.id) && props.show,
    })
    const { data: nftprice } = useContractRead({
        address: Market.address,
        abi: [{
            "inputs": [
                {
                    "internalType": "uint256",
                    "name": "_tokenId",
                    "type": "uint256"
                }
            ],
            "name": "getPrice",
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
        functionName: 'getPrice',
        select: (data) => formatEther(data),
        args: [props?.id],
        watch: true,
        enabled: Boolean(props?.id) && props.show,
    })
    const { config: approvenft } = usePrepareContractWrite({
        address: NFT.address,
        abi: [{
            "inputs": [
                {
                    "internalType": "address",
                    "name": "to",
                    "type": "address"
                },
                {
                    "internalType": "uint256",
                    "name": "tokenId",
                    "type": "uint256"
                }
            ],
            "name": "approve",
            "outputs": [],
            "stateMutability": "nonpayable",
            "type": "function"
        }],
        functionName: 'approve',
        args: [Market.address, props?.id],
        enabled: Boolean(String(approved) !== Market.address) && props.show,
    })
    const { config: listnft } = usePrepareContractWrite({
        address: Market.address,
        abi: [{
            "inputs": [
                {
                    "internalType": "uint256",
                    "name": "_tokenId",
                    "type": "uint256"
                },
                {
                    "internalType": "uint256",
                    "name": "_price",
                    "type": "uint256"
                }
            ],
            "name": "listedNFT",
            "outputs": [],
            "stateMutability": "nonpayable",
            "type": "function"
        }],
        functionName: 'listedNFT',
        args: [props?.id, parseEther((String(price) ?? '0'))],
        enabled: Boolean(approved === Market.address) && props.show,
    })
    const { config: editnft } = usePrepareContractWrite({
        address: Market.address,
        abi: [{
            "inputs": [
                {
                    "internalType": "uint256",
                    "name": "_tokenId",
                    "type": "uint256"
                },
                {
                    "internalType": "uint256",
                    "name": "_price",
                    "type": "uint256"
                }
            ],
            "name": "editPrice",
            "outputs": [],
            "stateMutability": "nonpayable",
            "type": "function"
        }],
        functionName: 'editPrice',
        args: [props?.id, parseEther((String(price) ?? '0'))],
        enabled: Boolean(props?.id) && props.show,
    })
    const { write: approve, data: approvedd, isLoading: approveload } = useContractWrite(approvenft)
    const { write: list, data: listnfts, isLoading: listing } = useContractWrite(listnft)
    const { write: edit, data: editnfts, isLoading: editing } = useContractWrite(editnft)
    const { isLoading: approveloading, isSuccess: approvesuccess } = useWaitForTransaction({
        hash: approvedd?.hash
    })
    const { isLoading: listloading, isSuccess: listsuccess } = useWaitForTransaction({
        hash: listnfts?.hash
    })
    const { isLoading: editloading, isSuccess: editsuccess } = useWaitForTransaction({
        hash: editnfts?.hash
    })

    const sell = () => {
        if (approved !== Market.address) {
            approve?.()
        }

        else {
            list?.()
        }
    }

    useEffect(() => {
        if (listsuccess || editsuccess) {
            setPrice(0)
        }
    }, [listsuccess, editsuccess])

    const handleinput = (e) => {
        const regex = /^[0-9]+$/;
        if (regex.test(e.target.value)) {
            setPrice(e.target.value)
        }
        if (e.target.value === '') {
            setPrice(e.target.value)
        }
    }

    return (
        <Modal
            show={props.show}
            onHide={props.onHide}
        >
            <div className="modal-body space-y-20 pd-40">
                {
                    props.mode === 'sell' &&
                    <>
                        <p className="label-1">Enter price to sell </p>
                        <input type="text" className="form-control quantity form-bottom" value={price} onChange={(e) => handleinput(e)} />
                        <button disabled={(approveloading && !approvesuccess) || approveload} onClick={() => sell()} className="button-popup" data-toggle="modal" data-target="#popup_bid_success" data-dismiss="modal" aria-label="Close">{((approveloading && !approvesuccess) || approveload) ? 'Approving...' : (listing || (listloading && !listsuccess)) ? 'Selling...' : 'Sell'}</button>
                    </>
                }
                {
                    props.mode === 'edit' &&
                    <>
                        <p className="label-1">Enter price you edit </p>
                        <input type="text" className="form-control quantity form-bottom" value={price} onChange={(e) => handleinput(e)} placeholder={`Current Price: ${String(nftprice) ?? '0'} USDT`} />
                        <button disabled={(editloading && !editsuccess) || editing} onClick={() => edit?.()} className="button-popup" data-toggle="modal" data-target="#popup_bid_success" data-dismiss="modal" aria-label="Close">{((editloading && !editsuccess) || editing) ? 'Editing...' : 'Edit'}</button>
                    </>
                }
            </div>
        </Modal >

    );
};

export default CardModal;
