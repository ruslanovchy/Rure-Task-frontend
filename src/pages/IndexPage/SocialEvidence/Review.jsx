import Stars from "./Stars";
import './Review.css'

function Review(params) {
    return (
        <div className="review-container">
            <div className="first-row">
                <div className="left">
                    <img className="photo" src={params.photo} alt="" />
                    <p className="name">{params.name}</p>
                    <p className="date">{params.date.toLocaleDateString('ru-RU', {
                        month: 'short',
                        year: 'numeric'
                    })}</p>
                </div>
                <Stars className='rating' rating={params.rating}/>
            </div>
            <p className="review">{params.review}</p>
        </div>
    )
}

export default Review;