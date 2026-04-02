import './Stars.css';

function Stars({ rating }) {
    return (
        <div className="rating-container">
            {
                [...Array(5)].map((_, i) => {
                    return (
                        <span key={i} className={i < rating ? 'filled' : 'empty'}>
                            ✦
                        </span>
                    )
                })
            }
        </div>
    )
}

export default Stars;