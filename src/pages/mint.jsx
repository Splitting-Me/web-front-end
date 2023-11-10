import { useState, useRef, useEffect } from 'react';
import React from 'react';
import { useAccount } from 'wagmi';
import { useContractWrite, usePrepareContractWrite, useContractRead, useWaitForTransaction } from 'wagmi'
import AddSlot from '../assets/deployment/FactoryToken.json'
import NFTSpl from '../assets/deployment/NFTSplittingME.json'
import './mint.css'
import { useDebounce } from 'use-debounce';
import { formatEther, parseEther } from 'viem'

function MintTokenList(data) {
    const { address } = useAccount()

    const { data: name } = useContractRead({
        address: data?.data,
        abi: [{
            "inputs": [],
            "name": "name",
            "outputs": [
                {
                    "internalType": "string",
                    "name": "",
                    "type": "string"
                }
            ],
            "stateMutability": "view",
            "type": "function"
        },],
        functionName: 'name',
        enabled: Boolean(data?.data)
    })

    const { data: symbol } = useContractRead({
        address: data?.data,
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
        enabled: Boolean(data?.data)
    })

    const { data: quantity } = useContractRead({
        address: data?.data,
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
        enabled: Boolean(data?.data),
        select: (data) => formatEther(data)
    })

    return { name, symbol, quantity }
}

function Minttoken(data) {
    const [quantityToken, setQuantityToken] = useState('')
    const { name, symbol, quantity } = MintTokenList(data)
    const { address } = useAccount()
    const [finalquantityToken] = useDebounce(quantityToken, 300)

    const { config: minttoken } = usePrepareContractWrite({
        address: data.data,
        abi: [{
            "inputs": [
                {
                    "internalType": "address",
                    "name": "account",
                    "type": "address"
                },
                {
                    "internalType": "uint256",
                    "name": "amount",
                    "type": "uint256"
                }
            ],
            "name": "mint",
            "outputs": [],
            "stateMutability": "nonpayable",
            "type": "function"
        },],
        functionName: 'mint',
        args: [address, parseEther(finalquantityToken)],
        enabled: Boolean(finalquantityToken)
    })

    const { write: mint, isLoading, data: datamint } = useContractWrite(minttoken)
    const { isLoading: mintloading } = useWaitForTransaction({
        hash: datamint?.hash,
    })

    const handleinput = (e) => {
        if (e.target.name === 'quantity') {
            const regex = /^[0-9]+$/;
            if (regex.test(e.target.value)) {
                setQuantityToken(e.target.value)
            }

            if (e.target.value === '') {
                setQuantityToken(e.target.value)
            }
        }
    }

    const showtokencontract = () => {
        navigator.clipboard.writeText(String(data.data))
    }

    return (
        <div className='list_mint_token'>
            <div className='contract' onClick={() => showtokencontract()}>
                <div className='contract-header'>Copy Contract</div>
                <img src="https://cdn-icons-png.flaticon.com/512/566/566295.png" alt="splittingme" />
            </div>
            <div className='name_mint_token'>
                <div>Token Name:</div>
                <div>{name}</div>
            </div>
            <div className='quantity_mint_token_nft'>
                <div> Token Symbol: </div>
                <div>{symbol}</div>
            </div>
            <div className='quantity_mint_token_nft'>
                <div> Token Quantity: </div>
                <div>{String(quantity)}</div>
            </div>

            <div className='quantity_mint_token'>
                <div> Tokens To Mint:</div>
                <input name='quantity' id="mintinput" type="text" value={quantityToken} placeholder='VD:1000' onChange={e => handleinput(e)} />
            </div>
            <button disabled={quantityToken === ''} className='mint_btn' onClick={() => mint?.()}>{(isLoading || mintloading) ? 'Minting..' : 'Mint'}</button>
        </div>
    )
}

const NFTcreate = ({ data }) => {
    const [nameToken, setNameToken] = useState('')
    const [symbolToken, setSymbolToken] = useState('')
    const [finalnameToken] = useDebounce(nameToken, 300)
    const [finalsymbolToken] = useDebounce(symbolToken, 300)


    const { data: approved } = useContractRead({
        address: NFTSpl.address,
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
        args: [data],
        watch: true,
        enabled: Boolean(data),
    })

    const { config: createCampaign } = usePrepareContractWrite({
        address: AddSlot.address,
        abi: [{
            "inputs": [
                {
                    "internalType": "string",
                    "name": "_name",
                    "type": "string"
                },
                {
                    "internalType": "string",
                    "name": "_symbol",
                    "type": "string"
                },
                {
                    "internalType": "uint256",
                    "name": "_NFTID",
                    "type": "uint256"
                }
            ],
            "name": "createNewCampaign",
            "outputs": [],
            "stateMutability": "nonpayable",
            "type": "function"
        }],
        functionName: 'createNewCampaign',
        args: [finalnameToken, finalsymbolToken, data],
        enabled: Boolean(finalnameToken && finalsymbolToken),

    })

    const { config: approvenft } = usePrepareContractWrite({
        address: NFTSpl.address,
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
        args: [AddSlot.address, data],
        enabled: Boolean(data),
    })

    const handleinput = (e) => {
        if (e.target.name === 'tokenname') {
            if ((e.target.value).length <= 15) {
                setNameToken(e.target.value);
            }
        }

        else if (e.target.name === 'tokensymbol') {
            if ((e.target.value).length <= 7) {
                setSymbolToken(e.target.value);
            }
        }
    }

    const { write: create, isLoading, data: createcam } = useContractWrite(createCampaign)

    const { write: approve, data: approvedd, isLoading: approveload } = useContractWrite(approvenft)

    const { isLoading: createloading } = useWaitForTransaction({
        hash: createcam?.hash,
    })

    const { isLoading: approveloading } = useWaitForTransaction({
        hash: approvedd?.hash,
    })

    const handlecreat = () => {
        if (approved === '0x0000000000000000000000000000000000000000') {
            approve?.()
        }
        else {
            create?.()
        }
    }

    return (
        <>
            <div className='list_mint_token'>
                <img src="https://lp-cms-production.imgix.net/image_browser/Ho%20Chi%20Minh%20City%20skyline.jpg?auto=format&w=1440&h=810&fit=crop&q=75" alt="splittingme" />

                <div className='name_mint_token'>
                    <div>NFT id:</div>
                    <div>{data}</div>
                </div>
                <div className='quantity_mint_token'>
                    <div> Token Name: </div>
                    <input name='tokenname' id="mintinput" type="text" value={nameToken} placeholder={'VD:Binance'} onChange={e => handleinput(e)} />
                </div>
                <div className='quantity_mint_token'>
                    <div> Token Symbol:</div>
                    <input name='tokensymbol' id="mintinput" type="text" value={symbolToken} placeholder='VD:BNB' onChange={e => handleinput(e)} />
                </div>
                <button className='mint_btn' onClick={() => handlecreat()}>{(isLoading || createloading) ? 'Creating..' : (approveloading || approveload) ? 'Approving' : 'Create'}</button>
            </div>
        </>
    )

}

const Mint = () => {
    const [mode, setMode] = useState('NFT')
    const { address } = useAccount()
    const [addAdress, setAddAdress] = useState(null)
    const [uri, setURI] = useState('')
    const [url, setURL] = useState('')
    const [selectedImage, setSelectedImage] = useState(null);
    const [description, setDescription] = useState('');
    const [name, setName] = useState('');
    const [waiting, setWaiting] = useState(false)
    const fileInputRef = useRef(null);

    const { config: addSlot } = usePrepareContractWrite({
        address: AddSlot.address,
        abi: [{
            "inputs": [
                {
                    "internalType": "address",
                    "name": "_address",
                    "type": "address"
                }
            ],
            "name": "addSlotMintNFT",
            "outputs": [],
            "stateMutability": "nonpayable",
            "type": "function"
        }],
        functionName: 'addSlotMintNFT',
        args: [addAdress],
        enabled: Boolean(addAdress)
    })

    const { data: Slot } = useContractRead({
        address: AddSlot.address,
        abi: [{
            "inputs": [
                {
                    "internalType": "address",
                    "name": "",
                    "type": "address"
                }
            ],
            "name": "slotMintNFT",
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
        functionName: 'slotMintNFT',
        args: [address],
        enabled: Boolean[address],
        watch: true,
    })

    const { data: NFTList } = useContractRead({
        address: NFTSpl.address,
        abi: [{
            "inputs": [
                {
                    "internalType": "address",
                    "name": "_owner",
                    "type": "address"
                }
            ],
            "name": "getAllNFT",
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
        functionName: 'getAllNFT',
        args: [address],
        enabled: Boolean[address],
        watch: true,
    })

    const { data: TokenList } = useContractRead({
        address: AddSlot.address,
        abi: [{
            "inputs": [
                {
                    "internalType": "address",
                    "name": "_owner",
                    "type": "address"
                }
            ],
            "name": "getAllCampaignsByOwner",
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
        functionName: 'getAllCampaignsByOwner',
        args: [address],
        enabled: Boolean[address],
        watch: true,
    })

    const { isLoading, isSuccess, write: addslot } = useContractWrite(addSlot)
    const { isLoading: isLoading3, write: mintting, data: mint } = useContractWrite({
        address: AddSlot.address,
        abi: [{
            "inputs": [
                {
                    "internalType": "string",
                    "name": "_tokenURI",
                    "type": "string"
                }
            ],
            "name": "mintNFT",
            "outputs": [],
            "stateMutability": "nonpayable",
            "type": "function"
        }],
        functionName: 'mintNFT',
        args: [String(url)],
    })
    const { isLoading: loadingmint, isSuccess: successmint } = useWaitForTransaction({
        hash: mint?.hash,
    })

    useEffect(() => {
        if (uri) {
            setURL(uri?.url)
        }
    }, [uri])

    useEffect(() => {
        if (url) {
            mintting()
        }
    }, [url])


    useEffect(() => {
        if (successmint) {
            setSelectedImage(null)
            setDescription('')
            setName('')
            setWaiting(false)
        }
    })

    const handleChangeMode = (mode) => {
        setMode(mode)
    }

    const handleAddAddress = () => {
        if (addAdress) {
            addslot?.()
        }
    }

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        const reader = new FileReader();

        reader.onload = () => {
            // Đọc dữ liệu ảnh thành base64 và lưu trong state
            setSelectedImage(reader.result);
        };

        if (file) {
            reader.readAsDataURL(file);
        }
    };

    const handleCustomFileInput = () => {
        fileInputRef.current.click();
    };

    const nftmint = async () => {
        setWaiting(true)
        function extractBase64Data(dataUrl) {
            // Tách chuỗi thành mảng bằng dấu ","
            const parts = dataUrl.split(',');

            // Kiểm tra xem có ít nhất 2 phần tử trong mảng
            if (parts.length >= 2) {
                // Lấy phần tử thứ hai (chứa dữ liệu base64)
                const base64Data = parts[1];

                return base64Data;
            } else {
                // Trả về null hoặc thông báo lỗi nếu không tìm thấy
                return null;
            }
        }

        const dataToSend = {
            name: name,
            description: description,
            image: extractBase64Data(selectedImage),
        };

        const headers = {
            'Content-Type': 'application/json',
            'ngrok-skip-browser-warning': '555',
        };

        fetch(`${process.env.REACT_APP_API_URL}/ipfs`, {
            method: "POST",
            headers: headers,
            body: JSON.stringify(dataToSend),
        })
            .then((response) => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then((data) => {
                setURI(data.data)
            })
            .catch((error) => {
                console.error('Lỗi khi đăng bài:', error);
            });
    };

    return (

        <div className='mint_container' >
            <div className='NFTswicthToken'>
                <button onClick={() => handleChangeMode('NFT')} className={mode === 'NFT' ? 'active_switch' : ''}>Mint NFT</button>
                <button onClick={() => handleChangeMode('Token')} className={mode === 'Token' ? 'active_switch' : ''}>Mint Token</button>
                {address === String(process.env.REACT_APP_ADMIN_WALLET) && <button onClick={() => handleChangeMode('Admin')} className={mode === 'Admin' ? 'active_switch' : ''}>Admin</button>}
            </div>

            {
                mode === 'NFT' &&
                <div className='mint_nft'>
                    <i class="rain"></i><i class="rain"></i><i class="rain"></i><i class="rain"></i><i class="rain"></i><i class="rain"></i><i class="rain"></i><i class="rain"></i><i class="rain"></i><i class="rain"></i><i class="rain"></i><i class="rain"></i><i class="rain"></i><i class="rain"></i><i class="rain"></i><i class="rain"></i><i class="rain"></i><i class="rain"></i><i class="rain"></i><i class="rain"></i><i class="rain"></i><i class="rain"></i><i class="rain"></i><i class="rain"></i><i class="rain"></i><i class="rain"></i><i class="rain"></i><i class="rain"></i><i class="rain"></i><i class="rain"></i><i class="rain"></i><i class="rain"></i><i class="rain"></i><i class="rain"></i><i class="rain"></i><i class="rain"></i><i class="rain"></i><i class="rain"></i><i class="rain"></i><i class="rain"></i><i class="rain"></i><i class="rain"></i><i class="rain"></i><i class="rain"></i><i class="rain"></i><i class="rain"></i><i class="rain"></i><i class="rain"></i><i class="rain"></i><i class="rain"></i><i class="rain"></i><i class="rain"></i><i class="rain"></i><i class="rain"></i><i class="rain"></i><i class="rain"></i><i class="rain"></i><i class="rain"></i><i class="rain"></i><i class="rain"></i><i class="rain"></i><i class="rain"></i><i class="rain"></i><i class="rain"></i><i class="rain"></i><i class="rain"></i><i class="rain"></i><i class="rain"></i><i class="rain"></i><i class="rain"></i><i class="rain"></i><i class="rain"></i><i class="rain"></i><i class="rain"></i><i class="rain"></i><i class="rain"></i><i class="rain"></i><i class="rain"></i><i class="rain"></i><i class="rain"></i><i class="rain"></i><i class="rain"></i><i class="rain"></i><i class="rain"></i><i class="rain"></i><i class="rain"></i><i class="rain"></i><i class="rain"></i><i class="rain"></i><i class="rain"></i><i class="rain"></i><i class="rain"></i><i class="rain"></i><i class="rain"></i><i class="rain"></i><i class="rain"></i><i class="rain"></i><i class="rain"></i><i class="rain"></i><i class="rain"></i><i class="rain"></i><i class="rain"></i><i class="rain"></i><i class="rain"></i><i class="rain"></i><i class="rain"></i><i class="rain"></i><i class="rain"></i><i class="rain"></i><i class="rain"></i><i class="rain"></i><i class="rain"></i><i class="rain"></i><i class="rain"></i><i class="rain"></i><i class="rain"></i><i class="rain"></i><i class="rain"></i><i class="rain"></i><i class="rain"></i><i class="rain"></i><i class="rain"></i><i class="rain"></i><i class="rain"></i><i class="rain"></i><i class="rain"></i><i class="rain"></i><i class="rain"></i><i class="rain"></i><i class="rain"></i><i class="rain"></i><i class="rain"></i><i class="rain"></i><i class="rain"></i><i class="rain"></i><i class="rain"></i><i class="rain"></i><i class="rain"></i><i class="rain"></i><i class="rain"></i><i class="rain"></i><i class="rain"></i><i class="rain"></i><i class="rain"></i><i class="rain"></i><i class="rain"></i><i class="rain"></i><i class="rain"></i><i class="rain"></i><i class="rain"></i>
                    <img src={selectedImage || 'https://cdn.dribbble.com/users/260537/screenshots/3981198/dribbble_animation.gif'} alt='Splittingme' />
                    <textarea rows="4" className='descript' placeholder='Name' value={name} onChange={(e) => setName(e.target.value)}></textarea>
                    <textarea rows="4" className='descript' placeholder='Description' value={description} onChange={(e) => setDescription(e.target.value)}></textarea>
                    <div className='buttonmintnft'>
                        <input
                            type="file"
                            accept="image/*"
                            ref={fileInputRef}
                            style={{ display: 'none' }}
                            onChange={handleImageChange}
                        />
                        <button disabled={!address} onClick={handleCustomFileInput}>Choose Imgage</button>
                        <button disabled={String(Slot) === '0' || !selectedImage || isLoading3 || (loadingmint && !successmint) || !name || !description || waiting} onClick={() => nftmint()}> {(isLoading3 || (loadingmint && !successmint) || waiting) ? 'Pending...' : String(Slot) === '0' ? 'No Slot Left' : 'Mint'}</button>
                    </div>
                </div>
            }

            {
                mode === 'Token' && <div className='mint_token'>
                    <div className='mint_token header'>Token Mint List</div>
                    {
                        NFTList?.map((data) => (
                            String(data) !== '0' && <NFTcreate key={String(data)} data={String(data)} />
                        ))
                    }
                    {
                        TokenList?.map((data) => (
                            String(data) !== '0' && <Minttoken key={String(data)} data={data} />
                        ))
                    }
                </div>
            }

            {
                mode === 'Admin' &&
                <div className='mint_nft'>
                    <label className='.header'>Add Address to Mint</label>
                    <input type="text" name="addAdress" value={addAdress} onChange={e => setAddAdress(e.target.value)} />
                    <label className='.header'>Status: {isSuccess ? "Add Success" : ""}</label>
                    <button onClick={() => handleAddAddress()}>{isLoading ? 'Pending...' : 'Add Address'}</button>
                </div>
            }
        </div >
    )
}

export default Mint