import { supabase } from "@/lib/supabaseClient"

export async function updateProfile(updates: { avatar?: string; name?: string }) {
  try {
    // 获取当前登录用户
    const { data: { user }, error: userError } = await supabase.auth.getUser()
    if (userError || !user) {
      throw new Error("No logged-in user")
    }

    // 判断角色（假设你在 user_metadata 里存了 role）
    const role = user.user_metadata?.role
    if (!role) throw new Error("User role not found")

    // 根据角色选择表
    const table = role === "teacher" ? "teachers" : "students"

    const { error } = await supabase
      .from(table)
      .update(updates)
      .eq("user_id", user.id)

    if (error) throw error

    console.log("Profile updated:", updates)
  } catch (err: any) {
    console.error("Failed to update profile:", err.message)
  }
}
