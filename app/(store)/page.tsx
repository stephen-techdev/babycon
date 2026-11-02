import { HeroSlider } from "@/components/home/hero-slider";
import { TrustStrip } from "@/components/home/story";
import { CollectionsShowcase } from "@/components/home/collections-showcase";
import { FeaturedProducts } from "@/components/product/product-grid";
import { EditorialSplit } from "@/components/home/editorial-split";
import { OfferBanner } from "@/components/home/offer-banner";
import { BrandStory } from "@/components/home/story";
import { Testimonials } from "@/components/home/testimonials";
import { InstagramStrip } from "@/components/home/instagram-strip";
import { HomeFaq } from "@/components/home/home-faq";
import { getFeatured, listCollections, listProducts } from "@/lib/db";

export const revalidate = 300;

export default function HomePage() {
  const featured = getFeatured(8);
  const collections = listCollections();
  const newest = listProducts({ sort: "newest", limit: 12 });

  return (
    <>
      <HeroSlider />
      <TrustStrip />
      <CollectionsShowcase collections={collections} />
      <FeaturedProducts products={featured} />
      <EditorialSplit />
      <OfferBanner />
      <BrandStory />
      <Testimonials />
      <InstagramStrip products={newest} />
      <HomeFaq />
    </>
  );
}
