import { X, File } from "lucide-react";
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

	/* const removeFile = (index: number) => {
		props.setUploadedFiles((prev) => prev.filter((_, i) => i !== index));
	}; */

	const removeAllFiles = () => {
		props.setUploadedFiles([]);
	};

	/* const formatFileSize = (bytes: number): string => {
		if (bytes === 0) return "0 Bytes";
		const k = 1024;
		const sizes = ["Bytes", "KB", "MB", "GB"];
		const allowsFileSize = Math.floor(Math.log(bytes) / Math.log(k));
		return (
			parseFloat((bytes / Math.pow(k, allowsFileSize)).toFixed(2)) +
			" " +
			sizes[allowsFileSize]
		);
	}; */

	return (
		<>
			{props.uploadedFiles[0] && (
				<div className="relative flex flex-col items-center px-6 py-4 rounded-xl bg-white border-1 border-[#E5E7EB]">
					<div className="relative pb-2">
						<div className="relative z-2 max-h-50 min-h-30 object-cover bg-white flex items-center justify-center">
							<File size={40} className="text-gray-500" />
						</div>
						{props.uploadedFiles.length > 1 && (
							<div>
								<div className="absolute top-2 left-2 z-1 max-h-50 min-h-30 object-cover opacity-50 flex items-center justify-center">
									<File size={40} className="text-gray-500" />
								</div>
								<div className="absolute z-2 -bottom-2 -right-4 px-3.5 py-1.5 text-xm text-[#6B7280] font-bold bg-white border-1 border-[#E5E7EB] rounded-3xl">
									{props.uploadedFiles.length}
								</div>
							</div>
						)}
					</div>

					<button
						type="button"
						className="absolute top-1.5 right-1.5 p-1 rounded-xl text-red-500 border-1 border-[#E5E7EB] cursor-pointer"
						onClick={removeAllFiles}
					>
						<X size={18} />
					</button>
				</div>
			)}
			{!props.uploadedFiles[0] && (
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
					<p className="text-[#6B7280]">
						{props.label || "Upload file"}
					</p>
					<label
						htmlFor="fileUpload"
						className="px-6 py-4 rounded-xl text-[#6B7280] bg-[#E5E7EB] cursor-pointer"
					>
						Choose File
					</label>
				</div>
			)}
		</>
	);
}
