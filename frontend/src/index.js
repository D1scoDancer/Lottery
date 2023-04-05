import React from "react"
import ReactDOM from "react-dom/client"
import "./index.css"
import App from "./App"
import reportWebVitals from "./reportWebVitals"
import { WagmiConfig, createClient } from "wagmi"
import { ConnectKitProvider, getDefaultClient } from "connectkit"
import { polygonMumbai } from "wagmi/chains"

const alchemyId = process.env.ALCHEMY_ID
const chains = [polygonMumbai]

const client = createClient(
    getDefaultClient({
        appName: "Lottery",
        alchemyId,
        chains,
    })
)

const options = { initialChainId: 0, embedGoogleFonts: true }

const root = ReactDOM.createRoot(document.getElementById("root"))
root.render(
    <React.StrictMode>
        <WagmiConfig client={client}>
            <ConnectKitProvider options={options} theme="midnight" mode="dark">
                <App />
            </ConnectKitProvider>
        </WagmiConfig>
    </React.StrictMode>
)

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals()
