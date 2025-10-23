import { X, Upload, File } from "lucide-react";
import { validateFileSize, validateFileType } from "../utils/fileUpload";

type FileUploadProps = {
	uploadedFiles: File[];
	setUploadedFiles: React.Dispatch<React.SetStateAction<File[]>>;
	isMulti?: boolean;
	allowedTypes?: string[];
	maxFileSizeMB?: number;
	label?: string;
};

export default function FileUpload(props: FileUploadProps) {
	const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
		const files = e.target.files;
		if (files) {
			Array.from(files).forEach((file) => {
				// 파일 크기 검증
				if (!validateFileSize(file, props.maxFileSizeMB || 10)) {
					alert(
						`파일 크기는 ${props.maxFileSizeMB || 10}MB 이하여야 합니다.`,
					);
					return;
				}

				// 파일 타입 검증
				const defaultAllowedTypes = [
					"pdf",
					"doc",
					"docx",
					"ppt",
					"pptx",
					"xls",
					"xlsx",
					"txt",
					"zip",
					"rar",
					"png",
					"jpg",
					"jpeg",
					"gif",
				];

				const allowedTypes = props.allowedTypes || defaultAllowedTypes;

				if (!validateFileType(file, allowedTypes)) {
					alert(
						`허용되지 않는 파일 형식입니다. 허용 형식: ${allowedTypes.join(", ")}`,
					);
					return;
				}

				props.setUploadedFiles((prev) => [...prev, file]);
			});
		}
	};

	const removeFile = (index: number) => {
		props.setUploadedFiles((prev) => prev.filter((_, i) => i !== index));
	};

	const removeAllFiles = () => {
		props.setUploadedFiles([]);
	};

	const formatFileSize = (bytes: number): string => {
		if (bytes === 0) return "0 Bytes";
		const k = 1024;
		const sizes = ["Bytes", "KB", "MB", "GB"];
		const allowsFileSize = Math.floor(Math.log(bytes) / Math.log(k));
		return (
			parseFloat((bytes / Math.pow(k, allowsFileSize)).toFixed(2)) +
			" " +
			sizes[allowsFileSize]
		);
	};

	return (
		<>
			{/* 업로드된 파일 목록 표시 */}
			{props.uploadedFiles.length > 0 && (
				<div className="space-y-2">
					{props.uploadedFiles.map((file, index) => (
						<div
							key={index}
							className="relative flex items-center justify-between p-4 rounded-xl bg-white border border-[#E5E7EB]"
						>
							<div className="flex items-center space-x-3">
								<div className="w-12 h-12 bg-gray-100 rounded flex items-center justify-center">
									<File size={20} className="text-gray-500" />
								</div>
								<div>
									<p className="text-sm font-medium text-gray-900">
										{file.name}
									</p>
									<p className="text-xs text-gray-500">
										{formatFileSize(file.size)}
									</p>
								</div>
							</div>
							<button
								type="button"
								className="p-1 text-red-500 hover:text-red-700"
								onClick={() => removeFile(index)}
							>
								<X size={18} />
							</button>
						</div>
					))}
					{props.uploadedFiles.length > 1 && (
						<button
							type="button"
							className="text-sm text-red-500 hover:text-red-700"
							onClick={removeAllFiles}
						>
							모든 파일 제거
						</button>
					)}
				</div>
			)}

			{/* 파일 업로드 영역 */}
			<div className="flex flex-col items-center px-6 py-4 rounded-xl bg-white border-2 border-[#E5E7EB] border-dashed">
				<input
					id="fileUpload"
					accept="*"
					className="hidden"
					type="file"
					name="fileUpload"
					onChange={handleFileUpload}
					multiple={props.isMulti || false}
				/>
				<div className="text-center">
					<Upload size={32} className="mx-auto text-gray-400 mb-2" />
					<p className="text-[#6B7280] mb-2">
						{props.label || "파일을 업로드하세요"}
					</p>
					<p className="text-xs text-gray-400 mb-4">
						최대 {props.maxFileSizeMB || 10}MB,{" "}
						{props.isMulti ? "여러 파일" : "단일 파일"} 업로드 가능
					</p>
					<label
						htmlFor="fileUpload"
						className="inline-flex items-center px-4 py-2 rounded-xl text-[#6B7280] bg-[#E5E7EB] hover:bg-[#D1D5DB] cursor-pointer transition-colors"
					>
						<Upload size={16} className="mr-2" />
						파일 선택
					</label>
				</div>
			</div>
		</>
	);
}
