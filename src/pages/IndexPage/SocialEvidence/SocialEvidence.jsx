import { reviewAvatarImages } from '../../../assets/review-avatars/reviewAvatars';
import Review from './Review';
import './SocialEvidence.css';
import { motion } from 'framer-motion'

function SocialEvidence() {
    

    const reviews = [
        { photo: reviewAvatarImages['maksim'], name: 'Maksim', review: 'Мне очень понравился сайт. Все что мне нужно было я нашел. Сайт простой, любой разберется.', rating: 5, date: new Date('2026-3-25') },
        { photo: reviewAvatarImages['jadikov'], name: 'Jadikov', review: 'Конничива, мои рассенганчики ✌️✌️. Этот сайт просто пушка, даттебаё!', rating: 4, date: new Date('2026-2-20') },
        { photo: reviewAvatarImages['alice'], name: 'Алиса', review: 'Очень удобный интерфейс и приятный дизайн. Пользоваться одно удовольствие.', rating: 5, date: new Date('2026-1-19') },
        { photo: reviewAvatarImages['katya'], name: 'Екатерина', review: 'В целом сайт хороший, но иногда приходится немного поискать нужную информацию. Надеюсь, со временем станет еще удобнее.', rating: 4, date: new Date('2026-3-25') },
        { photo: reviewAvatarImages['jamal'], name: 'Jamal', review: 'Нормальный сайт, но есть куда расти. Иногда страницы грузятся дольше, чем хотелось бы.', rating: 3, date: new Date('2026-3-24') },
        { photo: reviewAvatarImages['genadiy'], name: 'Геннадий', review: 'Отличный ресурс! Видно, что разработчики постарались. Все продумано до мелочей!', rating: 5, date: new Date('2026-3-23') },
    ]

    return (
        <section className='social-evidence-section'>
            <div className="container social-evidence-container">
                <h1>Отзывы наших пользователей</h1>
                <div
                    className='reviews-list'>
                    {
                        reviews.map((r, i) => {
                            return (
                                <motion.div
                                    initial={{ opacity: 0, y: 40 }}
                                    whileInView={{opacity: 1, y: 0}}
                                    transition={{duration: 0.6, delay: i * 0.05}}
                                    viewport={{ once: true }}>
                                        <Review 
                                            key={i} 
                                            photo={r.photo}
                                            name={r.name}
                                            review={r.review}
                                            rating={r.rating}
                                            date={r.date}/>
                                </motion.div>
                            )
                        })
                    }

                </div>
            </div>
        </section>
    )
}

export default SocialEvidence;