import { useEffect } from "react";
import supabase from "../utils/supabase";

export function useSetOnlineStatus(userId: string) {
	useEffect(() => {
		const setOnline = async () => {
			await supabase
				.from("users")
				.update({ is_online: true })
				.eq("auth_id", userId);
		};

		const setOffline = async () => {
			await supabase
				.from("users")
				.update({ is_online: false, last_seen: new Date() })
				.eq("auth_id", userId);
		};

		setOnline();

		window.addEventListener("beforeunload", setOffline);
		window.addEventListener("offline", setOffline);

		return () => {
			setOffline();
			window.removeEventListener("beforeunload", setOffline);
			window.removeEventListener("offline", setOffline);
		};
	}, [userId]);
}
