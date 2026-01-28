import { createContext, useContext, useState } from 'react';

const AdminContext = createContext(null);

export const AdminProvider = ({ children }) => {
    const [isAdmin, setIsAdmin] = useState(false);
    const [adminName, setAdminName] = useState('');

    // No session persistence - admin must login after every page reload

    const login = (name, password) => {
        const correctName = import.meta.env.VITE_ADMIN_NAME;
        const correctPassword = import.meta.env.VITE_ADMIN_PASSWORD;

        if (name === correctName && password === correctPassword) {
            setIsAdmin(true);
            setAdminName(name);
            return { success: true };
        }
        return { success: false, error: 'Invalid credentials' };
    };

    const logout = () => {
        setIsAdmin(false);
        setAdminName('');
    };

    return (
        <AdminContext.Provider value={{ isAdmin, adminName, login, logout }}>
            {children}
        </AdminContext.Provider>
    );
};

export const useAdmin = () => {
    const context = useContext(AdminContext);
    if (!context) {
        throw new Error('useAdmin must be used within AdminProvider');
    }
    return context;
};

export default AdminContext;
