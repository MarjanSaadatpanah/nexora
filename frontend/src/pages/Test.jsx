import React, { useEffect, useState } from 'react'
import Nav from '../components/Nav';

const Test = () => {
    const [isScrolled, setIsScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {

            if (window.scrollY > 50) {
                setIsScrolled(true);
            } else {
                setIsScrolled(false);
            }
        };
        window.addEventListener('scroll', handleScroll);
        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);


    const searchAndFilterClass = isScrolled
        ? "bg-red-500 fixed top-0 left-0 right-0 z-50"
        : "";

    return (
        <div>
            <Nav className={searchAndFilterClass} />
            hohoho

            <p className="h-96 bg-slate-500" >
                hohoho
            </p>
            <p className="h-96 bg-slate-500" >
                hohoho
            </p>
            <p className="h-96 bg-slate-500" >
                hohoho
            </p>
        </div>
    )
}

export default Test
