import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase";

export async function GET(
    request: Request,
    { params }: { params: Promise<{ shortCode: string }> },
) {
    const supabase = await createClient();
    try {
        const { shortCode } = await params;

        const { data, error } = await supabase
            .from("urls")
            .select("*")
            .eq("short_code", shortCode)
            .single();

        if (error || !data) {
            return NextResponse.json({ error: "URL not found" }, {
                status: 404,
            });
        }

        // Fire and forget the increment_clicks RPC
        void supabase.rpc("increment_clicks", { url_id: data.id });

        return NextResponse.redirect(data.original_url);
    } catch (error) {
        console.error("Redirect error:", error);
        return NextResponse.json({ error: "Failed to redirect" }, {
            status: 500,
        });
    }
}
