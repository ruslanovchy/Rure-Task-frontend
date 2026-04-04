import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import './Project.css'
import { createContext, useContext, useEffect, useState } from 'react';
import { LoadingContext } from '../../App';
import { taskValidation } from '../../validation';
import { api } from '../../api';
import toast from 'react-hot-toast';
import { getPageNumbers } from '../../utils/pagination';
import trash_icon from '../../assets/icons/trash-icon.png';
import pen_icon from '../../assets/icons/pen-icon.png';
import { toShortLocalDate } from '../../utils/date';

const ModeContext = createContext();
const DragDropContext = createContext();

function getPriorityProperties(priority) {
    return priority == 0 ?
            ['gray', '▽ Низкий'] :
            priority == 1 ?
            ['blue', '◇ Нормальный'] :
            priority == 2 ?
            ['yellow', '◈ Средний'] :
            priority == 3 ?
            ['orange', '▲ Высокий'] :
            ['red', '⚑ Критический'];
}

function getStatusProperties(status) {
    return status == 0 ?
        ['blue', 'В планах'] :
        status == 1 ?
        ['yellow', 'В процессе'] :
        ['green', 'Выполнено'];
}

function Project() {
    const navigate = useNavigate();
    
    const loadingContext = useContext(LoadingContext);

    const params = useParams();
    const [searchParams, setSearchParams] = useSearchParams();
    const page = Number(searchParams.get('page') || 1);

    //#region header
    const [query, setQuery] = useState('');
    const [debouncedQuery, setDebouncedQuery] = useState(query);
    const [filterStatus, setFilterStatus] = useState(-1);
    const [filterPriority, setFilterPriority] = useState(-1);
    //#endregion

    //#region list
    const [tasks, setTasks] = useState([]);
    //#endregion

    //#region modal
    const [openedModal, setOpenedModal] = useState('');
    const [modalTitle, setModalTitle] = useState('');
    const [modalDescription, setModalDescription] = useState('');
    const [modalProjectStatus, setModalProjectStatus] = useState(0);
    const [modalProjectPriority, setModalProjectPriority] = useState(0);
    const [modalErrors, setModalErrors] = useState({});

    const [taskToDelete, setTaskToDelete] = useState(null);

    const [taskToEdit, setTaskToEdit] = useState(null);

    const [taskToDetail, setTaskToDetail] = useState(null);
    const [taskToDetailStatus, setTaskToDetailStatus] = useState(['blue', 'В планах']);
    const [taskToDetailPriority, setTaskToDetailPriority] = useState(['blue', 'Низкий']);
    //#endregion

    //#region pagination
    const [pagesCount, setPagesCount] = useState(1);
    //#endregion

    //#region drag and drop
    const [dragIndex, setDragIndex] = useState(null);
    const [overIndex, setOverIndex] = useState(null);
    const [overPos, setOverPos] = useState(null);
    //#endregion

    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedQuery(query);
        }, 300)

        return () => {
            clearTimeout(handler);
        }
    }, [query])

    useEffect(() => {
        updatePage();
    }, [debouncedQuery])
    
    useEffect(() => {
        loadingContext.setIsLoading(false);

        updatePage();
    }, [page])

    useEffect(() => {
        updatePage();
    }, [filterStatus, filterPriority])

    useEffect(() => {
        if (taskToDetail) {
            setTaskToDetailPriority(getPriorityProperties(taskToDetail.priority));
            setTaskToDetailStatus(getStatusProperties(taskToDetail.status));
        }
    }, [taskToDetail])

    function goToPage(newPage) {
        const params = new URLSearchParams(searchParams);
        params.set('page', newPage)

        setSearchParams(params);
    }

    async function getTasks() {
        return await api.get(`/tasks?projectId=${params.id}&search=${debouncedQuery}&status=${filterStatus}&priority=${filterPriority}&page=${page}`);
    }

    async function updatePage() {
        const response = await getTasks();
        
        if (response.status === 200) {
            const data = response.data;
            setTasks(data.tasks);
            setPagesCount(data.totalPages);

            if (page <= 0) {
                goToPage(1);
            }
            else if (data.tasks.length <= 0) {
                if (data.totalPages > 0)
                    goToPage(data.totalPages);
                else
                    goToPage(1);
            }
        }
        else {
            toast.error(`Произошла ошибка при попытке получить задачи.`);
        }
        
    }

    function clearCreateModal() {

    }

    function createSubmit(e) {
        e.preventDefault();

        const newErrors = {}

        if (!taskValidation.titleRegex.test(modalTitle)) {
            newErrors.title = 'Неверное название задачи. Название должно содержать от 5 до 100 символов.'
        }

        if (!taskValidation.descriptionRegex.test(modalDescription)) {
            newErrors.description = 'Неверное описание. Описание не должно превышать 1000 строк.'
        }

        if (Object.keys(newErrors).length === 0) {
            const formData = new FormData();

            formData.append('projectId', params.id);
            formData.append('title', modalTitle);
            formData.append('description', modalDescription);
            formData.append('status', modalProjectStatus);
            formData.append('priority', modalProjectPriority);
            if (openedModal == 'edit') {
                formData.append('id', taskToEdit.id);
            }

            const promise = openedModal == 'create' ?
                api.post('/tasks', formData) :
                api.put('/tasks', formData);

            toast.promise(promise, {
                loading: 'Идет сохранение...',
                success: 'Задача успешно сохранена!',
                error: 'Не удалось сохранить задачу!'
            });

            promise.then(response => {
                if (response.status === 200) {
                    setOpenedModal('');
                    updatePage();
                }
            });
        }
        
        setModalErrors(newErrors);
    }

    function openTaskDetailModal(task) {
        setOpenedModal('detail');
        setTaskToDetail(task);
    }

    function moveStatus(task) {
        if (!task) {
            return;
        }

        const promise = api.patch(`/tasks?projectId=${params.id}&id=${task.id}`);

        toast.promise(promise, {
            loading: 'Идет загрузка...',
            success: 'Успешно!',
            error: 'Не удалось изменить статус задачи.'
        })

        promise.then(response => {
            if (response.status === 200) {
                updatePage();
                setOpenedModal('');
            }
        })
    }

    function submitDelete() {
        if (!taskToDelete) {
            return;
        }

        const promise = api.delete(`/tasks?projectId=${params.id}&id=${taskToDelete.id}`);

        toast.promise(promise, {
            loading: 'Идет загрузка...',
            success: 'Успешно!',
            error: 'Не удалось удалить задачу.'
        })

        promise.then(response => {
            if (response.status === 200) {
                updatePage();
                setOpenedModal('');
            }
        })
    }

    function openDeleteModal() {
        setTaskToDelete(taskToDetail);
        setOpenedModal('delete');
    }

    function openEditModal() {
        setTaskToEdit(taskToDetail);
        setOpenedModal('edit');
        setModalTitle(taskToDetail.title);
        setModalDescription(taskToDetail.description);
        setModalProjectStatus(taskToDetail.status);
        setModalProjectPriority(taskToDetail.priority);
    }

    function updateAfterDragAndDrop() {
        if (dragIndex === null || overIndex === null) return;

        const next = [...tasks];
        const [moved] = next.splice(dragIndex, 1); // вынимаем элемент

        let insertAt = overIndex;
        if (overPos !== 'center') {
            if (dragIndex < overIndex) insertAt--;       // компенсируем сдвиг после splice
            if (overPos === 'after') insertAt++;
        }

        next.splice(insertAt, 0, moved);            // вставляем на новое место
        setTasks(next);
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
                    <input type="text" placeholder='Search by title' value={query} onChange={(e)=>{setQuery(e.target.value)}}/>
                </div>

                <div className='second-row'>
                    <ModeContext.Provider value={{ mode: filterStatus, setMode: setFilterStatus}}>
                        <div className='filter-container'>
                                <FilterButton value={-1} color='gray'>Все</FilterButton>
                                <FilterButton value={0} color='blue'>В планах</FilterButton>
                                <FilterButton value={1} color='yellow'>В процессе</FilterButton>
                                <FilterButton value={2} color='green'>Выполнено</FilterButton>
                        </div>
                    </ModeContext.Provider>

                    <ModeContext.Provider value={{ mode: filterPriority, setMode: setFilterPriority}}>
                        <div className='filter-container'>
                                <FilterButton value={-1} color='gray'>Все</FilterButton>
                                <FilterButton value={0} color='gray'>Низкий</FilterButton>
                                <FilterButton value={1} color='blue'>Нормальный</FilterButton>
                                <FilterButton value={2} color='yellow'>Средний</FilterButton>
                                <FilterButton value={3} color='orange'>Высокий</FilterButton>
                                <FilterButton value={4} color='red'>Критический</FilterButton>
                        </div>
                    </ModeContext.Provider>
                </div>

            </div>
            <DragDropContext.Provider value={{dragIndex, setDragIndex, overIndex, setOverIndex, overPos, setOverPos, update: updateAfterDragAndDrop}}>
                <div className='tasks-list'>
                    {
                        tasks.map((t, i) => {
                            if (!!t) {
                                return <TaskCard key={t.id} index={i} task={t} onClick={
                                    () => {
                                        openTaskDetailModal(t);
                                    }
                                } />
                            }
                        })
                    }
                </div>
            </DragDropContext.Provider>

            <div className={ !!openedModal ? 'modal-overlay' : 'modal-overlay hidden'}>
                {
                    openedModal == 'create' || openedModal == 'edit' ?
                    <div key='create-card' className='card create-card'>
                        <h1>{openedModal === 'create' ? 'Создание задачи' : 'Изменение задачи'}</h1>

                        <button className="close-button"
                            onClick={() => {
                                clearCreateModal(); 
                                if (openedModal === 'create') 
                                    setOpenedModal('');
                                else 
                                    setOpenedModal('detail');
                            }}>✖</button>

                        <input type="text" placeholder='Введите название' 
                            value={modalTitle}
                            onChange={(e)=> { setModalTitle(e.target.value); }}/>
                        {modalErrors.title && <div className="error-text">{modalErrors.title}</div>}

                        <textarea value={modalDescription} onChange={(e) => setModalDescription(e.target.value)} placeholder='Введите описание'></textarea>
                        <p className={modalDescription.length > 1000 ? 'length-counter exceed' : 'length-counter'}>
                            {modalDescription.length}/1000
                        </p>
                        {modalErrors.description && <div className="error-text">{modalErrors.description}</div>}

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
                                <FilterButton value={0} color='gray'>Низкий</FilterButton>
                                <FilterButton value={1} color='blue'>Нормальный</FilterButton>
                                <FilterButton value={2} color='yellow'>Средний</FilterButton>
                                <FilterButton value={3} color='orange'>Высокий</FilterButton>
                                <FilterButton value={4} color='red'>Критический</FilterButton>
                            </div>
                        </ModeContext.Provider>

                        <button className='submit-button'
                            onClick={createSubmit}>Подтвердить</button>
                    </div> :
                    openedModal == 'detail' ?
                    <div key='detail-card' className='card task-detail-card'>

                        <button className="close-button"
                            onClick={() => { clearCreateModal(); setOpenedModal(''); }}>✖</button>

                        <p className='title-p'>{taskToDetail.title}</p>
                        <p className='description-p'>{taskToDetail.description}</p>
                        
                        <div className='other-details'>
                            <div className='detail-group'>
                                <p className='title'>Статус</p>
                                <p className={`status ${taskToDetailStatus[0]}`}>{taskToDetailStatus[1]}</p>
                            </div>
                            <div className='detail-group'>
                                <p className='title'>Приоритет</p>
                                <p className={`priority ${taskToDetailPriority[0]}`}>{taskToDetailPriority[1]}</p>
                            </div>
                            <div className='detail-group'>
                                <p className='title'>Создан</p>
                                <p className='date'>{toShortLocalDate(new Date(taskToDetail.createdAt))}</p>
                            </div>
                        </div>

                        <div className='actions-container'>
                            <button className={`next-state-button ${taskToDetailStatus[0]}`}
                                onClick={() => { moveStatus(taskToDetail); }}>
                                {
                                    taskToDetail.status == 0 ?
                                    'Начать выполнение' :
                                    taskToDetail.status == 1 ?
                                    'Завершить' :
                                    'Запланировать снова' 
                                }
                            </button>
                            <button 
                                onClick={(e) => { e.stopPropagation(); openEditModal(); }}
                                className="edit-button">
                                <img src={pen_icon} alt="" />
                            </button>
                            <button
                                onClick={(e) => { e.stopPropagation(); openDeleteModal(); }}
                                className="delete-button">
                                <img src={trash_icon} alt="" />
                            </button>
                        </div>
                    </div> :
                    openedModal == 'delete' ?
                    <div key="delete-card" className="card delete-card">
                        <button className="close-button"
                            onClick={() => { 
                                if (openedModal === 'create') 
                                    setOpenedModal('');
                                else 
                                    setOpenedModal('detail');
                             }}>✖</button>
                        <h1>Подтверждение</h1>
                        <p>Вы уверены что хотите удалить <span style={{ color: "var(--o4)"}}>{taskToDelete.title}</span>?</p>
                        <button
                            onClick={submitDelete}>Подтвердить</button>
                    </div>  :
                    <></>
                }

            </div>

            <button className="add-button" onClick={() => setOpenedModal('create')}>+</button>

            <div className="pages-list">
                {pagesCount > 1 && getPageNumbers(page, pagesCount).map((p, i) => 
                    p === '...' ?
                    <div 
                        className="ellipsis"
                        key={i}>
                            ●●●
                    </div> :

                    <button
                        key={i}
                        className={p === page ? 'page-button selected' : 'page-button'}
                        onClick={() => { goToPage(p); }}>
                        {p}
                    </button>
                )}
            </div>
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

function TaskCard(params) {
    const dragDropContext = useContext(DragDropContext);

    const task = params.task;

    const [priorityColor, priorityText] = getPriorityProperties(task.priority);
    
    const [statusColor, statusText] = getStatusProperties(task.status);
    
    // onDragOver={(e) => {
    //     e.preventDefault();
    //     const rect = e.currentTarget.getBoundingClientRect();
    //     const mid = rect.left + rect.width / 2;
    //     dragDropContext.setOverPos(Math.abs(e.clientX - mid) < 50 ? 'center' : e.clientX < mid ? 'before' : 'after');
    //     dragDropContext.setOverIndex(params.index);
    // }}
    // onDragStart={() => {
    //     dragDropContext.setDragIndex(params.index);
    // }}
    // onDragEnd={() => {
    //     dragDropContext.setDragIndex(null);
    //     dragDropContext.setOverIndex(null);
    //     dragDropContext.setOverPos(null);
    //     dragDropContext.update();
    // }}
    // draggable
    return ( 
        <div className={`task-card ${priorityColor}`}
            onClick={params.onClick}>
            <div className='task-header'>
                <p className='title-p'>{task.title}</p>
                <span className={`status-span ${statusColor}`}>{statusText}</span>
            </div>
            <p className='description-p'>{task.description}</p>
            <p className='priority-p'>{priorityText}</p>
        </div>
    )
}

export default Project;