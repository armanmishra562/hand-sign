import { UploadForm } from '../components/UploadForm';

const ImageRecognition = () => {
	return (
		<div className="p-8">
			<h1 className="text-3xl font-bold mb-6">
				Image-Based Hand Sign Recognition
			</h1>
			<UploadForm />
		</div>
	);
};

export default ImageRecognition;
