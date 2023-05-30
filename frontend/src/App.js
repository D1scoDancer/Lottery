import "./App.css"
import Header from "./components/Header/Header"
import Main from "./components/Main/Main"
import "bootstrap/dist/css/bootstrap.min.css"
import "./variables.css"
import Footer from "./components/Footer/Footer"

function App() {
    return (
        <html>
            <head></head>
            <body>
                <div className="subbody">
                    <Header />
                    <Main />
                    <Footer />
                </div>
            </body>
        </html>
    )
}

export default App
