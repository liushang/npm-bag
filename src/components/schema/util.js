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
    // console.log(child)
    if (!child || !child.values) { // 简单类型
        return child;
    } else if (child.name.startsWith('o')) {
        // assign
        let item = {
            class: Object.assign(child.raw['class'] || {}, child.class),
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
        if (item.style && item.style.border && item.style.border === '1px solid red') {
            item.class['border-red'] = true
        } else {
            delete item.class['border-red']
        }
        if (child.raw.attr) {
            let attrs = {};
            let props = {};
            for (let i in child.raw.attr) {
                attrs[i] = child.raw.attr[i];
            }
            item.attrs = Object.assign(item.attrs || {}, attrs);
            item.props = Object.assign(item.props || {}, props);
        }
        for (let x in child) {
            if (!['values', 'children', 'name', 'raw'].includes(x)) item.props[x] = child[x];
        }
        return cb(
            child.name,
            item,
            analysisRenderConfig.bind(this)(child.values, cb)
        );
    } else {
        let item = {
            'class': child.raw['class'] || {},
            style: child.raw.style,
            attrs: child.raw.attrs,
            props: child.raw.attrs,
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
        if (item.style && item.style.border && item.style.border === '1px solid red') {
            item.class['border-red'] = true
        } else {
            delete item.class['border-red']
        }
        if (child.raw.attr) {
            let attrs = {};
            let props = {};
            for (let i in child.raw.attr) {
                attrs[i] = child.raw.attr[i];
            }
            item.attrs = Object.assign(item.attrs || {}, attrs);
            item.props = Object.assign(item.props || {}, props);
        }
        for (let x in child) {
            if (!['values', 'children', 'name', 'raw'].includes(x)) item.props[x] = child[x];
        }
        if (item.ref) {} else {
            if (item.props && item.props.ref) item.ref = item.props.ref
        }
        return cb(
            child.name,
            item,
            analysisRenderConfig.bind(this)(child.values, cb)
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
export function getComponent(callBack, { path, delay = 1 }, param) {
    // setTimeout(() => {
    callBack(require([`${path}`], param));
    // }, delay);
}

// export function analysisData(configComponents) {
//     // 构建组件数据
//     const configData = [];
//     for (let i = 0; i < configComponents.length; i++) {
//         const rawData = deepClone1(configComponents[i]);
//         delete rawData.children;
//         if (typeof configComponents[i] !== 'object') { // 简单类型
//             const childrenData = {
//                 type: 'simple',
//                 values: configComponents[i],
//                 raw: rawData
//             };
//             configData.push(childrenData);
//         } else {
//             const childrenData = {
//                 type: 'Array',
//                 raw: rawData
//             };
//             if (configComponents[i].children) {
//                 childrenData.values = analysisData(configComponents[i].children);
//             } else {
//                 childrenData.values = [];
//             }
//             configData.push(childrenData);
//         }
//     }
    
//     return configData;
// }

export function analysisDataRender(configComponents, index) {
    // 构建组件数据
    const configData = [];
    for (let i = 0; i < configComponents.length; i++) {
        const rawData = deepClone1(configComponents[i]);
        delete rawData.children;
        if (typeof configComponents[i] !== 'object') { // 简单类型
            configData.push(configComponents[i]);
        } else {
            const childrenData = {
                name: configComponents[i].name,
                raw: rawData
            }
            if (configComponents[i].children) {
                childrenData.values = analysisDataRender.bind(this)(configComponents[i].children);
            } else {
                childrenData.values = [];
            }
            let childrenArr = [childrenData]
            if (rawData.on) {
                for (let x in rawData.on) {
                    let funcs = stringToFunc(rawData.on[x]);
                    rawData.on[x] = (e) => {
                        // return func(e, this);
                        let oo = funcs.bind(this)
                        return oo(e);
                    };
                }
            }
            if (rawData.nativeOn) {
                for (let x in rawData.nativeOn) {
                    let funcs = stringToFunc(rawData.nativeOn[x]);
                    rawData.nativeOn[x] = (e) => {
                        // return func(e, this);
                        let oo = funcs.bind(this)
                        return oo(e);
                    };
                }
            }
            if (rawData.renderFun) {
                let funcss = stringToFunc(rawData.renderFun)
                childrenArr = funcss.bind(this)(childrenData)
                if (!Array.isArray(childrenArr)) {
                    childrenArr = [childrenArr]
                }
            }
            // 组件 renderfun 字符串注入处理为函数
            // if (rawData.props && rawData.props.renderFun) {
            //     console.log(typeof rawData.props.renderFun)
            //     let funcss = stringToFunc(rawData.props.renderFun)
            //     rawData.props.renderFun = funcss
            // }
            // if (rawData.props && rawData.props.insData) {
            //     rawData.props.insData = JSON.parse(rawData.props.insData)
            // }
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
    if (!Array.isArray(children)) children = [children]
    if (children.length < 2) return children;
    for (let i = 1; i < children.length; i++) {
        changeRawId(children[i])
    }
    return children
}

export function analysisInjectData(constructor, data = {}, parentRawId, all) {
    // 注入数据：组件本地数据，组件函数，组件映射字段
    console.log('injectData')
    console.log(constructor)
    // if (!data) return constructor
    const { rawId, subRawId } = constructor.props;
    if (rawId && constructor.props && constructor.props.children && constructor.props.children.length) {
        // 组件子元素注入
        for (let i of constructor.props.children) {
            if (i.props.rawId && data[i.props.rawId]) {
                // 如果检测到的是组件，按组件注入
                analysisInjectData(i, all[i.props.rawId], rawId, all)
            } else if (i.props.subRawId) {
                console.log('注入元素树形,依旧注入组件属性', i, data[i.props.subRawId], all)
                analysisInjectData(i, data[i.props.subRawId], rawId, all)
            }
        }
    } else if (subRawId && constructor.children && constructor.children.length) {
        // 元素子元素注入
        for (let i of constructor.children) {
            console.log(i.props)
            if (!i.props) return
            if (i.props.rawId && data[i.props.rawId]) {
                // 如果检测到的是组件，按组件注入
                analysisInjectData(i, all[i.props.rawId], parentRawId, all)
            } else if (i.props.subRawId) {
                console.log('注入元素树形', i.name, data, all)
                analysisInjectData(i, all[parentRawId][i.props.subRawId], parentRawId, all)
            }
        }
    }
    let mergerLocal = Object.assign(data, {
        attrMap: constructor.props.attrMap
    })
    injectData(constructor, mergerLocal)
    return constructor;
}
function injectData(item, dataItem) {
    if (item.name === 'ElInput') {
        console.log('ElInpeeeeeeeeut')
    }
    console.log('inject', item.name, dataItem)
    const { insData, renderFun, attrMap, on } = dataItem || {};
    if (item.props.insData && insData) {
        for (let i in dataItem.insData) {
            item.props.insData[i] = insData[i]
        } 
    }
    if (attrMap) {
        for(let x in attrMap) {
            // this的坑点
            item.props.renderFun = item.props.renderFun.replace(x, attrMap[x])
            item.renderFun = item.renderFun.replace(x, attrMap[x])
        }
    }
    if (item.props.renderFun && renderFun) {
        item.props.renderFun = getFunctionReplace(renderFun);
    }
    if (item.props.on && on) {
        for (let y in item.props.on) {
            if (on[y]) item.props.on[y] = getFunctionReplace(on[y])
        }
    }
    function getFunctionReplace(func) {
        // 函数替换配置中的变量map
        if (typeof func === 'function') {
            func = func.toString()
        }
        if (attrMap) {
            for(let x in attrMap) {
                if (func.includes(x)) func = func.replace(x, attrMap[x])
            }
        }
        return stringToFunc(func)
    }
    console.log(item)
}
