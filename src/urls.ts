const host = "http://10.175.1.57:8082"
export const urls = {
    saveGateway: host + "/krakend/saveKrakendJson",
    // addEndpoint:host+"/krakend/addendpoints",
    updateEndpoint: host + "/krakend/updateEndpoint",
    getEndpointById: host + "/krakend/getKrakendJson",
    // updateBackend:host+"/krakend/updateBackendOfEndpoint",
    updateKrakend: host + "/krakend/updateKrakendJson",
    getGatewayCards: host + "/krakend/getKrakendJsonCards",
    getUser: host + "/user/getUser",
    deployFile: host + "/krakend/krakendFile",
    getEndpointCards: host + "/krakend/endpoint/getEndpointCards",
    addEndpoint: host + "/krakend/endpoint/addendpoint",
    linkEndpoint: host + "/krakend/linkEndpoint",
    addbackend: host + "/krakend/endpoint/backend/addBackendToEndpoint",
    getEndpoint: host + "/krakend/endpoint/getEndpoint",
    getGatewayName: host + "/krakend/endpoint/getGatewayname",

    updateBackend: host + "/krakend/endpoint/backend/updateBackendOfEndpoint",
    addParametersByEndpoint: host + "/krakend/endpoint/addParameterForwarding",
    addUpdateThrottling: host + "/krakend/endpoint/addOrUpdateThrottling",
    addResponse: host + "/krakend/endpoint/addOrUpdateResponseManipulation",
    addPolicies: host + "/krakend/endpoint/addOrUpdatePolices",
    addConnectivity: host + "/krakend/endpoint/addOrUpdateConnectivityOptions",
    addOpenAPI: host + "/krakend/endpoint/addOrUpdateOpenApi",
    deleteEndpoint: host + "/krakend/endpoint/deletedEndpoint",
    addOrUpdateTelemetryMoesifUrl: host + "/krakend/extraconfig/monetization/addOrUpdateTelemetryMoesif",
    deleteBackend: host + "/krakend/endpoint/backend/deletedBackend",
    addOrUPdateHttpSecurity: host + "/krakend/extraconfig/httpSecurity/addOrUpdateHttpSecurity",

    addOrUpdateServiceSetting: host + "/krakend/extraconfig/serviceSetting/addOrUpdateServiceSetting",
    openApiSpecFileGetting: host + "/apicurio/getOpenApiJsonFromRegistry"
}