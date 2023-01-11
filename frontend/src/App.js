import "./App.css"
import AccountStats from "./components/AccountStats/AccountStats"
import Lottery from "./components/Lottery/Lottery"
import VRFCoordinator from "./components/VRFCoordinator/VRFCoordinator"

function App() {
    return (
        <div className="App">
            <AccountStats />
            <Lottery />
            <VRFCoordinator />
        </div>
    )
}

export default App
