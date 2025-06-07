import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ImageRecognition from './pages/ImageRecognition';

function App() {
	return (
		<Router>
			<Routes>
				<Route path="/" element={<ImageRecognition />} />
			</Routes>
		</Router>
	);
}

export default App;
