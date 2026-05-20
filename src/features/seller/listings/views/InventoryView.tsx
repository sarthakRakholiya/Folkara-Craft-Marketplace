"use client";

import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { useCallback, useTransition, useState, useEffect } from "react";
import Link from "next/link";
import {
  InventoryProduct,
  ProductStatus,
  SortOption,
} from "../types/inventory.types";
import { InventoryProductCard } from "../components/InventoryProductCard";
import { Pagination } from "@/components/ui/Pagination";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/Button";
import { Plus, Trash2 } from "lucide-react";
import { Skeleton } from "@/components/ui/Skeleton";
import { motion } from "framer-motion";
import { ConfirmationModal } from "@/components/ui/ConfirmationModal";
import { toast } from "sonner";
import { useDeleteProductMutation } from "../hooks/useProductMutation";
import { FormInput } from "@/components/form/FormInput";
import { Modal } from "@/components/ui/Modal";
import { StockUpdateModal } from "../components/StockUpdateModal";

interface InventoryViewProps {
  initialProducts: InventoryProduct[];
  totalPages: number;
  totalCount: number;
  stats: {
    all: number;
    active: number;
    draft: number;
    "out-of-stock": number;
  };
  currentParams: {
    page: number;
    status: ProductStatus | "all";
    sort: SortOption;
  };
}

export function InventoryView({
  initialProducts,
  totalPages,
  totalCount,
  stats,
  currentParams,
}: InventoryViewProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  // Optimistic UI states
  const [activeStatus, setActiveStatus] = useState<ProductStatus | "all">(
    currentParams.status,
  );
  const [activeSort, setActiveSort] = useState<SortOption>(currentParams.sort);

  // Sync with props when navigation completes
  useEffect(() => {
    setActiveStatus(currentParams.status);
    setActiveSort(currentParams.sort);
  }, [currentParams.status, currentParams.sort]);

  // Delete State
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState<string | null>(null);
  const { mutate: deleteProduct, isPending: isDeleting } = useDeleteProductMutation();

  const handleConfirmDelete = () => {
    if (!productToDelete) return;
    
    deleteProduct(productToDelete, {
      onSuccess: (result) => {
        if ('success' in result) {
          setIsDeleteModalOpen(false);
          setProductToDelete(null);
          // Refresh the list if needed, though mutation onSuccess handles it if it invalidates queries
          router.refresh();
        }
      },
    });
  };

  // Stock Update State
  const [isStockModalOpen, setIsStockModalOpen] = useState(false);
  const [stockUpdateData, setStockUpdateData] = useState<{ id: string; current: number } | null>(null);

  const handleUpdateStockClick = (id: string, current: number) => {
    setStockUpdateData({ id, current });
    setIsStockModalOpen(true);
  };

  const updateQueryParams = useCallback(
    (updates: Record<string, string | number>) => {
      const params = new URLSearchParams(searchParams.toString());
      Object.entries(updates).forEach(([key, value]) => {
        if (value === "all" || (key === "page" && value === 1)) {
          params.delete(key);
        } else {
          params.set(key, String(value));
        }
      });

      startTransition(() => {
        router.push(`${pathname}?${params.toString()}`);
      });
    },
    [router, pathname, searchParams],
  );

  const handleFilterChange = (status: ProductStatus | "all") => {
    setActiveStatus(status);
    updateQueryParams({ status, page: 1 });
  };

  const handleSortChange = (sort: SortOption) => {
    setActiveSort(sort);
    updateQueryParams({ sort, page: 1 });
  };

  return (
    <div className="max-w-[1440px] mx-auto px-4 md:px-8 mt-10">
      {/* Page Title & AI Guide Pulse */}
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between mb-8 md:mb-12 gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-4">
            <h2 className="font-headline-md text-3xl md:text-4xl text-primary">
              Inventory Gallery
            </h2>
          </div>
          <p className="font-body-lg text-base md:text-lg text-on-surface-variant max-w-2xl italic">
            &quot;The craftsman&quot;s work is the outward expression of an
            inward stillness.&quot; <br className="hidden md:block" />
            Manage your handcrafted creations.
          </p>
        </div>

        {/* AI Guide Component */}
        <div className="bg-secondary/5 p-6 rounded-[2rem] border border-secondary/10 relative overflow-hidden group max-w-xs w-full shadow-sm">
          <div className="flex gap-4 relative z-10">
            <div className="w-10 h-10 rounded-full bg-secondary/10 flex items-center justify-center shrink-0">
              <span className="material-symbols-outlined text-secondary animate-pulse text-[20px]">
                auto_awesome
              </span>
            </div>
            <div>
              <p className="font-headline-sm text-[15px] italic text-secondary leading-tight mb-1">
                Artisan Insight
              </p>
              <p className="font-body-md text-[12px] text-secondary/70 leading-relaxed">
                {stats["out-of-stock"] > 0
                  ? `${stats["out-of-stock"]} items are out of stock. Consider a restock to maintain your momentum.`
                  : "Your gallery is looking vibrant. All active listings are well-stocked."}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters & Sorting */}
      <div className="flex flex-col xl:flex-row items-start xl:items-center justify-between mb-8 border-b border-outline-variant/10 pb-4 gap-6">
        <div className="flex flex-wrap gap-4 md:gap-8">
          {[
            { label: "All Listings", value: "all", count: stats.all },
            { label: "Active", value: "active", count: stats.active },
            { label: "Drafts", value: "draft", count: stats.draft },
            {
              label: "Out of Stock",
              value: "out-of-stock",
              count: stats["out-of-stock"],
            },
          ].map((tab) => (
            <button
              key={tab.value}
              onClick={() =>
                handleFilterChange(tab.value as ProductStatus | "all")
              }
              className={cn(
                "font-label-caps text-[11px] md:text-sm pb-4 transition-all relative font-bold tracking-widest",
                activeStatus === tab.value
                  ? "text-primary"
                  : "text-on-surface-variant/40 hover:text-primary",
              )}
            >
              {tab.label.toUpperCase()} ({tab.count})
              {activeStatus === tab.value && (
                <motion.div
                  layoutId="activeTab"
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary"
                  transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                />
              )}
            </button>
          ))}
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-4 w-full xl:w-auto">
          <div className="relative group w-full sm:w-64">
            <select
              value={activeSort}
              onChange={(e) => handleSortChange(e.target.value as SortOption)}
              className="appearance-none w-full bg-surface-container-low border border-outline-variant/30 px-4 py-2.5 rounded-xl font-label-caps text-[11px] text-primary font-bold tracking-wider hover:border-primary transition-all focus:outline-none cursor-pointer"
            >
              <option value="recently-added">SORT: RECENTLY ADDED</option>
              <option value="price-low-to-high">PRICE: LOW TO HIGH</option>
              <option value="price-high-to-low">PRICE: HIGH TO LOW</option>
              <option value="stock-low-to-high">STOCK: LOW TO HIGH</option>
            </select>
            <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-primary/40 text-[18px]">
              expand_more
            </span>
          </div>

          <Link href="/seller/listings/create" className="w-full sm:w-auto">
            <Button
              startIcon={<Plus className="w-4 h-4" />}
              className="rounded-xl w-full sm:w-auto px-8 h-11 text-[11px] font-bold tracking-widest"
            >
              ADD LISTING
            </Button>
          </Link>
        </div>
      </div>

      {/* Grid */}
      {isPending ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8 items-start min-h-[500px]">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="space-y-4 animate-pulse">
              <Skeleton className="aspect-[4/5] w-full rounded-lg" />
              <div className="space-y-2">
                <div className="flex justify-between">
                  <Skeleton className="h-5 w-2/3" />
                  <Skeleton className="h-5 w-1/4" />
                </div>
                <Skeleton className="h-4 w-1/3" />
              </div>
            </div>
          ))}
        </div>
      ) : initialProducts.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8 items-start min-h-[500px]">
          {initialProducts.map((product) => (
            <InventoryProductCard
              key={product.id}
              product={product}
              onEdit={(id) => router.push(`/seller/listings/${id}/edit`)}
              onView={(id) => {
                if (product.status === 'draft') {
                  router.push(`/seller/listings/create?id=${id}&step=3`);
                } else {
                  router.push(`/seller/listings/${id}`);
                }
              }}
              onDelete={(id) => {
                setProductToDelete(id);
                setIsDeleteModalOpen(true);
              }}
              onUpdateStock={handleUpdateStockClick}
            />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-32 min-h-[500px] text-center bg-surface-container-lowest/30 rounded-[3rem] border border-dashed border-outline-variant/30">
          <div className="w-20 h-20 rounded-full bg-surface-container flex items-center justify-center mb-6">
            <span className="material-symbols-outlined text-4xl text-outline-variant">
              inventory_2
            </span>
          </div>
          <h3 className="text-xl font-headline-sm text-primary italic mb-2">
            No creations found
          </h3>
          <p className="text-on-surface-variant/60 max-w-sm mx-auto text-sm">
            This corner of your gallery is currently empty. Adjust your filters
            or add a new handcrafted masterpiece.
          </p>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <ConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleConfirmDelete}
        title="Farewell to a Creation?"
        message="Are you sure you want to delete this listing? This product and its details will be removed from your gallery forever."
        confirmText="Yes, Delete"
        cancelText="Keep"
        variant="destructive"
        icon={Trash2}
        isLoading={isDeleting}
      />

      {/* Stock Update Modal */}
      {stockUpdateData && (
        <StockUpdateModal
          isOpen={isStockModalOpen}
          onClose={() => {
            setIsStockModalOpen(false);
            setStockUpdateData(null);
          }}
          productId={stockUpdateData.id}
          currentStock={stockUpdateData.current}
        />
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="mt-16 flex justify-center pb-20">
          <Pagination
            currentPage={currentParams.page}
            totalPages={totalPages}
            onPageChange={(page) => updateQueryParams({ page })}
          />
        </div>
      )}
    </div>
  );
}
