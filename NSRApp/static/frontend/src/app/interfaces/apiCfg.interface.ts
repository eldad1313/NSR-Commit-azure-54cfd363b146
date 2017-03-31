export interface ApiCfg {
    type: string,
    data?: any,
    urlParams?: any,
    disableBI?: boolean,
    disableErrorHandler?: boolean
}

export const API_CFG_DEFAULTS = {
    disableBI: false,
    data: {},
    disableErrorHandler: false
};
