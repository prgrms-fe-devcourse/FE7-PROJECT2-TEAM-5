type UserProfile = {
	// auth ID
	auth_id: string;
	// 자기소개
	bio?: string;
	// 출생년도
	birth_date: Date;
	// 자녀코드
	child_link_code: string;
	// 가입 날짜 및 시간
	created_at: Date;
	// 선생님 포인트
	current_point: number;
	// 경력
	experience?: string;
	// 성별
	gender?: string;
	// 취미
	habits?: string[];
	// 관심
	interests?: string[];
	// 프로필 성공?
	is_profile_completed: boolean;
	// 전공
	major?: string;
	// 이름
	nickname: string;
	// 프로필 이미지
	profile_image_url?: string;
	// 지역
	region?: string;
	// 뱃지 아이디
	representative_badge_id?: string;
	// 소속
	role: string;
};

type ChildInfo = {
	auth_id: string;
	nickname: string;
	child_link_code: string;
};
