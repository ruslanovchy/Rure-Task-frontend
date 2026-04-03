import './Explanation.css'
import { motion } from 'framer-motion'

function Explanation(params) {
    return (
        <div
            className={`explanation-container ${params.color} ${params.type == 1 ? 'right' : 'left'}`}>
            <motion.div
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}>
                <video 
                    src={params.video}
                    autoPlay muted loop playsInline></video>
            </motion.div>
            <motion.div
                className={`texts`}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                viewport={{ once: true }}>
                <div className=''>
                    <h2>{params.title}</h2>
                    <p>{params.description}</p>
                </div>
            </motion.div>
        </div>
    )
}

export default Explanation;