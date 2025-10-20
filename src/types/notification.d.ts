export interface Notification {
	id: string;
	type:
		| "CHILD_LINKED"
		| "NEW_POST_BY_CHILD"
		| "COMMENT_ADOPTED"
		| "COMMENT_LIKE"
		| "NEW_COMMENT"
		| "NEW_MESSAGE"
		| "POST_LIKE"
		| "NEW_REPLY";
	message: string;
	content?: string;
	date: string;
	isRead: boolean;
	actorId?: string;
	targetId?: string;
	createdAt: string;
}

export interface NotificationState {
	notifications: Notification[];
	unreadCount: number;
	isLoading: boolean;
}
