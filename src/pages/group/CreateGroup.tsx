// pages/group/CreateGroup.tsx
import { useState } from "react";
import { X } from "lucide-react";
import { Link, useNavigate } from "react-router";
import supabase from "../../utils/supabase";
import { useProfileStore } from "../../stores/profileStore";
import Input from "../../components/Input";

export default function CreateGroup() {
  const navigate = useNavigate();
  const profile = useProfileStore((state) => state.profile);

  
  const [name, setName] = useState("");
  const [bio, setBio] = useState("");

 
  const [imgFiles, setImgFiles] = useState<{ file: string; fileName: string }[]>(
    [],
  );

  const [loading, setLoading] = useState(false);

  
  const handleImgFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
  const files = e.target.files;
  if (files) {
    Array.from(files).map((file) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        setImgFiles((prev) => [
          ...prev,
          {
            file: e.target?.result as string,
            fileName: file.name,
          },
        ]);
      };
      reader.readAsDataURL(file);
    });
  }
};

  const removeImgFiles = () => setImgFiles([]);

  // 제출
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!profile?.auth_id) {
      alert("로그인이 필요합니다.");
      return;
    }
    if (!name.trim() || !bio.trim()) {
      alert("그룹 이름과 소개를 입력하세요.");
      return;
    }

    try {
      setLoading(true);

      // 1) groups 생성
      const { data: groupData, error: gErr } = await supabase
        .from("groups")
        .insert([
          {
            name: name.trim(),
            bio: bio.trim(),
            profile_image_url: imgFiles[0]?.file ?? null,
          },
        ])
        .select();

      if (gErr) throw gErr;

      const newGroupId = groupData?.[0]?.id;
      if (!newGroupId) throw new Error("그룹 생성에 실패했어요.");

      // 2) 생성자 자동 가입
      const { error: mErr } = await supabase.from("group_members").insert([
        {
          group_id: newGroupId,
          user_id: profile.auth_id,
        },
      ]);
      if (mErr) throw mErr;

      alert("그룹이 생성되었습니다.");
      navigate("/groups");
    } catch (err) {
      console.error(err);
      alert("그룹 생성에 실패했어요. 잠시 후 다시 시도해 주세요.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-w-250 px-4">
      <h2 className="mb-6 text-[32px] font-bold">그룹 생성하기</h2>

      <form method="post" onSubmit={handleSubmit}>
        <div className="flex flex-col gap-5.5 px-6 py-4 rounded-xl bg-white shadow-[0_4px_20px_rgba(0,0,0,0.05)]">
        
          <div className="relative w-full px-6 py-4 rounded-xl bg-white border-1 border-[#E5E7EB] outline-none user-invalid:border-red-500">
            <Input
              id="groupName"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              validationText="그룹 이름을 입력하세요"
            >
              그룹 이름
            </Input>
          </div>

         
          {imgFiles[0] ? (
            <div className="relative flex flex-col items-center px-6 py-4 rounded-xl bg-white border-1 border-[#E5E7EB]">
              <div className="relative pb-2">
                <img
                  src={imgFiles[0].file}
                  alt="group-cover"
                  className="relative z-2 max-h-50 min-h-30 object-cover bg-white"
                />
                {imgFiles.length > 1 && (
                  <div>
                    <img
                      src={imgFiles[0].file}
                      alt="group-cover-shadow"
                      className="absolute top-2 left-2 z-1 max-h-50 min-h-30 object-cover opacity-50"
                    />
                    <div className="absolute z-2 -bottom-2 -right-4 px-3.5 py-1.5 text-xm text-[#6B7280] font-bold bg-white border-1 border-[#E5E7EB] rounded-3xl">
                      {imgFiles.length}
                    </div>
                  </div>
                )}
              </div>

              <button
                type="button"
                className="absolute top-1.5 right-1.5 p-1 rounded-xl text-red-500 border-1 border-[#E5E7EB] cursor-pointer"
                onClick={removeImgFiles}
                title="이미지 삭제"
              >
                <X size={18} />
              </button>
            </div>
          ) : (
            <div className="flex flex-col items-center px-6 py-4 rounded-xl bg-white border-2 border-[#E5E7EB] border-dashed">
              <input
                id="imgFile"
                accept="image/*"
                className="hidden"
                type="file"
                name="imgFile"
                onChange={handleImgFileUpload}
                multiple
              />
              <p className="text-[#6B7280]">Upload image</p>
              <label
                htmlFor="imgFile"
                className="px-6 py-4 rounded-xl text-[#6B7280] bg-[#E5E7EB] cursor-pointer"
              >
                Choose Img File
              </label>
            </div>
          )}

         
          <div className="relative w-full px-6 py-4 rounded-xl bg-white border-1 border-[#E5E7EB] outline-none user-invalid:border-red-500">
            <textarea
              id="groupBio"
              rows={12}
              className="peer w-full resize-none outline-none align-middle"
              required
              wrap="hard"
              value={bio}
              onChange={(e) => setBio(e.target.value)}
            />
            <label
              htmlFor="groupBio"
              className="absolute left-6 top-4 text-[#C8C8C8] transition-all duration-100 ease-in-out 
                peer-focus:text-sm peer-focus:-translate-y-6 peer-focus:bg-white peer-focus:text-[#8B5CF6]
                peer-valid:-translate-y-6 peer-valid:text-sm peer-valid:bg-white peer-valid:text-[#8B5CF6]"
            >
              그룹 소개
            </label>
            <label
              htmlFor="groupBio"
              className="absolute hidden left-6 -top-2 bg-white text-sm text-red-500 peer-user-invalid:block "
            >
              그룹 소개를 입력하세요.
            </label>
          </div>
        </div>

        
        <div className="flex justify-end mt-7 gap-2">
          <Link
            to="/groups"
            className="px-4 py-2.5 text-sm rounded-xl bg-white text-[#8B5CF6]
              font-Regular hover:bg-[#B08DFF] hover:text-white cursor-pointer border-1 border-[#8B5CF6]"
          >
            삭제
          </Link>
          <button
            type="submit"
            disabled={loading}
            className="px-4 py-2.5 text-sm text-white rounded-xl bg-[#8B5CF6]  hover:bg-[#B08DFF] cursor-pointer disabled:opacity-60"
          >
            {loading ? "등록 중…" : "등록"}
          </button>
        </div>
      </form>
    </div>
  );
}
