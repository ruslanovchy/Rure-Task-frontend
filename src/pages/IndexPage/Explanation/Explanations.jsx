import { landingVideos } from '../../../assets/landing-videos/landingVideos';
import Explanation from './Explanation';
import './Explanations.css'

function Explanations() {
    const explanations = [
        {
            video: landingVideos.creating_project,
            title: 'Создавайте проекты',
            description: 'Создание проекта позволит вам распределить задачи для нескольких проектов. Чтобы создать проект, вы должны нажать на кнопку снизу справа, и ввести необходимую информацию.',
            color: 'orange',
            type: 0,
        },
        {
            video: landingVideos.creating_task,
            title: 'Создавайте задачи',
            description: 'После создания проекта, вы можете создать, редактировать или удалить задачи проекта.',
            color: 'white',
            type: 1,
        },
        {
            video: landingVideos.changing_task,
            title: 'Изменяйте статус задачи',
            description: 'После создания задачи, вы можете изменить его статус в зависимости от этапа задачи.',
            color: 'orange',
            type: 0,
        }
    ]

    return (
        <section className="explanations-section">
            <div className="container explanations-container">
                <h1>Просто и удобно</h1>
                <h2>Каждый этап интеллектуально понятен</h2>
                <div className='explanations-list'>
                    {
                        explanations.map((e, i) => {
                            return <Explanation
                                        title={e.title}
                                        description={e.description}
                                        color={e.color}
                                        type={e.type}
                                        video={e.video}/>
                        })
                    }
                </div>
            </div>
        </section>
    )
}

export default Explanations;