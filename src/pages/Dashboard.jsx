import { useState } from 'react';
import CardModal from '../components/layouts/CardModal';
import { Tabs, TabPanel } from 'react-tabs';
import { Link } from 'react-router-dom';
import img from '../assets/images/background/thumb-pagetitle.jpg'
import avt from '../assets/images/author/author-db.jpg'
import imgp7 from '../assets/images/product/product6.jpg'
import { useAccount, useContractRead } from 'wagmi';
import checkNFT from '../assets/deployment/NFTSplittingME.json'


const shortenMiddle = (inputString, keepLength) => {
    if (inputString?.length <= keepLength * 2) {
        return inputString;
    }

    const start = inputString?.slice(0, keepLength);
    const end = inputString?.slice(-keepLength);

    return `${start}...${end}`;
};

function Dashboard() {
    const { address } = useAccount()
    const { data } = useContractRead({
        address: checkNFT.address,
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


    const [modalShow, setModalShow] = useState(false);
    const [mode, setMode] = useState('')
    const [id, setId] = useState('')

    const setSell = (id) => {
        setModalShow(true)
        setMode('sell')
        setId(id)
    }

    return (
        <div>

            <section className="tf-page-title ">
                <div className="tf-container">
                    <div className="row">
                        <div className="col-md-12">
                            <ul className="breadcrumbs">
                                <li><Link to="/">Home</Link></li>
                                <li>Profile</li>
                            </ul>
                        </div>
                    </div>
                </div>
                <div className="container-fluid">
                    <div className="row">
                        <div className="thumb-pagetitle">
                            <img src={img} alt="images" />
                        </div>
                    </div>
                </div>
            </section>

            <section className="tf-dashboard tf-tab">
                <div className="tf-container">
                    <Tabs className='dashboard-filter'>
                        <div className="row ">
                            <div className="col-xl-3 col-lg-12 col-md-12">
                                <div className="dashboard-user">
                                    <div className="dashboard-infor">
                                        <div className="avatar">
                                            <img src={'https://vapa.vn/wp-content/uploads/2022/12/hinh-de-thuong-don-gian-003.jpg'} alt="images" />
                                        </div>
                                        <div className="pax">{address && shortenMiddle(address, 9)}</div>
                                    </div>
                                </div>
                            </div>
                            <div className="col-xl-9 col-lg-12 col-md-12 overSPM-table">

                                <div className="dashboard-content inventory content-tab">
                                    <TabPanel><div className="inner-content inventory favorite">
                                        <div className="table-ranking top">
                                            <div className="title-ranking">
                                                <div className="col-rankingg"><Link to="#">ID</Link></div>
                                            </div>
                                        </div>
                                        <div className="table-ranking">
                                            {
                                                data?.map((id) => {
                                                    if (String(id) !== '0') {
                                                        return (
                                                            <div key={id} className="content-ranking">
                                                                <div className="col-rankingg">
                                                                    <div className="box-product-favorite">
                                                                        <Link to="#" className="bookmark"><svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 18 18" fill="none">
                                                                            <path d="M12.7617 2.25H5.23828C4.42969 2.25 3.76172 2.91797 3.76172 3.76172V15.75L9 13.5L14.2383 15.75V3.76172C14.2383 2.91797 13.5703 2.25 12.7617 2.25Z" fill="#3749E9" />
                                                                        </svg></Link>
                                                                        <div className="image"><img src={imgp7} alt="Splittingme" /></div>
                                                                        <Link to="#" className="name">{String(id)}</Link>
                                                                    </div>
                                                                </div>

                                                                <div className="col-rankingg">
                                                                    <button onClick={() => setSell(String(id))} className='sell-btn'>Sell</button>
                                                                </div>
                                                            </div>
                                                        )
                                                    }
                                                })
                                            }
                                        </div>
                                    </div>
                                    </TabPanel>
                                </div>
                            </div>
                        </div>
                    </Tabs >

                </div >
            </section >

            <CardModal
                show={modalShow}
                mode={mode}
                id={id}
                setModalShow={setModalShow}
                onHide={() => { setModalShow(false); setMode('') }}
            />
        </div >


    );
}

export default Dashboard;