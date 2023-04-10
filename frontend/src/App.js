import "./App.css"
import Header from "./components/Header/Header"
import Main from "./components/Main/Main"
import "bootstrap/dist/css/bootstrap.min.css"
import "./variables.css"

function App() {
    return (
        <html>
            <head></head>
            <body>
                <div className="subbody">
                    <Header />
                    <Main />
                </div>
            </body>
        </html>
    )
}

export default App
