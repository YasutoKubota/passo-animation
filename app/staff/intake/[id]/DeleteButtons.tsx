"use client";

import { deleteIntake, deleteAgreement } from "./actions";

export function DeleteIntakeButton({
  id,
  name,
  agreementCount,
}: {
  id: string;
  name: string;
  agreementCount: number;
}) {
  return (
    <form
      action={deleteIntake}
      onSubmit={(e) => {
        const base = `${name} の面談票を削除します。`;
        const agreementWarning =
          agreementCount > 0
            ? `\n\n⚠ 紐付けされている誓約書 ${agreementCount} 件は「面談票リンクなし」状態で残ります。`
            : "";
        const footer = `\n\nこの操作は元に戻せません。本当に削除しますか？`;

        if (!confirm(base + agreementWarning + footer)) {
          e.preventDefault();
        }
      }}
    >
      <input type="hidden" name="id" value={id} />
      <button type="submit" className="staff-danger-btn">
        面談票を削除
      </button>
    </form>
  );
}

export function DeleteAgreementButton({
  id,
  intakeId,
  signedName,
}: {
  id: string;
  intakeId: string;
  signedName: string;
}) {
  return (
    <form
      action={deleteAgreement}
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
      <input type="hidden" name="intake_id" value={intakeId} />
      <button
        type="submit"
        className="staff-agreement-delete-btn"
        aria-label={`${signedName} の誓約書を削除`}
        title="削除"
      >
        ✕
      </button>
    </form>
  );
}
