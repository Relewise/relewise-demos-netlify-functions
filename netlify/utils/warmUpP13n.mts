import { resolve } from 'path';
import relewise_client from '@relewise/client';
import pollyJs from 'polly-js';
import { UserData } from '../../src/types/UserData.mts';
import { sanityClient } from './sanityClient.mts';

//
// ────────────────────────────────────────────────────────────────────────────
//   HELPER FUNCTIONS
// ────────────────────────────────────────────────────────────────────────────
//
async function runWithRetry(method, request, label, retries = 5, delayMs = 300) {
    try {
        const result = await pollyJs()
            .waitAndRetry(retries) // Retry `retries` times
            .executeForPromise(async () => {
                await new Promise((resolve) => setTimeout(resolve, delayMs)); // Wait before retry
                return method(request);
            });
        // Optionally handle `result` here or return it if needed
        // e.g., console.log(result.recommendations?.length, `${label} results received`);
        const arrayName = Array.isArray(result.recommendations)
            ? 'recommendations'
            : Array.isArray(result.results)
                ? 'results'
                : 'unknown';

        const numOfItems = Array.isArray(result[arrayName])
            ? result[arrayName].length
            : 0;

        console.log(`Number of items in ${arrayName}: ${numOfItems}`);
        return result;
    } catch (err) {
        console.error(`Failed after ${retries} retries (${label})`, err);
    }
}

function buildPopularProductsRequest(settings, options: RecommendationOptions) {
    const {
        basedOn = 'MostPurchased',
        sinceMinutesAgo = 20160,
        numberOfRecommendations = 10,
        onSale = false,
    } = options;

    const builder = new relewise_client.PopularProductsBuilder(settings)
        .setSelectedProductProperties({
            displayName: true,
            categoryPaths: true,
            pricing: true,
            brand: true,
        })
        .basedOn(basedOn)
        .sinceMinutesAgo(sinceMinutesAgo)
        .setNumberOfRecommendations(numberOfRecommendations);

    // If this is an onSale request, add the filters
    if (onSale) {
        builder.filters((b) => {
            b.addProductDataFilter('OnSale', (c) =>
                c.addEqualsCondition(relewise_client.DataValueFactory.string('true'))
            );
            b.addProductDataFilter(
                'SoldOut',
                (c) => c.addEqualsCondition(relewise_client.DataValueFactory.string('false')),
                true,
                false
            );
        });
    }

    return builder.build();
}

function buildPopularBrandsRequest(settings, numberOfRecommendations = 4) {
    return new relewise_client.PopularBrandsRecommendationBuilder(settings)
        .sinceMinutesAgo(20160)
        .setNumberOfRecommendations(numberOfRecommendations)
        .build();
}

function buildPopularCategoriesRequest(settings, numberOfRecommendations = 4) {
    return new relewise_client.PopularProductCategoriesRecommendationBuilder(settings)
        .sinceMinutesAgo(20160)
        .setNumberOfRecommendations(numberOfRecommendations)
        .build();
}

function buildB2BSearchRequest(settings) {
    // Category 3 is Appliances (just an example)
    return new relewise_client.ProductSearchBuilder(settings)
        .setSelectedProductProperties({
            displayName: true,
            categoryPaths: true,
            pricing: true,
            brand: true,
        })
        .setSelectedVariantProperties({
            displayName: true,
        })
        .pagination((p) => p.setPageSize(40).setPage(1))
        .filters((builder) => {
            builder.addProductCategoryIdFilter('Ancestor', '3');
            builder.addProductDataFilter('AvailableInChannels', (c) =>
                c.addContainsCondition(relewise_client.DataValueFactory.string('B2B'))
            );
        })
        .build();
}

//
// ────────────────────────────────────────────────────────────────────────────
//   MAIN EXECUTION FLOW
// ────────────────────────────────────────────────────────────────────────────
//

export async function warmUpP13n(relewise_dataset: string, relewise_api: string) {
    try {

        const demoConfiguration = await sanityClient.fetch("*[_type == 'relewiseDemoConfig_Core' && id == 'demousers'] {  'json': jsonData['code']}");
        
        const users: UserData[] = JSON.parse(demoConfiguration[0].json) as UserData[];
        
        const recommender = new relewise_client.Recommender(relewise_dataset, relewise_api, { serverUrl: Netlify.env.get('RELEWISE_SERVER_URL') });
        const searcher = new relewise_client.Searcher(relewise_dataset, relewise_api, { serverUrl: Netlify.env.get('RELEWISE_SERVER_URL') });

        for (const user of users) {
            console.log('Warming up dataset with user:', user.email);
            const settings = {
                language: 'en-gb',
                currency: 'EUR',
                displayedAtLocation: 'Relewise Demo Store',
                user,
            };

            // 1) Popular Products (Regular)
            const popularProdsRegularRequest = buildPopularProductsRequest(settings, {
                basedOn: 'MostPurchased',
                onSale: false,
            });
            await runWithRetry(recommender.recommendPopularProducts.bind(recommender), popularProdsRegularRequest, 'Popular Products Regular');

            // 2) Popular Products (On Sale)
            const popularProdsOnSaleRequest = buildPopularProductsRequest(settings, {basedOn: 'MostPurchased', onSale: true });
            await runWithRetry(recommender.recommendPopularProducts.bind(recommender), popularProdsOnSaleRequest, 'Popular Products On Sale');

            // 3) Popular Brands
            const popularBrandsRequest = buildPopularBrandsRequest(settings);
            await runWithRetry(recommender.recommendPopularBrands.bind(recommender), popularBrandsRequest, 'Popular Brands');

            // 4) Popular Categories
            const popularCategoriesRequest = buildPopularCategoriesRequest(settings);
            await runWithRetry(recommender.recommendPopularProductCategories.bind(recommender), popularCategoriesRequest, 'Popular Categories');

            // 5) B2B-specific search
            if (user?.classifications?.channel === 'B2B') {
                const searchRequest = buildB2BSearchRequest(settings);
                await runWithRetry(searcher.searchProducts.bind(searcher), searchRequest, 'B2B Search');
            }
        }
    } catch (error) {
        console.error('An unexpected error occurred:', error);
    }
};

interface RecommendationOptions {
    basedOn?: 'MostPurchased' | 'MostViewed';
    sinceMinutesAgo?: number;
    numberOfRecommendations?: number;
    onSale?: boolean;
}