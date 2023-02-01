import "./App.css"
import AccountStats from "./components/AccountStats/AccountStats"
import Lottery from "./components/Lottery/Lottery"
import VRFCoordinator from "./components/VRFCoordinator/VRFCoordinator"
import Header from "./components/Header/Header"
import Main from "./components/Main/Main"
import "bootstrap/dist/css/bootstrap.min.css"

function App() {
    return (
        <html>
            <head></head>
            <body>
                <Header />
                <Main />
            </body>
        </html>
    )
}

export default App
