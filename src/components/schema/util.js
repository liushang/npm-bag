export const allHtmlNode = [ '!DOCTYPE', 'html', 'title', 'body', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'p', 'br', 'hr', 'abbr', 'address', 'b', 'bdi', 'bdo', 'blockquote', 'cite', 'code', 'del', 'dfn', 'em', 'i', 'ins', 'kbd', 'mark', 'meter', 'pre', 'progress', 'q', 'rp', 'rt', 'ruby', 's', 'samp', 'small', 'srong', 'sub', 'time', 'u', 'var', 'wbr', 'from', 'input', 'textarea', 'button', 'select', 'optgroup', 'option', 'label', 'fieldset', 'legend', 'datalist', 'keygen', 'output', 'iframe', 'img', 'map', 'area', 'canvas', 'figcaption', 'figure', 'audio', 'source', 'track', 'video', 'a', 'link', 'nav', 'ul', 'ol', 'li', 'dl', 'dt', 'dd', 'menu', 'command', 'table', 'caption', 'th', 'tr', 'td', 'thead', 'tbody', 'tfoot', 'col', 'colgroup', 'style', 'div', 'span', 'header', 'footer', 'section', 'article', 'aside', 'details', 'dialog', 'summary', 'head', 'meta', 'base', 'basefont', 'script', 'noscript', 'applet', 'enbed', 'object', 'param']
export function deepClone(obj) {
    // 判断拷贝的要进行深拷贝的是数组还是对象，是数组的话进行数组拷贝，对象的话进行对象拷贝
    let objClone = Array.isArray(obj) ? [] : {};
    // 进行深拷贝的不能为空，并且是对象或者是
    if (obj && typeof obj === 'object') {
        for (let key in obj) {
            if (obj.hasOwnProperty(key)) {
                if (obj[key] && typeof obj[key] === 'object') {
                    objClone[key] = deepClone(obj[key]);
                } else {
                    objClone[key] = obj[key];
                }
            }
        }
    }
    return objClone;
}

export function deepCloneEnhance(obj, item) {
    // 判断拷贝的要进行深拷贝的是数组还是对象，是数组的话进行数组拷贝，对象的话进行对象拷贝
    let objClone = Array.isArray(obj) ? [] : {};
    if (item && !Array.isArray(obj)) {
        let appendItem = function(object, data) {
                if (typeof object === 'object') {
                    if (!object.raw.props.scope) object.raw.props.scope = {}
                    if (!object.raw.scope) object.raw.scope = {}
                    // object.raw.scope[i] = data[i]
                    object.raw.props.scope = Object.assign(object.raw.props.scope, data)
                    object.raw.scope = Object.assign(object.raw.scope, data)
                }
                if (object.values && object.values.length) {
                    for (let ii of object.values) {
                        appendItem(ii, data)
                    }
                }
        }
        appendItem(obj, item)
    }
    // 进行深拷贝的不能为空，并且是对象或者是
    if (obj && typeof obj === 'object') {
        for (let key in obj) {
            if (obj.hasOwnProperty(key)) {
                if (obj[key] && typeof obj[key] === 'object') {
                    objClone[key] = deepClone(obj[key]);
                } else {
                    objClone[key] = obj[key];
                }
            }
        }
    }
    return objClone;
}
window.deepClone = deepClone;
window.deepCloneEnhance = deepCloneEnhance

export function analysisDataRender(configComponents) {
    const configData = [];
    for (let i = 0; i < configComponents.length; i++) {
        const rawData = deepClone(configComponents[i]);
        delete rawData.children;
        if (typeof configComponents[i] !== 'object') { // 简单类型
            configData.push(configComponents[i]);
        } else {
            const childrenData = {
                name: configComponents[i].name,
                raw: rawData,
                // ...((rawData || {}).scope || {})
                // children: configComponents[i].children || []
            }
            let scopes = rawData.scope || {}
            for (let i in scopes) {
                childrenData[i] = scopes[i]
            }
            // if (configComponents[i].children) {
            //     childrenData.values = analysisDataRender.bind(this)(configComponents[i].children);
            // } else {
            //     childrenData.values = [];
            // }
            let childrenArr = [childrenData];
            childrenData.values = [];
            if (configComponents[i].name === 'div') {
            }
            if (configComponents[i].name === 'oRow') {
                if (rawData.props.on) {
                    for (let x in rawData.props.on) {
                        let funcs = stringToFunc(rawData.props.on[x]);
                        rawData.props.on[x] = (e) => {
                            let oo = funcs.bind(this)
                            return oo(e);
                        };
                    }
                }
                if (rawData.props.renderFun) {
                    let funcss = stringToFunc(rawData.props.renderFun)
                    rawData.props.renderFun = funcss.bind(this);
                    childrenArr = funcss.bind(this)(childrenData)
                    if (!Array.isArray(childrenArr)) {
                        childrenArr = [childrenArr]
                    }
                    for (let xx of childrenArr) {
                        if (configComponents[i].children && typeof xx === 'object' && !Array.isArray(xx) && xx.name) {
                            xx.values = analysisDataRender.bind(this)(configComponents[i].children)
                        } else if (typeof xx === 'object' && !Array.isArray(xx) && xx.name) {
                            xx.values = []
                        } else {
                            console.log('处理剩下的值', xx)
                        }
                    }
                }
            }
            ['on', 'nativeOn', 'scopedSlots', 'watch'].forEach((i) => {
                if (rawData[i]) {
                    for (let x in rawData[i]) {
                        let funcs = stringToFunc(rawData[i][x]);
                        rawData[i][x] = (e) => {
                            let oo = funcs.bind(this)
                            return oo(e);
                        };
                    }
                }
            })
            let funcss = (configComponents[i].name !== 'oRow' && rawData.renderFun && stringToFunc(rawData.renderFun)) || (x => x)
            childrenArr = funcss.bind(this)(childrenData)
            if (!Array.isArray(childrenArr)) {
                childrenArr = [childrenArr]
            }
            for (let xx of childrenArr) {
                if (configComponents[i].children && typeof xx === 'object' && !Array.isArray(xx) && xx.name) {
                    if (configComponents[i] && Array.isArray(configComponents[i].children)) {
                        for (let uu of configComponents[i].children) {
                            if (typeof uu === 'object' && uu.name) {
                                !uu.scope && (uu.scope = {})
                                Object.assign(uu.scope, xx.raw.scope)
                            }
                        }
                    }
                    // render函数并没有 render子元素  子元素的赋值需要留在下一级
                    xx.values = analysisDataRender.bind(this)(configComponents[i].children)
                } else if (typeof xx === 'object' && !Array.isArray(xx) && xx.name) {
                    xx.values = []
                } else {
                    console.log('处理剩下的值', xx)
                }
            }
            configData.push(...childrenArr);
        }
    }
    return configData;
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
    if (!child || !child.values) { // 简单类型
        return child;
    } else {
        let item = {
            'class': child.raw['classes'] || {},
            style: child.raw.style,
            attrs: child.raw.attrs,
            props: child.name.startsWith('o') ? child.raw.props : child.raw.attrs,
            domProps: child.raw.domProps,
            on: child.raw.on,
            nativeOn: child.raw.nativeOn,
            directives: child.raw.directives,
            // scopedSlots: child.raw.scopedSlots,
            // slot: child.raw.slot,
            key: child.raw.key,
            ref: child.raw.ref,
            refInFor: child.raw.refInFor
        };
        if (child.raw.slot) item.slot = child.raw.slot
        // console.log(child.raw, child.name)
        // if (child.raw.slot) console.log(child.raw.slot, '我我我我我我')
        if (!item.scopedSlots) {
            item.scopedSlots = {}
            for (let i in child.raw.scopedSlots) {
                let o = child.raw.scopedSlots[i]
                item.scopedSlots[i] = a => {
                    if (a) {
                        let ee = o(a)
                        if (ee) {
                            return dealSlotNode.bind(this)(cb, ee)
                            // return cb(ee.name, { on: ee.on }, ee.children )
                        }
                    }
                }
            }
        }
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
            if (!['values', 'children', 'directives', 'name', 'raw'].includes(x) && child[x]) {
                !item.props && (item.props = {})
                item.props[x] = child[x];
            }
        }
        if (item.ref) {} else {
            if (item.props && item.props.ref) item.ref = item.props.ref
        }
        if(child.name === 'oRow') {
            // todo 对容器类组件自身属性测试优化
            item.on = item.props.on
        }
        if (item.directives) {
            let att = []
            for(let i in item.directives) {
                att.push(item.directives[i])
            }
            item.directives = att.filter(x => x)
        }
        return cb(
            child.name,
            item,
            analysisRenderConfig.bind(this)(child.values, cb)
        )
    }
}
function dealSlotNode(cb, item) {
    if (item.on) {
        for (let x in item.on) {
            let funcs = stringToFunc(item.on[x]);
            item.on[x] = (e) => {
                let oo = funcs.bind(this)
                return oo(e);
            };
        }
    }
    if (item.nativeOn) {
        for (let x in item.nativeOn) {
            let funcs = stringToFunc(item.nativeOn[x]);
            item.nativeOn[x] = (e) => {
                let oo = funcs.bind(this)
                return oo(e);
            };
        }
    }
    const { name, on, props, attrs, nativeOn, style, scopedSlots, children, slot } = item
    if (children && children.length) {
        let childrens = []
        for(let i of children) {
            childrens.push(dealSlotNode.bind(this)(cb, i))
        }
        const param = {
            on: on || {},
            props: props || {},
            attrs: attrs || {},
            // nativeOn: nativeOn || {},
            style: style || {},
            scopedSlots: scopedSlots || {},
        }
        if (!allHtmlNode.includes(name)) {
            param.nativeOn = on || {}
        }
        return cb(name, param, childrens)
    } else if (name){
        const param = {
            on: on || {},
            props: props || {},
            attrs: attrs || {},
            style: style || {},
            scopedSlots: scopedSlots || {},
        }
        if (!allHtmlNode.includes(name)) {
            param.nativeOn = on || {}
        }
        return cb(name, param)
    } else {
        return item
    }
}
export function stringToFunc(str) {
    // const deepClone = function deepClone(obj) {
    //     // 判断拷贝的要进行深拷贝的是数组还是对象，是数组的话进行数组拷贝，对象的话进行对象拷贝
    //     let objClone = Array.isArray(obj) ? [] : {};
    //     // 进行深拷贝的不能为空，并且是对象或者是
    //     if (obj && typeof obj === 'object') {
    //         for (let key in obj) {
    //             if (obj.hasOwnProperty(key)) {
    //                 if (obj[key] && typeof obj[key] === 'object') {
    //                     objClone[key] = deepClone(obj[key]);
    //                 } else {
    //                     objClone[key] = obj[key];
    //                 }
    //             }
    //         }
    //     }
    //     return objClone;
    // };
    // const deepCloneEnhance = deepCloneEnhance;
    if (typeof str === 'string') {
        let newStr = `return ${str.replace('[native code]', '')}`
        let newFun = new Function(newStr)
        let newnew = newFun()
        return newnew
    } else {
        return str
    }
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
    if (i.props && i.props.children) {
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

export function analysisInjectData(constructor, data = {attrMap: {}}, parentRawId, all) {
    // 注入数据：组件本地数据，组件函数，组件映射字段
    const { rawId, subRawId } = constructor.props;
    if (rawId && constructor.props && constructor.props.children && constructor.props.children.length) {
        // 组件子元素注入
        for (let i of constructor.props.children) {
            if (i.props && i.props.rawId) {
                // 如果检测到的是组件，按组件注入
                analysisInjectData(i, all[i.props.rawId], rawId, all)
            } else if (i.props && i.props.subRawId) {
                analysisInjectData(i, data[i.props.subRawId], rawId, all)
            }
        }
    } else if (subRawId && constructor.children && constructor.children.length) {
        // 元素子元素注入
        for (let i of constructor.children) {
            if (i.props) {
                if (i.props.rawId && data[i.props.rawId]) {
                    // 如果检测到的是组件，按组件注入
                    analysisInjectData(i, all[i.props.rawId], parentRawId, all)
                } else if (i.props.subRawId) {
                    analysisInjectData(i, (all[parentRawId] || {})[i.props.subRawId], parentRawId, all)
                }
            }
        }
    }
    for (let i in constructor.attrMap) {
        if (constructor.attrMap && !constructor.attrMap[i]) break;
        if (!data.attrMap[i]) data.attrMap[i] = constructor.attrMap[i]
    }
    for (let i in constructor.props.attrMap) {
        if (constructor.attrMap && !constructor.attrMap[i]) break;
        if (!data.attrMap[i]) data.attrMap[i] = constructor.props.attrMap[i]
    }
    constructor.props.attrMap && Object.assign(constructor.props.attrMap, data.attrMap)
    constructor.attrMap && Object.assign(constructor.attrMap, data.attrMap)
    injectData(constructor, data)
    return constructor;
}
function injectData(item, dataItem) {
    const { insData, renderFun, attrMap, on, nativeOn, methods, scopedSlots, watch } = dataItem || {};
    if (item.props.insData && insData) {
        for (let i in dataItem.insData) {
            item.props.insData[i] = insData[i]
        }
    }
    if (attrMap) {
        const replaceFun = (func, key, val, name) => {
            let str = func.toString()
            for (let i in attrMap) {
                if (str.indexOf(i) > -1) {
                    str = str.replace(i, attrMap[i])
                }
            }
            let oo = stringToFunc(str)
            return oo
        }
        for(let x in attrMap) {
            if (!attrMap[x]) break;
            // this的坑点
            if (item.props && item.props.renderFun) {
                if (!item.props.renderRawFun && item.props.renderFun.toString().indexOf(x) > -1) item.props.renderRawFun = item.props.renderFun.toString()
                item.props.renderFun = replaceFun(item.props.renderRawFun || item.props.renderFun, x, attrMap[x])
            }
            if (item.renderFun) {
                if (!item.renderRawFun && item.renderFun.toString().indexOf(x) > -1) item.renderRawFun = item.renderFun.toString()
                if(item.renderRawFun && item.renderRawFun.indexOf(x) > -1) {
                    item.renderFun = replaceFun(item.renderRawFun || item.renderFun, x, attrMap[x])
                }
            }
            for(let i in item.on) {
                // 元素on方法
                if (item.on[i].toString().indexOf(x) > -1) {
                    if (!item.rawOn) item.rawOn = {}
                    item.rawOn[i] = item.on[i].toString()
                }
                if (item.rawOn && item.rawOn[i] && item.rawOn[i].indexOf(x) > -1) {
                    item.props.on[i] = item.on[i] = replaceFun(item.rawOn && item.rawOn[i] || item.on[i], x, attrMap[x])
                }
            }
            for(let i in item.nativeOn) {
                if (item.nativeOn[i].toString().indexOf(x) > -1) {
                    if (!item.rawNativeOn) item.rawNativeOn = {}
                    item.rawNativeOn[i] = item.nativeOn[i].toString()
                }
                if (item.rawNativeOn && item.rawNativeOn[i] && item.rawNativeOn[i].indexOf(x) > -1) {
                    item.props.nativeOn[i] = item.nativeOn[i] = replaceFun(item.rawNativeOn && item.rawNativeOn[i] || item.nativeOn[i], x, attrMap[x], item.name)
                }
            }
            for(let i in item.scopedSlots) {
                if (item.scopedSlots[i].toString().indexOf(x) > -1) {
                    if (!item.rawScopedSlots) item.rawScopedSlots = {}
                    item.rawScopedSlots[i] = item.scopedSlots[i].toString()
                }
                if (item.rawScopedSlots && item.rawScopedSlots[i] && item.rawScopedSlots.indexOf(x) > -1) {
                    item.props.scopedSlots[i] = item.scopedSlots[i] = replaceFun(item.rawScopedSlots && item.rawScopedSlots[i] || item.scopedSlots[i], x, attrMap[x])
                }
            }
            if (item.props.methods) {
                for(let i in item.props.methods) {
                    if (item.props.methods[i].toString().indexOf(x) > -1) {
                        if (!item.props.rawMethods) item.props.rawMethods = {}
                        item.props.rawMethods[i] = item.props.methods[i].toString()
                    }
                    if (item.rawMethods && item.rawMethods[i] && item.rawMethods.indexOf(x) > -1) {
                        item.props.methods[i] = replaceFun(item.props.rawMethods && item.props.rawMethods[i] || item.props.methods[i], x, attrMap[x])
                    }
                }
            }
            if (item.props.watch) {
                for(let i in item.props.watch) {
                    if (item.props.watch[i].toString().indexOf(x) > -1) {
                        if (!item.props.rawWatch) item.props.rawWatch = {}
                        item.props.rawWatch[i] = item.props.watch[i].toString()
                    }
                    if (item.rawWatch && item.rawWatch[i] && item.rawWatch.indexOf(x) > -1) {
                        item.props.watch[i] = replaceFun(item.props.rawWatch && item.props.rawWatch[i] || item.props.watch[i], x, attrMap[x])
                    }
                }
            }
        }
    }

    if (item.props && item.props.renderFun && renderFun) {
        item.props.renderFun = getFunctionReplace(renderFun);
        item.renderFun && (item.renderFun = getFunctionReplace(renderFun));
    }
    if (item.props && item.props.on && on) {
        Object.assign(item.props.on, on)
    }
    if (item.props && item.props.methods && methods) {
        Object.assign(item.props.methods, methods)
    }
    if (item.props && item.props.watch && watch) {
        Object.assign(item.props.watch, watch)
    }
    if (item.props && item.props.nativeOn && nativeOn) {
        for (let y in item.props.nativeOn) {
            if (nativeOn[y]) {
                item.props.nativeOn[y] = getFunctionReplace(nativeOn[y])
                if (item.nativeOn[y]) item.nativeOn[y] = getFunctionReplace(nativeOn[y])
            }
        }
        Object.assign(item.props.nativeOn, nativeOn)
    }
    if (item.props && item.props.scopedSlots && scopedSlots) {
        for (let y in item.props.scopedSlots) {
            if (scopedSlots[y]) {
                item.props.scopedSlots[y] = getFunctionReplace(scopedSlots[y])
                if (item.scopedSlots[y]) item.scopedSlots[y] = getFunctionReplace(scopedSlots[y])
            }
        }
        Object.assign(item.props.scopedSlots, scopedSlots)
    }
    function getFunctionReplace(func) {
        // 函数替换配置中的变量map
        if (typeof func === 'function') {
            func = func.toString()
        }
        if (attrMap) {
            for(let x in attrMap) {
                if (func.includes(x) && attrMap[x]) func = func.replace(x, attrMap[x])
            }
        }
        return stringToFunc(func)
    }
}
