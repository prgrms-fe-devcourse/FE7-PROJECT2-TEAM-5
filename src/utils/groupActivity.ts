import supabase from "./supabase";

/**
 * 그룹의 최근 활동 시간을 업데이트하는 함수
 * 게시글 또는 댓글 작성 시 호출
 */
export const updateGroupActivity = async (groupId: string): Promise<void> => {
	try {
		await supabase
			.from("groups")
			.update({ last_activity_at: new Date().toISOString() })
			.eq("id", groupId);
	} catch (error) {
		console.error("[updateGroupActivity error]", error);
	}
};

/**
 * 게시글 ID를 통해 그룹의 최근 활동 시간을 업데이트하는 함수
 * 댓글 작성 시 사용 (게시글의 그룹 ID를 찾아서 업데이트)
 */
export const updateGroupActivityFromPost = async (
	postId: string,
): Promise<void> => {
	try {
		// 게시글의 그룹 ID 조회
		const { data: post, error: postError } = await supabase
			.from("posts")
			.select("group_id")
			.eq("id", postId)
			.single();

		if (postError) {
			console.error(
				"[updateGroupActivityFromPost post error]",
				postError,
			);
			return;
		}

		// 그룹 ID가 있고 그룹 게시글인 경우에만 업데이트
		if (post?.group_id) {
			await updateGroupActivity(post.group_id);
		}
	} catch (error) {
		console.error("[updateGroupActivityFromPost error]", error);
	}
};
