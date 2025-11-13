import PageContainer from "@/components/PageContainer";
import ProductDetailComponent from "@/components/product/ProductDetailComponent";

export default function ProductPage() {
  return (
    <PageContainer showHeader>
      <ProductDetailComponent />
    </PageContainer>
  );
}