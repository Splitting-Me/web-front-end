import React from 'react';
import Banner03 from '../components/banner/Banner03';
import dataBanner2 from '../assets/fake-data/data-banner-2';


function Home03(props) {
    return (
        <div className='home-3'>

            <div id="page">
                <Banner03 data={dataBanner2} />
            </div>

        </div>
    );
}

export default Home03;