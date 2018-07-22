/**
 * @description Helper utils methods for fetch-html module
 */

/* eslint-disable strict */

'use strict'

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
    return (data.substring(0, 100).toLowerCase().indexOf('<!doctype html>') !== -1) ? 5 : 4.10
};

const getDocumentLinksAnalysis = ($) => {
    const analysis = {};
    analysis.internalLinks = $("a[href^='/']").length;
    analysis.externalLinks = $("a[href^='http']").length;
    return analysis;
};

const getForm = $ => $('form').length;

module.exports = {
    findHeadingsCount,
    findDocumentVersion,
    getDocumentLinksAnalysis,
    getForm
};
