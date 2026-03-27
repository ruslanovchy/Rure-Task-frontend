import { useContext, useEffect, useState } from 'react';
import './Login.css'
import { passwordRegex } from '../../validation';
import toast from 'react-hot-toast';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../../auth/auth';

function Login() {
  const navigate = useNavigate();
  const authContext = useContext(AuthContext);

  useEffect(() => {
    if (authContext.isAuthenticated) {
      navigate('/projects');
    }
  })

  const [login, setLogin] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({});

  function submit(e) {
    e.preventDefault();

    const newErrors = {};

    if (login.length < 3) {
      newErrors.login = 'Неверное значение';
    }

    if (!passwordRegex.test(password)) {
      newErrors.password = 'Неверный пароль'
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length == 0) {
      const formData = new FormData();

      formData.append('login', login);
      formData.append('password', password);

      const fetchPromise = authContext.login(formData)
      .then((response) => {
        if (response.status == 200) {
          toast.success('Вы успешно вошли!');
          navigate('/projects');
        }
      })
      .catch(e => {
        if (e.status == 404) {
          toast.error('Пользователь с таким логином или почтой не существует!');
        }
        else if (e.status == 403 || e.status == 401) {
          toast.error('Неверный логин или пароль!');
        }
        else {
          toast.error('Произошла ошибка!');
        }
      });

      toast.promise(fetchPromise, 
        {
          loading: 'Идет вход...',
        }
      );

    }
  }

  return (
    <div className='card' id="mainCard">
      <h1 className=''>Вход</h1>

      <form action="post" onSubmit={(e) => submit(e)}>
        <input type="text" placeholder="Введите логин или почту" id="emailInput" 
          className={errors.login && 'error'} 
          value={login}
          onChange={(e) => { setLogin(e.target.value); setErrors({});}}/>
        {errors.login && (<div className='error-text'>{errors.login}</div>)}

        <br />

        <input type="password" placeholder="Введите пароль" id="passwordInput" 
          className={errors.password && 'error'} 
          value={password}
          onChange={(e) => { setPassword(e.target.value); setErrors({});}}/>
        {errors.password && (<div className='error-text'>{errors.password}</div>)}

        <br />

        <button>Вход в систему</button>
      </form>
      <div className='separator'>
        <span>другие методы</span>
      </div>

      <button className='button-social'>Google</button>

      <p>Нет учетной записи? <Link to='/signup'>Зарегистрировать</Link></p>

    </div>
  );
}

export default Login;