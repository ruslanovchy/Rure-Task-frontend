import Hero from './Hero/Hero';
import SocialEvidence from './SocialEvidence/SocialEvidence';
import './IndexPage.css'
import Explanations from './Explanation/Explanations';
import Footer from './Footer/Footer';
import Final from './Final/Final';

function IndexPage() {
    return (
        <div className="landing-container">
            <Hero />
            <Explanations />
            <SocialEvidence />
            <Final />
            <Footer />
        </div>
    )
}

export default IndexPage;