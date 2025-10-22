import { X } from "lucide-react";

//isMulti: 다중 파일 업로드가 가능한지에 대한 boolean 값
type InputFileProps = {
	imgFiles: { file: string; fileName: string }[];
	setImgFiles: React.Dispatch<
		React.SetStateAction<
			{
				file: string;
				fileName: string;
			}[]
		>
	>;
	isMulti: boolean;
};

export default function InputFile(props: InputFileProps) {
	const handleImgFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
		const files = e.target.files;
		if (files) {
			Array.from(files).map((file) => {
				const reader = new FileReader();
				reader.onload = (e) => {
					props.setImgFiles((prev) => [
						...prev,
						{
							file: e.target?.result as string,
							fileName: file.name,
						},
					]);
				};
				reader.readAsDataURL(file);
			});
		}
	};
	const removeImgFiles = () => {
		props.setImgFiles([]);
	};
	return (
		<>
			{props.imgFiles[0] && (
				<div className="relative flex flex-col items-center px-6 py-4 rounded-xl bg-white border-1 border-[#E5E7EB]">
					<div className="relative pb-2">
						<img
							src={props.imgFiles[0].file}
							alt={"image"}
							className="relative z-2 max-h-50 min-h-30 object-cover bg-white"
						/>
						{props.imgFiles.length > 1 && (
							<div>
								<img
									src={props.imgFiles[0].file}
									alt={"image"}
									className="absolute top-2 left-2 z-1 max-h-50 min-h-30 object-cover opacity-50"
								/>
								<div className="absolute z-2 -bottom-2 -right-4 px-3.5 py-1.5 text-xm text-[#6B7280] font-bold bg-white border-1 border-[#E5E7EB] rounded-3xl">
									{props.imgFiles.length}
								</div>
							</div>
						)}
					</div>

					<button
						type="button"
						className="absolute top-1.5 right-1.5 p-1 rounded-xl text-red-500 border-1 border-[#E5E7EB] cursor-pointer"
						onClick={removeImgFiles}
					>
						<X size={18} />
					</button>
				</div>
			)}
			{!props.imgFiles[0] && (
				<div className="flex flex-col items-center px-6 py-4 rounded-xl bg-white border-2 border-[#E5E7EB] border-dashed">
					<input
						id="imgFile"
						accept="image/*"
						className="hidden"
						type="file"
						name="imgFile"
						onChange={handleImgFileUpload}
						multiple={props.isMulti}
					/>
					<p className="text-[#6B7280]">Upload image</p>
					<label
						htmlFor="imgFile"
						className="px-6 py-4 rounded-xl text-[#6B7280] bg-[#E5E7EB] cursor-pointer"
					>
						Choose Img File
					</label>
				</div>
			)}
		</>
	);
}
