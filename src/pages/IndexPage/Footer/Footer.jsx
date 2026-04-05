import { icons } from '../../../assets/icons/icons';
import './Footer.css'


function Footer() {
    return (
        <section className='footer-section'>
            <div className='footer-container'>
                <div className='first-row'>
                    <p className="logo-p">Rure Task</p>
                    <div className='links-container'>
                        <div className='social-net-container'
                            onClick={() => { location.href = 'https://www.instagram.com/rurzen_/' }}>
                            <img src={icons['instagram.svg']} alt="" />
                            <p>Instagram</p>
                        </div>
                        <div className='social-net-container'
                            onClick={() => { location.href = 'https://x.com/DrakonikT' }}>
                            <img src={icons['twitter.svg']} alt="" />
                            <p>Twitter</p>  
                        </div>
                        <div className='social-net-container'
                        onClick={() => { location.href = 'https://www.tiktok.com/@chyngyzry' }}>
                            <img src={icons['tiktok.svg']} alt="" />
                            <p>TikTok</p>
                        </div>
                    </div>
                </div>
                <div className='second-row'>
                    <p>© 2026 Rure Tech, Inc. All Rights Reserved.</p>
                </div>
            </div>
                
        </section>
    )
}

export default Footer;