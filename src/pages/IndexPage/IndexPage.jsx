import Hero from './Hero/Hero';
import SocialEvidence from './SocialEvidence/SocialEvidence';
import './IndexPage.css'
import Explanations from './Explanation/Explanations';

function IndexPage() {
    return (
        <div className="landing-container">
            <Hero />
            <Explanations />
            <SocialEvidence />
        </div>
    )
}

export default IndexPage;