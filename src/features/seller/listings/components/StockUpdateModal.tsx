"use client";

import { useEffect } from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useRouter } from "next/navigation";
import { Modal } from "@/components/ui/Modal";
import { FormInput } from "@/components/form/FormInput";
import { Button } from "@/components/ui/Button";
import { useUpdateProductStockMutation } from "../hooks/useProductMutation";

const stockUpdateSchema = z.object({
  additionalQuantity: z.coerce.number().min(0, "Quantity cannot be negative"),
});

type StockUpdateValues = z.infer<typeof stockUpdateSchema>;

interface StockUpdateModalProps {
  isOpen: boolean;
  onClose: () => void;
  productId: string;
  currentStock: number;
}

export function StockUpdateModal({
  isOpen,
  onClose,
  productId,
  currentStock,
}: StockUpdateModalProps) {
  const router = useRouter();
  const updateStockMutation = useUpdateProductStockMutation();

  const form = useForm<StockUpdateValues>({
    resolver: zodResolver(stockUpdateSchema) as never,
    defaultValues: {
      additionalQuantity: 0,
    },
  });

  useEffect(() => {
    if (isOpen) {
      form.reset({
        additionalQuantity: 0,
      });
    }
  }, [isOpen, form]);

  const additionalStock = form.watch("additionalQuantity");
  const safeCurrentStock = Number(currentStock) || 0;
  const safeAdditionalStock = Number(additionalStock) || 0;
  const newTotalDisplay = safeCurrentStock + safeAdditionalStock;

  const onSubmit: SubmitHandler<StockUpdateValues> = async (values) => {
    const newTotal = safeCurrentStock + (Number(values.additionalQuantity) || 0);
    updateStockMutation.mutate({ productId, newQuantity: newTotal }, {
      onSuccess: () => {
        onClose();
        router.refresh();
      }
    });
  };

  const isUpdating = updateStockMutation.isPending;

  return (
    <Modal 
      isOpen={isOpen} 
      onClose={onClose}
      maxWidth="max-w-[400px]"
      noPadding
      showCloseButton={false}
      className="rounded-[2rem] bg-surface"
    >
      <div className="p-8">
        <div className="w-16 h-16 bg-primary/5 rounded-2xl flex items-center justify-center mb-6 border border-primary/10 mx-auto">
          <span className="material-symbols-outlined text-primary text-3xl">inventory_2</span>
        </div>

        <div className="text-center mb-8">
          <h3 className="font-display-md text-2xl text-primary mb-2">Replenish Stock</h3>
          <p className="font-body-sm text-on-surface-variant/60">
            Manage your handcrafted inventory for this creation.
          </p>
        </div>

        <form onSubmit={form.handleSubmit(onSubmit as never)} className="space-y-6">
          <div className="flex justify-between items-center p-4 bg-surface-container-low rounded-2xl border border-outline-variant/10">
            <span className="text-xs font-label-caps font-bold tracking-widest text-on-surface-variant">Current Stock</span>
            <span className="text-lg font-headline-sm text-primary">{currentStock}</span>
          </div>

          <FormInput
            control={form.control}
            name="additionalQuantity"
            label="ADDITIONAL QUANTITY"
            type="number"
            placeholder="0"
            inputClassName="text-center h-16 rounded-2xl text-2xl font-headline-sm font-bold"
            variant="default"
            onFocus={(e: React.FocusEvent<HTMLInputElement>) => e.target.select()}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
              const value = e.target.value;
              if (value.length > 1 && value.startsWith('0')) {
                e.target.value = value.replace(/^0+/, '');
              }
            }}
          />

          <div className="flex justify-between items-center p-4 bg-primary/5 rounded-2xl border border-primary/10">
            <span className="text-xs font-label-caps font-bold tracking-widest text-primary">New Total</span>
            <span className="text-xl font-headline-sm text-primary">
              {newTotalDisplay}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-3 mt-10">
            <Button
              variant="outline"
              type="button"
              onClick={onClose}
              className="h-12 rounded-xl font-label-caps tracking-widest text-[10px] font-bold"
              disabled={isUpdating}
            >
              CANCEL
            </Button>
            <Button
              type="submit"
              className="h-12 rounded-xl font-label-caps tracking-widest text-[10px] font-bold shadow-lg shadow-primary/10"
              disabled={isUpdating}
            >
              {isUpdating ? "SAVING..." : "UPDATE STOCK"}
            </Button>
          </div>
        </form>
      </div>
    </Modal>
  );
}
