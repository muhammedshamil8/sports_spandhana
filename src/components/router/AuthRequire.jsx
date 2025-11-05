import { useEffect, useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { auth } from '@/config/fbase';
import { onAuthStateChanged, signOut } from 'firebase/auth';


// eslint-disable-next-line react/prop-types
const AuthRoleRequire = ({ children }) => {
    const [user, setUser] = useState(auth.currentUser);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            setUser(user);
            setLoading(false);
            if (!user) {
                await signOut(auth);
                navigate('/Login');
           
        }});

        return () => unsubscribe();
    }, []);


    if (loading) {
        return <div className='fixed top-0 left-0 w-full h-full bg-white dark:bg-slate-900 flex items-center justify-center z-50'>
            <p className='text-center dark:text-white flex items-center justify-center'> Loading...</p>
        </div>;
    }

    return user ? children : <Navigate to="/Login" replace />;
};

export default AuthRoleRequire;