import { useState } from 'react';
import axios from 'axios';
import { Button } from '@/components/ui/button'; // ShadCN button

export const UploadForm = () => {
	const [file, setFile] = useState<File | null>(null);
	const [prediction, setPrediction] = useState<string | null>(null);
	const [loading, setLoading] = useState(false);

	const handleUpload = async () => {
		if (!file) return;

		const formData = new FormData();
		formData.append('file', file);
		setLoading(true);
		setPrediction(null);

		try {
			const res = await axios.post(
				'http://localhost:5000/api/inference/image',
				formData,
				{
					headers: { 'Content-Type': 'multipart/form-data' },
				},
			);
			setPrediction(res.data.prediction);
		} catch (err) {
			console.error(err);
			alert('Failed to classify image');
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className="max-w-md mx-auto p-4 border rounded-2xl shadow">
			<input
				type="file"
				accept="image/*"
				onChange={(e) => setFile(e.target.files?.[0] || null)}
				className="mb-4"
			/>
			<Button onClick={handleUpload} disabled={!file || loading}>
				{loading ? 'Uploading...' : 'Classify'}
			</Button>

			{prediction && (
				<div className="mt-4 p-4 bg-green-100 rounded-xl text-center">
					<h2 className="text-xl font-bold">Prediction:</h2>
					<p className="text-2xl text-green-800">{prediction}</p>
				</div>
			)}
		</div>
	);
};
