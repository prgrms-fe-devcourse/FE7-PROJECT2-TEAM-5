type Group = {
  group_id: string;
  title: string;
  bio: string;
  recent_act: string;
  members: number;
  groups_img_url: string; 
};

type Props = {
  group: Group;
  onJoinToggle?: () => void; 
  joined?: boolean;         
};

export default function GroupCard({ group, onJoinToggle, joined }: Props) {
  return (
    <article
      className="w-60 overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-gray-200 hover:shadow-md"
      aria-label="그룹 카드"
    >
      
      {group.groups_img_url ? (
        <img
          src={group.groups_img_url}
          alt={group.title}
          className="w-full h-35 object-cover" 
        />
      ) : (
        <div className="h-35 w-full bg-gray-200/80" />
      )}

      <div className="py-4 px-5">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-semibold text-[#6D28D9] hover:text-[#7C3AED] line-clamp-1">
            {group.title}
          </h3>
          <span className="shrink-0 text-xs text-gray-500">{group.recent_act}</span>
        </div>

        <p className="h-8 mt-1 text-xs text-gray-600 line-clamp-2">{group.bio}</p>

        <div className="mt-3 flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-xs text-gray-500">
            <svg
              className="h-4 w-4"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              aria-hidden
            >
              <path d="M17 21v-2a4 4 0 0 0-4-4H7a4 4 0 0 0-4 4v2" />
              <circle cx="9" cy="7" r="4" />
              <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
              <path d="M16 3.13a4 4 0 0 1 0 7.75" />
            </svg>
            <span>{group.members}</span>
          </div>

          
          <button
            className={`rounded-lg px-3 py-1 text-xs font-medium text-white ${
              joined ? "bg-gray-500 hover:bg-gray-600" : "bg-[#8B5CF6] hover:bg-[#7C3AED]"
            }`}
            onClick={(e) => {
              e.stopPropagation(); 
              onJoinToggle?.();
            }}
          >
            {joined ? "탈퇴하기" : "참여하기"}
          </button>
        </div>
      </div>
    </article>
  );
}
