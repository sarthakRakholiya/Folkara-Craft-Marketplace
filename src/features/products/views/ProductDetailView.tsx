"use client";

import { useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import { ProductGallery } from '../components/ProductGallery';
import { ProductInfo } from '../components/ProductInfo';
import { MakerStory } from '../components/MakerStory';
import { RelatedProducts } from '../components/RelatedProducts';
import { ProductReviews } from '../components/ProductReviews';
import { Product } from '../types/product.types';

// Mock data based on Untitled-3
const MOCK_PRODUCT: Product = {
  id: 'matcha-set-1',
  title: 'Handcrafted Ceramic Matcha Set',
  maker: {
    name: 'Aanya Studio',
    href: '#',
    bio: "Based in the quiet outskirts of the valley, Aanya has spent fifteen years perfecting the balance between utility and poetry. Her workshop operates on the rhythm of the seasons, using only sun-dried clays and natural mineral pigments.",
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAN51O7MW-jEiDus9-l6jCtRr2u9hZ21RDGW5TaYeheTKno88JwJxvFgIJ-cJexvg1SGeiVCpJLX2nwQtPosTF4X2IidwAPuBsOD2vf36yig1ZZUyRXyLNUIwfYzMRY9ChcmYt052ESja9k_63f0fnf6agvPwZpRMAECWY3xbG1EQ0ebL55k9vHweOxn-hLbSZ0_BatShSg6X178o7DV9G42LQxrSeRYq-Cs5c2ZdGKljj5EW0Z-WW6Zs-IZ1kcVI6ObSpMp6YKq-I'
  },
  price: '$124.00',
  description: '"Each piece is shaped by hand using natural clay sourced from the local foothills. This set is a meditation in physical form, designed to slow your morning ritual and ground your senses."',
  images: [
    'https://lh3.googleusercontent.com/aida-public/AB6AXuCDMRMUZEENtB4AV99b1s2ULk_6zh-4APClaSDVG5ywj2NWuCQfp73LGCZZ3yDqskog-kwVhXmIkma0Ns5poJA2tQkG9QGAZQPuXlwWciFsHIKog8Jb-hZzpNmcCRWrDw4Fly34mW-W9J68snswCRjnKFLLrv5r2PXVX_k2O1UT0FGATjKzhHoolBG-G7WHtTaoktttukwtIxJMHG-0f2h7agyRcndR3LMMfr_WWEOzDO8wePEw-dfR05atIUL2o2EgRwagMeOj-lM',
    'https://lh3.googleusercontent.com/aida-public/AB6AXuAqfjEXko0lav558lXeVX36dJLJrKSB2EEFhIxSMp4pPLkVprIqM1xRFBNLX0vD-eieAF0HFwxUfarjwlBwyMdWDvK_llOs3dyhMujmJUCNlKkyijr-cjc1c0CJxaoqFYcZ1JrI69wTh0GpfFxzqeZ8-hRMxLkG0g9FxoNCnbHwFOtPGrnP9xv4N8Jhx42um48bn1YnBhhuLpLezhx2K06vSp4nuZpv_07utZVaJbVO9KpRCuV2_JLyDJXsPuA6E4eNKT8xOP04mz1I',
    'https://lh3.googleusercontent.com/aida-public/AB6AXuCEWDT8JQsXwnlcNmmTAn1XTqqrzCNcwkdlC4HiYQgYAFV3OZygd6v2keAayd6UbAhnR9y02oExCZ54L2ao08WLZ10Y4Qh0Yg54Es-xnbjUPaXh27-SmFg2s2pv-sTE92zcx_9qYyGbbw4I90dh09g0ydAhhTBGnBXt6ZuyXBsvLezelLzBl3xsOxP1pirRCj55Qja9b-6UAFCZi1Jf6GtkK_gY3e9iAPx8OfqqKq5p05zjJwtrYtO6m8IDI5u4beZwzvGWzMN0La8',
    'https://lh3.googleusercontent.com/aida-public/AB6AXuBJFlbL1Lqk0_Xp8MUXEcJnKbTtYDyX05sjyeofFk8upwFyTVdVQc6-Hg06A8GKGy4kNcxbxaDwlAkMrQA0hdsBoqegPDf8kPTN6AB3uSFjtKLwiEK41zs4oQhkEWGIWTos2muix2CEtaICfok44pH3Wrw-os3Nu0viiQ7vH3ifH19a1hGYmQS4nvD15mP8fGh4qZyrpRQ5FrIAps9PlrBwg8EVd6SB9pL47M53zrNttryT6vl149iYguI84Dju9dQVxmIGNYc91Pc'
  ],
  details: {
    materials: 'Unrefined stoneware clay, organic moss-mineral glaze, and sustainably harvested bamboo for the whisk.',
    dimensions: 'Bowl: 12cm diameter, 8cm height. Tray: 20cm x 15cm. Whisk: 11cm length.',
    care: 'Hand wash recommended. The porous nature of the clay will age beautifully with time, developing a unique patina.'
  },
  recommendations: [
    { id: 'r1', title: 'Salvaged Oak Tray', price: '$85.00', imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCsiXbuOuzzWCp_MfhdVGLZ1PY_R8jF6isY6kIrNxWSaONx8FYwmma_0leiW_RglgYZwLnipWN-lqvyEZxRxY5Leb087mqBK-6t8fPPK4AzIaoKpw7wUoKgpC5WsfLJydG44DZ4K5RaeoHQnSwx-mQJZNPuU6CMDpD9OytvwJ9C94K8QgmrzQVUgokGd53YrYrPFbrynBXNBprXaFBYWD0hvqs7m9zAy1aDdF1q_V_-dLvN4NcVi9dMDXGyz70MxUHWbj5omdSit8o' },
    { id: 'r2', title: 'Stone Linen Napkins (Set of 2)', price: '$32.00', imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBzpSIfwOWGdUqdbPCFhj5sIcMHVYPCmJA26nCb6PJDvcIBN17BMPCNhD6lf9c7mli10-oVySdweXc03SPY0b48-wdPao9QaWMHDsgX3ZDMPn8Vyqi1hGEc5L8HUcbxVzWTK_tNMnV7iIOaVWpVS9RXsLk6xteU0b60A_eccDcrVjxqyvdGveadhgtpD_F-BT0gzzPp7z4E85xiFgkOGNVueonEG3kbdO0B0EmCJoHAH2MJRl4iQ18P14EKHEdaoAz6Z2_qhJfGzBM' },
    { id: 'r3', title: 'Miniature Bud Vase', price: '$48.00', imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCxBVyAmEVJHs4fERpd24d7TxI0iujpWoIwBGKBp9A2sVMbSKUwr7Y4Qdv5MDqkjRVcRbILLiMzyEC9HQIVsa9Iqd74iremvFzIC0YGmvjtG0ZyfaGQRYtfbK6GtBXrP15bPBnGpWzU8zcgKr4Jkep33L2AmjuflAwvrbJn7S-qGbrkxQALkSFu1GE9AeXjUiXz0VMe69bPTrCoDbjEQVfMBXF88X7mnRqgQVxLuVXvZbfiNYhbm5j3A8Nj6xOsO3hoIe15cVwdgN1RAmq63Rhq1SP-Jw7dlrMwiSkQxhgS7C0uSri7U3hOofvgyjIRL-ZA' },
    { id: 'r4', title: 'Ceremonial Grade Matcha', price: '$28.00', imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDHhV6YulRI1jAXtQ-JuvdcIzMDWBnoIEbj447_qqStJMM_ij5y-62Vu9F9ChmcTV1QdngAfRswT_94GyTcK-Wtla_kr8948EljUJWtr6PI_C-HV9rZvnVPVQ4EDbAWusCdezdRx4T0Pz1fZayjGMZpz5WuWRAAVN0qRJd556txYkDT17uL2hR67QXk64-Mas7C9tChHO3jBVhFdxqLX2TS4vdnhmnk8NEGJoZkRB6dbqYbT6RhJb5xunDohUc2OvaiXVWcwL4X9yo' }
  ],
  reviews: [
    { id: 'rev1', author: 'Elena M.', rating: 5, content: '"The weight of the bowl in my hands is so grounding. You can truly feel the maker\'s energy in every curve."', avatarUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCyEq0fkSmnxIhyFESgaI3luljNbcNxHZgQQWBFA_bRHkjk32jSyGUwZ2-0fmLWNcRdGGQfJWbnX05rnUqzl7nDyI3TGZmVf-pcOHCYlZGowIWs4Ko9uE4uzQkF5Wko51OeZSnDdKGIzU_PoPQgaZJgbDw-bPmSAAKKG28vn221tBQjLN5cqJFqg07GswCd0kJk1A2gJhTxcNJD3kjpcWT0Puf-cvwkcu1IxhXBGkU9UOGeGhdQA1dlZJGWJvrHbwld9DrZb9LxDvM' },
    { id: 'rev2', author: 'Julian R.', rating: 5, content: '"Packaging was thoughtful and plastic-free. The glaze is even more stunning in person—it looks like morning mist on moss."', avatarUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBZZu-drNYeqk5zhbnmtP0csyzeV6CTCd_a6NRvPTk9p0orVQHK0TyRYoD_XqcajASx-gzSs_3F5J9vJdVoXqvoVs1qhBZtS1LZgwe57MDM49bTYFLuR1STDIDsHGw2y20jTaxME1_bLwUOTyJ2WbPTrCoDbjEQVfMBXF88X7mnRqgQVxLuVXvZbfiNYhbm5j3A8Nj6xOsO3hoIe15cVwdgN1RAmq63Rhq1SP-Jw7dlrMwiSkQxhgS7C0uSri7U3hOofvgyjIRL-ZA' },
    { id: 'rev3', author: 'Serafina K.', rating: 5, content: '"The AI guide suggested this based on my previous ceramic purchases, and it\'s a perfect match for my kitchen\'s palette."', avatarUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuApJWDuIrooPGMb3KnYMkU0xp7bsfSatnucIlwquWS1msXX02M8LaCBPYzt_N-uEC3rySd_EMW4_xKU26I1RcISHhs627aXWCAqzSx0ujhlnEC_tGYgVV0zXMQphJrS0ruPKrCIU4r8rxmsuR4fSSkUo8nure_nJ0cJD3RIVJBkuBqOiI5sjwuJgEG-mDFr8EqErKdu_k8Rh1QbuHPTwjKayKOLKlds_EDF21NHfVkX8kAYU5u_5O2s0jdJ_5uPiZVrch8xykyBXHc' }
  ]
};

export const ProductDetailView = () => {
  const router = useRouter();

  return (
    <main className="w-full bg-surface relative min-h-screen">
      {/* Back Button */}
      <div className="max-w-container-max mx-auto px-margin-page pt-6 md:pt-12">
        <button 
          onClick={() => router.back()}
          className="flex items-center gap-2 text-primary hover:text-secondary transition-colors group"
        >
          <ArrowLeft className="w-4 h-4 md:w-5 md:h-5 transition-transform group-hover:-translate-x-1" />
          <span className="font-sans text-[10px] md:text-xs font-bold tracking-[0.2em] uppercase">Back</span>
        </button>
      </div>

      {/* PDP Hero Section */}
      <section className="max-w-container-max mx-auto px-margin-page py-6 md:py-12 flex flex-col md:flex-row gap-8 md:gap-gutter">
        <ProductGallery images={MOCK_PRODUCT.images} />
        <ProductInfo product={MOCK_PRODUCT} />
      </section>

      {/* Artisan Story Section */}
      <MakerStory maker={MOCK_PRODUCT.maker} />

      {/* AI Styling / Recommended Items */}
      <RelatedProducts products={MOCK_PRODUCT.recommendations} />

      {/* Reviews Section */}
      <ProductReviews reviews={MOCK_PRODUCT.reviews} />
    </main>
  );
};
