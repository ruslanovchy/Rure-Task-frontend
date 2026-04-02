import { useNavigate } from 'react-router-dom';
import './Hero.css'
import { useCounter } from '../../../hooks/useCounter';

function Hero() {
    const navigate = useNavigate();
    const counterValue = useCounter(800, 1500, true);
    return (
        <section>
            <div className="container hero-container">
                <h1>Планируйте задачи для вашего бизнеса и следите за их выполнением</h1>
                <h2>Быстро и удобно управляйте задачами для нескольких проектов. </h2>
                <button onClick={() => navigate('/login')}>Начать ➔</button>

                <div className="stats">
                    <p><span className='number-span'>{counterValue.toLocaleString()}+</span> пользователей ежедневно</p>
                </div>
            </div>
        </section>
    )
}

export default Hero;