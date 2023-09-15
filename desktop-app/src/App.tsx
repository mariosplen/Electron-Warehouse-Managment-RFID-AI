import RFIDTable from "./components/RFIDTable";


const App = () => {
    const  electron = (window as any).electron;
     
    return (
        <div className="App">
            <h1>GEIAAAAA</h1>
            <button
            onClick={() =>{
                console.log(electron.getCurrentEpcs())
            }}>
                get RFIDS
            </button>
            <button
            onClick={() =>{
                electron.startTCPClient("192.168.1.9", 14150)
            }}>
                Start TCP Client
            </button>
            <RFIDTable/>
            {/* <RFIDTagDisplay /> */}
        </div>
    )
}



export default App;