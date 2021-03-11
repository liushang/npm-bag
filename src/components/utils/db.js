const DRAWING_ITEMS = 'drawingItems';
const DRAWING_ITEMS_VERSION = '1.2';
const DRAWING_ITEMS_VERSION_KEY = 'DRAWING_ITEMS_VERSION';
const DRAWING_ID = 'idGlobal';
const DRAWING_CONTAINER = 'containerInject';

const TREE_NODE_ID = 'treeNodeId';
const FORM_CONF = 'formConf';
import { stringToFunc } from '../schema/util'
export function getDrawingList() {
    // 加入缓存版本的概念，保证缓存数据与程序匹配
    const version = localStorage.getItem(DRAWING_ITEMS_VERSION_KEY);
    if (version !== DRAWING_ITEMS_VERSION) {
        localStorage.setItem(DRAWING_ITEMS_VERSION_KEY, DRAWING_ITEMS_VERSION);
        saveDrawingList([]);
        return null;
    }

    const str = localStorage.getItem(DRAWING_ITEMS);
    // if (str) return propertyStringToFunc(JSON.parse(str))
    if (str) {
        let abc = onToFunc(onToFunc(onToFunc(onToFunc(propertyStringToFunc(JSON.parse(str)), 'on'), 'methods'), 'nativeOn'), 'computed')
        console.log(abc)
        return abc
    };
    return null;
}
export function onToFunc(iarr, on) {
    for (const i of iarr) {
        if (i.props && (i.props[on])) {
            for (let y in i.props[on]) {
                i.props[on][y] = stringToFunc(i.props[on][y]);
            }
        }
        if (i.props && i.props.children) {
            onToFunc(i.props.children, on);
        }
    }
    return iarr;
}
export function propertyStringToFunc(str) {
    for (let i of str) {
        if (i.props && (i.props.renderFun)) {
            // let funStr = i.props.renderFun;
            // // 获取函数体
            // let funLast = funStr.slice(funStr.indexOf('{') + 1);
            // let funMiddle = funLast.slice(0, funLast.lastIndexOf('}'));
            // // 获取函数参数
            // let funPre = funStr.slice(funStr.indexOf('(') + 1);
            // let funNamePre = funPre.slice(0, funPre.indexOf(')'));
            // let funNameArr = funNamePre.split(',');
            // i.props.renderFunStr = i.props.renderFun;
            /* eslint-disable */
            i.props.renderFun = stringToFunc(i.props.renderFun);
            /* eslint-enable */
        }
        if (i.props && i.props.children) {
            propertyStringToFunc(i.props.children);
        }
    }
    return str;
}

// export function stringToFunc(str, self) {
//     let funStr = str;
//     // 获取函数体
//     let funLast = funStr.slice(funStr.indexOf('{') + 1);
//     let funMiddle = funLast.slice(0, funLast.lastIndexOf('}'));
//     // 获取函数参数
//     let funPre = funStr.slice(funStr.indexOf('(') + 1);
//     let funNamePre = funPre.slice(0, funPre.indexOf(')'));
//     let funNameArr = funNamePre.split(',');
//     /* eslint-disable */
//     if (self) return new Function(self, ...funNameArr, funMiddle);
//     return new Function(...funNameArr, funMiddle);
//     /* eslint-enable */
// }

export function saveDrawingList(list) {
    let json = JSON.stringify(list, function(key, value) {
        if (typeof value === 'function') {
            return value.toString();
        } else {
            return value;
        }
    });
    localStorage.setItem(DRAWING_ITEMS, json);
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
