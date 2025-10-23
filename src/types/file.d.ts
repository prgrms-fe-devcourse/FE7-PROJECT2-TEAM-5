export interface FileInfo {
	id?: string;
	post_id: string;
	file_path: string;
	file_name: string;
	file_size?: number;
	file_type?: string;
	created_at?: string;
}

export interface UploadedFile {
	file: File;
	preview?: string;
	fileName: string;
	fileSize: number;
	fileType: string;
}

export interface FileUploadResult {
	success: boolean;
	fileInfo?: FileInfo;
	error?: string;
}
