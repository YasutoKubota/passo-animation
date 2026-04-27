"use client";

import { deleteAdCampaign } from "./actions";

export function DeleteAdButton({ id, name }: { id: string; name: string }) {
  return (
    <form
      action={deleteAdCampaign}
      onSubmit={(e) => {
        if (
          !confirm(
            `「${name}」のキャンペーンを削除します。\nこの操作は元に戻せません。`
          )
        ) {
          e.preventDefault();
        }
      }}
    >
      <input type="hidden" name="id" value={id} />
      <button type="submit" className="staff-agreement-delete-btn" title="削除">
        ✕
      </button>
    </form>
  );
}
