import { useNavigate, useParams } from 'react-router-dom';
import './Project.css'
import { createContext, useContext, useEffect, useState } from 'react';
import { LoadingContext } from '../../App';

const ModeContext = createContext();

function Project() {
    const navigate = useNavigate();
    
    const loadingContext = useContext(LoadingContext);

    const params = useParams();

    //#region header
    const [filterStatus, setFilterStatus] = useState(0);
    const [filterPriority, setFilterPriority] = useState(0);
    //#endregion

    //#region modal
    const [openedModal, setOpenedModal] = useState('');
    const [modalProjectStatus, setModalProjectStatus] = useState(0);
    const [modalProjectPriority, setModalProjectPriority] = useState(0);
    const [modalDescription, setModalDescription] = useState('');
    //#endregion

    useEffect(() => {
        loadingContext.setIsLoading(false);

    }, [])

    function clearCreateModal() {

    }

    return (
        <div className='project-main-container'>
            <div className='header-container'>

                <div className='first-row'>
                    <button 
                        className='back-to-projects-list-button'
                        onClick={(e) => {
                            navigate('/projects');
                        }}>
                        ⬅
                    </button>
                    <input type="text" placeholder='Search by title'/>
                </div>

                <div className='second-row'>
                    <ModeContext.Provider value={{ mode: filterStatus, setMode: setFilterStatus}}>
                        <div className='filter-container'>
                                <FilterButton value={0} color='blue'>В планах</FilterButton>
                                <FilterButton value={1} color='yellow'>В процессе</FilterButton>
                                <FilterButton value={2} color='green'>Выполнено</FilterButton>
                        </div>
                    </ModeContext.Provider>

                    <ModeContext.Provider value={{ mode: filterPriority, setMode: setFilterPriority}}>
                        <div className='filter-container'>
                                <FilterButton value={0} color='blue'>Низкий</FilterButton>
                                <FilterButton value={1} color='yellow'>Нормальный</FilterButton>
                                <FilterButton value={2} color='gray'>Средний</FilterButton>
                                <FilterButton value={3} color='orange'>Высокий</FilterButton>
                                <FilterButton value={4} color='red'>Критический</FilterButton>
                        </div>
                    </ModeContext.Provider>
                </div>

            </div>
            <div className='tasks-main-container'>

            </div>

            <div className={ !!openedModal ? 'modal-container' : 'modal-container hidden'}>
                
                {
                    openedModal == 'create' || openedModal == 'edit' ?
                    <div className='card create-card'>
                        <h1>{openedModal === 'create' ? 'Создание задачи' : 'Изменение задачи'}</h1>

                        <button className="close-button"
                            onClick={() => { clearCreateModal(); setOpenedModal(''); }}>✖</button>

                        <input type="text" placeholder='Введите название' />

                        <textarea value={modalDescription} onChange={(e) => setModalDescription(e.target.value)} placeholder='Введите описание'></textarea>
                        <p className={modalDescription.length > 1000 ? 'length-counter exceed' : 'length-counter'}>
                            {modalDescription.length}/1000
                        </p>

                        <p className='section-p'>Статус</p>
                        <ModeContext.Provider value={{ mode: modalProjectStatus, setMode: setModalProjectStatus}}>
                            <div className='filter-container'>
                                <FilterButton value={0} color='blue'>В планах</FilterButton>
                                <FilterButton value={1} color='yellow'>В процессе</FilterButton>
                                <FilterButton value={2} color='green'>Выполнено</FilterButton>
                            </div>
                        </ModeContext.Provider>

                        <p className='section-p'>Приоритет</p>
                        <ModeContext.Provider value={{ mode: modalProjectPriority, setMode: setModalProjectPriority}}>
                            <div className='filter-container'>
                                <FilterButton value={0} color='blue'>Низкий</FilterButton>
                                <FilterButton value={1} color='yellow'>Нормальный</FilterButton>
                                <FilterButton value={2} color='gray'>Средний</FilterButton>
                                <FilterButton value={3} color='orange'>Высокий</FilterButton>
                                <FilterButton value={4} color='red'>Критический</FilterButton>
                            </div>
                        </ModeContext.Provider>

                        <button className='submit-button'>Подтвердить</button>
                    </div> :
                    <></>
                }

            </div>

            <button className="add-button" onClick={() => setOpenedModal('create')}>+</button>
        </div>
    )
}

function FilterButton(params) {
    const modeContext = useContext(ModeContext);
    
    return (
        <button 
            className={
                params.value == modeContext.mode ?
                `filter-button ${params.color} selected` :
                `filter-button ${params.color}`
            }
            onClick={()=> {
                modeContext.setMode(params.value);
            }}>
            {params.children}
        </button>
    )
}

export default Project;