import { useEffect, useRef } from "react";
import supabase from "../utils/supabase";

export function useSetOnlineStatus(userId: string) {
	const timeoutId = useRef<ReturnType<typeof setTimeout> | null>(null);

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

		// 유휴 시간 5분 감지
		const resetTimer = () => {
			if (timeoutId.current) clearTimeout(timeoutId.current);
			timeoutId.current = setTimeout(() => setOffline(), 5 * 60 * 1000);
		};

		window.addEventListener("mousemove", resetTimer);
		window.addEventListener("keydown", resetTimer);
		resetTimer();

		// 브라우저 종료 / offline 이벤트
		window.addEventListener("beforeunload", setOffline);
		window.addEventListener("offline", setOffline);

		return () => {
			// SPA 이동 시 cleanup에서 offline 호출 제거
			if (timeoutId.current) clearTimeout(timeoutId.current);
			window.removeEventListener("mousemove", resetTimer);
			window.removeEventListener("keydown", resetTimer);
			window.removeEventListener("beforeunload", setOffline);
			window.removeEventListener("offline", setOffline);
		};
	}, [userId]);

	const logoutOffline = async () => {
		if (!userId) return;
		await supabase
			.from("users")
			.update({ is_online: false })
			.eq("auth_id", userId);
	};

	return { logoutOffline };
}
