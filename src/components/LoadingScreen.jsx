import './LoadingScreen.css';

function LoadingScreen({ isLoading = true }) {
    return (
        <div className={isLoading ? "loading-container" : "loading-container hidden"}>
            <div className="spinner"></div>
        </div>
    );
}

export default LoadingScreen;