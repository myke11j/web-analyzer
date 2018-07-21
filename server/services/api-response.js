/**
 * @description Module is to send HTTP responses in a common format
 */
const Response = {
    sendSuccess: async (params) => {
        const {
            res, message, data = []
        } = params;
        return res.status(200).json({
            message: message || 'Successful',
            data,
            code: 200
        });
    },

    sendFailure: (params) => {
        const {
            res, message
        } = params;
        return res.status(500).json({
            message: message || 'API failed',
            data: [],
            code: 500
        });
    },

    sendInvalidFormat: (params) => {
        const {
            res, message
        } = params;
        return res.status(200).json({
            message: message || 'Invalid format',
            data: [],
            code: 400
        });
    },

    sendInvalidPrompt: (params) => {
        const {
            res, message
        } = params;
        return res.status(200).json({
            message: message || 'Validation Error',
            data: [],
            code: 113
        });
    }
};

module.exports = Response;
