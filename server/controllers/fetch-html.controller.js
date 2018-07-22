/* eslint-disable strict */

'use strict'

const cheerio = require('cheerio');
const fetchService = require('../services/fetch.service');

const {
    sendSuccess, sendFailure
} = require('../services/api-response')

const {
    findHeadingsCount,
    findDocumentVersion,
    getDocumentLinksAnalysis,
    getForm
} = require('../utils/fetch-html.helper')

const fetchHTML = (req, res) => {
    try {
        const {
            pageURL
        } = req.query;
        fetchService(pageURL)
            .then((response) => {
                const {
                    data, statusCode
                } = response;
                const $ = cheerio.load(data);
                const pageInsights =  {
                    statusCode,
                    version: findDocumentVersion(data),
                    title: $('title').html(),
                    headingsLevels: findHeadingsCount(cheerio.load(data)),
                    anchorTagsCount: getDocumentLinksAnalysis(cheerio.load(data)),
                    formCount: getForm(cheerio.load(data))
                }
                return sendSuccess({
                    res,
                    message: 'Successfully fetched data',
                    data: pageInsights
                })
            })
            .catch((err) => {
                return sendFailure({
                    res,
                    message: `Unable to fetch page requested ${err.reason}. Host: ${err.host}`
                })
            });
    } catch (error) {
        return sendFailure({
            res,
            message: `Unable to fetch page requested ${err.reason}. Host: ${err.host}` 
        })
    }
};

module.exports = {
    fetchHTML
};
