import { supabaseAdmin } from "@/lib/supabase";
import { AgreementForm } from "./AgreementForm";

export const dynamic = "force-dynamic";

type IntakeLite = {
  id: string;
  name: string;
  furigana: string;
  studio_location: string | null;
};

export default async function AgreementPage({
  searchParams,
}: {
  searchParams: Promise<{ intake_id?: string }>;
}) {
  const { intake_id } = await searchParams;

  let intake: IntakeLite | null = null;
  let loadError: string | null = null;

  if (intake_id) {
    const { data, error } = await supabaseAdmin
      .from("intake_forms")
      .select("id, name, furigana, studio_location")
      .eq("id", intake_id)
      .maybeSingle();

    if (error) {
      loadError = error.message;
    } else if (data) {
      intake = data as IntakeLite;
    } else {
      loadError = "指定された面談票が見つかりませんでした";
    }
  }

  return (
    <AgreementForm
      intake={intake}
      loadError={loadError}
      queryIntakeId={intake_id ?? null}
    />
  );
}
