import "./App.css";
import Wallet from "./connector/Wallet";

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <p>Wallet connect example</p>
        <Wallet />
      </header>
    </div>
  );
}

export default App;
