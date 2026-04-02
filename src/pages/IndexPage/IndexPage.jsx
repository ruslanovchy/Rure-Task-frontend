import Hero from './Hero/Hero';
import SocialEvidence from './SocialEvidence/SocialEvidence';
import './IndexPage.css'

function IndexPage() {
    return (
        <div className="landing-container">
            <Hero />
            <SocialEvidence />
        </div>
    )
}

export default IndexPage;