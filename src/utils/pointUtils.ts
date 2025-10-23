import supabase from "./supabase";

// 포인트 차감 함수
export const deductPoints = async (
	userId: string,
	points: number,
	description: string,
): Promise<{ success: boolean; message: string }> => {
	try {
		// 현재 사용자 포인트 조회
		const { data: userData, error: userError } = await supabase
			.from("users")
			.select("current_point")
			.eq("auth_id", userId)
			.single();

		if (userError) throw userError;

		const currentPoints = userData?.current_point || 0;

		// 포인트 부족 확인
		if (currentPoints < points) {
			return {
				success: false,
				message: `포인트가 부족합니다. (현재: ${currentPoints}포인트, 필요: ${points}포인트)`,
			};
		}

		// 포인트 차감
		const newPoints = currentPoints - points;
		const { error: updateError } = await supabase
			.from("users")
			.update({ current_point: newPoints })
			.eq("auth_id", userId);

		if (updateError) throw updateError;

		// 포인트 사용 기록 추가
		const { error: logError } = await supabase.from("point_logs").insert([
			{
				user_id: userId,
				point: -points, // 음수로 저장하여 차감 표시
				description: description,
			},
		]);

		if (logError) throw logError;

		return {
			success: true,
			message: `${points}포인트가 차감되었습니다.`,
		};
	} catch (error) {
		console.error("포인트 차감 실패:", error);
		return {
			success: false,
			message: "포인트 차감 중 오류가 발생했습니다.",
		};
	}
};

// 포인트 조회 함수
export const getCurrentPoints = async (userId: string): Promise<number> => {
	try {
		const { data, error } = await supabase
			.from("users")
			.select("current_point")
			.eq("auth_id", userId)
			.single();

		if (error) throw error;
		return data?.current_point || 0;
	} catch (error) {
		console.error("포인트 조회 실패:", error);
		return 0;
	}
};
