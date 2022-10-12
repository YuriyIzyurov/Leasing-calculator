import './App.scss'
import Calculator from "./components/Calculator";


function App() {

  return (
    <div className="container">
        <div className="calculator">
            <h1 className="title bold-font">Рассчитайте стоимость автомобиля в лизинг</h1>
            <Calculator/>
        </div>
    </div>
  );
}

export default App;
