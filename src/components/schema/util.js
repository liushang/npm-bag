export function deepClone1(obj) {
    // 判断拷贝的要进行深拷贝的是数组还是对象，是数组的话进行数组拷贝，对象的话进行对象拷贝
    let objClone = Array.isArray(obj) ? [] : {};
    // 进行深拷贝的不能为空，并且是对象或者是
    if (obj && typeof obj === 'object') {
        for (let key in obj) {
            if (obj.hasOwnProperty(key)) {
                if (obj[key] && typeof obj[key] === 'object') {
                    objClone[key] = deepClone1(obj[key]);
                } else {
                    objClone[key] = obj[key];
                }
            }
        }
    }
    return objClone;
}
// render拼接
export function analysisRenderConfig(configData, createElement) {
    if (configData) {
        let renderArr = [];
        for (let i of configData) {
            let dealChildFun = dealChild.bind(this)
            if (Array.isArray(dealChildFun(i, createElement))) {
                renderArr.push(...dealChildFun(i, createElement))
            } else {
                renderArr.push(dealChildFun(i, createElement));
            }
        }
        return renderArr;
    }
}
function dealChild(child, cb) {
    if (!Array.isArray(child.value)) { // 简单类型
        return child.value;
    } else if (child.raw.name.startsWith('o')) {
        let item = {
            class: child.raw['class'],
            style: child.raw.style,
            attrs: child.raw.attrs,
            props: child.raw.props,
            domProps: child.raw.domProps,
            on: child.raw.on,
            nativeOn: child.raw.nativeOn,
            directives: child.raw.directives,
            scopedSlots: child.raw.scopedSlots,
            slot: child.raw.slot,
            key: child.raw.key,
            ref: child.raw.ref,
            refInFor: child.raw.refInFor
        };
        if (child.raw.attr) {
            let attrs = {};
            let props = {};
            for (let i in child.raw.attr) {
                attrs[i] = child.raw.attr[i];
            }
            item.attrs = Object.assign(item.attrs || {}, attrs);
            item.props = Object.assign(item.props || {}, props);
        }
        return cb(
            child.raw.name,
            item,
            analysisRenderConfig.bind(this)(child.value, cb)
        );
    } else {
        let item = {
            'class': child.raw['class'],
            style: child.raw.style,
            attrs: child.raw.attrs,
            props: child.raw.props,
            domProps: child.raw.domProps,
            on: child.raw.on,
            nativeOn: child.raw.nativeOn,
            directives: child.raw.directives,
            scopedSlots: child.raw.scopedSlots,
            slot: child.raw.slot,
            key: child.raw.key,
            ref: child.raw.ref,
            refInFor: child.raw.refInFor
        };
        if (child.raw.attr) {
            let attrs = {};
            for (let i in child.raw.attr) {
                attrs[i] = child.raw.attr[i];
            }
            item.attrs = Object.assign(item.attrs || {}, attrs);
        }
        return cb(
            child.raw.name,
            item,
            analysisRenderConfig.bind(self)(child.value, cb)
        )
    }
}

export function stringToFunc(str) {
    if (typeof str === 'string') {
        str = String(str)
        let funLast = str.slice(str.indexOf('{') + 1);
        let funMiddle = funLast.slice(0, funLast.lastIndexOf('}')).trim();
        // 获取函数参数
        let funPre = str.slice(str.indexOf('(') + 1);
        let funNamePre = funPre.slice(0, funPre.indexOf(')'));
        let funNameArr = funNamePre.trim().replace(/[\r\n]/g, '').split(',');
        /* eslint-disable */
        return new Function(...funNameArr, funMiddle);
    } else {
        return str
    }
}

export function dealConfigJSON(configJson) {
    let components = {};
    for (let i of configJson) {
        components[i.name] = resolve => {
            getComponent(component => {
            }, i, resolve);
        };
        // components[i.name] = resolve => require([i.path], resolve);
    }
    return components;
}
export function getComponent(callBack, { path, delay = 1 }, param) {
    // setTimeout(() => {
    callBack(require([`${path}`], param));
    // }, delay);
}

export function analysisData(configComponents) {
    // 构建组件数据
    const configData = [];
    for (let i = 0; i < configComponents.length; i++) {
        const rawData = deepClone1(configComponents[i]);
        delete rawData.children;
        if (typeof configComponents[i] !== 'object') { // 简单类型
            const childrenData = {
                type: 'simple',
                value: configComponents[i],
                raw: rawData
            };
            configData.push(childrenData);
        } else {
            const childrenData = {
                type: 'Array',
                raw: rawData
            };
            if (configComponents[i].children) {
                childrenData.value = analysisData(configComponents[i].children);
            } else {
                childrenData.value = [];
            }
            configData.push(childrenData);
        }
    }
    
    return configData;
}

export function analysisDataRender(configComponents, index) {
    // 构建组件数据
    const configData = [];
    for (let i = 0; i < configComponents.length; i++) {
        const rawData = deepClone1(configComponents[i]);
        delete rawData.children;
        if (typeof configComponents[i] !== 'object') { // 简单类型
            const childrenData = {
                type: 'simple',
                value: configComponents[i],
                raw: rawData
            };
            if (rawData.on) {
                for (let i in rawData.on) {
                    let funcs = stringToFunc(rawData.on[i]);
                    rawData.on[i] = (e) => {
                        // return func(e, this);
                        let oo = funcs.bind(this)
                        return oo(e);
                    };
                }
            }
            if (rawData.nativeOn) {
                for (let i in rawData.nativeOn) {
                    let funcs = stringToFunc(rawData.nativeOn[i]);
                    rawData.nativeOn[i] = (e) => {
                        // return func(e, this);
                        let oo = funcs.bind(this)
                        return oo(e);
                    };
                }
            }
            if (rawData.renderFun) {
                if (rawData.renderFun) {
                    let funcss = stringToFunc(rawData.renderFun)
                    childrenArr = funcss.bind(this)(childrenArr)
                }
            }
            // Vue.set(this.controlData, id, childrenData);
            configData.push(childrenData);
        } else {
            const childrenData = {
                type: 'Array',
                raw: rawData
            };
            if (configComponents[i].children) {
                childrenData.value = analysisDataRender.bind(this)(configComponents[i].children);
            } else {
                childrenData.value = [];
            }
            let childrenArr = [childrenData]
            if (rawData.on) {
                for (let i in rawData.on) {
                    if (i === 'input') {
                    }
                    let funcs = stringToFunc(rawData.on[i]);
                    rawData.on[i] = (e) => {
                        // return func(e, this);
                        let oo = funcs.bind(this)
                        return oo(e);
                    };
                }
            }
            if (rawData.nativeOn) {
                for (let i in rawData.nativeOn) {
                    let funcs = stringToFunc(rawData.nativeOn[i]);
                    rawData.nativeOn[i] = (e) => {
                        // return func(e, this);
                        let oo = funcs.bind(this)
                        return oo(e);
                    };
                }
            }
            if (rawData.renderFun) {
                let funcss = stringToFunc(rawData.renderFun)
                childrenArr = funcss.bind(this)(childrenArr)
            }
            configData.push(...childrenArr);
        }
    }
    return configData;
}

export function getDefaultProps (config) {
    let props = config.props || {};
    let propsIns = {};
    const map = {
        'Number': 0,
        'String': '',
        'Boolean': false,
        'Object': {},
        'function': () => {},
        'Array': []
    };
    const dealMap = {
        'Number': e => +e,
        'String': e => e,
        'Boolean': e => !!e,
        'function': e => e,
        'Array': e => e
    };
    for (let i in props) {
        if (props[i].type) {
            const type = props[i].type;
            if (Array === type || type === Object) {
                if ('default' in props[i]) {
                    propsIns[i] = props[i].default() || {};
                } else {
                    propsIns[i] = map[type];
                }
            } else {
                propsIns[i] = 'default' in props[i] ? dealMap[typeof type](props[i].default) : map[type];
            }
        }
    }
    return propsIns;
}

export function getRawId(name) {
    return name + '_' + parseInt(Math.random() * 1000000);
}
function changeRawId(i) {
    if (i.props && (i.props.rawId || i.props.subRawId)) {
        // if (i.props.subRawId) i.props.subRawId = i.props.subRawId.split('_')[0] + '_' + parseInt(Math.random() * 1000000)
        // if (i.props.rawId) i.props.rawId = i.props.rawId.split('_')[0] + '_' + parseInt(Math.random() * 1000000)
    }
    if (i.props.children) {
        for (let x of i.props.children) {
            changeRawId(x)
        }
    }
    if (i.children) {
        for (let x of i.children) {
            changeRawId(x)
        }
    }
}
export function dealMultiChildren(children) {
    if (children.length < 2) return children;
    for (let i = 1; i < children.length; i++) {
        changeRawId(children[i])
    }
    return children
}