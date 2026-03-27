import './Project.css'

function Project() {



    return (
        <div className='project-main-container'>
            <h1>Проект</h1>
            <div className='tasks-main-container'>
                <div className='card tasks-list'></div>

                <div className='task-container'>
                    <div className='card task-content-container'></div>
                    <div className='card task-params-container'></div>
                </div>
            </div>
        </div>
    )
}

export default Project;