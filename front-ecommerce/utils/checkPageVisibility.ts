import { getPageBySlug } from "@/actions/admin";

export const checkPageVisibility = async (slug: string) => {
    const page = await getPageBySlug(slug);

    if (!page || !page.data || !page.data.isVisible) {
        return null;
    }

    return page.data;
};