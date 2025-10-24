import supabase from "./supabase";

// 파일명을 URL safety한 파일명으로 변환하는 함수
// 파일명이 한글이면 등록이 안됨...
const sanitizeFileName = (fileName: string): string => {
	// 파일 확장자 분리
	const lastDotIndex = fileName.lastIndexOf(".");
	const name =
		lastDotIndex > 0 ? fileName.substring(0, lastDotIndex) : fileName;
	const extension = lastDotIndex > 0 ? fileName.substring(lastDotIndex) : "";

	// 한글과 특수문자를 제거하고 영문/숫자만 남김
	const sanitizedName = name
		.replace(/[^a-zA-Z0-9]/g, "_") // 영문/숫자가 아닌 문자를 _로 변경
		.replace(/_+/g, "_") // 연속된 _를 하나로 합침
		.replace(/^_|_$/g, ""); // 앞뒤 _ 제거

	return sanitizedName + extension;
};

// 파일 업로드 함수
export const uploadFile = async (
	file: File,
	postId: string,
	bucketName: string = "files",
): Promise<{ filePath: string; fileName: string } | null> => {
	try {
		// 파일명 중복 방지를 위해 타임스탬프 추가
		const timestamp = Date.now();
		const originalFileName = file.name;
		const sanitizedFileName = sanitizeFileName(originalFileName);
		const newFileName = `${timestamp}_${sanitizedFileName}`;
		const filePath = `posts/${postId}/${newFileName}`;

		// 수파베이스 스토리지에 파일 업로드
		const { data, error } = await supabase.storage
			.from(bucketName)
			.upload(filePath, file);

		if (error) {
			console.error("파일 업로드 실패:", error);
			throw error;
		}

		return {
			filePath: data.path,
			fileName: originalFileName, // 원본 파일명 반환
		};
	} catch (error) {
		console.error("파일 업로드 중 오류:", error);
		return null;
	}
};

// 파일 크기 검증 함수
export const validateFileSize = (
	file: File,
	maxSizeMB: number = 10,
): boolean => {
	const maxSizeBytes = maxSizeMB * 1024 * 1024;
	return file.size <= maxSizeBytes;
};

// 파일 타입 검증 함수
export const validateFileType = (
	file: File,
	allowedTypes: string[] = [],
): boolean => {
	if (allowedTypes.length === 0) {
		return true; // 제한 없음
	}

	const fileExt = file.name.split(".").pop()?.toLowerCase();
	return fileExt ? allowedTypes.includes(fileExt) : false;
};
