import { CheckoutSuccessView } from "@/features/checkout/views/CheckoutSuccessView";
import { Metadata } from "next";
import { getOrderByIdAction, fulfillStripeOrderAction } from "@/features/checkout/actions/checkout.actions";
import { redirect } from "next/navigation";
import Link from "next/link";
import { ShieldCheck, XCircle } from "lucide-react";

export const metadata: Metadata = {
  title: "Order Confirmed | Folkara Craft Marketplace",
  description: "Your secure checkout has been completed. Thank you for supporting independent slow-made artisans.",
};

interface SuccessPageProps {
  searchParams: Promise<{
    session_id?: string;
  }>;
}

export default async function CheckoutSuccessPage({ searchParams }: SuccessPageProps) {
  const { session_id } = await searchParams;

  if (!session_id) {
    redirect("/cart");
  }

  let orderId = "";
  let errorMsg = "";

  try {
    if (session_id.startsWith("sim_sess_")) {
      orderId = session_id.replace("sim_sess_", "");
    } else {
      const res = await fulfillStripeOrderAction(session_id);
      if (res.success && res.orderId) {
        orderId = res.orderId;
      } else {
        errorMsg = res.error || "We could not verify your Stripe checkout session.";
      }
    }
  } catch (err: any) {
    console.error("Server-side checkout fulfillment error:", err);
    errorMsg = "An unexpected server-side error occurred during order verification.";
  }

  if (errorMsg) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
        <div className="bg-white rounded-3xl p-8 max-w-md w-full shadow-lg border border-slate-200/50 text-center space-y-6">
          <div className="w-16 h-16 bg-rose-50 border border-rose-200 rounded-full flex items-center justify-center mx-auto text-rose-500">
            <XCircle className="w-8 h-8" />
          </div>
          <div className="space-y-2">
            <h3 className="font-serif text-xl font-medium text-slate-900">Checkout Verification Failed</h3>
            <p className="text-slate-500 text-xs leading-relaxed">
              {errorMsg}
            </p>
          </div>
          <div className="pt-2 flex flex-col gap-2">
            <Link
              href="/cart"
              className="w-full bg-slate-900 text-white hover:bg-slate-800 py-3 rounded-full text-xs font-bold uppercase tracking-widest transition-colors flex items-center justify-center"
            >
              Return to Cart
            </Link>
            <Link
              href="/buyer/orders"
              className="w-full border border-slate-200 hover:bg-slate-50 py-3 rounded-full text-xs font-bold uppercase tracking-widest transition-colors text-slate-700 flex items-center justify-center"
            >
              View Order History
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const order = await getOrderByIdAction(orderId);

  if (!order) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
        <div className="bg-white rounded-3xl p-8 max-w-md w-full shadow-lg border border-slate-200/50 text-center space-y-6">
          <div className="w-16 h-16 bg-amber-50 border border-amber-200 rounded-full flex items-center justify-center mx-auto text-amber-500">
            <ShieldCheck className="w-8 h-8" />
          </div>
          <div className="space-y-2">
            <h3 className="font-serif text-xl font-medium text-slate-900">Order Not Found</h3>
            <p className="text-slate-500 text-xs leading-relaxed">
              We found the transaction details, but the order record is not accessible or does not exist.
            </p>
          </div>
          <div className="pt-2 flex flex-col gap-2">
            <Link
              href="/buyer/orders"
              className="w-full bg-slate-900 text-white hover:bg-slate-800 py-3 rounded-full text-xs font-bold uppercase tracking-widest transition-colors flex items-center justify-center"
            >
              View Order History
            </Link>
            <Link
              href="/"
              className="w-full border border-slate-200 hover:bg-slate-50 py-3 rounded-full text-xs font-bold uppercase tracking-widest transition-colors text-slate-700 flex items-center justify-center"
            >
              Return Home
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return <CheckoutSuccessView order={order} />;
}
