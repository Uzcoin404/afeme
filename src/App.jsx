// Import React and React Hooks
import React, { useEffect, Suspense, lazy } from 'react';
import { Routes, Route, useLocation } from "react-router-dom";

// Import Components
import './App.scss';
import Loader from './Components/Loader/Loader';
import ScrollTop from './Utils/ScrollTop';

// Lazy load pages for code splitting
const Home = lazy(() => import("./Pages/Home/Home"));
const SignUp = lazy(() => import('./Pages/SignUp/SignUp'));
const AdvertPage = lazy(() => import('./Pages/AdventPage/advertPage'));
const Adverts = lazy(() => import('./Pages/Adverts/Adverts'));
const Advert = lazy(() => import('./Pages/Advert/Advert'));
const CatalogRealtor = lazy(() => import('./Pages/CatalogOfRealtors/CatalogRealtors'));
const Chat = lazy(() => import('./Pages/ChatPage/ChatPage'));
const Page404 = lazy(() => import('./Pages/404/404'));
const ReltorCob = lazy(() => import('./Pages/ReltorCobinet/Reltor'));
const UsProfil = lazy(() => import('./Pages/UserProfil/UsProfil'));
const UserAdsPage = lazy(() => import("./Pages/UserAdsPage/UserAdsPage"));
const UserFavoritesPage = lazy(() => import('./Pages/UserFavoritesPage/UserFavoritesPage'));
const Help = lazy(() => import('./Pages/Help/Help'));
const SearchMap = lazy(() => import('./Pages/SearchMap/SearchMap'));
const UserPostEditPage = lazy(() => import('./Pages/UserPostEditPage/UserPostEditPage'));
const Email = lazy(() => import('./Components/Forgot/Email/Email'));
const NewPassword = lazy(() => import('./Components/Forgot/newPassword/NewPassword'));

// Track if readystatechange listener has been added
let readystateListenerAdded = false;

function App() {
    const location = useLocation();

    useEffect(() => {
        const isChatPage = location.pathname.substring(0, 5) === '/chat';
        const isErrorPage = document.querySelector('.page404');
        
        if (!isChatPage && !isErrorPage) {
            // Load Replain widget only once
            if (!window.replainSettings) {
                window.replainSettings = { id: "c2f4a578-9a1f-49ac-9214-44448b236714" };
                const script = document.createElement("script");
                script.async = true;
                script.src = "https://widget.replain.cc/dist/client.js";
                script.style.zIndex = "1";
                document.head.appendChild(script);
            }
        }
    }, [location.pathname])

    // Clean up loaders on document ready
    useEffect(() => {
        if (!readystateListenerAdded) {
            const handleReadyStateChange = () => {
                if (document.readyState === "complete") {
                    const loaders = document.querySelectorAll('.loading');
                    loaders.forEach(loader => {
                        setTimeout(() => loader.remove(), 500);
                    });
                    document.removeEventListener('readystatechange', handleReadyStateChange);
                    readystateListenerAdded = true;
                }
            };
            document.addEventListener('readystatechange', handleReadyStateChange);
        }
    }, [])

    return (
        <>
            <ScrollTop />
            <Suspense fallback={<Loader />}>
                <Routes>
                    <Route path='/' element={<Home />} />
                    <Route path='/Afeme' element={<Home />} />
                    <Route path='/SignUp' element={<SignUp />} />
                    <Route path='/advertPage' element={<AdvertPage />} />
                    <Route path='/adverts' element={<Adverts />} />
                    <Route path='/advert/:postID' element={<Advert />} />
                    <Route path='/catalogreltor' element={<CatalogRealtor />} />
                    <Route path='/reltorcob/:userId' element={<ReltorCob />} />
                    <Route path='/userprofil' element={<UsProfil />} />
                    <Route path='/userads' element={<UserAdsPage />} />
                    <Route path='/userfavorites' element={<UserFavoritesPage />} />
                    <Route path='/userpostedit/:postID' element={<UserPostEditPage/>} />
                    <Route path='/chat' element={<Chat />} />
                    <Route path='/help' element={<Help />} />
                    <Route path='/map' element={<SearchMap />} />
                    <Route path='/forgot' element={<Email />} />
                    <Route path='/newPassword' element={<NewPassword />} />
                    <Route path="*" element={<Page404 />} />
                </Routes>
            </Suspense>
        </>
    )
};
export default App;