import { authenticate } from "../shopify.server";

export const loader = async ({ request }) => {
    const { cors } = await authenticate.admin(request);

    

}