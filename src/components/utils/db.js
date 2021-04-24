const DRAWING_ITEMS = 'drawingItems';
const DRAWING_ITEMS_VERSION = '1.2';
const DRAWING_ITEMS_VERSION_KEY = 'DRAWING_ITEMS_VERSION';
const DRAWING_ID = 'idGlobal';
const DRAWING_CONTAINER = 'containerInject';

const TREE_NODE_ID = 'treeNodeId';
const FORM_CONF = 'formConf';
import { stringToFunc } from '../schema/util'
export function getDrawingList(detailStr) {
    // 加入缓存版本的概念，保证缓存数据与程序匹配
    // const version = localStorage.getItem(DRAWING_ITEMS_VERSION_KEY);
    // if (version !== DRAWING_ITEMS_VERSION) {
    //     localStorage.setItem(DRAWING_ITEMS_VERSION_KEY, DRAWING_ITEMS_VERSION);
    //     saveDrawingList([]);
    //     return null;
    // }

    const str = detailStr || localStorage.getItem(DRAWING_ITEMS);
    if (str) {
        let abc = onToFunc(onToFunc(onToFunc(onToFunc(onToFunc(onToFunc(propertyStringToFunc(JSON.parse(str)), 'on'), 'methods'), 'nativeOn'), 'computed'), 'scopedSlots'), 'watch')
        return [dealLcData(abc[0])]
    };
    return null;
}
window.strToObj = getDrawingList
window.stringToFunc = stringToFunc
function dealLcData (obj) {
    // 还要增加对子inData的处理
    if (obj && obj.props && obj.props.insData) {
        const data = obj.props.insData
        const dealChild = (data) => {
            for(let i in data) {
                if (typeof data[i] === 'object' && data[i] !== null) {
                    dealChild(data[i])
                } else if (typeof data[i] === 'string' && data[i].startsWith('function')) {
                    data[i] = stringToFunc(data[i])
                }
            }
        }
        dealChild(data)
    }
    const child = obj && obj.props && (obj.props.rawId &&  obj.props.children || obj.props.subRawId && obj.children ) || []
    if (child.length) {
        for (let i of child) {
            dealLcData(i)
        }
    }
    return obj
}
export function onToFunc(iarr, on) {

    for (const i of iarr) {
        if (i && i.props && (i.props[on])) {
            for (let y in i.props[on]) {
                i.props[on][y] = stringToFunc(i.props[on][y]);
            }
        }
        if (i && i[on]) {
            for (let y in i[on]) {
                i[on][y] = stringToFunc(i[on][y]);
            }
        }
        if (i && i.props && i.props.children) {
            onToFunc(i.props.children, on);
        }
        if (i && i.children) {
            onToFunc(i.children, on);
        }
    }
    return iarr;
}
export function propertyStringToFunc(str) {
    for (let i of str) {
        if (i && i.props && (i.props.renderFun)) {
            i.props.renderFun = stringToFunc(i.props.renderFun);
        }
        if (i && i.renderFun) {
            i.renderFun = stringToFunc(i.renderFun);
        }
        if (i && i.props && i.props.children) {
            propertyStringToFunc(i.props.children);
        }
        if (i && i.children) {
            propertyStringToFunc(i.children);
        }
    }
    return str;
}

export function saveDrawingList(list) {
    let json = JSON.stringify(list, function(key, value) {
        if (typeof value === 'function') {
            return value.toString();
        } else {
            return value;
        }
    });
    localStorage.setItem(DRAWING_ITEMS, json);
    return json
}

export function saveIdGlobal(id) {
    localStorage.setItem(DRAWING_ID, `${id}`);
}

export function getContainer() {
    const str = localStorage.getItem(DRAWING_CONTAINER);
    if (str) return JSON.parse(str);
    return {};
}

export function saveContainer(id) {
    // todo 对函数处理
    localStorage.setItem(DRAWING_CONTAINER, JSON.stringify(id));
}

export function getTreeNodeId() {
    const str = localStorage.getItem(TREE_NODE_ID);
    if (str) return parseInt(str, 10);
    return 100;
}

export function saveTreeNodeId(id) {
    localStorage.setItem(TREE_NODE_ID, `${id}`);
}

export function getFormConf() {
    const str = localStorage.getItem(FORM_CONF);
    if (str) return JSON.parse(str);
    return null;
}

export function saveFormConf(obj) {
    localStorage.setItem(FORM_CONF, JSON.stringify(obj));
}
