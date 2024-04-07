import React, { useState, useEffect } from 'react';
import { animateScroll as scroll } from 'react-scroll';
import SystemTop from "next-common/assets/imgs/icons/systemTop.svg";
export default function ScrollToTopButton({scrollYShowPX = 800}){
    const [showButton, setShowButton] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setShowButton(window.scrollY > scrollYShowPX);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const handleClick = () => {
        scroll.scrollToTop();
    };

    return (
        showButton && (
            <div className={'w-10 h-10'} style={{
                display:"flex",
                justifyContent:'center',
                alignItems:'center',
                position: 'fixed',
                cursor:'pointer',
                bottom: '96px',
                right: '24px',
                zIndex:1000,
                borderRadius: '8px',
                border: '1px solid var(--color-neutral400, #E0E4EB)',
                background: 'var(--color-neutral100, #FFF)',
                /* shadow100 */
                boxShadow: '0px 6px 7px 0px rgba(30, 33, 52, 0.02), 0px 1.34px 1.564px 0px rgba(30, 33, 52, 0.01), 0px 0.399px 0.466px 0px rgba(30, 33, 52, 0.01)'
            }} onClick={handleClick}>
                <SystemTop />
            </div>
        )
    );
};
