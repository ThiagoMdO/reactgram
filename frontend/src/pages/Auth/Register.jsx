import './Auth.css';

// Components
import {Link} from 'react-router-dom';
import Message from '../../componentes/Message';

// Hooks
import { useState, useEffect} from 'react';
import { useSelector, useDispatch } from 'react-redux';

// Redux
import { register, reset } from '../../slices/authSlice';

const Register = () => {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const dispatch = useDispatch()

    const {loading, error} = useSelector((state) => state.auth)

    const handleSubmit = (e) => {
        e.preventDefault();

        const user = {
            name,
            email,
            password,
            confirmPassword
        }

        console.log(user);

        dispatch(register(user));
    }

    // Clean all auth states
    useEffect(() => {
        dispatch(reset());
    }, [dispatch]);


    return(
        <div id="register">
            <h2>Registrar</h2>
            <p className="subtitle">Cadastre-se para ver as fotos dos seus amigos</p>

            <form onSubmit={handleSubmit}>
                <input 
                    type="text" 
                    placeholder='Nome'
                    value={name || ''}
                    onChange={(e) => setName(e.target.value)}
                />
                <input 
                    type="text"
                    placeholder='E-mail'
                    value={email || ''}
                    onChange={(e) => setEmail(e.target.value)}
                />
                <input 
                    type="password"
                    placeholder='Senha'
                    value={password || ''}
                    onChange={(e) => setPassword(e.target.value)}
                />
                <input 
                    type="password"
                    placeholder='Confirme a senha'
                    value={confirmPassword || ''}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                />
                {!loading && <input type="submit" value="Cadastrar" />}
                {loading && <input type='submit' value="Aguarde" /> }
                {console.log(error)}
                {error && <Message msg={error} type="error" />}              
                <p>Já tem conta? <Link to="/login">Login</Link></p>
            </form>
        </div>
    )
}

export default Register