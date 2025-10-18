import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import supabase from "../utils/supabase";
import { useProfileStore } from "../stores/profileStore";

/**
 * users.is_profile_completed 컬럼을 확인하여 프로필 완성 여부를 확인,
 *  미완성 시 SocialSignupInfo 페이지로 리다이렉트하는 훅
 */
export const useCheckProfileCompleted = () => {
	const navigate = useNavigate();
	const { profile, isLoggedIn, loading } = useProfileStore();
	const [isChecking, setIsChecking] = useState(false);

	useEffect(() => {
		const CheckProfileCompleted = async () => {
			// 로그인하지 않았거나 로딩 중이면 체크하지 않음
			if (!isLoggedIn || loading || isChecking) return;

			// 프로필이 없으면 체크하지 않음
			if (!profile) return;

			// 이미 프로필이 완성된 경우 체크하지 않음
			if (profile.is_profile_completed) return;

			// 현재 SocialSignupInfo 페이지에 있으면 리다이렉트하지 않음 (무한반복 방지)
			if (window.location.pathname === "/register/socialSignup") return;

			setIsChecking(true); // 체크 시작
			try {
				// 사용자의 프로필 완성 여부 확인
				const { data: userData, error } = await supabase
					.from("users")
					.select("is_profile_completed")
					.eq("auth_id", profile.auth_id)
					.single();

				if (error) {
					console.error("프로필 완성 여부 확인 오류:", error);
					return;
				}

				// 프로필이 미완성인 경우 SocialSignupInfo 페이지로 리다이렉트
				if (!userData.is_profile_completed) {
					navigate("/register/socialSignup", { replace: true });
				}
			} catch (error) {
				console.error("프로필 완성 여부 확인 중 오류:", error);
			} finally {
				setIsChecking(false);
			}
		};

		CheckProfileCompleted();
	}, [isLoggedIn, loading, profile, navigate, isChecking]);

	return { isChecking };
};
