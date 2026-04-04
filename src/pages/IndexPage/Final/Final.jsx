import { useNavigate } from 'react-router-dom';
import './Final.css'

function Final() {
    const navigate = useNavigate();
    return (
        <section className="final-section">
            <div className="final-container">
                <h2>Готовы приступить к качественному планированию задач?</h2>
                <button onClick={() => { navigate('/login') }}>Начать</button>
            </div>
        </section>
    )
}

export default Final;