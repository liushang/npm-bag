
import { analysisRenderConfig, analysisDataRender } from './util';

export function created() {
    this.configData = analysisDataRender(this.configComponents.children);
}

export const computed = {
    configData() {
        // console.log('this.configComponents.children')
        // console.log(this.configComponents.children)
        console.log(this.configComponents.children)
        return analysisDataRender.bind(this)(this.configComponents.children);
    }, 
};

export function render(h) {
    // this.configData = analysisDataRender(this.configComponents.children);
    console.log(this.configData)
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