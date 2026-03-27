import { createContext, useEffect, useState } from "react";
import { api } from "../api";

export const AuthContext = createContext(null);

function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    
    useEffect(() => {
        api.get('/account/me')
            .then(response => { setUser(response.data); })
            .catch(() => { setUser(null); })
            .finally(() => { setIsLoading(false); });
    }, []);

    const updateUser = async () => {
        try {
            const res = await api.get('/account/me');
            setUser(res.data);
        }
        catch {
            setUser(null);
        }
    }

    const login = async (credentials) => {
        const response = await api.post('/account/login', credentials);
        await updateUser();
        return response;
    }

    const signup = async (credentials) => {
        const response = await api.post('/account/signup', credentials);
        await updateUser();
        return response;
    }

    const logout = async () => {
        await api.post('/account/logout');
        await updateUser();
    }

    return (
        <AuthContext.Provider value={{user, isAuthenticated: !!user, isLoading, login, signup, logout}}>
            { children }
        </AuthContext.Provider>
    )
}

export default AuthProvider;