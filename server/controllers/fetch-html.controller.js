/* eslint-disable strict */

'use strict'

const cheerio = require('cheerio');
const https = require('https');

const {
    sendSuccess, sendFailure
} = require('../services/api-response')

const findHeadingsCount = ($) => {
    const headingsLevels = [
        { level: 'h1' },
        { level: 'h2' },
        { level: 'h3' },
        { level: 'h4' },
        { level: 'h5' },
        { level: 'h6' }
    ]
    headingsLevels.forEach((headingsLevel) => {
        const tag = headingsLevel.level;
        headingsLevel.count = $(tag).length
    });
    return headingsLevels;
};

const findDocumentVersion = (data) => {
    return (data.substring(0, 20).toLowerCase().indexOf('<!doctype html>') !== -1) ? 5 : 4.10
};

const getDocumentLinksAnalysis = ($) => {
    const analysis = {};
    analysis.internalLinks = $("a[href^='/']").length;
    analysis.externalLinks = $("a[href^='http']").length;
    return analysis;
};

const fetchHTML = (req, res) => {
    const {
        pageURL
    } = req.query;
    https.get(pageURL, (response) => {
        let data = ''
        response.on('data', (d) => {
            data += d;
        });
        response.on('end', () => {
            const $ = cheerio.load(data);
            const pageInsights =  {
                statusCode: response.statusCode,
                version: findDocumentVersion(data),
                title: $('title').html(),
                headingsLevels: findHeadingsCount(cheerio.load(data)),
                anchorTagsCount: getDocumentLinksAnalysis(cheerio.load(data))
            }
            // pageInsights.containsForm = $('body').find('form');
            return sendSuccess({
                res,
                message: 'Successfully fetched data',
                data: pageInsights
            })
        })
    })
    .on('error', e => sendFailure({ res, message: `Unable to fetch page requested ${e.reason}. Host: ${e.host}` }));
};

module.exports = {
    fetchHTML
};
