import { useContext, useEffect, useRef, useState } from "react";
import { Link, useNavigate, useParams, useSearchParams } from "react-router-dom";
import { AuthContext } from "../../auth/auth";
import { api } from '../../api'
import { LoadingContext } from "../../App";
import './ProjectsList.css'
import toast from "react-hot-toast";
import { projectValidation } from "../../validation";
import trash_icon from '../../assets/icons/trash-icon.png';
import pen_icon from '../../assets/icons/pen-icon.png';
import { images } from "../../assets/projectImages";
import { getPageNumbers } from "../../utils/pagination";

function ProjectsList() {
    const [searchParams, setSearchParams] = useSearchParams();

    const page = Number(searchParams.get('page') || 1);

    const navigate = useNavigate();
    const authContext = useContext(AuthContext);
    const loadingContext = useContext(LoadingContext);

    const [projects, setProjects] = useState([]);
    const [pagesCount, setPagesCount] = useState(1);

    const [modalOpened, setModalOpened] = useState('');

    //#region create modal
    const [image, setImage] = useState(null);
    const [imageURL, setImageURL] = useState('');
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [errors, setErrors] = useState({});
    //#endregion

    //#region delete modal
    const [projectToDelete, setProjectToDelete] = useState(null);
    //#endregion

    //#region edit modal
    const [projectToEdit, setProjectToEdit] = useState(null);
    const [isImageChanged, setIsFileChanged] = useState(false);
    //#endregion

    const fileInputRef = useRef(null);

    async function getProjects() {
        const response = await api.get(`/projects?page=${page}`);
        if (response.status === 200) {
            return response.data;
        }
        return null;
    }

    async function updatePage() {
        loadingContext.setIsLoading(true);

        const data = await getProjects();
        
        if (!data) {
            setProjects([]);
            return;
        }
        setProjects(data.projects)
        setPagesCount(data.totalPages);
        loadingContext.setIsLoading(false);

        if (page <= 0) {
            goToPage(1);
        }
        else if (data.projects.length <= 0) {
            goToPage(data.totalPages)
        }
    }

    useEffect(() => {
        updatePage();
        return () => {
            loadingContext.setIsLoading(false);
        }
    }, [page])

    function goToPage(newPage) {
        const params = new URLSearchParams(searchParams);
        params.set('page', newPage);

        setSearchParams(params);
    }

    async function submit(e) {
        const newErrors = {};

        if (!projectValidation.nameRegex.test(name)) {
            newErrors.name = 'Неверное название проекта. Название должно содержать от 5 до 100 символов.'
        }

        if (!projectValidation.descriptionRegex.test(description)) {
            newErrors.description = 'Неверное описание. Описание не должно превышать 1000 строк.'
        }

        if (Object.keys(newErrors).length == 0) {
            const formData = new FormData();

            if (modalOpened == 'edit') {
                console.log(projectToEdit);
                formData.append('id', projectToEdit.id);
            }

            formData.append('name', name);
            formData.append('image', image);
            formData.append('isImageChanged', isImageChanged);
            if (!!description) formData.append('description', description);
            
            const promise = modalOpened === 'create' ? api.post('/projects', formData) : api.put('/projects', formData);
            toast.promise(promise, {
                loading: 'Идет сохранение...',
                success: 'Проект успешно сохранен!',
                error: 'Не удалось сохранить проект!'
            });

            promise.then(async (response) => {
                if (response.status == 200) {
                    setModalOpened('');
                    updatePage();
                    clearCreateModal();
                }
            });
        }

        setErrors(newErrors);
    }

    function clearCreateModal() {
        setDescription('');
        setName('');
        setImage(null);
        setImageURL(null);
        setErrors({});
    }

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        setImage(file);
        setImageURL(URL.createObjectURL(file));
        setIsFileChanged(true);
    }
    
    const openDeleteModal = (project) => {
        setProjectToDelete(project);

        setModalOpened('delete');
    }

    async function submitDelete(e) {
        if (!projectToDelete || !projectToDelete.id) {
            return;
        }

        const promise = api.delete(`/projects?id=${projectToDelete.id}`);

        toast.promise(promise, {
            loading: 'Идет удаление...',
            success: 'Проект успешно удален!',
            error: 'Не удалось удалить проект!'
        })

        promise.then(response => {
            if (response.status === 200) {
                setModalOpened('');
                updatePage();
            }
        })
    }

    function openEditModal(project) {
        setProjectToEdit(project);

        setImageURL(project.imageUrl);

        setName(project.name);
        setDescription(project.description);

        setModalOpened('edit');
        setIsFileChanged(false);
    }

    return (
        <div className="projects-main-container">
            <div className="projects-list">
                {projects.map((p) => {
                    let number = 0;
                    const firstDigitIndex = p.id.search(/\d/)
                    if (firstDigitIndex != -1) {
                        number = parseInt(p.id[firstDigitIndex])
                    }
                    return (
                        <div key={p.id} className="card project-card"
                            onClick={() => { navigate(`/projects/${p.id}`); }}>
                            <div className="project-actions">
                                <button 
                                    onClick={(e) => { e.stopPropagation(); openEditModal(p); }}
                                    className="edit-button">
                                    <img src={pen_icon} alt="" />
                                </button>
                                <button
                                    onClick={(e) => { e.stopPropagation(); openDeleteModal(p); }}
                                    className="delete-button">
                                    <img src={trash_icon} alt="" />
                                </button>
                            </div>
                            <img src={!!p.imageUrl ? p.thumbnailImageUrl : images[number]} alt="" />
                            <p className="name">{p.name}</p>
                            <p className="description">{p.description}</p>
                        </div>
                    )
                })}
            </div>

            <button className="add-button" onClick={() => setModalOpened('create')}>+</button>

            <div className={modalOpened ? 'modal-overlay' : 'modal-overlay hidden'}>
                {
                    modalOpened === 'create' || modalOpened === 'edit' ?

                    <div key="create-card" className="card">
                        <h1>{modalOpened === 'create' ? 'Создание проекта' : 'Изменение проекта'}</h1>

                        <button className="close-button"
                            onClick={() => { clearCreateModal(); setModalOpened(''); }}>✖</button>

                        <input 
                            type="file"
                            ref={fileInputRef}
                            style={{ display: 'none' }}
                            onChange={ handleFileChange } />
                        <div 
                            className="image-container"
                            onClick={() => { fileInputRef.current.click(); }}>
                            {
                                !!imageURL ?
                                <div className="image-second-container">
                                    <img src={imageURL} alt=""/>
                                    <button 
                                        className="close-button"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            setImage(null);
                                            setImageURL(null);
                                            setIsFileChanged(true);
                                        }}>✖</button>
                                </div> :
                                <p>Загрузить фото</p>
                            }
                            
                        </div>

                        <input className={errors.name && 'error'} type="text"
                            placeholder="Название проекта"
                            value={name}
                            onChange={(e) => { setName(e.target.value) }} />

                        {errors.name && <div className="error-text">{errors.name}</div>}

                        <textarea className={errors.description && 'error'} name="" id=""
                            placeholder="Описание проекта" value={description}
                            onChange={(e) => { setDescription(e.target.value) }}></textarea>

                        <p className={description.length > 1000 ? 'length-counter exceed' : 'length-counter'}>
                            {description.length}/1000
                        </p>

                        {errors.description && <div className="error-text">{errors.description}</div>}

                        <button onClick={(e) => { submit(e) }}>Подтвердить</button>
                    </div> 
                    
                    : modalOpened == 'delete' ?
                    
                    <div key="delete-card" className="card delete-card">
                        <button className="close-button"
                            onClick={(e) => { setModalOpened(''); }}>✖</button>
                        <h1>Подтверждение</h1>
                        <p>Вы уверены что хотите удалить <span style={{ color: "var(--o4)"}}>{projectToDelete.name}</span>?</p>
                        <button
                            onClick={submitDelete}>Подтвердить</button>
                    </div> 
                    
                    : 
                    
                    <></>
                }
                
            </div>

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

export default ProjectsList;