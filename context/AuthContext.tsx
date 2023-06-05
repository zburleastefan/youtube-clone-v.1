'use client'
import { User, getAuth, onAuthStateChanged } from 'firebase/auth';
import React from 'react';
import firebaseApp from '../firebase/firebaseConfig';
import SignIn from '@/app/signin/page';
import { usePathname } from 'next/navigation';
import LoadingDots from './../app/components/LoadingDots';

const auth = getAuth(firebaseApp);

export const AuthContext = React.createContext({});
export const useAuthContext = () =>  React.useContext(AuthContext);
export const AuthContextProvider = ({
    children,
}:{
    children: React.ReactNode
}) => {
    const [user, setUser] = React.useState<User | null>(null);
    const [loading, setLoading] = React.useState<Boolean>(true);
    const pathName = usePathname();

    React.useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                setUser(user);
            } else {
                setUser(null);
            }
            setLoading(false);
        });
        return () => unsubscribe();
    }, []);

    return (
    <AuthContext.Provider value={{auth}}>
        { loading ? 
            <div 
                className="flex h-screen w-screen bg-black bg-no-repeat bg-center bg-contain bg-[url('/ytLogo.svg')] object-scale-down text-center items-center justify-center
                  overflow-y-hidden overflow-x-clip p-3 align-middle"
            >
                <h1 className="text-3xl font-display font-serif md:text-5xl font-bold tracking-normal text-black ">
                    Loading{" "}
                    <span className="relative text-3xl"><LoadingDots /></span>
                </h1>
            </div>
        : user && user.emailVerified == true ? 
            children
        :
            <SignIn/>
        }
    </AuthContext.Provider>
  );
}

export const authContext = auth;