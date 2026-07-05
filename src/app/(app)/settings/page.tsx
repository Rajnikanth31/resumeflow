"use client";

import { useState } from "react";
import { useSession, signOut } from "next-auth/react";

export default function SettingsPage() {
  const { data: session, update: updateSession } = useSession();
  const [name, setName] = useState(session?.user?.name || "");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [status, setStatus] = useState<{ type: "success" | "error" | ""; message: string }>({
    type: "",
    message: "",
  });
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleUpdateSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setStatus({ type: "", message: "" });

    try {
      const res = await fetch("/api/user/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name || undefined,
          currentPassword: currentPassword || undefined,
          newPassword: newPassword || undefined,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to update settings");
      }

      setStatus({ type: "success", message: "Settings updated successfully!" });
      setCurrentPassword("");
      setNewPassword("");
      
      await updateSession({ name });
    } catch (err: any) {
      setStatus({ type: "error", message: err.message });
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (!window.confirm("Are you absolutely sure you want to delete your account? This action is irreversible and performs a soft-delete of all your resume data.")) {
      return;
    }

    setIsDeleting(true);
    setStatus({ type: "", message: "" });

    try {
      const res = await fetch("/api/user/delete", {
        method: "DELETE",
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to delete account");
      }

      await signOut({ callbackUrl: "/" });
    } catch (err: any) {
      setStatus({ type: "error", message: err.message });
      setIsDeleting(false);
    }
  };

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 md:py-12">
      <h1 className="font-heading text-3xl font-bold tracking-tight text-neutral-900 dark:text-neutral-50 md:text-4xl">
        Account Settings
      </h1>
      <p className="mt-2 text-neutral-600 dark:text-neutral-400">
        Manage your profile details, change your security credentials, or close your account.
      </p>

      {status.message && (
        <div
          className={`mt-6 rounded-lg p-4 text-sm ${
            status.type === "success"
              ? "bg-green-50 text-green-800 dark:bg-green-900/20 dark:text-green-300"
              : "bg-red-50 text-red-800 dark:bg-red-900/20 dark:text-red-300"
          }`}
          role="alert"
        >
          {status.message}
        </div>
      )}

      <div className="mt-8 space-y-8">
        <section className="rounded-xl border border-neutral-200 bg-white p-6 shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
          <h2 className="font-heading text-xl font-semibold text-neutral-900 dark:text-neutral-50">
            Profile Details
          </h2>
          <form onSubmit={handleUpdateSettings} className="mt-6 space-y-6">
            <div>
              <label htmlFor="name-input" className="block text-sm font-medium text-neutral-700 dark:text-neutral-300">
                Full Name
              </label>
              <input
                id="name-input"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="mt-1 block w-full rounded-md border border-neutral-300 bg-white px-3 py-2 text-neutral-900 shadow-sm focus:border-neutral-500 focus:outline-none focus:ring-2 focus:ring-neutral-200 dark:border-neutral-700 dark:bg-neutral-850 dark:text-neutral-100 dark:focus:border-neutral-500 dark:focus:ring-neutral-800"
                placeholder="Jane Doe"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300">
                Email Address
              </label>
              <input
                type="email"
                disabled
                value={session?.user?.email || ""}
                className="mt-1 block w-full rounded-md border border-neutral-200 bg-neutral-50 px-3 py-2 text-neutral-500 shadow-sm cursor-not-allowed dark:border-neutral-850 dark:bg-neutral-950 dark:text-neutral-500"
              />
              <p className="mt-1.5 text-xs text-neutral-500">
                Email addresses are tied to account identity and cannot be edited.
              </p>
            </div>

            <div className="border-t border-neutral-150 pt-6 dark:border-neutral-800">
              <h3 className="font-heading text-lg font-medium text-neutral-900 dark:text-neutral-50">
                Change Password
              </h3>
              <p className="mt-1 text-xs text-neutral-500">
                Leave blank if you do not wish to update your password.
              </p>

              <div className="mt-4 grid grid-cols-1 gap-6 md:grid-cols-2">
                <div>
                  <label htmlFor="current-pw-input" className="block text-sm font-medium text-neutral-700 dark:text-neutral-300">
                    Current Password
                  </label>
                  <input
                    id="current-pw-input"
                    type="password"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    className="mt-1 block w-full rounded-md border border-neutral-300 bg-white px-3 py-2 text-neutral-900 shadow-sm focus:border-neutral-500 focus:outline-none focus:ring-2 focus:ring-neutral-200 dark:border-neutral-700 dark:bg-neutral-850 dark:text-neutral-100 dark:focus:border-neutral-500 dark:focus:ring-neutral-800"
                  />
                </div>

                <div>
                  <label htmlFor="new-pw-input" className="block text-sm font-medium text-neutral-700 dark:text-neutral-300">
                    New Password
                  </label>
                  <input
                    id="new-pw-input"
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="mt-1 block w-full rounded-md border border-neutral-300 bg-white px-3 py-2 text-neutral-900 shadow-sm focus:border-neutral-500 focus:outline-none focus:ring-2 focus:ring-neutral-200 dark:border-neutral-700 dark:bg-neutral-850 dark:text-neutral-100 dark:focus:border-neutral-500 dark:focus:ring-neutral-800"
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-end pt-4">
              <button
                type="submit"
                disabled={isSaving}
                className="inline-flex justify-center rounded-md border border-transparent bg-neutral-900 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-neutral-800 focus:outline-none focus:ring-2 focus:ring-neutral-500 focus:ring-offset-2 disabled:bg-neutral-300 dark:bg-neutral-100 dark:text-neutral-900 dark:hover:bg-neutral-200 dark:focus:ring-neutral-800"
              >
                {isSaving ? "Saving changes..." : "Save Changes"}
              </button>
            </div>
          </form>
        </section>

        <section className="rounded-xl border border-red-200 bg-red-50/20 p-6 dark:border-red-900/30 dark:bg-red-950/10">
          <h2 className="font-heading text-xl font-semibold text-red-900 dark:text-red-400">
            Danger Zone
          </h2>
          <p className="mt-2 text-sm text-red-700 dark:text-red-400">
            Once you delete your account, there is no going back. All of your saved resumes and histories will be soft-deleted.
          </p>
          <div className="mt-6 flex justify-start">
            <button
              onClick={handleDeleteAccount}
              disabled={isDeleting}
              className="inline-flex justify-center rounded-md border border-transparent bg-red-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 disabled:bg-red-300"
            >
              {isDeleting ? "Deleting..." : "Delete Account"}
            </button>
          </div>
        </section>
      </div>
    </div>
  );
}
