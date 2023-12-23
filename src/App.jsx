import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import Menu from './Menu'

function App() {
  const [count, setCount] = useState(0)

    return (
        <>
            <div className="card">
                <Menu />

            </div>
        </>
    );
}

export default App
