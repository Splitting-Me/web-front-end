import { React, useEffect } from 'react';
import AOS from 'aos';
import { Route, Routes } from 'react-router-dom';
import Header from './components/header';
import Footer from './components/footer';
import routes from './pages';
import Page404 from './pages/404';
import '../src/assets/binasea.css';
import '../src/assets/font-awesome.css';
import { WagmiConfig, createConfig, configureChains } from 'wagmi'
import { sepolia } from 'wagmi/chains';
import { publicProvider } from 'wagmi/providers/public'
import { InjectedConnector } from 'wagmi/connectors/injected'
import { alchemyProvider } from 'wagmi/providers/alchemy'
import { infuraProvider } from 'wagmi/providers/infura'

const { publicClient, webSocketPublicClient } = configureChains(
    [sepolia],
    [alchemyProvider({ apiKey: 'bhxiJmeoYfTa4rc33n5r8LWl35R39HvT' })],
    [publicProvider()],
    [infuraProvider({ apiKey: 'b2fb2fcbd6e6477f9a2e316aea394a0a' })],
)

const config = createConfig({
    autoConnect: true,
    connectors: [new InjectedConnector({
        sepolia,
        options: {
            name: 'Injected',
            shimDisconnect: true,
        },
    })],
    publicClient,
    webSocketPublicClient,
})

function App() {
    useEffect(() => {
        AOS.init({
            duration: 2000
        });
    }, []);

    return (
        <>
            <WagmiConfig config={config}>
                <Header />
                <Routes>
                    {
                        routes.map((data, idx) => (
                            <Route key={idx} path={data.path} element={data.component} exact />
                        ))
                    }
                    <Route path='*' element={<Page404 />} />
                </Routes>

                <Footer />
            </WagmiConfig>
        </>
    );
}

export default App;
