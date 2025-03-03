import { localize } from '@deriv/translations';
import TradersHub from 'Modules/traders-hub';
import ConfigStore from 'Stores/config-store';
import { TRoute } from 'Types';
import Onboarding from 'Modules/onboarding';
import CFDCompareAccounts from '@deriv/cfd/src/Containers/cfd-compare-accounts';

type TRoutesConfig = {
    consumer_routes: ConfigStore['routes'];
};

// 1. Order matters! Put more specific consumer_routes at the top.
// 2. Don't use `Localize` component since native html tag like `option` cannot render them
const initRoutesConfig = ({ consumer_routes }: TRoutesConfig): TRoute[] => [
    {
        path: consumer_routes.traders_hub,
        component: TradersHub,
        getTitle: () => localize("Trader's Hub"),
    },
    {
        path: consumer_routes.onboarding,
        component: Onboarding,
        getTitle: () => localize('Onboarding'),
    },
    {
        path: consumer_routes.compare_cfds,
        component: CFDCompareAccounts,
        getTitle: () => localize('CFDCompareAccounts'),
    },
];

let routes_config: Array<TRoute>;

const getRoutesConfig = ({ consumer_routes }: TRoutesConfig): TRoute[] => {
    // For default page route if page/path is not found, must be kept at the end of routes_config array.
    if (!routes_config) {
        const route_default = { getTitle: () => localize('Error 404') };

        routes_config = initRoutesConfig({ consumer_routes });
        routes_config.push(route_default);
    }

    return routes_config;
};
export default getRoutesConfig;
