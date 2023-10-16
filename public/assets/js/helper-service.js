'use strict'

//const { isValidObjectId } = require("mongoose");
var REQ_PATTERN = /(REQ|req|INC|inc|PRB|prb)\d{9}/;

var HelperService = {
    /**
     * @name showToast
     * @description Will show a toast  with some message
     * @param {*} title
     */
    showToast: function (text) {
        $.toast({
            text,
            position: 'top-right',
            hideAfter: 4000,
            showHideTransition: 'slide' // It can be plain, fade or slide
        });
    },
    postRequest: function (url, request, ok, fail) {
        return $.ajax({
            url,
            type: "POST",
            data: JSON.stringify(request),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (data) {
                ok(data);
            }, error: (error) => {
                fail(error);
            }
        });
    },
    getRequest: function (url, request, ok, fail) {
        return $.ajax({
            url,
            type: "GET",
            // data: JSON.stringify(request),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (data) {
                ok(data);
            }, error: (error) => {
                fail(error);
            }
        });
    },
    /**
     * @name showSpinner
     * @description Show an overlay for indicate it's working on
     * @param {*} title
     */
    showSpinner: function (title = "Wait a minute, please...") {
        const body = `<div id="loader" class="loader d-flex align-content-center flex-wrap">
                        <h3 class="w-100 loader__text text-center">${title}</h3>
                        <div class="w-100">
                            <div class="w-50 loader__element m-auto"></div>
                        </div>
                    </div>`;

        $('body').append(body);
        $('#loader').show();
        $('body').css('overflow', 'hidden');
    },
    /**
     * @name hideSpinner
     * @description Hide overlay to show that task has finished
     */
    hideSpinner: function () {
        $('#loader').remove();
        $('body').css('overflow', 'auto');
    },
    updateLoadingModalMessage: function (newMsj) {
        $('#loader .loader__text').text(newMsj);
    },
    showAlert: function (type, title, body, okFunction, cancelFunction) {
        const ok = okFunction;
        const cancel = cancelFunction;
        const headerClasses = type ? `text-white bg-${type}` : '';

        const html = `<div class="modal fade bd-example-modal-lg ${headerClasses}" tabindex="-1" role="dialog" aria-labelledby="myLargeModalLabel" aria-hidden="true">
                        <div class="modal-dialog modal-lg">
                            <div class="modal-header">
                                <h5 class="modal-title h4" id="myLargeModalLabel">${title}</h5>
                                <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                                    <span aria-hidden="true">×</span>
                                </button>
                            </div>
                            <div class="modal-content">
                                ${body}
                            </div>
                        </div>
                    </div>`;
    },
    /**
     * @name aler
     * @description Show custom message in sweetAlet2 component
     * @param {*} title Alert title
     * @param {*} text Text or HTML shown in body alert
     * @param {*} type success, warning, error, info, question
     */
    alert: function (type, title, text) {
        swal({ type, text, title });
    },
    /**
     *
     * @param {*} title Alert title
     * @param {*} text Text or HTML shown in body alert
     * @param {*} type success, warning, error, info, question
     * @param {*} confirmButtonText Yes button text
     * @param {*} cancelButtonText Cancel button text
     * @param {*} yes callback - Arrow function when user click on yes button
     * @param {*} cancel callback - Arrow function when user click on cancel button
     */
    confirmationAlert: function (title, text, type, confirmButtonText, cancelButtonText, yes, cancel) {
        swal({ title, text, type, confirmButtonText, cancelButtonText, showCancelButton: true })
            .then((result) => {
                if (result.value) {
                    if (yes) {
                        yes();
                    }
                } else if (result.dismiss === 'cancel') {
                    if (cancel) {
                        cancel();
                    }
                }
            });
    },
    successAlert: function (title, text, type, confirmButtonText, yes) {
        swal({
            title, text, type, confirmButtonText, showCancelButton: false, allowOutsideClick: false,
            allowEscapeKey: false
        })
            .then((result) => {
                if (result.value) {
                    if (yes) {
                        yes();
                    }
                }
            });
    },
    injectCSSRules: function (rule) {
        var style = document.createElement('style');
        style.type = 'text/css';
        style.innerHTML = rule;
        document.getElementsByTagName('head')[0].appendChild(style);
    },
    getRegions: function () {
        var dataCountries = localStorage.getItem("regions");//Cookies.get("regions");
        if (dataCountries) {
            return JSON.parse(dataCountries);
        } else {
            return null;
        }
    },
    injectNoDataMessage: function (selector) {
        const noDataMessage = `<div class="alert alert-warning w-100 p-5 border-warning mb-0 mt-3" role="alert" style="border: dashed 2px;">
                                    <p>No data available</p>
                                </div>`;
        $(selector).html();
        $(selector).html(noDataMessage);
    },
    /**
     * Order an array desc by field
     * @param {*} array
     * @param {*} field
     */
    sort: function (array, field) {
        array.sort((a, b) => {
            if (a[field] < b[field]) return -1
            return a[field] > b[field] ? 1 : 0
        });
        return array;
    },
    /**
     * Determines color to apply by project status
     * @param {*} status
     * @returns
     */
    getColorByStatus: function (status) {
        switch (status) {
            case 'New':
                return 'success';
            case 'Design':
                return 'secondary';
            case 'Design Review':
                return 'primary';
            case 'FDM':
                return 'danger';
            case 'Resources':
                return 'warning';
            case 'Done':
                return 'info';
            case 'Governance':
                return 'light';
            case 'dmz':
                return 'muted';
            case '3':
                return 'white';
            default:
                return 'dark';
        }
    },
    /**
     * Determines color to apply by server status
     * @param {*} status
     * @returns
     */
    getServerColorByStatus: function (status) {
        switch (status) {
            case 'Pending For Resources':
                return 'success';
            case 'Assign resources - telecomm':
                return 'success-light badge-dot-xl-sub';
            case 'Assign resources - virtualization':
                return 'success-light badge-dot-xl-sub';
            case 'Ready':
                return 'danger';
            case 'Building':
                return 'warning';
            case 'finished':
                return 'info';
            case 'Error':
                return 'light';
            default:
                return 'dark';
        }
    },
    /**
     * Return basic json for init Bootstrap tables
     */
    getBootstrapTableOptions: function () {
        return {
            pagination: true,
            showRefresh: false,
            showFullscreen: true,
            showColumnsToggleAll: true,
            showExport: true,
            pageList: [5, 10, 20, 50, 100],
            locale: "en-US",
            sidePagination: "server",
            showPaginationSwitch: false,
            search: false,
            showExtendedPagination: true,
            sortStable: false,
            sortName: "",
            sortOrder: "",
            showSearchClearButton: false,
            buttonsPrefix: 'btn-sm btn',
            data: [],
            totalRows: 0,
            totalNotFilteredField: 0,
            searchTimeOut: 0,
            pageNumber: 1,
            searchOnEnterKey: true,
            searchHighlight: false,
            clickToSelect: false,
            onPageChange: function (number, size) { },
            onSearch: function (value, args) { },
            onSort: function (name, order) { },
            onColumnSearch: function (name, args) { }
        }
    },
    /**
     * Will verify if user has some role specified in param array
     * @param {*} roleList
     */
    userHasRoles: function (roleList) {
        const rolesStr = Cookies.get('role');
        const roles = rolesStr.split(',');
        const matchedElements = roles.filter(role => roleList.includes(role));
        if (matchedElements.length > 0) {
            return true;
        }
        return false;
    },
    userRolesArreAllowed: function (roleList) {
        const rolesStr = Cookies.get('role');
        const roles = rolesStr.split(',');
        const matchedElements = roles.filter(role => roleList.includes(role));
        if (matchedElements.length > 0) {
            return true;
        }
        return false;
    },
    userRolesNotAllowed: function (roleList) {
        const rolesStr = Cookies.get('role');
        const roles = rolesStr.split(',');
        const matchedElements = roles.filter(role => roleList.includes(role));
        return matchedElements.length > 0;
    },

    validateReq: function (reqValue) {
        return REQ_PATTERN.test(reqValue);
    },
    /**
     * Determines server class color based in server status
     * @param {String} status
     * @returns
     */
    getServerClass: function (status) {

        if (status === "Building" || status === "building") {
            return "s-building";
        }
        if (status === "Pending for resources" || status === "Pending for Resources") {
            return "s-pending";
        }
        if (status === "Finished" || status === "finished") {
            return "s-finish";
        }
        if (status === "Error" || status === "error") {
            return "s-error";
        }
        if (status === "Ready" || status === "ready") {
            return "s-ready";
        }

        return "bg-primary";
    },
    allowedActions: {},
    getSpecificAction(attribute) {
        return this.allowedActions[attribute];
    },
    getAllowedRoles(option) {
        if (!option) return [];
        const allowedRoles = option.roles.filter(rol => rol.isEnabled);
        return allowedRoles.map((role) => role.rol);
    },
    isAllowedOption(attribute, isIncluseve = true) {
        const option = this.getSpecificAction(attribute);
        const rolesArray = this.getAllowedRoles(option);
        let isAllowed = false;

        if (!option) return false;
        if (!option.isEnabled) return false;

        if (isIncluseve) {
            isAllowed = this.userRolesArreAllowed(rolesArray);
        } else {
            isAllowed = this.userRolesNotAllowed(rolesArray);
        }
        return isAllowed;
    },
    isAllowedSDTOption(option, isIncluseve = true) {
        const rolesArray = this.getAllowedRoles(option);
        let isAllowed = false;

        if (!option) return false;

        if (isIncluseve) {
            isAllowed = this.userRolesArreAllowed(rolesArray);
        } else {
            isAllowed = this.userRolesNotAllowed(rolesArray);
        }
        return isAllowed;
    },
    /**
     * Write on localStorage basic configuration for ILM
     * @returns
     */
    getConfig: function () {
        return $.ajax({
            url: "/config",
            type: "GET",
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (res) {
                localStorage['config'] = JSON.stringify(res);
            },
            error: function (err) {
                console.error(err);
            }
        });
    },
    /**
 * Generic function that validates values based in their owns regex
 * @param {pspInfo} val collection of values to validate {value, pattern, key}
 * @returns errors empty if all values are corrects, is filled with the keys of the wrong values
 */
    processPspInfo: function (configAll, pspInfo, applyOnModel, patterns_names) {
        let errors = [];
        const patternsInfo = configAll.find(el => el.name === patterns_names);
        // const forceFullNameValue = pspInfo.find(elem => elem.key === "forceFullName").value;
        const forceFullNameValue = pspInfo.find(elem => elem.key === "forceFullName");
        // const applyMOdelFinal = forceFullNameValue ? applyOnModel[forceFullNameValue] : [];
        const applyMOdelFinal = forceFullNameValue ? forceFullNameValue.applyOnModel : [];
        let errorsApplyModel = [];
        pspInfo.forEach(function (it) {
            var customRegExp = new RegExp(decodeURI(patternsInfo.value[it.pattern]));
            let value = (it.type === "number" ? parseInt(it.value) : it.value);
            let attributeKey = it.key;
            let isInApplyModel = applyMOdelFinal.find(modelToAply => modelToAply.field === attributeKey)
            if (it.value !== undefined && it.required && isInApplyModel === undefined) {
                if (!customRegExp.test(value)) {
                    errors.push(it.key);
                    $(`#input-${it.key}`).addClass("is-invalid");
                    $(`#input-${it.key}-error`).css("display", "inline-block");
                } else {
                    $(`#input-${it.key}`).removeClass("is-invalid");
                    $(`#input-${it.key}-error`).css("display", "none");
                }
            } else if (isInApplyModel !== undefined) {

                isInApplyModel.regex.forEach(function (regExp) {
                    var customRegExpApplyModel = new RegExp(decodeURI(patternsInfo.value[regExp]));
                    if (!customRegExpApplyModel.test(value)) {
                        errors.push(attributeKey);
                        errorsApplyModel.push(attributeKey)
                    } else {
                        $(`#input-${attributeKey}`).removeClass("is-invalid");
                        $(`#input-${attributeKey}-error`).css("display", "none");
                    }
                });
                errorsApplyModel.forEach(element => {
                    $(`#input-${element}`).addClass("is-invalid");
                    $(`#input-${element}-error`).text(isInApplyModel.helper)
                    $(`#input-${element}-error`).css("display", "inline-block");
                });
            }
        })
        return errors;
    },
    createFormFromConfig: (configForm, container, serverInfo, isArray = false) => {
        let formContainer = $(container);
        if (!isArray) {
            formContainer.html("");
        }

        for (const key in configForm) {
            const property = configForm[key];
            if (!property.hidden) {
                injectInput(formContainer, key, property, (serverInfo && serverInfo[key] ? serverInfo[key] : null));
            }
        }
        $('.psp-change').on('change', function () {
            applyOnModel($(this).val(), $(this).attr("attr-change"))
        });
    },
    getInfoValidation: (configForm) => {
        let psp = [];
        for (const key in configForm) {
            let node = {};
            const property = configForm[key];
            if (property.hidden) {
                psp[key] = property.default;
            }

            node["key"] = key;
            node["value"] = $(`#input-${key}`).val();
            node["pattern"] = property.pattern;
            node["type"] = property.type;
            node["required"] = property.required;

            psp.push(node);
        }
        return psp;
    },
    getInfoFromModel: (configForm, dataDeploy) => {
        let psp = {};
        for (const key in configForm) {
            const property = configForm[key];
            if (property.hidden) {
                psp[key] = property.default;
            } else {
                let value = $(`#input-${key}`).val();
                if (property.getFromModel) {
                    // psp[key] = dataDeploy
                } else {
                    if (property.type === "numberSelect" || property.type === "number") {
                        psp[key] = parseInt(value);
                    } else if (property.type === "boolean") {
                        psp[key] = value === "true";
                    } else {
                        psp[key] = value;
                    }
                }
            }
        }
        return psp;
    },
    alertCommnet: function (title, text, type, confirmButtonText, cancelButtonText, yes, cancel) {
        swal({ title, text, type, confirmButtonText, cancelButtonText, showCancelButton: true, content: "input" })
            .then((result) => {
                if (result.value) {
                    if (yes) {
                        yes(result.value);
                    }
                } else if (result.dismiss === 'cancel') {
                    if (cancel) {
                        cancel();
                    }
                }
            });
    },
    injectAdvertismments: function (ilmConfigAll) {

        const ilmAdvertissements = ilmConfigAll.object.find(actions => actions.name === "ILM advertisement");

        if (!ilmAdvertissements || !ilmAdvertissements.isEnabled) {
            return;
        }

        const configValue = ilmAdvertissements.value;

        // console.log("configValue injectAdvertismments", configValue);
        const enableds = configValue.filter(el => el.isEnabled);
        if (enableds.length > 0) {

            if ($("#carouselExampleFade").length > 0) {
                return
            }
            //if (enableds.length > 1) {
                $(".dashboard-wrapper").prepend(`
                    <div id="carouselExampleFade" class="carousel slide carousel-fade d-none" data-ride="carousel">
                        <div class="carousel-inner h-100"></div>
                        ${enableds.length > 1 ? `<a class="carousel-control-prev" href="#carouselExampleFade" role="button" data-slide="prev">
                        <span class="carousel-control-prev-icon" aria-hidden="true"></span>
                        <span class="sr-only">Previous</span>
                    </a>
                    <a class="carousel-control-next" href="#carouselExampleFade" role="button" data-slide="next">
                        <span class="carousel-control-next-icon" aria-hidden="true"></span>
                        <span class="sr-only">Next</span>
                    </a>`: ``}
                    </div>`
                );
            //}

            $('#carouselExampleFade').carousel()
            enableds.forEach((advertismment, index) => {
                $("#carouselExampleFade .carousel-inner").append(
                    `<div class="carousel-item cadv h-100${((index === 0) ? ' active' : '')}${((advertismment.type) ? ` ${advertismment.type}` : 'bg-warning')}">
                            <div class="carousel-caption caption-advertismment d-flex flex-column justify-content-center align-items-center">
                                <p>${advertismment.message}</p>
                            </div>
                        </div>`
                );
            });
            $("#carouselExampleFade").removeClass("d-none");
            $(".page-header").css("margin-top", "0px");
        } else {
            $(".page-header").css("margin-top", "80px");
        }
    }
}

function getOptions(optionsArray, selected, defaultOption) {
    let options = "";
    if (defaultOption !== undefined) {
        options += `<option value="">Select an option</option> `;
    }
    optionsArray.forEach(option => {
        options += `<option value="${option.value}" ${(selected == option.value ? 'selected' : '')}>${option.text}</option> `;
    });
    return options;
}

function applyOnModel(value, modelString) {
    if (modelString) {
        let model = JSON.parse(modelString);
        let configToApplyArray = model[value];

        configToApplyArray.forEach(el => {
            let id = `input-${el.field}`;
            let field = $('#' + id);

            if (el.disabled) {
                field.prop('disabled', 'disabled');
            } else {
                field.removeAttr('disabled');
            }

            if (el.maxLength) {
                field.prop('maxLength', el.maxLength);
            } else {
                field.removeAttr("maxLength");
            }

            if (el.minLength) {
                field.prop('minLength', el.minLength);
            } else {
                field.removeAttr("minLength");
            }

            if (el.value !== undefined && el.value !== null) {
                field.prop('value', el.value);
            } else {
                field.prop('value', "");
            }

            if (el.min) {
                field.prop('min', el.min);
            } else {
                field.removeAttr("min");
            }

            if (el.max) {
                field.prop('max', el.max);
            } else {
                field.removeAttr("max");
            }

            $(id + "-error").text(el.helper);
        });
    }
}

function injectInput(container, key, element, propertyValue) {
    var field = "";
    const idElement = `input-${key}`;
    // console.log(`---- ${idElement}`, element.type);
    let required = (element.required ? '<strong class="missing">*</strong>' : '');
    let requiredtext = (element.helper ? element.helper : (element.required ? 'Required' : ''));
    let disabled = (element.disabled ? 'disabled' : '');
    let label = `<label for="${idElement}">${element.label}:${required}</label>`;
    let isHidden = (element.hidden ? 'd-node' : '');
    let value = (propertyValue ? propertyValue : element.default);
    let options = "";

    if (element.type === "numberSelect" || element.type === "stringSelect") {
        options = getOptions((element.enum ? element.enum : []), value, element.defaultOption);
    }

    let min = (element.min ? `minlength="${element.min}"` : '');
    let max = (element.max ? `maxlength="${element.max}"` : '');

    let onChange = ((element.applyOnModel) ? `attr-change='${JSON.stringify(element.applyOnModel)}'` : '');

    let feedback = `<div id="${idElement + "-error"}" class="invalid-feedback" style="display: none">
                        ${requiredtext}
                    </div>`;

    switch (element.type) {
        case 'string':
            field = `
                <div class="">
                    ${label}
                    <input ${min} ${max} name="${idElement}" value="${value}" type="text" class="form-control${(element.class ? ' ' + element.class : '')}" id="${idElement}" ${disabled}>
                    ${feedback}
                </div>
                `;
            break;
        case 'password':
            field = `
                <div class="">
                    ${label}
                    <input ${min} ${max} name="${idElement}" value="${value}" type="password" class="form-control${(element.class ? ' ' + element.class : '')}" id="${idElement}" ${disabled}>
                    ${feedback}
                </div>
                `;
            break;
        case 'number':
            field = `
                ${label}
                <div class="input-group">
                    <input name="${idElement}" value="${value}" type="number" class="form-control ${(element.class ? ' ' + element.class : '')}" id="${idElement}" ${disabled}>
                    ${feedback}
                </div>`;
            break;
        case 'numberSelect':
            field = `
                ${label}
                <div class="input-group" >
                    <select ${onChange} name="${idElement}" class="form-control psp-change ${(element.class ? ' ' + element.class : '')}" id="${idElement}" ${disabled}>
                        ${options}
                    </select>
                    ${feedback}
                </div>`;
            break;
        case 'stringSelect':
            field = `
                ${label}
                <div class="input-group" >
                    <select ${onChange} name="${idElement}" class="form-control psp-change ${(element.class ? ' ' + element.class : '')}" id="${idElement}" ${disabled} ${(element.isMulti ? 'multiple' : '')}>
                        ${options}
                    </select>
                    ${feedback}
                </div>`;
            break;
        case 'objectList':
            var field = `
                    <div class="col">
                        <fieldset id="${idElement}" class="field-container container-fluid">
                            <legend class="field-container--tittle txt-white">${element.label}</legend>
                            <div id="${idElement}-container" class="row"></div>
                        </fieldset>
                    </div>
                `;
            break;
        default:
            // console.log(`-----`, key, element.type, "-----");
            field = `
                ${label}
                <div class="alert alert-warning">
                    No HTML element configured
                </div>`;

            break;
    }
    if (element.type === "objectList") {
        // console.log("inject to ---> ", container);
        // console.log("element.formDefinition", element.formDefinition);
        $(container).append(field);
        const definition = element.formDefinition;
        let definitionSend = element.formDefinition;

        for (let index = 0; index < element.limitedTo; index++) {

            $(`#${idElement}-container`).append(`<div class="${(element.cols ? element.cols : "col-4 col-sm-6 col-md-3 col-md-4")}">
                                                    <div class="row ${element.class} ${element.class + "-" + index}"></div>
                                                </div>`);

            for (const key in definition) {
                let property = definitionSend[key];
                if (!property.hidden) {
                    let split = property.class.split("-");
                    if (split.length > 0) {
                        property.class = split[0] + `-${index}`;
                    } else {
                        property.class = property.class + `-${index}`;
                    }
                    injectInput(`.${element.class + "-" + index}`, key, property, null);
                }
                property = null;
            }

            if (element.isDeletable) {
                $(`.${element.class + "-" + index}`).append(`<div class="col-1">${isDeletable(element.isDeletable, `.${element.class + "-" + index}`)} </div>`);
            }
        }
    } else {
        $(container).append(`<div class="${(element.cols ? element.cols : "col-4 col-sm-6 col-md-3 col-md-4")}">
                                <div class="form-group">${field}</div>
                            </div>`);
    }
    $(`#${idElement}`).val(value).trigger("change");
}

function isDeletable(isDeletable, rowId) {
    if (isDeletable) {
        return `<i style="margin-top: 40px;" onclick="deleteRow('${rowId}')"class="fas fa-trash text-danger"></i>`;
        // return `<button onclick="deleteRow('${rowId}')" class="btn btn-sm btn-danger mt-4" type="button">
        //          <i class="fas fa-trash"></i>
        //      </button>`;
    }
    return "";
}

function deleteRow(element) {
    $(element).remove();
}

