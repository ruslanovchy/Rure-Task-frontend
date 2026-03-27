import { useContext, useEffect, useState } from 'react';
import './Signup.css'
import toast from 'react-hot-toast';
import { emailRegex, loginRegex, passwordRegex } from '../../validation';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../../auth/auth';

function Login() {
  const authContext = useContext(AuthContext);
  const navigate = useNavigate();
  
  useEffect(() => {
    if (authContext.isAuthenticated) {
      navigate('/projects');
    }
  })

  const [login, setLogin] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [repeatPassword, setRepeatPassword] = useState('');
  const [errors, setErrors] = useState({});

  async function submit(e) {
    e.preventDefault();
    
    const newErrors = {};

    if (!emailRegex.test(email) || email.length > 254) {
      newErrors.email = 'Неверная почта';
    }

    if (!loginRegex.test(login)) {
      newErrors.login = 'Неверный логин. Логин должен содержать 3 и больше символов.'
    }

    if (!passwordRegex.test(password)) {
      newErrors.password = 'Неверный пароль. Пароль должен содержать от 8 до 30 символов.'
    }

    if (password != repeatPassword) {
      newErrors.repeatPassword = 'Пароли не совпадают.'
    }

    setErrors(newErrors);

    if (Object.keys(newErrors) == 0) {
      const formData = new FormData();

      formData.append('login', login);
      formData.append('email', email);
      formData.append('password', password);

      const fetchPromise = authContext.signup(formData)
      .then(response => {

        if (response.status == 200) {
          toast.success('Вы успешно зарегистрировались!');
          navigate('/projects');
        }
      })
      .catch(e => {
        if (e.status == 409) {
          toast.error('Пользователь с таким логином или почтой уже существует!');
        }
        else {
          toast.error('Произошла ошибка');
        }
      });

      toast.promise(fetchPromise, 
        {
          loading: 'Идет регистрация...',
        }
      );
    }
  }

  return (
    <div className='card' id="mainCard">
      <h1 className=''>Регистрация</h1>

      <form action="post" onSubmit={(e) => submit(e)}>
        <input type="text" placeholder="Введите логин" id="emailInput" 
          className={errors.login && 'error'} 
          value={login}
          onChange={(e) => { setLogin(e.target.value); setErrors({});}}/>
        {errors.login && (<div className='error-text'>{errors.login}</div>)}
        

        <br />

        <input type="text" placeholder="Введите почту" id="emailInput"
          className={errors.email && 'error'} 
          value={email}
          onChange={(e) => { setEmail(e.target.value); setErrors({});} }/>
        {errors.email && (<div className='error-text'>{errors.email}</div>)}

        <br />
        <br />

        <input type="password" placeholder="Введите пароль" id="passwordInput" 
          className={errors.password && 'error'} 
          value={password}
          onChange={(e) => {setPassword(e.target.value); setErrors({});}}/>
        {errors.password && (<div className='error-text'>{errors.password}</div>)}

        <br />

        <input type="password" placeholder="Подтвердите пароль" id="passwordInput" 
          className={errors.repeatPassword && 'error'} 
          value={repeatPassword}
          onChange={(e) => {setRepeatPassword(e.target.value); setErrors({});}}/>
        {errors.repeatPassword && (<div className='error-text'>{errors.repeatPassword}</div>)}

        <br />

        <button>Зарегистрировать</button>
      </form>
      <div className='separator'>
        <span>другие методы</span>
      </div>

      <button className='button-social'>Google</button>

      <p>Есть учетной записи? <Link to='/login'>Войти</Link></p>

    </div>
  );
}


export default Login;