
import { analysisRenderConfig, analysisDataRender } from './util';
export const computed = {
    configData() {
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