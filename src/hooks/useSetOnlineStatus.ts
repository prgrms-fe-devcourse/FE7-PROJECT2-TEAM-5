import { useEffect } from "react";
import supabase from "../utils/supabase";

export function useSetOnlineStatus(userId: string) {
	useEffect(() => {
		if (!userId) return;

		const setOnline = async () => {
			await supabase
				.from("users")
				.update({ is_online: true, last_seen: new Date() })
				.eq("auth_id", userId);
		};

		const setOffline = async () => {
			await supabase
				.from("users")
				.update({ is_online: false })
				.eq("auth_id", userId);
		};

		setOnline();

		// 브라우저 종료 / offline 이벤트
		window.addEventListener("beforeunload", setOffline);
		window.addEventListener("offline", setOffline);

		// 유휴 시간 5분 감지
		let timeoutId: ReturnType<typeof setTimeout>;
		const resetTimer = () => {
			clearTimeout(timeoutId);
			timeoutId = setTimeout(
				() => {
					setOffline();
				},
				5 * 60 * 1000,
			);
		};
		window.addEventListener("mousemove", resetTimer);
		window.addEventListener("keydown", resetTimer);
		resetTimer();

		return () => {
			clearTimeout(timeoutId);
			setOffline();
			window.removeEventListener("beforeunload", setOffline);
			window.removeEventListener("offline", setOffline);
			window.removeEventListener("mousemove", resetTimer);
			window.removeEventListener("keydown", resetTimer);
		};
	}, [userId]);

	// 로그아웃용으로 setOffline 함수도 리턴
	const logoutOffline = async () => {
		if (!userId) return;
		await supabase
			.from("users")
			.update({ is_online: false })
			.eq("auth_id", userId);
	};

	return { logoutOffline };
}
