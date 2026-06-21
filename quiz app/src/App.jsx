import "./App.css";
import Quiz from "./Quiz";

function App() {
  return (
    <>
      <div className="background-circle circle1"></div>
      <div className="background-circle circle2"></div>

      <div className="App">
        <h1>React Quiz App</h1>
        <Quiz />
      </div>
    </>
  );
}

export default App;