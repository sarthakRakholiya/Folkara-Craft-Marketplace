"use client";

import { InventoryProduct } from "@/features/seller/listings/types/inventory.types";
import { Button } from "@/components/ui/Button";
import { 
  ArrowLeft, 
  Edit3, 
  Package, 
  IndianRupee, 
  Tag, 
  Sparkles,
  ChevronLeft,
  ChevronRight,
  Share2,
  Trash2
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState, useRef, useLayoutEffect } from "react";
import { cn } from "@/lib/utils";
import gsap from "gsap";
import { toast } from "sonner";
import { ConfirmationModal } from "@/components/ui/ConfirmationModal";
import { useRouter } from "next/navigation";
import { deleteProductAction } from "../actions/product.actions";
import { StockUpdateModal } from "../components/StockUpdateModal";

interface ListingDetailViewProps {
  product: InventoryProduct;
}

export function ListingDetailView({ product }: ListingDetailViewProps) {
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  // Delete States
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  // Stock Update State
  const [isStockModalOpen, setIsStockModalOpen] = useState(false);

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      const result = await deleteProductAction(product.id);
      if ("success" in result) {
        toast.success("Listing deleted successfully");
        router.push("/seller/listings");
        router.refresh();
      } else {
        toast.error(result.error || "Failed to delete listing");
      }
    } catch (error) {
      toast.error("Something went wrong");
    } finally {
      setIsDeleting(false);
      setIsDeleteModalOpen(false);
    }
  };
  const images = (product.images as { url: string }[]) || [];

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(".animate-in-detail", {
        opacity: 0,
        y: 30,
        duration: 1,
        stagger: 0.1,
        ease: "expo.out",
        delay: 0.2,
        clearProps: "all"
      });

      gsap.from(".image-scale", {
        scale: 1.1,
        duration: 1.5,
        ease: "expo.out"
      });
    }, containerRef);
    return () => ctx.revert();
  }, []);

  return (
    <div ref={containerRef} className="max-w-[1400px] mx-auto px-4 md:px-8 py-8 md:py-16">
      {/* Navigation */}
      <div className="animate-in-detail mb-12 flex items-center justify-between">
        <Link 
          href="/seller/listings"
          className="group flex items-center gap-2 text-on-surface-variant hover:text-primary transition-colors text-xs font-label-caps font-bold tracking-widest uppercase"
        >
          <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
          Back to listing
        </Link>
        
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" shape="rounded" startIcon={<Share2 className="w-4 h-4" />}>
            SHARE
          </Button>
          <Link href={`/seller/listings/${product.id}/edit`}>
            <Button variant="outline" size="sm" shape="rounded" startIcon={<Edit3 className="w-4 h-4" />}>
              EDIT LISTING
            </Button>
          </Link>
          <Button 
            variant="outline" 
            size="sm" 
            shape="rounded" 
            startIcon={<Package className="w-4 h-4" />}
            onClick={() => setIsStockModalOpen(true)}
          >
            ADD STOCK
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 xl:gap-24 items-start relative">
        {/* Left Side: Visuals (Sticky) */}
        <div className="lg:col-span-7 lg:sticky lg:top-20 h-fit self-start z-20">
          <div className="animate-in-detail space-y-8">
            <div className="relative aspect-[4/3] rounded-[2.5rem] overflow-hidden border border-outline-variant/10 shadow-2xl bg-surface-container-low group">
            {images.length > 0 ? (
              <Image
                src={images[activeImageIndex].url}
                alt={product.title}
                fill
                className="object-cover image-scale transition-opacity duration-700"
                priority
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-surface-container-high">
                <Package className="w-16 h-16 text-outline-variant/40" />
              </div>
            )}
            
            {/* Image Navigation Arrows */}
            {images.length > 1 && (
              <div className="absolute inset-0 flex items-center justify-between px-6 opacity-0 group-hover:opacity-100 transition-opacity">
                <button 
                  onClick={() => setActiveImageIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1))}
                  className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center hover:bg-white/40 transition-all text-white shadow-xl"
                >
                  <ChevronLeft className="w-6 h-6" />
                </button>
                <button 
                  onClick={() => setActiveImageIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1))}
                  className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center hover:bg-white/40 transition-all text-white shadow-xl"
                >
                  <ChevronRight className="w-6 h-6" />
                </button>
              </div>
            )}
          </div>

          {/* Thumbnails */}
          {images.length > 1 && (
            <div className="flex gap-4 overflow-x-auto pb-4 px-2 -mx-2 scrollbar-hide">
              {images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveImageIndex(idx)}
                  className={cn(
                    "relative w-24 h-24 rounded-2xl overflow-hidden border-2 transition-all duration-300 shrink-0",
                    activeImageIndex === idx 
                      ? "border-primary shadow-lg scale-105" 
                      : "border-transparent opacity-60 hover:opacity-100"
                  )}
                >
                  <Image src={img.url} alt="Thumbnail" fill className="object-cover" />
                </button>
              ))}
            </div>
          )}
          </div>
        </div>

        {/* Right Side: Details */}
        <div className="lg:col-span-5 space-y-12 animate-in-detail">
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <span className="bg-primary/5 text-primary px-4 py-1.5 rounded-full text-[10px] font-label-caps font-bold tracking-widest uppercase border border-primary/10">
                {product.category || "Uncategorized"}
              </span>
              <span className={cn(
                "px-4 py-1.5 rounded-full text-[10px] font-label-caps font-bold tracking-widest uppercase border",
                product.status === "ACTIVE" 
                  ? "bg-success-container/20 text-success border-success/10" 
                  : "bg-surface-container-high text-on-surface-variant/60 border-outline-variant/10"
              )}>
                {product.status}
              </span>
            </div>
            
            <h1 className="font-display-lg text-4xl md:text-6xl text-primary tracking-tight leading-[1.1]">
              {product.title}
            </h1>
            
            <div className="bg-surface-container-lowest/50 p-8 rounded-3xl border border-outline-variant/10 italic leading-relaxed text-on-surface-variant/80 font-body-lg text-lg">
              {product.description}
            </div>
          </div>

          {/* Pricing & Stock Card */}
          <div className="grid grid-cols-2 gap-6 pt-12 border-t border-outline-variant/10">
            <div className="space-y-2">
              <span className="font-label-caps text-[10px] text-on-surface-variant opacity-40 uppercase tracking-widest font-bold flex items-center gap-2">
                <IndianRupee className="w-3 h-3" /> Price
              </span>
              <div className="font-headline-md text-3xl text-primary">
                ₹{product.price}
              </div>
            </div>
            <div className="space-y-2">
              <span className="font-label-caps text-[10px] text-on-surface-variant opacity-40 uppercase tracking-widest font-bold flex items-center gap-2">
                <Package className="w-3 h-3" /> Stock
              </span>
              <div className="font-headline-md text-3xl text-primary">
                {product.stockCount} <span className="text-sm font-body-md opacity-40">units</span>
              </div>
            </div>
          </div>

          {/* Tags */}
          <div className="space-y-4">
            <span className="font-label-caps text-[10px] text-on-surface-variant opacity-40 uppercase tracking-widest font-bold flex items-center gap-2">
              <Tag className="w-3 h-3" /> Tags
            </span>
            <div className="flex flex-wrap gap-2">
              {(product.tags as string[] || []).map((tag) => (
                <span 
                  key={tag} 
                  className="px-4 py-1.5 bg-surface-container-low rounded-full text-[10px] font-label-caps font-bold text-secondary tracking-widest uppercase border border-outline-variant/10"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>

          {/* AI Artisan Analysis */}
          {product.artisanAnalysis && (
            <div className="bg-secondary/5 p-8 rounded-[2.5rem] border border-secondary/10 relative overflow-hidden">
              <Sparkles className="absolute -top-4 -right-4 w-24 h-24 text-secondary/5" />
              <div className="flex items-center gap-3 mb-4">
                <Sparkles className="w-5 h-5 text-secondary" />
                <h3 className="font-headline-sm text-sm text-secondary uppercase tracking-widest">
                  Artisan Insight
                </h3>
              </div>
              <p className="font-body-md text-sm text-secondary/80 leading-relaxed italic">
                {product.artisanAnalysis}
              </p>
            </div>
          )}

          {/* Danger Zone */}
          <div className="pt-12 border-t border-outline-variant/10 flex items-center justify-between">
            <p className="text-[10px] font-body-sm text-on-surface-variant opacity-40 italic">
              Listing created on {new Date(product.createdAt).toLocaleDateString()}
            </p>
            <Button 
              variant="ghost" 
              className="text-error hover:bg-error/5" 
              size="sm" 
              startIcon={<Trash2 className="w-4 h-4" />}
              onClick={() => setIsDeleteModalOpen(true)}
              disabled={isDeleting}
            >
              {isDeleting ? "DELETING..." : "DELETE"}
            </Button>
          </div>
        </div>
      </div>

      <ConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleDelete}
        title="Farewell to a Creation?"
        message="Are you sure you want to delete this listing? This product and its details will be removed from your gallery forever."
        confirmText="Yes, Delete"
        cancelText="Keep"
        variant="destructive"
        icon={Trash2}
        isLoading={isDeleting}
      />

      {/* Stock Update Modal */}
      <StockUpdateModal
        isOpen={isStockModalOpen}
        onClose={() => setIsStockModalOpen(false)}
        productId={product.id}
        currentStock={product.stockCount}
      />
    </div>
  );
}
