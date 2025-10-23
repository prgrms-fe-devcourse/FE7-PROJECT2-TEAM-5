import supabase from "./supabase";

// 파일 다운로드 함수
export const downloadFile = async (filePath: string, fileName: string) => {
	try {
		const { data, error } = await supabase.storage
			.from("files")
			.download(filePath);

		if (error) {
			console.error("파일 다운로드 실패:", error);
			throw error;
		}

		// 브라우저에서 파일 다운로드
		// href랑 download 속성 이용
		const url = URL.createObjectURL(data);
		const a = document.createElement("a");
		a.href = url;
		a.download = fileName;
		document.body.appendChild(a);
		a.click();
		document.body.removeChild(a);
		URL.revokeObjectURL(url);
	} catch (error) {
		console.error("파일 다운로드 중 오류:", error);
		alert("파일 다운로드에 실패했습니다.");
	}
};

// 파일 URL 가져오기 함수 (미리보기용)
export const getFileUrl = (filePath: string, bucketName: string = "files") => {
	const { data } = supabase.storage.from(bucketName).getPublicUrl(filePath);

	return data.publicUrl;
};
