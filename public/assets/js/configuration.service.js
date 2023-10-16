'use strict'
const URL_CONFIG_ENDPOINT = "/configuration";

let Configuration = {
    /**
     * Find sigle document that matchs with name in cat_config collection
     * @param {String} configName
     * @param {Boolean} isClear
     * @returns
     */
    get: async function (configName, isClear) {
        const request = {url: URL_CONFIG_ENDPOINT, isGateway: false, showSpinner: false, type: 'POST', data: JSON.stringify({names: [configName], clear: isClear}) };
        return await ZeroService.request(request, (response) => {}, (error) => {});
    },
    /**
     * Find list of configurations saveds in cat_config collection
     * @param {String []} configNamesList
     * @param {Boolean} isClear
     * @returns
     */
    getList: async function (configNamesList, isClear) {
        const request = {url: URL_CONFIG_ENDPOINT, isGateway: false, showSpinner: false, type: 'POST', data: JSON.stringify({names: configNamesList, clear: isClear}) };
        return await ZeroService.request(request, (response) => {}, (error) => {});
    }
}
