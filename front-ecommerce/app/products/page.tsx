import ProductListShop from "@/components/products/ProductListShop";
import PageContainer from "../../components/PageContainer";
import { Suspense } from "react";
import ProductSuspense from "@/components/products/ProductSuspense";
import { checkPageVisibility } from "@/utils/checkPageVisibility";
import { notFound } from "next/navigation";

const ProductsPage = async () => {

  // const page = await checkPageVisibility("/products");

  // if (!page) {
  //   notFound(); 
  // }

  return (
    <Suspense fallback={<PageContainer showHeader><ProductSuspense /></PageContainer>}>
      <PageContainer showHeader showFooter>
        <ProductListShop />
      </PageContainer>
    </Suspense>
  );
};

export default ProductsPage;