
import { analysisRenderConfig, analysisDataRender, deepClone, deepCloneEnhance } from './util';

export function created() {
    this.configData = analysisDataRender(this.configComponents.children);
}

export const computed = {
    configData() {
        const deepClone = deepClone;
        const deepCloneEnhance = deepCloneEnhance;
        return analysisDataRender.bind(this)(this.configComponents.children);
    },
};

export function render(h) {
    let configArr = analysisRenderConfig.bind(this)(this.configData, h);
    if (configArr.length > 1) {
        return h(
            'span',
            null,
            configArr
        );
    } else {
        return configArr[0];
    }

}