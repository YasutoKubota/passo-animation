"use client";

import { deleteAgreementFromView } from "./actions";

export function DeleteAgreementFromView({
  id,
  intakeId,
  signedName,
  from,
}: {
  id: string;
  intakeId: string | null;
  signedName: string;
  from: string;
}) {
  return (
    <form
      action={deleteAgreementFromView}
      onSubmit={(e) => {
        if (
          !confirm(
            `署名「${signedName}」の誓約書を削除します。\nこの操作は元に戻せません。本当に削除しますか？`
          )
        ) {
          e.preventDefault();
        }
      }}
    >
      <input type="hidden" name="id" value={id} />
      <input type="hidden" name="intake_id" value={intakeId ?? ""} />
      <input type="hidden" name="from" value={from} />
      <button type="submit" className="staff-danger-btn">
        この誓約書を削除
      </button>
    </form>
  );
}
